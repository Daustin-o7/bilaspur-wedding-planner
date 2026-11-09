let connection = { url: '', key: '' };
let cloudBase = null, cloudRevision = 0, cloudReady = false, cloudBusy = false;
let syncTimer, pendingConflict = null, cacheBlocked = false, startupError = '';
let draftKey, workspaceKey, editorName = '', clientId;
let initialPlan, lastPersisted, cloudResources = {};
const editingField = () => document.activeElement?.matches('input,textarea,select') || document.querySelector('dialog[open],#modal-add-task:not(.hidden)');

function storageGet(key) { try { return localStorage.getItem(key); } catch { cacheBlocked = true; return null; } }
function storageSet(key, value) { try { localStorage.setItem(key, value); return true; } catch { cacheBlocked = true; return false; } }
function validConnection(c) { return /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(c.url) && /^[a-f0-9]{64}$/.test(c.key); }

function initializeLocalWorkspace() {
  initialPlan = Hub.clone(state);
  try {
    clientId = sessionStorage.getItem('wedding-tab') || '';
    const incoming = new URLSearchParams(location.hash.slice(1));
    const saved = JSON.parse(storageGet('wedding-connection') || 'null');
    if (incoming.has('bridge') || incoming.has('key')) {
      const c = { url: incoming.get('bridge') || '', key: incoming.get('key') || '' };
      if (!validConnection(c)) throw Error('The family invite link is incomplete. Ask the coordinator for a new link.');
      connection = c;
      storageSet('wedding-connection', JSON.stringify(c));
      history.replaceState(null, '', location.pathname + location.search);
    } else if (saved && validConnection(saved)) connection = saved;
    editorName = storageGet('wedding-editor') || '';
  } catch (error) { startupError = error.message; clientId ||= crypto.randomUUID(); }
  workspaceKey = STORAGE_KEY + ':' + (connection.url.split('/').at(-2) || 'local');
  draftKey = workspaceKey + ':draft:' + clientId;
  try {
    const raw = storageGet(draftKey) || storageGet(workspaceKey);
    if (raw) {
      const cached = JSON.parse(raw);
      state = Hub.validateState(cached.state);
      cloudBase = cached.base ? Hub.validateState(cached.base) : null;
      cloudRevision = Number.isInteger(cached.revision) ? cached.revision : 0;
    }
  } catch (error) {
    const unreadable = storageGet(draftKey) || storageGet(workspaceKey);
    if (unreadable) storageSet(workspaceKey + ':unreadable:' + crypto.randomUUID(), unreadable);
    startupError = 'A saved draft could not be read. It has not been overwritten. Download the recovery copy in Connection. ' + error.message;
    draftKey += ':recovered-' + crypto.randomUUID();
    state = Hub.clone(initialPlan);
    cloudBase = null; cloudRevision = 0;
  }
  // A duplicated browser tab inherits sessionStorage, so give each document its own draft.
  clientId = crypto.randomUUID();
  try { sessionStorage.setItem('wedding-tab', clientId); } catch { cacheBlocked = true; }
  draftKey = workspaceKey + ':draft:' + clientId;
  Hub.validateState(state);
  lastPersisted = Hub.clone(state);
  if (cacheDraft()) pruneSavedDrafts();
}

function pruneSavedDrafts() {
  try {
    for (const key of Object.keys(localStorage).filter(k => k.startsWith(workspaceKey + ':draft:') && k !== draftKey)) {
      try {
        const cached = JSON.parse(localStorage.getItem(key));
        if ((Hub.equal(cached.state, state) && Hub.equal(cached.base, cloudBase) && cached.revision === cloudRevision) || (cached.base && Hub.equal(cached.state, cached.base) && cached.revision <= cloudRevision)) localStorage.removeItem(key);
      } catch { /* Unreadable drafts remain available for recovery. */ }
    }
  } catch { cacheBlocked = true; }
}

function setSaveStatus(text, error = false) {
  const indicator = document.getElementById('last-saved-indicator');
  if (indicator) { indicator.textContent = text; indicator.setAttribute('role', 'status'); indicator.style.color = error ? '#9f1239' : '#384d3b'; }
  const dot = document.getElementById('sync-pulse-dot');
  if (dot) dot.style.background = error ? '#be123c' : cloudReady ? '#49634d' : '#d97706';
}

function cacheDraft() {
  const text = JSON.stringify({ state, base: cloudBase, revision: cloudRevision, savedAt: new Date().toISOString(), editor: editorName });
  const saved = storageSet(draftKey, text);
  if (!connection.url) storageSet(workspaceKey, text);
  return saved;
}

function persistPlanner(action) {
  normalizePlanner(state);
  try { Hub.validateState(state); }
  catch (error) { state = Hub.clone(lastPersisted); rerenderPlanner(); showToast(error.message, 'error'); setSaveStatus('Invalid change rejected — review the field.', true); return false; }
  if (!Hub.equal(state, lastPersisted)) {
    const before = lastPersisted;
    lastPersisted = Hub.clone(state);
    if (before && Hub.collections.some(name => state[name].length < before[name].length)) {
      storageSet(workspaceKey + ':before-delete', JSON.stringify({ state: before, base: cloudBase, revision: cloudRevision, savedAt: new Date().toISOString() }));
    }
  }
  const cached = cacheDraft();
  if (pendingConflict) { setSaveStatus('Conflict needs review; your draft is preserved.', true); return; }
  setSaveStatus(cached ? connection.url ? 'Saved on this device • waiting for Google…' : 'Saved on this device • Google not connected' : 'Device storage unavailable — export a backup now.', !cached);
  clearTimeout(syncTimer);
  if (connection.url) syncTimer = setTimeout(syncCloud, 900);
}

async function cloudRequest(action, extra = {}) {
  if (!validConnection(connection)) throw Error('Open Connection and enter the deployed Google URL and family key.');
  const response = await fetch(connection.url, {
    method: 'POST', redirect: 'follow', credentials: 'omit', referrerPolicy: 'no-referrer',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action, key: connection.key, editor: editorName || 'Family member', ...extra }),
    signal: AbortSignal.timeout(45000)
  });
  if (!response.ok) throw Error('Google returned HTTP ' + response.status + '. Your draft is still here.');
  let data;
  try { data = await response.json(); } catch { throw Error('Google did not return a valid response. Check Web app deployment: execute as owner, access Anyone.'); }
  if (!data.ok) throw Error(data.error || 'Google save failed.');
  return data;
}

function applyRemote(remote) {
  if (!Number.isInteger(remote.revision) || remote.revision < 0) throw Error('Invalid Google revision.');
  if (remote.resources) { cloudResources = remote.resources; renderResourceLinks(); }
  if (!remote.state) {
    if (remote.revision !== 0 || cloudRevision > 0) throw Error('Shared storage appears to have been reset. Export your draft and contact the owner.');
    cloudBase = Hub.clone(initialPlan); cloudRevision = 0; cloudReady = true; return;
  }
  if (remote.revision < cloudRevision) throw Error('Google returned an older revision. Your draft was preserved.');
  Hub.validateState(remote.state);
  const base = cloudBase || initialPlan;
  const result = Hub.merge(base, state, remote.state);
  if (result.conflicts.length) {
    pendingConflict = { ...result, remote };
    showConflict(); return;
  }
  const changed = !Hub.equal(state, result.value);
  state = Hub.validateState(result.value); cloudBase = Hub.clone(remote.state); cloudRevision = remote.revision; cloudReady = true;
  lastPersisted = Hub.clone(state); cacheDraft();
  storageSet(workspaceKey, JSON.stringify({ state: cloudBase, base: cloudBase, revision: cloudRevision }));
  if (changed) rerenderPlanner();
}

async function syncCloud() {
  if (!connection.url || cloudBusy || pendingConflict || startupError) return;
  // Never replace a field while a relative is typing an uncommitted edit.
  if (editingField()) return;
  cloudBusy = true;
  let succeeded = false;
  try {
    const latest = await cloudRequest('read', { revision: cloudReady ? cloudRevision : -1 });
    if (editingField()) return;
    if (!latest.unchanged) applyRemote(latest);
    if (pendingConflict) return;
    if (!Hub.equal(state, cloudBase) || cloudRevision === 0) {
      const sent = Hub.clone(state);
      const reply = await cloudRequest('save', { revision: cloudRevision, state: sent });
      if (reply.conflict) {
        if (editingField()) return;
        applyRemote(reply);
        if (!pendingConflict) setSaveStatus('Merged concurrent changes; saving on next sync…');
        return;
      }
      if (!Number.isInteger(reply.revision) || reply.revision <= cloudRevision) throw Error('Save acknowledgment was invalid.');
      cloudBase = sent; cloudRevision = reply.revision;
      cloudReady = true; cacheDraft();
      pruneSavedDrafts();
      storageSet(workspaceKey, JSON.stringify({ state: sent, base: sent, revision: cloudRevision }));
    }
    succeeded = true;
    setSaveStatus(Hub.equal(state, cloudBase) ? `Saved to Google • revision ${cloudRevision} • ${new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })} IST` : 'New edits waiting to save…');
  } catch (error) {
    setSaveStatus('Google unavailable • draft kept on this device', true);
    const status = document.getElementById('connection-status'); if (status) status.textContent = error.message;
    const problem = document.getElementById('cloud-problem');
    if (problem) { problem.hidden = false; problem.textContent = error.message + ' Automatic retry in 10 seconds while this tab is active.'; }
  } finally {
    cloudBusy = false;
    if (succeeded && !pendingConflict) document.getElementById('cloud-problem').hidden = true;
  }
}

function showConflict() {
  setSaveStatus('Two people edited the same field — choose how to resolve it.', true);
  const box = document.getElementById('cloud-problem'); box.hidden = false; box.replaceChildren();
  const text = document.createElement('p'); text.textContent = 'Independent changes were merged. These fields conflict: ' + pendingConflict.conflicts.map(c => c.path).join(', '); box.appendChild(text);
  const explain = document.createElement('p'); explain.textContent = 'Download your draft before choosing. Keep mine preserves your conflicting values; Use Google preserves the other editor’s conflicting values. Both choices retain non-conflicting edits.'; box.appendChild(explain);
  for (const [label, choice] of [['Download my draft', 'download'], ['Keep mine for conflicts', 'mine'], ['Use Google for conflicts', 'remote']]) {
    const button = document.createElement('button'); button.type = 'button'; button.className = 'planner-button secondary'; button.textContent = label;
    button.onclick = () => {
      if (choice === 'download') return exportBackup();
      const remote = pendingConflict.remote;
      state = choice === 'mine' ? Hub.merge(cloudBase || initialPlan, state, remote.state).value : Hub.merge(cloudBase || initialPlan, remote.state, state).value;
      cloudBase = Hub.clone(remote.state); cloudRevision = remote.revision; cloudReady = true; pendingConflict = null; box.hidden = true;
      lastPersisted = Hub.clone(state); persistPlanner(); rerenderPlanner(); syncCloud();
    };
    box.appendChild(button);
  }
}

function downloadFile(name, value, type = 'application/json') {
  const a = document.createElement('a'); const url = URL.createObjectURL(new Blob([value], { type })); a.href = url; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function exportBackup() { downloadFile('wedding-' + Hub.today() + '.backup.json', JSON.stringify({ format: 'wedding-hub', exportedAt: new Date().toISOString(), state }, null, 2)); }

function renderResourceLinks() {
  const box = document.getElementById('storage-links'); if (!box) return; box.replaceChildren();
  for (const [key, label] of [['sheet', 'Private Google Sheet'], ['folder', 'Drive receipts & backups'], ['calendar', 'Wedding calendar']]) {
    const url = cloudResources[key];
    if (!url || !/^https:\/\/(docs|drive|calendar)\.google\.com\//.test(url)) continue;
    const a = document.createElement('a'); a.href = url; a.textContent = label + ' ↗'; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.className = 'planner-button secondary inline-block'; box.appendChild(a);
  }
}

function initCloud() {
  const toolbar = document.createElement('div'); toolbar.id = 'family-toolbar'; toolbar.className = 'no-print';
  toolbar.innerHTML = '<div class="max-w-7xl mx-auto flex flex-wrap items-center gap-2"><strong>Family workspace / परिवार</strong><button id="open-connection" class="planner-button secondary">Connection &amp; share</button><button id="sync-now" class="planner-button">Sync now</button><button id="download-backup" class="planner-button secondary">Download backup</button><label class="planner-button secondary">Restore backup<input id="restore-backup" type="file" accept="application/json,.json" class="hidden"></label><span id="your-name"></span></div><div id="cloud-problem" class="planner-alert" role="alert" hidden></div>';
  document.body.insertBefore(toolbar, document.querySelector('main'));
  const dialog = document.createElement('dialog'); dialog.id = 'connection-dialog';
  dialog.innerHTML = `<h2>Family link &amp; Google connection</h2><p>Owner: open <a href="SETUP.md" target="_blank" rel="noopener" class="underline">setup instructions</a> and deploy the supplied Apps Script once. Family members use the private link; no Google login is needed to edit.</p><label>Your name / आपका नाम<input id="editor-name" maxlength="100" autocomplete="name"></label><label>Deployed Apps Script URL<input id="bridge-url" type="url" autocomplete="off" placeholder="https://script.google.com/macros/s/…/exec"></label><label>Family key (from setup)<input id="family-key" type="password" autocomplete="off" spellcheck="false"></label><p>The family link grants full read, add, edit and delete access. Keep it in your family group; the normal Pages URL contains no shared data.</p><button id="connect-cloud" class="planner-button">Connect &amp; load shared plan</button><button id="copy-family-link" class="planner-button secondary">Copy private family edit link</button><button id="close-connection" class="planner-button secondary">Close</button><p id="connection-status" role="status"></p><details><summary>Recover a device draft</summary><p>Drafts from other tabs and the last delete are listed here. Review before applying them to the shared plan.</p><select id="recovery-list" aria-label="Saved device drafts"></select><button id="download-recovery" class="planner-button secondary">Download selected draft</button></details>`;
  document.body.appendChild(dialog);
  dialog.querySelector('a').href = 'SETUP.html';
  const open = () => {
    document.getElementById('connect-cloud').disabled = cloudBusy;
    document.getElementById('connection-status').textContent = cloudBusy ? 'A sync is in progress. Close and reopen Connection after it finishes.' : cloudReady ? 'Connected to Google. Report tabs refresh within five minutes.' : 'Google is not connected yet.';
    document.getElementById('editor-name').value = editorName;
    document.getElementById('bridge-url').value = connection.url;
    document.getElementById('family-key').value = connection.key;
    const select = document.getElementById('recovery-list'); select.replaceChildren();
    try { Object.keys(localStorage).filter(k => k.startsWith(STORAGE_KEY)).forEach(k => { const option = document.createElement('option'); option.value = k; option.textContent = k; select.appendChild(option); }); } catch { /* Local storage failure is shown in save status. */ }
    dialog.showModal();
  };
  document.getElementById('open-connection').onclick = open;
  document.getElementById('btn-open-cloud-bridge').onclick = open;
  document.getElementById('close-connection').onclick = () => dialog.close();
  document.getElementById('connect-cloud').onclick = () => {
    if (cloudBusy) return;
    const c = { url: document.getElementById('bridge-url').value.trim(), key: document.getElementById('family-key').value.trim() };
    if (!validConnection(c)) { document.getElementById('connection-status').textContent = 'Enter a valid /exec deployment URL and the 64-character family key.'; return; }
    editorName = document.getElementById('editor-name').value.trim() || 'Family member';
    storageSet('wedding-editor', editorName);
    if (c.url !== connection.url) {
      exportBackup();
      cloudBase = Hub.clone(initialPlan); cloudRevision = 0; cloudReady = false;
      workspaceKey = STORAGE_KEY + ':' + c.url.split('/').at(-2); draftKey = workspaceKey + ':draft:' + clientId;
    }
    connection = c; storageSet('wedding-connection', JSON.stringify(c)); startupError = ''; pendingConflict = null; cacheDraft(); dialog.close(); document.getElementById('your-name').textContent = editorName; syncCloud();
  };
  document.getElementById('copy-family-link').onclick = () => {
    if (!validConnection(connection) || !cloudReady) { document.getElementById('connection-status').textContent = 'Connect successfully before sharing.'; return; }
    const url = new URL(location.href); url.hash = new URLSearchParams({ bridge: connection.url, key: connection.key }).toString();
    copyTextToClipboard(url.href, 'Private family edit link copied.');
  };
  document.getElementById('download-recovery').onclick = () => {
    const raw = storageGet(document.getElementById('recovery-list').value); if (raw) downloadFile('wedding-recovery.backup.json', raw);
  };
  document.getElementById('your-name').textContent = editorName || 'Set your name in Connection';
  document.getElementById('download-backup').onclick = exportBackup;
  document.getElementById('sync-now').onclick = () => { document.activeElement?.blur(); syncCloud(); };
  document.getElementById('restore-backup').onchange = async event => {
    const file = event.target.files[0]; if (!file) return;
    try {
      if (cloudBusy) throw Error('A sync is in progress. Try restoring again after it finishes.');
      if (file.size > 7500000) throw Error('Backup is too large.');
      const loaded = JSON.parse(await file.text()); const next = Hub.validateState(loaded.state);
      if (!confirm('Replace this plan with the selected backup? This will sync additions and deletions to your family workspace. Your current plan will be downloaded first.')) return;
      exportBackup(); state = next; pendingConflict = null; startupError = ''; persistPlanner(); rerenderPlanner();
    } catch (error) { showToast(error.message, 'error'); }
    finally { event.target.value = ''; }
  };
  async function action(button, action, label) {
    button.disabled = true;
    try {
      document.activeElement?.blur(); await syncCloud();
      if (pendingConflict || cloudBusy || !cloudReady || !Hub.equal(state, cloudBase)) throw Error('Save all changes to Google and resolve conflicts first.');
      const reply = await cloudRequest(action, { revision: cloudRevision });
      document.getElementById('calendar-status').textContent = reply.message || label;
      showToast(reply.message || label);
    } catch (error) { showToast(error.message, 'error'); document.getElementById('calendar-status').textContent = error.message; }
    finally { button.disabled = false; }
  }
  document.getElementById('publish-calendar').onclick = event => action(event.target, 'calendar', 'Wedding calendar updated.');
  document.getElementById('cloud-backup').onclick = event => action(event.target, 'backup', 'Snapshot saved to Google Drive.');
  document.getElementById('receipt-file').onchange = async event => {
    const input = event.target, file = input.files[0]; if (!file) return;
    input.disabled = true;
    try {
      if (!['application/pdf','image/jpeg','image/png','image/webp'].includes(file.type) || !file.size || file.size > 5000000) throw Error('Choose a PDF, JPEG, PNG or WebP up to 5 MB.');
      const data = await new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result.split(',')[1]); reader.onerror = () => reject(Error('Could not read this file.')); reader.readAsDataURL(file); });
      const reply = await cloudRequest('upload', { name: file.name, mime: file.type, data });
      if (!/^https:\/\/drive\.google\.com\//.test(reply.url)) throw Error('Invalid Drive receipt link.');
      const result = document.getElementById('receipt-result'); result.replaceChildren();
      const link = document.createElement('a'); link.href = reply.url; link.textContent = reply.url; link.target = '_blank'; link.rel = 'noopener noreferrer'; result.append('Uploaded privately. Copy this URL into the vendor’s receipt field: ', link);
      showToast(reply.message);
    } catch (error) { document.getElementById('receipt-result').textContent = error.message; showToast(error.message, 'error'); }
    finally { input.disabled = false; input.value = ''; }
  };
  window.addEventListener('beforeunload', event => {
    document.activeElement?.blur();
    if (connection.url && !Hub.equal(state, cloudBase)) { cacheDraft(); event.preventDefault(); event.returnValue = ''; }
  });
  window.addEventListener('online', syncCloud);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) syncCloud(); });
  setInterval(() => { if (!document.hidden) syncCloud(); }, 10000);
  if (startupError) { const problem = document.getElementById('cloud-problem'); problem.hidden = false; problem.textContent = startupError; }
  setSaveStatus(cacheBlocked ? 'Storage unavailable — download backups before closing.' : connection.url ? 'Connecting to private Google storage…' : 'Local mode • Google not connected', cacheBlocked);
  syncCloud();
}
