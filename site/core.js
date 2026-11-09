/* Shared pure helpers: also copied into Apps Script for validation. */
var Hub = (() => {
  const collections = ['tasks', 'roles', 'budgetRows', 'addons', 'miscDuties', 'guests', 'extendedBride', 'extendedGroom', 'morningSchedule', 'receptionSchedule', 'events', 'games', 'backups', 'intakeLogs', 'attendance'];
  const numeric = new Set(['secNum', 'quoted', 'agreed', 'advance', 'cost', 'adults', 'kids', 'rooms', 'vendorMeals', 'guaranteedPax', 'budget', 'brideGuests', 'groomGuests']);
  const boolean = new Set(['done', 'active', 'sent', 'skipped', 'customGuestNoticeEdited']);
  const fields = {
    tasks: ['text owner sub secTitle group priority note secNum done', 'offset dueDate skipped blockedBy'],
    roles: ['role resp person phone backup', ''],
    budgetRows: ['item pct vendor quoted agreed advance dueDate receipt owner', 'notes receiptURL payments'],
    addons: ['type venue vendor cue cost status owner', ''],
    miscDuties: ['done item venue person backup note', ''],
    guests: ['name side group adults kids rsvp meal room pickup note phone', 'rooms checkIn checkOut arrival arrivalPoint driver departure support allergy inviteRef'],
    extendedBride: ['name sent', ''], extendedGroom: ['name sent', ''],
    morningSchedule: ['time task owner', ''], receptionSchedule: ['time item owner', ''],
    events: ['name timing venue desc active', 'start end owner vendorMeals guaranteedPax countDeadline'],
    games: ['name venue duration rules host', ''], backups: ['risk prev action owner', ''],
    intakeLogs: ['type by title time', ''], attendance: ['guestId eventId adults kids status', '']
  };
  const dateFields = new Set(['date', 'dueDate', 'countDeadline']);
  const dateTimeFields = new Set(['start', 'end', 'checkIn', 'checkOut', 'arrival']);
  function validDate(value) {
    return /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value + 'T00:00:00Z')) && new Date(value + 'T00:00:00Z').toISOString().slice(0, 10) === value;
  }
  const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const object = v => v !== null && typeof v === 'object' && !Array.isArray(v);
  const clone = v => v === undefined ? undefined : JSON.parse(JSON.stringify(v));
  function validateState(s) {
    if (!object(s) || s.schema !== 5 || !object(s.meta) || !object(s.commonSenders) || !Array.isArray(s.priorities)) throw Error('Invalid wedding backup format (expected version 5).');
    if (JSON.stringify(s).length > 2000000) throw Error('Plan exceeds the 2 MB family workspace limit. Export a backup and archive old intake notes.');
    const topFields = [...collections, 'schema', 'meta', 'commonSenders', 'priorities', 'lastAction', 'customGuestNoticeEdited', 'customGuestNoticeText'];
    if (Object.keys(s).some(k => !topFields.includes(k)) || s.lastAction !== null || typeof s.customGuestNoticeText !== 'string' || typeof s.customGuestNoticeEdited !== 'boolean') throw Error('Invalid wedding details.');
    function record(row, required, optional = '') {
      const requiredKeys = required.split(' '), allowed = [...requiredKeys, ...optional.split(' ')];
      if (requiredKeys.some(k => !Object.hasOwn(row, k))) throw Error('Missing record field.');
      for (const [key, value] of Object.entries(row)) {
        if (!allowed.includes(key)) throw Error('Unknown record field: ' + key);
        const type = numeric.has(key) || key === 'offset' ? 'number' : boolean.has(key) ? 'boolean' : 'string';
        if (typeof value !== type) throw Error('Invalid field: ' + key);
        if (key === 'offset' && (!Number.isInteger(value) || Math.abs(value) > 3650)) throw Error('Invalid task date offset.');
        if (dateFields.has(key) && value && !validDate(value)) throw Error('Invalid date: ' + key);
        if (dateTimeFields.has(key) && value && (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value) || !validDate(value.slice(0,10)) || value.slice(11,13) > '23' || value.slice(14) > '59')) throw Error('Invalid date/time: ' + key);
      }
    }
    record(s.meta, 'themeTitle bride groom date coordinator mandapamSchedule mandapamStay churchTime receptionTime cpiHall budget brideGuests groomGuests dressCode rsvpContact');
    for (const name of collections) {
      if (!Array.isArray(s[name]) || s[name].length > (name === 'events' ? 100 : 20000)) throw Error('Invalid collection: ' + name);
      const ids = new Set();
      for (const row of s[name]) {
        if (!object(row) || typeof row.id !== 'string' || !/^[a-zA-Z0-9_-]{1,100}$/.test(row.id) || ids.has(row.id)) throw Error('Invalid or duplicate record ID in ' + name);
        ids.add(row.id);
        record(row, 'id ' + fields[name][0], fields[name][1]);
      }
    }
    function walk(v, key = '', depth = 0) {
      if (depth > 8 || ['__proto__', 'prototype', 'constructor'].includes(key)) throw Error('Invalid data key.');
      if (numeric.has(key) && (typeof v !== 'number' || !Number.isFinite(v) || v < 0 || v > 1000000000)) throw Error('Invalid non-negative number: ' + key);
      if (['adults', 'kids', 'rooms', 'vendorMeals', 'guaranteedPax', 'brideGuests', 'groomGuests', 'secNum'].includes(key) && !Number.isInteger(v)) throw Error('Whole number required: ' + key);
      if (boolean.has(key) && typeof v !== 'boolean') throw Error('Invalid checkbox: ' + key);
      if (typeof v === 'string' && v.length > 10000) throw Error('Text is too long: ' + key);
      if (typeof v === 'number' && !Number.isFinite(v)) throw Error('Invalid number.');
      if (v !== null && typeof v === 'object') Object.entries(v).forEach(([k, x]) => walk(x, k, depth + 1));
    }
    walk(s);
    const enums = { tasks: { priority: ['Normal','High'] }, guests: { side: ['Bride','Groom','Both'], rsvp: ['Pending','Maybe','Confirmed','Declined'], room: ['Yes','No'], pickup: ['Yes','No'] }, attendance: { status: ['Pending','Maybe','Confirmed','Declined'] }, addons: { status: ['Shortlisted','Booked','Advance Paid','Not Needed','Done'] }, budgetRows: { receipt: ['Pending','Quote Saved','Contract Signed','Receipt Filed'] } };
    for (const [name, checks] of Object.entries(enums)) for (const row of s[name]) for (const [key, values] of Object.entries(checks)) if (!values.includes(row[key])) throw Error('Invalid choice: ' + key);
    for (const r of s.roles) if (!r.role.trim()) throw Error('Role name cannot be blank.');
    for (const r of s.guests) if (r.checkIn && r.checkOut && r.checkOut <= r.checkIn) throw Error('Checkout must follow check-in.');
    if (s.priorities.some(p => typeof p !== 'string')) throw Error('Invalid priorities.');
    if (Object.values(s.commonSenders).some(v => typeof v !== 'string')) throw Error('Invalid invite senders.');
    return s;
  }
  // Merge independent field changes; same-field or delete-versus-edit collisions require a choice.
  function merge(base, local, remote) {
    const conflicts = [];
    function visit(b, l, r, path) {
      if (equal(l, b)) return clone(r);
      if (equal(r, b) || equal(l, r)) return clone(l);
      if (Array.isArray(b) && Array.isArray(l) && Array.isArray(r) && [...b, ...l, ...r].every(x => object(x) && typeof x.id === 'string')) {
        const bm = new Map(b.map(x => [x.id, x])), lm = new Map(l.map(x => [x.id, x])), rm = new Map(r.map(x => [x.id, x]));
        return [...new Set([...r, ...l].map(x => x.id))].map(id => visit(bm.get(id), lm.get(id), rm.get(id), path + '[' + id + ']')).filter(x => x !== undefined);
      }
      if (object(b) && object(l) && object(r)) {
        const result = {};
        for (const k of new Set([...Object.keys(b), ...Object.keys(l), ...Object.keys(r)])) {
          if (['__proto__', 'constructor', 'prototype'].includes(k)) throw Error('Invalid key.');
          const v = visit(b[k], l[k], r[k], path ? path + '.' + k : k);
          if (v !== undefined) result[k] = v;
        }
        return result;
      }
      conflicts.push({ path, local: clone(l), remote: clone(r) });
      return clone(l);
    }
    return { value: visit(base, local, remote, ''), conflicts };
  }
  const escapeHTML = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const normalizeName = s => String(s || '').normalize('NFKC').toLocaleLowerCase('en-IN').replace(/[\p{P}\p{Z}\s]+/gu, ' ').trim();
  const csvCell = v => /^[\s]*[=+\-@\t\r]/.test(String(v ?? '')) ? "'" + v : String(v ?? '');
  const paise = v => Math.round(((Number(v) || 0) + Number.EPSILON) * 100);
  function today(now = new Date()) { return new Date(now.getTime() + 19800000).toISOString().slice(0, 10); }
  function daysUntil(date, now = new Date()) { return Math.round((Date.parse(date + 'T00:00:00Z') - Date.parse(today(now) + 'T00:00:00Z')) / 86400000); }
  function eventDates(ev) {
    const pattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
    if (!pattern.test(ev.start || '') || !pattern.test(ev.end || '')) throw Error('Set an exact start and end for ' + ev.name);
    const start = new Date(ev.start + ':00+05:30'), end = new Date(ev.end + ':00+05:30');
    if (!Number.isFinite(+start) || !Number.isFinite(+end) || end <= start) throw Error('Event end must be after start: ' + ev.name);
    if (new Date(+start + 19800000).toISOString().slice(0, 16) !== ev.start || new Date(+end + 19800000).toISOString().slice(0, 16) !== ev.end) throw Error('Invalid calendar date.');
    return { start, end };
  }
  function calendarURL(ev) {
    const { start, end } = eventDates(ev);
    const compact = d => d.toISOString().replace(/[-:]/g, '').replace('.000', '');
    return 'https://calendar.google.com/calendar/render?' + new URLSearchParams({ action: 'TEMPLATE', text: ev.name, dates: compact(start) + '/' + compact(end), ctz: 'Asia/Kolkata', location: ev.venue || '', details: ev.desc || '' });
  }
  return { collections, equal, clone, validateState, merge, escapeHTML, normalizeName, csvCell, paise, today, daysUntil, eventDates, calendarURL };
})();
if (typeof module !== 'undefined') module.exports = Hub;
