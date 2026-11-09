const escapeHTML = Hub.escapeHTML;
const plannerTasks = [
  ['Mandapam contract: list each hall/lawn, rooms, access hours, end time, cancellation, taxes and duty-manager contact.', 'मंडपम के हॉल, लॉन, कमरे, समय और शुल्क लिखित में लें।', 'Mandapam & pre-wedding lead', -56],
  ['Confirm Mandapam room inventory, extra beds, accessible rooms, early check-in, checkout and breakfast package.', 'कमरों की संख्या, अतिरिक्त बिस्तर, चेक-इन/आउट और नाश्ता पक्का करें।', 'Hospitality & transport lead', -42],
  ['Build a meal count for every Mandapam breakfast, lunch and dinner, plus CPI dinner; separate children and vendor meals.', 'हर नाश्ते, दोपहर और रात के भोजन की अलग गिनती रखें।', 'Guest & RSVP lead', -14],
  ['Book bridal mehendi time first; agree artist headcount, guest designs, finish time, comfortable seating and lighting.', 'दुल्हन की मेहंदी पहले; कलाकार, डिज़ाइन और समाप्ति का समय तय करें।', 'Bride-side coordinator', -28],
  ['Arrange a helper, easy-to-change outfit, drinking water and food assistance while bridal mehendi dries.', 'मेहंदी सूखने पर कपड़े, पानी, भोजन और सहायक की व्यवस्था करें।', "Bride's personal attendant", -7],
  ['Agree haldi floor protection, stain/cleaning charges, non-slip access, towels, water and changing rooms.', 'हल्दी के दाग, सफ़ाई, सुरक्षित फ़र्श और चेंजिंग रूम तय करें।', 'Mandapam & pre-wedding lead', -14],
  ['Check ingredients and skin tolerance for mehendi/haldi beforehand; participation and facial application follow the couple’s wishes.', 'मेहंदी/हल्दी की सामग्री जाँचें; भागीदारी दंपति की इच्छा से हो।', 'Bride-side coordinator', -14],
  ['Lock a short sangeet lineup and firm finish time that protects sleep before morning makeup and church reporting.', 'संगीत का समापन समय तय करें ताकि अगले दिन आराम मिले।', 'MC / stage manager', -14],
  ['Dhol contract: player count, performance length, entry cue, travel/meals, overtime and backup player.', 'ढोल वादक, अवधि, संकेत, यात्रा, भोजन और विकल्प लिखित में लें।', 'Mandapam & pre-wedding lead', -28],
  ['Check dhol/outdoor sound permission and the venue’s actual sound cutoff; keep church worship separate from entertainment.', 'ढोल व बाहरी साउंड की अनुमति और समय; चर्च आराधना अलग रखें।', 'MC / stage manager', -14],
  ['Rehearse Mandapam → church → rest → CPI transfers at the relevant time of day; record measured travel plus boarding buffer.', 'तीनों स्थानों का रास्ता जाँचें; वास्तविक यात्रा और बैठने का अतिरिक्त समय रखें।', 'Hospitality & transport lead', -14],
  ['Record exact arrival station/airport, train/flight, terminal, passengers, driver and delayed-arrival fallback for each pickup.', 'हर पिकअप के स्टेशन/हवाई अड्डे, ट्रेन/फ़्लाइट, यात्रियों और ड्राइवर का विवरण लें।', 'Hospitality & transport lead', -7],
  ['Confirm return shuttles after CPI, last departure, elderly escorts and the standby vehicle.', 'रिसेप्शन के बाद वापसी गाड़ियाँ, आख़िरी समय और बुज़ुर्गों के सहायक तय करें।', 'Hospitality & transport lead', -7],
  ['Nominate a ring custodian and a separate document custodian; record handover before church and after signing.', 'अंगूठियों और दस्तावेज़ों के नामित ज़िम्मेदार तथा हस्तांतरण दर्ज करें।', "Groom's personal attendant", -7],
  ['Allocate each elder an agreed escort and arrange a quiet room, child supervision and accessible washrooms.', 'बुज़ुर्गों के सहायक, शांत कमरा, बच्चों की देखरेख और सुगम शौचालय रखें।', 'Hospitality & transport lead', -14],
  ['Confirm nearest suitable medical facility and route, local emergency contact, first-aid person and available vehicle.', 'निकट चिकित्सा केंद्र, रास्ता, आपात संपर्क, प्राथमिक उपचार व्यक्ति और वाहन पक्का करें।', 'Emergency lead', -14],
  ['Prepare a seasonal heat/rain/cold plan for all venues; assign who decides to move indoors and by what time.', 'गर्मी/बारिश/ठंड की योजना; भीतर जाने का निर्णय किसका और कब होगा।', 'Emergency lead', -7],
  ['Confirm backup power under actual sound, lighting, cooling and kitchen load at Mandapam and CPI.', 'मंडपम व सीपीआई में असली लोड पर बिजली बैकअप जाँचें।', 'CPI/venue liaison', -7],
  ['Verify each Google Maps pin and the correct entrance with both venue managers before sharing invitations.', 'निमंत्रण से पहले नक्शे का सही पिन और प्रवेश द्वार जाँचें।', 'Hospitality & transport lead', -28],
  ['Record vendor legal name, phone, backup contact, GST-inclusive scope, arrival time and receipt link in payment notes.', 'वेंडर का नाम, फ़ोन, विकल्प, जीएसटी सहित काम, आगमन और रसीद दर्ज करें।', 'Budget & payments lead', -28],
  ['Reconcile CPI package versus separate catering and every add-on against the budget so each expense is counted once.', 'सीपीआई पैकेज, कैटरिंग और ऐड-ऑन का खर्च केवल एक बार जोड़ें।', 'Budget & payments lead', -14],
  ['Agree final guaranteed pax, adjustment deadline, extra-plate price and who authorises extra food with each caterer.', 'गारंटी प्लेट संख्या, बदलाव की अंतिम तारीख और अतिरिक्त भोजन का अधिकार तय करें।', 'CPI/venue liaison', -14],
  ['Confirm couple’s private lunch, rest, outfit change and realistic evening departure time between church and CPI.', 'चर्च और रिसेप्शन के बीच दंपति का भोजन, आराम और कपड़े बदलने का समय रखें।', "Bride's personal attendant", -7],
  ['Record gift/card handovers, numbered cash envelopes, room-key return and rental deposit reconciliation.', 'उपहार, नकद लिफ़ाफ़े, कमरे की चाबी और किराये की जमा राशि का हिसाब रखें।', 'Budget & payments lead', 1],
  ['Test the family edit link on two phones, download a backup and print the final contact/run sheets.', 'दो फ़ोन पर साझा लिंक जाँचें; बैकअप और अंतिम संपर्क/कार्यक्रम सूची छापें।', 'Overall wedding lead', -7]
];

function normalizePlanner(s) {
  s.schema = 5;
  s.attendance ||= [];
  Hub.collections.forEach(name => (s[name] || []).forEach((r, i) => { r.id ||= name + '-legacy-' + i; }));
  return s;
}

function addPlannerSeed(s) {
  plannerTasks.forEach(([text, hindi, owner, offset], i) => s.tasks.push({ id: 'ops-' + (i + 1), secNum: 28, secTitle: '28. Three-venue operations • तीन स्थानों का संचालन', group: 'Wedding Day, Backup & Post-Wedding', sub: 'Operations / संचालन', text, note: hindi, owner, done: false, priority: 'High', offset, dueDate: '', skipped: false }));
  s.events.forEach(ev => { ev.start = ''; ev.end = ''; ev.owner = ''; ev.vendorMeals = 0; ev.guaranteedPax = 0; ev.countDeadline = ''; });
  s.backups.push({ id: 'bk-medical', risk: 'Medical incident / heat illness', prev: 'Confirm emergency lead, facility and route before event', action: 'Call 112 for emergency assistance; one escort and vehicle ready. Record local facility contact in notes.', owner: 'Emergency lead' });
}

function loadPlannerState() {
  addPlannerSeed(state);
  normalizePlanner(state);
  initializeLocalWorkspace();
}

function plannerField(label, collection, row, field, type = 'text', options = null) {
  const value = row[field] ?? '';
  const data = `data-record="${collection}" data-id="${escapeHTML(row.id)}" data-field="${field}"`;
  const control = options ? `<select ${data}>${options.map(([v, t]) => `<option value="${escapeHTML(v)}" ${String(value) === String(v) ? 'selected' : ''}>${escapeHTML(t)}</option>`).join('')}</select>` : type === 'checkbox' ? `<input type="checkbox" ${data} ${value ? 'checked' : ''}>` : `<input type="${type}" ${data} value="${escapeHTML(value)}" ${type === 'number' ? 'min="0" max="1000000000" step="1"' : ''}>`;
  return `<label class="planner-field">${escapeHTML(label)}${control}</label>`;
}

function taskDue(t) {
  if (t.dueDate) return t.dueDate;
  let offset = t.offset;
  if (offset === undefined && t.secNum === 3) {
    const weeks = t.sub.match(/T[−–-](\d+) weeks?/i);
    if (weeks) offset = -Number(weeks[1]) * 7;
    else if (/T[−–-]1 day/i.test(t.sub)) offset = -1;
  }
  return state.meta.date && offset !== undefined ? new Date(Date.parse(state.meta.date + 'T00:00:00Z') + offset * 86400000).toISOString().slice(0, 10) : '';
}

function enhanceChecklist() {
  document.querySelectorAll('[data-text-task]').forEach(input => {
    const t = state.tasks.find(r => r.id === input.dataset.textTask);
    const card = input.closest('div.p-3\\.5');
    if (!card || !t) return;
    const extra = document.createElement('details');
    extra.className = 'row-extras';
    extra.innerHTML = `<summary>${t.skipped ? 'Not applicable' : t.blockedBy ? 'Blocked' : 'Deadline & notes'} • ${escapeHTML(taskDue(t) || 'No date set')}</summary><div class="planner-grid">${plannerField('Due date / अंतिम तारीख', 'tasks', t, 'dueDate', 'date')}${plannerField('Waiting on / बाधा', 'tasks', t, 'blockedBy')}${plannerField('Not applicable / लागू नहीं', 'tasks', t, 'skipped', 'checkbox')}</div>`;
    card.appendChild(extra);
  });
}

function enhanceGuests() {
  const body = document.getElementById('guest-table-body');
  [...body.rows].forEach(tr => {
    const id = tr.querySelector('[data-g-id]')?.dataset.gId;
    const g = state.guests.find(r => r.id === id);
    if (!g) return;
    const row = document.createElement('tr');
    row.innerHTML = `<td colspan="13"><details class="row-extras"><summary>${escapeHTML(g.name || 'Household')} — stay, travel &amp; access needs / ठहराव व यात्रा</summary><div class="planner-grid">${[
      ['Room count', 'rooms', 'number'], ['Check-in (IST)', 'checkIn', 'datetime-local'], ['Check-out (IST)', 'checkOut', 'datetime-local'], ['Arrival (IST)', 'arrival', 'datetime-local'], ['Train / flight & exact station/airport', 'arrivalPoint'], ['Driver, vehicle & phone', 'driver'], ['Return journey / departure', 'departure'], ['Mobility / child support & escort', 'support'], ['Allergies & kitchen contact', 'allergy'], ['Invite household reference / locality', 'inviteRef']
    ].map(([label, field, type]) => plannerField(label, 'guests', g, field, type)).join('')}</div></details></td>`;
    tr.after(row);
  });
  renderAttendance();
}

function enhanceEvents() {
  document.querySelectorAll('[data-ev-edit][data-field=name]').forEach(input => {
    const ev = state.events.find(r => r.id === input.dataset.evEdit);
    const card = input.closest('div.p-4');
    const div = document.createElement('div');
    div.className = 'planner-grid';
    div.innerHTML = [['Start (IST)', 'start', 'datetime-local'], ['End (IST)', 'end', 'datetime-local'], ['Event lead', 'owner'], ['Vendor/staff meals', 'vendorMeals', 'number'], ['Contract guaranteed pax', 'guaranteedPax', 'number'], ['Final count deadline', 'countDeadline', 'date']].map(([label, field, type]) => plannerField(label, 'events', ev, field, type)).join('');
    card.appendChild(div);
  });
  renderCalendarLinks();
}

function renderAttendance() {
  const box = document.getElementById('event-attendance');
  if (!box) return;
  const guests = state.guests.map(g => [g.id, g.name || 'Unnamed household']);
  const events = state.events.map(e => [e.id, e.name + (e.active ? '' : ' (inactive)')]);
  box.innerHTML = `<h3>Event-wise catering / हर कार्यक्रम की भोजन संख्या</h3><p>Add a household once per function with actual adults and children attending. “Maybe” is not confirmed. Vendor meals and contracted guarantees are shown separately.</p><button type="button" id="add-attendance" class="planner-button">+ Household attendance</button>`;
  state.events.filter(e => e.active).forEach(ev => {
    const candidates = state.attendance.filter(a => a.eventId === ev.id && state.guests.some(g => g.id === a.guestId));
    const rows = candidates.filter(a => candidates.filter(b => b.guestId === a.guestId).length === 1);
    const confirmed = rows.filter(a => a.status === 'Confirmed').reduce((n, a) => n + a.adults + a.kids, 0);
    const pending = rows.filter(a => a.status === 'Pending' || a.status === 'Maybe').reduce((n, a) => n + a.adults + a.kids, 0);
    const p = document.createElement('p');
    p.textContent = `${ev.name}: ${confirmed} confirmed guests • ${pending} pending/maybe • ${ev.vendorMeals || 0} staff meals • ${ev.guaranteedPax || 0} contracted pax • Count deadline: ${ev.countDeadline || 'TBD'}` + (rows.length !== candidates.length ? ' — DUPLICATE HOUSEHOLD RSVPs: remove the duplicate entries below; their counts are excluded until resolved.' : '');
    box.appendChild(p);
  });
  for (const a of state.attendance) {
    const card = document.createElement('div'); card.className = 'planner-card planner-grid';
    card.innerHTML = plannerField('Household', 'attendance', a, 'guestId', 'text', [['', 'Choose household'], ...guests]) + plannerField('Function', 'attendance', a, 'eventId', 'text', [['', 'Choose active event'], ...events]) + plannerField('Adults', 'attendance', a, 'adults', 'number') + plannerField('Children', 'attendance', a, 'kids', 'number') + plannerField('Event RSVP', 'attendance', a, 'status', 'text', ['Pending','Maybe','Confirmed','Declined'].map(x => [x,x])) + `<button type="button" class="planner-button secondary" data-remove-attendance="${a.id}">Remove attendance</button>`;
    box.appendChild(card);
  }
  document.getElementById('add-attendance').onclick = () => {
    if (!guests.length || !events.length) return showToast('Add a household and activate an event first.', 'error');
    state.attendance.push({ id: crypto.randomUUID(), guestId: '', eventId: '', adults: 0, kids: 0, status: 'Pending' });
    saveState(); renderAttendance();
  };
}

function renderPlannerSummary() {
  const summary = document.getElementById('planner-summary');
  if (!summary) return;
  const open = state.tasks.filter(t => !t.done && !t.skipped);
  const overdue = open.filter(t => taskDue(t) && taskDue(t) < Hub.today());
  const unassigned = state.roles.filter(r => !r.person.trim());
  const payments = state.budgetRows.filter(r => r.dueDate && r.dueDate <= Hub.today() && Hub.paise(r.agreed) > Hub.paise(r.advance));
  summary.innerHTML = `<h2>Coordinator’s desk / समन्वयक डेस्क</h2><p>${overdue.length} overdue tasks · ${open.filter(t => t.blockedBy).length} blocked · ${unassigned.length} roles without a named person · ${payments.length} payments due</p><p><strong>First decisions:</strong> wedding date, church slot and paperwork route, Mandapam room/function contract, exact CPI hall, budget ceiling and event-wise headcount.</p><ul class="planner-list">${overdue.slice(0,5).map(t => `<li>${escapeHTML(taskDue(t))}: ${escapeHTML(t.text)}</li>`).join('')}${payments.slice(0,5).map(r => `<li>Payment: ${escapeHTML(r.item)} — ${formatINR((Hub.paise(r.agreed)-Hub.paise(r.advance))/100)}</li>`).join('')}</ul><p>Optional customs belong to the couple. The sample timings are a starting point; obtain actual venue and pastor confirmations.</p>`;
}

function renderCalendarLinks() {
  const box = document.getElementById('calendar-links');
  if (!box) return;
  box.replaceChildren();
  state.events.filter(e => e.active).forEach(ev => {
    try {
      const a = document.createElement('a'); a.href = Hub.calendarURL(ev); a.textContent = '+ Add personal copy: ' + ev.name; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.className = 'planner-button secondary inline-block'; box.appendChild(a);
    } catch { /* Undated draft events have no calendar link. */ }
  });
}

function rerenderPlanner() {
  bindMetaInputs(); populateFilterDropdowns(); renderPriorities(); updateHeaderAndProgress(); updateGuestTemplatePreview(); renderChecklist(); renderRoles(); renderBudget(); renderGuests(); renderExtendedGuests(); renderAddonsAndMisc(); renderSchedulesAndEvents(); renderIntakeLogs(); renderPlannerSummary();
  labelControls();
}

function labelControls() {
  const labelled = new Set([...document.querySelectorAll('label[for]')].map(label => label.htmlFor));
  document.querySelectorAll('input,select,textarea,button').forEach(el => {
    if (el.getAttribute('aria-label') || labelled.has(el.id) || el.closest('label') || (el.tagName === 'BUTTON' && el.textContent.trim() !== '✕')) return;
    const cell = el.closest('td');
    const head = cell?.closest('table')?.tHead?.rows[0]?.cells[cell.cellIndex]?.textContent;
    el.setAttribute('aria-label', el.title || head?.trim() || el.dataset.field || el.placeholder || (el.type === 'checkbox' ? 'Mark completed' : 'Edit value'));
  });
}

function printCurrentTab() { document.activeElement?.blur(); window.print(); }

function initPlanner() {
  const summary = document.createElement('div'); summary.id = 'planner-summary'; summary.className = 'planner-card'; document.getElementById('tab-panel-dashboard').prepend(summary);
  const attendance = document.createElement('div'); attendance.id = 'event-attendance'; attendance.className = 'planner-card'; document.getElementById('tab-panel-guests').appendChild(attendance);
  const banner = document.createElement('p'); banner.className = 'planner-alert'; banner.textContent = 'All event cards and morning times are planning suggestions. Enter exact dates and IST times before publishing Calendar events. Mehendi, haldi and sangeet are optional cultural celebrations.'; document.getElementById('tab-panel-schedules').prepend(banner);
  const budgetInfo = document.createElement('div'); budgetInfo.className = 'planner-card'; budgetInfo.innerHTML = '<h3>Vendor notes, receipts &amp; instalments</h3><p>Use each line’s item/vendor fields for the contract scope and contact. The Paid-to-date amount must include all instalments. Add a payment/receipt note below; keep each package and add-on in the budget only once.</p><div id="vendor-notes"></div>'; document.getElementById('tab-panel-budget').appendChild(budgetInfo);
  const receipts = document.createElement('div'); receipts.className = 'planner-card'; receipts.innerHTML = '<h3>Upload a receipt to private Drive</h3><p>After Google setup, upload a PDF or image up to 5 MB. Copy its Drive URL into the matching vendor’s receipt field above. The owner controls access to the file.</p><label class="planner-field">Receipt / contract<input id="receipt-file" type="file" accept="application/pdf,image/jpeg,image/png,image/webp"></label><p id="receipt-result" role="status"></p>'; document.getElementById('tab-panel-budget').appendChild(receipts);
  const oldBudget = renderBudget;
  renderBudget = function() {
    oldBudget();
    document.getElementById('vendor-notes').innerHTML = state.budgetRows.map(r => `<details class="row-extras"><summary>${escapeHTML(r.item)} ${r.advance > r.agreed ? '— OVERPAYMENT: reconcile refund/credit' : ''}</summary><div class="planner-grid">${plannerField('Contact / backup / arrival / terms', 'budgetRows', r, 'notes')}${plannerField('Drive contract / receipt URL', 'budgetRows', r, 'receiptURL', 'url')}${plannerField('Payment dates, amounts & references', 'budgetRows', r, 'payments')}</div></details>`).join('');
  };
  document.addEventListener('change', event => {
    const el = event.target;
    if (!el.dataset.record) return;
    if (!el.reportValidity()) return;
    const row = state[el.dataset.record]?.find(r => r.id === el.dataset.id);
    if (!row) return;
    const field = el.dataset.field, old = row[field];
    row[field] = el.type === 'checkbox' ? el.checked : el.type === 'number' ? Number(el.value) : el.value;
    if (el.dataset.record === 'attendance' && row.guestId && row.eventId && state.attendance.some(a => a.id !== row.id && a.guestId === row.guestId && a.eventId === row.eventId)) {
      row[field] = old; el.value = old || ''; return showToast('That household already has an RSVP for this event.', 'error');
    }
    if (row.checkIn && row.checkOut && row.checkOut <= row.checkIn) { row[field] = old; el.value = old || ''; return showToast('Checkout must follow check-in.', 'error'); }
    saveState();
    if (el.dataset.record === 'tasks') {
      const summary = el.closest('details')?.querySelector('summary');
      if (summary) summary.textContent = `${row.skipped ? 'Not applicable' : row.blockedBy ? 'Blocked' : 'Deadline & notes'} • ${taskDue(row) || 'No date set'}`;
    }
    renderAttendance(); renderCalendarLinks(); labelControls();
  });
  document.addEventListener('click', event => {
    const id = event.target.dataset.removeAttendance;
    if (!id) return;
    state.attendance = state.attendance.filter(a => a.id !== id); saveState(); renderAttendance();
  });
  document.addEventListener('keydown', event => {
    const modal = document.querySelector('#modal-add-task:not(.hidden)');
    if (!modal) return;
    if (event.key === 'Escape') { modal.classList.add('hidden'); document.getElementById('btn-open-add-task').focus(); }
    if (event.key === 'Tab') {
      const focusable = [...modal.querySelectorAll('button,input,select')]; const first = focusable[0], last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  document.getElementById('modal-add-task').setAttribute('role', 'dialog');
  document.getElementById('modal-add-task').setAttribute('aria-modal', 'true');
  document.getElementById('modal-add-task').setAttribute('aria-label', 'Add wedding task');
  window.addEventListener('beforeprint', () => {
    document.querySelectorAll('.tab-panel:not(.hidden) details:not([open])').forEach(el => { el.dataset.printOpened = 'true'; el.open = true; });
    document.querySelectorAll('.print-value').forEach(x => x.remove());
    document.querySelectorAll('input:not([type=checkbox]),textarea,select').forEach(el => {
      const span = document.createElement('span'); span.className = 'print-value hidden'; span.textContent = el.tagName === 'SELECT' ? el.selectedOptions[0]?.textContent || '' : el.value; el.after(span);
    });
  });
  window.addEventListener('afterprint', () => document.querySelectorAll('[data-print-opened]').forEach(el => { el.open = false; delete el.dataset.printOpened; }));
  rerenderPlanner();
}
