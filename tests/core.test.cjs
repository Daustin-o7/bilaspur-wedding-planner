const { test } = require('node:test');
const assert = require('node:assert/strict');
const Hub = require('../site/core.js');
const { plan } = require('./fixture.cjs');

test('seed validates, has no invented guests or bookings, and includes three-venue operations', () => {
  const s = Hub.validateState(plan());
  assert.equal(s.guests.length, 0);
  assert.equal(s.meta.budget, 0);
  assert.equal(s.tasks.length, 674);
  assert.ok(s.tasks.some(t => t.id === 'ops-1' && t.offset < 0));
  assert.ok(s.addons.every(a => a.status === 'Shortlisted'));
});

test('malformed backups, injection keys, invalid money, counts and dates are rejected', () => {
  for (const mutate of [s => s.meta.bride = {}, s => s.roles[0].person = null, s => s.budgetRows[0].agreed = -1, s => s.budgetRows[0].agreed = '5', s => s.meta.brideGuests = 1.5, s => s.tasks[0].done = 'yes', s => s.events[0].start = '2027-02-30T09:00', s => s.meta.date = '2027-02-30', s => s.tasks[0].id = '"><img src=x>', s => s.tasks.push(s.tasks[0]), s => s.meta = {}, s => s.commonSenders = JSON.parse('{"__proto__":"bad"}'), s => s.priorities.push({text: 'bad'}), s => s.budgetRows[0].dueDate = '" onfocus="alert(1)', s => s.tasks[0].offset = 1e99]) {
    const s = plan(); mutate(s); assert.throws(() => Hub.validateState(s), mutate.toString());
  }
});

test('three-way merge preserves independent fields and concurrent additions', () => {
  const base = { rows: [{id: 'a', name: 'A', phone: ''}] }, local = Hub.clone(base), remote = Hub.clone(base);
  local.rows[0].name = 'B'; remote.rows[0].phone = '123';
  local.rows.push({id: 'b', name: 'Local'}); remote.rows.push({id: 'c', name: 'Remote'});
  const result = Hub.merge(base, local, remote);
  assert.deepEqual(result.conflicts, []);
  assert.equal(result.value.rows.length, 3);
  assert.deepEqual(result.value.rows[0], {id: 'a', name: 'B', phone: '123'});
});

test('same-field and delete-versus-edit collisions require a choice; plain deletes propagate', () => {
  const base = { rows: [{id: 'a', name: 'A'}] }, local = Hub.clone(base), remote = Hub.clone(base);
  local.rows[0].name = 'L'; remote.rows[0].name = 'R';
  assert.equal(Hub.merge(base, local, remote).conflicts[0].path, 'rows[a].name');
  assert.equal(Hub.merge(base, {rows: []}, remote).conflicts.length, 1);
  assert.equal(Hub.merge(base, {rows: []}, base).value.rows.length, 0);
  assert.equal(Hub.merge(base, local, {rows: []}).value.rows[0].name, 'L');
});

test('Hindi names, escaped text, spreadsheet formulas, paise and IST dates', () => {
  assert.equal(Hub.normalizeName('  सैमुएल, ऑस्टिन  '), Hub.normalizeName('सैमुएल ऑस्टिन'));
  assert.notEqual(Hub.normalizeName('सैमुएल'), Hub.normalizeName('सुनील'));
  assert.equal(Hub.escapeHTML('<img onerror="x">'), '&lt;img onerror=&quot;x&quot;&gt;');
  assert.equal(Hub.csvCell(' =IMPORTXML("https://bad")')[0], "'");
  assert.equal(Hub.paise(0.1) + Hub.paise(0.2), 30);
  assert.equal(Hub.paise(1.005), 101);
  assert.equal(Hub.today(new Date('2026-11-09T18:30:00Z')), '2026-11-10');
  assert.equal(Hub.daysUntil('2026-11-10', new Date('2026-11-09T18:31:00Z')), 0);
  const ev = {name: 'Wedding', start: '2027-01-02T10:00', end: '2027-01-02T11:00'};
  assert.equal(Hub.eventDates(ev).start.toISOString(), '2027-01-02T04:30:00.000Z');
  assert.match(Hub.calendarURL(ev), /20270102T043000Z/);
  assert.throws(() => Hub.eventDates({...ev, end: ev.start}));
  assert.throws(() => Hub.eventDates({...ev, start: '2027-02-30T10:00'}));
});
