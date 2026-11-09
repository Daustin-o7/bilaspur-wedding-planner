/* Run setupWedding once as the owner. Deploy as a Web app: Execute as Me, access Anyone.
 * Every data request requires the unguessable family key. Never publish that key in GitHub.
 * Core.gs is the same validation code as site/core.js.
 */
function setupWedding() {
  const p = PropertiesService.getScriptProperties();
  if (!p.getProperty('SHEET_ID')) {
    const book = SpreadsheetApp.create('Bilaspur Wedding — Private Family Plan');
    book.getSheets()[0].setName('Read_Me');
    book.getSheetByName('Read_Me').getRange('A1:A4').setValues([
      ['Private family wedding workspace. Edit the plan through the website.'],
      ['Report tabs are generated views; direct edits there do not change the website.'],
      ['Hub_Control and Hub_State sheets are machine-managed; do not edit them.'],
      ['The family edit link grants full access to the website. Keep it in the family group.']
    ]);
    ['Hub_Control', 'Hub_State_A', 'Hub_State_B'].forEach(name => book.insertSheet(name));
    book.getSheetByName('Hub_Control').getRange('A1:D1').setValues([['A', 0, '', '']]);
    ['Hub_State_A', 'Hub_State_B'].forEach(name => {
      const sheet = book.getSheetByName(name);
      sheet.insertColumnsAfter(sheet.getMaxColumns(), 60);
      sheet.hideSheet();
    });
    p.setProperty('SHEET_ID', book.getId());
  }
  if (!p.getProperty('FOLDER_ID')) p.setProperty('FOLDER_ID', DriveApp.createFolder('Wedding — Receipts and Backups (Private)').getId());
  if (!p.getProperty('CALENDAR_ID')) p.setProperty('CALENDAR_ID', CalendarApp.createCalendar('Bilaspur Wedding — Family Schedule', { timeZone: 'Asia/Kolkata' }).getId());
  if (!p.getProperty('FAMILY_KEY')) p.setProperty('FAMILY_KEY', (Utilities.getUuid() + Utilities.getUuid()).replace(/-/g, ''));
  if (!ScriptApp.getProjectTriggers().some(t => t.getHandlerFunction() === 'refreshReports')) ScriptApp.newTrigger('refreshReports').timeBased().everyMinutes(5).create();
  console.log('SETUP COMPLETE. Copy FAMILY_KEY privately from Project Settings → Script Properties.');
  console.log(JSON.stringify(resources_()));
}

function rotateFamilyKey() {
  PropertiesService.getScriptProperties().setProperty('FAMILY_KEY', (Utilities.getUuid() + Utilities.getUuid()).replace(/-/g, ''));
  console.log('Key rotated. Copy the new FAMILY_KEY from Script Properties and reconnect the owner website, then share the new family link.');
}

function resources_() {
  const p = PropertiesService.getScriptProperties();
  return {
    sheet: 'https://docs.google.com/spreadsheets/d/' + p.getProperty('SHEET_ID') + '/edit',
    folder: 'https://drive.google.com/drive/folders/' + p.getProperty('FOLDER_ID'),
    calendar: 'https://calendar.google.com/calendar/u/0/r?cid=' + encodeURIComponent(p.getProperty('CALENDAR_ID'))
  };
}

function doGet() { return json_({ ok: true, service: 'Private wedding hub', message: 'Use the family website. Authentication is required for all records.' }); }
function json_(data) { return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON); }

function doPost(e) {
  let lock, locked = false;
  try {
    const raw = e && e.postData && e.postData.contents;
    if (typeof raw !== 'string' || raw.length > 7500000) throw Error('Invalid request size.');
    const request = JSON.parse(raw);
    const expected = PropertiesService.getScriptProperties().getProperty('FAMILY_KEY');
    if (!expected || expected.length !== 64 || typeof request.key !== 'string' || request.key.length !== 64) throw Error('Invalid family key. Ask the coordinator for the latest private link.');
    let mismatch = 0;
    for (let i = 0; i < expected.length; i++) mismatch |= expected.charCodeAt(i) ^ request.key.charCodeAt(i);
    if (mismatch) throw Error('Invalid family key. Ask the coordinator for the latest private link.');
    if (!['read', 'save', 'calendar', 'backup', 'upload'].includes(request.action)) throw Error('Unknown action.');
    lock = LockService.getScriptLock();
    if (!lock.tryLock(10000)) throw Error('Another save is in progress. Please retry.');
    locked = true;
    const book = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SHEET_ID'));
    const current = readState_(book);
    if (request.action === 'read') {
      if (request.revision === current.revision && current.state) return json_({ ok: true, unchanged: true, revision: current.revision });
      return json_({ ok: true, ...current, resources: resources_() });
    }
    if (request.action === 'save') {
      if (!Number.isInteger(request.revision) || request.revision !== current.revision) return json_({ ok: true, conflict: true, ...current });
      Hub.validateState(request.state);
      writeState_(book, current, request.state, String(request.editor || 'Family member').slice(0, 100));
      return json_({ ok: true, revision: current.revision + 1 });
    }
    if (request.action === 'upload') return json_(uploadReceipt_(request));
    if (request.revision !== current.revision || !current.state) throw Error('The shared plan changed. Sync before trying again.');
    if (request.action === 'calendar') return json_({ ok: true, message: publishCalendar_(current.state) });
    backup_(current.state, current.revision);
    return json_({ ok: true, message: 'Revision ' + current.revision + ' backed up to your private Google Drive folder.' });
  } catch (error) { return json_({ ok: false, error: String(error.message || error) }); }
  finally { if (locked) lock.releaseLock(); }
}

function readState_(book) {
  const head = book.getSheetByName('Hub_Control').getRange('A1:D1').getValues()[0];
  const revision = Number(head[1]);
  if (!['A','B'].includes(head[0]) || !Number.isSafeInteger(revision) || revision < 0 || head[1] === '') throw Error('Storage header is invalid. Restore from the Drive backup.');
  if (revision === 0) return { revision: 0, state: null, slot: 'A' };
  const sheet = book.getSheetByName('Hub_State_' + head[0]);
  const values = sheet.getRange('A1:B1').getValues()[0];
  const count = Number(values[1]);
  if (values[0] !== revision || !Number.isInteger(count) || count < 1 || count > 100) throw Error('Storage revision is incomplete. Contact the coordinator; no data was changed.');
  const text = sheet.getRange(1, 3, 1, count).getValues()[0].map(value => JSON.parse(value)).join('');
  const digest = Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, text, Utilities.Charset.UTF_8));
  if (digest !== head[2]) throw Error('Storage integrity check failed; restore the last Drive snapshot.');
  return { revision, state: Hub.validateState(JSON.parse(text)), slot: head[0], updatedAt: String(head[3]) };
}

function writeState_(book, current, state, editor) {
  const text = JSON.stringify(state), chunks = [];
  // JSON strings start with a quote, so a chunk can never be interpreted as a Sheet formula.
  for (let i = 0; i < text.length; i += 20000) chunks.push(JSON.stringify(text.slice(i, i + 20000)));
  if (chunks.length > 100) throw Error('Workspace exceeds storage limit. Export and archive old notes.');
  const slot = current.slot === 'A' ? 'B' : 'A', revision = current.revision + 1;
  // Write the inactive snapshot first. A failed write never points readers at half a plan.
  const sheet = book.getSheetByName('Hub_State_' + slot);
  if (sheet.getMaxColumns() < chunks.length + 2) sheet.insertColumnsAfter(sheet.getMaxColumns(), chunks.length + 2 - sheet.getMaxColumns());
  sheet.getRange(1, 1, 1, chunks.length + 2).setValues([[revision, chunks.length, ...chunks]]);
  SpreadsheetApp.flush();
  const digest = Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, text, Utilities.Charset.UTF_8));
  book.getSheetByName('Hub_Control').getRange('A1:D1').setValues([[slot, revision, digest, new Date().toISOString()]]);
  SpreadsheetApp.flush();
  // The commit is already durable; reporting failure must not turn it into an ambiguous failed save.
  try {
    const activity = book.getSheetByName('Activity') || book.insertSheet('Activity');
    if (!activity.getLastRow()) activity.appendRow(['Revision', 'Time (UTC)', 'Editor (self-reported)']);
    activity.appendRow([revision, new Date().toISOString(), sheetText_(editor)]);
  } catch (error) { console.warn('Activity report failed: ' + error.message); }
}

function sheetText_(value) {
  if (typeof value === 'number' || typeof value === 'boolean') return value;
  const text = String(value == null ? '' : value);
  return /^[\s]*[=+\-@]/.test(text) ? "'" + text : text;
}

function refreshReports() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(1000)) return;
  try {
    const p = PropertiesService.getScriptProperties();
    const book = SpreadsheetApp.openById(p.getProperty('SHEET_ID'));
    const current = readState_(book);
    if (!current.state || String(current.revision) === p.getProperty('REPORT_REVISION')) return;
    const s = current.state;
    const reports = { Checklist: s.tasks, Family_Roles: s.roles, Budget: s.budgetRows, Guests_Stay: s.guests, Event_RSVP: s.attendance, Bride_Invites: s.extendedBride, Groom_Invites: s.extendedGroom, Events: s.events, AddOns: s.addons, Duties: s.miscDuties, Backup_Plan: s.backups };
    for (const name in reports) {
      const rows = reports[name], sheet = book.getSheetByName(name) || book.insertSheet(name);
      const fields = [...new Set(rows.flatMap(row => Object.keys(row)))];
      const data = fields.length ? [fields, ...rows.map(row => fields.map(field => sheetText_(row[field])))] : [['No records']];
      if (sheet.getMaxColumns() < data[0].length) sheet.insertColumnsAfter(sheet.getMaxColumns(), data[0].length - sheet.getMaxColumns());
      if (sheet.getMaxRows() < data.length) sheet.insertRowsAfter(sheet.getMaxRows(), data.length - sheet.getMaxRows());
      sheet.clearContents(); sheet.getRange(1, 1, data.length, data[0].length).setValues(data); sheet.setFrozenRows(1);
    }
    const lastBackup = Number(p.getProperty('BACKUP_TIME') || 0);
    if (Date.now() - lastBackup > 3600000) { backup_(s, current.revision); p.setProperty('BACKUP_TIME', String(Date.now())); }
    p.setProperty('REPORT_REVISION', String(current.revision));
  } finally { lock.releaseLock(); }
}

function backup_(state, revision) {
  const folder = DriveApp.getFolderById(PropertiesService.getScriptProperties().getProperty('FOLDER_ID'));
  const name = 'wedding-r' + revision + '-' + Utilities.formatDate(new Date(), 'Asia/Kolkata', 'yyyyMMdd-HHmmss') + '.backup.json';
  folder.createFile(name, JSON.stringify({ format: 'wedding-hub', exportedAt: new Date().toISOString(), state }), MimeType.PLAIN_TEXT);
}

function publishCalendar_(state) {
  const p = PropertiesService.getScriptProperties(), calendar = CalendarApp.getCalendarById(p.getProperty('CALENDAR_ID'));
  if (!calendar) throw Error('Dedicated wedding calendar missing. Check setup.');
  const selected = state.events.filter(ev => ev.active);
  // Validate all events before writing any, so draft dates cannot create partial schedules.
  selected.forEach(ev => Hub.eventDates(ev));
  const mapping = Object.create(null);
  for (const [key, value] of Object.entries(p.getProperties())) if (key.startsWith('EVENT_ID_')) mapping[key.slice(9)] = value;
  for (const ev of selected) {
    const dates = Hub.eventDates(ev);
    let event = mapping[ev.id] ? calendar.getEventById(mapping[ev.id]) : null;
    if (!event) {
      // The stable tag in the description also recovers a create acknowledged by Google but not by this script.
      event = calendar.getEvents(dates.start, dates.end).find(e => e.getDescription().includes('[WeddingHub:' + ev.id + ']'));
    }
    const description = (ev.desc || '') + '\nCoordinator: ' + (ev.owner || 'TBD') + '\n[WeddingHub:' + ev.id + ']';
    if (!event) event = calendar.createEvent(ev.name, dates.start, dates.end, { location: ev.venue || '', description });
    else { event.setTitle(ev.name).setTime(dates.start, dates.end).setLocation(ev.venue || '').setDescription(description); }
    mapping[ev.id] = event.getId();
    p.setProperty('EVENT_ID_' + ev.id, mapping[ev.id]);
  }
  for (const id of Object.keys(mapping)) {
    if (selected.some(ev => ev.id === id)) continue;
    const event = calendar.getEventById(mapping[id]); if (event) event.deleteEvent();
    delete mapping[id]; p.deleteProperty('EVENT_ID_' + id);
  }
  return selected.length + ' wedding events updated in Asia/Kolkata. Removed/inactive hub events were removed from this dedicated calendar.';
}

function uploadReceipt_(request) {
  const types = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
  if (!types.includes(request.mime) || typeof request.data !== 'string' || request.data.length > 7000000 || !/^[A-Za-z0-9+/]*={0,2}$/.test(request.data)) throw Error('Upload a PDF, JPEG, PNG or WebP up to 5 MB.');
  const bytes = Utilities.base64Decode(request.data);
  if (!bytes.length || bytes.length > 5000000) throw Error('File must be between 1 byte and 5 MB.');
  const name = String(request.name || 'receipt').replace(/[\\/\x00-\x1f]/g, '_').slice(0, 150);
  const file = DriveApp.getFolderById(PropertiesService.getScriptProperties().getProperty('FOLDER_ID')).createFile(Utilities.newBlob(bytes, request.mime, name));
  return { ok: true, url: file.getUrl(), message: 'Receipt uploaded to the owner’s private Drive folder.' };
}
