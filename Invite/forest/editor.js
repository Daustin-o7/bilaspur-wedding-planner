'use strict';
(() => {
  const U = window.Invite, key = 'ka-invitation-draft';
  const form = document.querySelector('#editor-form'), fields = document.querySelector('#editor-fields'), status = document.querySelector('#editor-status');
  let draft = structuredClone(window.INVITATION), dirty = false;
  try { if (U.stored(key)) draft = U.validate(JSON.parse(U.stored(key))); }
  catch (error) { status.textContent = `Saved draft could not be loaded. Published settings are shown. ${error.message}`; }
  const labels = { bride: 'Bride / वधू', groom: 'Groom / वर', city: 'City / शहर', invitation: 'Invitation / निमंत्रण', blessing: 'Bible verse / बाइबल वचन', blessingSource: 'Verse reference / वचन संदर्भ', bibleQuotes: 'Bible quotations / बाइबल के वचन', story: 'Our message / हमारा संदेश', photos: 'Photographs / तस्वीरें', scheduleNote: 'Schedule introduction / कार्यक्रम परिचय', venues: 'Venues / स्थल', events: 'Celebrations / समारोह', travel: 'Travel & stay / यात्रा और आवास', contact: 'Family contact / पारिवारिक संपर्क', rsvp: 'RSVP setup / उपस्थिति व्यवस्था', faqs: 'Guest questions / अतिथियों के प्रश्न' };
  labels.audio = 'Music / संगीत';
  labels.stay = 'Accommodation / आवास';
  labels.giftNote = 'Gifts & blessings note / उपहार और आशीर्वाद';
  const hints = { enabled: 'Show this event on the invitation / निमंत्रण में दिखाएँ', confirmed: 'Mark confirmed only after family/venue confirmation / पुष्टि के बाद चुनें', id: 'Internal ID; keep ceremony unchanged. Update matching venue IDs in events if renamed.', venue: 'Use an existing venue ID from the Venues section.', date: 'YYYY-MM-DD; leave blank if unconfirmed.', time: '24-hour India time; e.g. 17:30. Leave blank if unknown.', endTime: 'Same-day end time. Needed for a calendar download.', mapUrl: 'Exact HTTPS map link, or blank for a venue-name search.', phone: 'International format without spaces; e.g. +919876543210. Leave blank until ready.', formUrl: 'HTTPS link to your hosted RSVP form; used only in link mode.', deadline: 'Optional RSVP deadline, YYYY-MM-DD.' };
  function make(tag, text, className) { const node = document.createElement(tag); if (text) node.textContent = text; if (className) node.className = className; return node; }
  function addFields(value, path, container) {
    const grid = make('div', '', 'editor-grid'); container.append(grid);
    for (const [name, item] of Object.entries(value)) {
      const current = [...path, name];
      if (item && typeof item === 'object') {
        const group = make('fieldset');
        const title = Array.isArray(value) ? item.title?.en || item.name?.en || item.question?.en || item.reference?.en || `Item ${Number(name) + 1}` : name;
        group.append(make('legend', title)); container.append(group); addFields(item, current, group); continue;
      }
      const label = make('label', '', 'editor-field');
      const title = name === 'en' ? 'English' : name === 'hi' ? 'हिंदी' : name;
      let input;
      if (name === 'mode' && path[0] === 'rsvp') {
        input = make('select'); for (const [mode, title] of [['off', 'off — Not open yet / अभी बंद'], ['link', 'link — Free Google Form / निःशुल्क गूगल फ़ॉर्म'], ['netlify', 'netlify — Existing Netlify setup only']]) { const option = make('option', title); option.value = mode; input.append(option); }
      } else if (typeof item === 'string' && (item.length > 90 || ['invitation', 'story', 'travel', 'scheduleNote', 'blessing', 'faqs'].includes(path[0]))) input = make('textarea');
      else { input = make('input'); input.type = typeof item === 'boolean' ? 'checkbox' : ['date', 'deadline'].includes(name) ? 'date' : ['time', 'endTime'].includes(name) ? 'time' : 'text'; }
      input.dataset.path = JSON.stringify(current); input.name = current.join('.');
      if (typeof item === 'boolean') input.checked = item; else input.value = item;
      if (['en', 'hi'].includes(name)) input.lang = name;
      label.append(make('span', title), input);
      if (hints[name]) label.append(make('small', hints[name]));
      grid.append(label);
    }
  }
  function render() {
    fields.replaceChildren();
    for (const [name, value] of Object.entries(draft)) {
      const section = make('details', '', 'editor-group'); section.open = ['bride', 'groom', 'events'].includes(name);
      section.append(make('summary', labels[name] || name)); addFields(value, [name], section); fields.append(section);
    }
  }
  function collect() {
    const next = structuredClone(draft);
    for (const input of fields.querySelectorAll('[data-path]')) {
      const path = JSON.parse(input.dataset.path); let parent = next;
      for (const part of path.slice(0, -1)) parent = parent[part];
      parent[path.at(-1)] = input.type === 'checkbox' ? input.checked : input.value.trim();
    }
    return U.validate(next);
  }
  function attempt(callback) {
    try { if (!form.reportValidity()) return; draft = collect(); callback(); }
    catch (error) { status.textContent = `Please correct / कृपया सुधारें: ${error.message}`; status.scrollIntoView({ block: 'center' }); }
  }
  form.addEventListener('input', () => { dirty = true; });
  form.addEventListener('submit', event => { event.preventDefault(); attempt(() => { localStorage.setItem(key, JSON.stringify(draft)); dirty = false; status.textContent = 'Draft saved in this browser. Open Preview saved draft to view it. The live site is unchanged. / प्रारूप इस ब्राउज़र में सहेजा गया।'; }); });
  document.querySelector('#download-settings').addEventListener('click', () => attempt(() => {
    U.download('settings.js', `// Public invitation settings. Generated by editor.html.\nwindow.INVITATION = ${JSON.stringify(draft, null, 2)};\n`, 'text/javascript;charset=utf-8');
    dirty = false; status.textContent = 'Downloaded settings.js. Replace settings.js in your chosen design folder and redeploy that folder. / अपने डिज़ाइन की settings.js फ़ाइल बदलकर वही फ़ोल्डर दोबारा अपलोड करें।';
  }));
  document.querySelector('#download-json').addEventListener('click', () => attempt(() => { U.download('invitation-settings.json', JSON.stringify(draft, null, 2), 'application/json'); dirty = false; status.textContent = 'JSON backup downloaded / बैकअप डाउनलोड हुआ।'; }));
  document.querySelector('#import-json').addEventListener('change', async event => {
    const file = event.target.files[0]; if (!file) return;
    try {
      if (file.size > 250000) throw new Error('Settings file is too large. Maximum 250 KB.');
      const imported = U.validate(JSON.parse(await file.text()));
      if (dirty && !confirm('Replace the unsaved editor changes with this backup? / सहेजे नहीं गए बदलाव बदलें?')) return;
      draft = imported; render(); dirty = true; status.textContent = 'Backup loaded into the editor. Save a draft or download settings.js. / बैकअप संपादक में खुल गया।';
    } catch (error) { status.textContent = `Import failed; your draft is intact. ${error.message}`; }
    finally { event.target.value = ''; }
  });
  document.querySelector('#reset-draft').addEventListener('click', () => {
    if (!confirm('Discard this local draft and restore published settings? / स्थानीय प्रारूप हटाकर प्रकाशित विवरण वापस लाएँ?')) return;
    try { localStorage.removeItem(key); draft = structuredClone(window.INVITATION); dirty = false; render(); status.textContent = 'Published settings restored / प्रकाशित विवरण वापस लाए गए।'; }
    catch { status.textContent = 'Browser storage could not be updated. Your draft has not been reset.'; }
  });
  window.addEventListener('beforeunload', event => { if (dirty) { event.preventDefault(); event.returnValue = ''; } });
  render();
})();
