const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const crypto = require('node:crypto');
const Hub = require('../site/core.js');
const {plan} = require('./fixture.cjs');

function backend() {
  let failSheet = '', held = false;
  const properties = { FAMILY_KEY: 'a'.repeat(64), SHEET_ID: 'private', FOLDER_ID: 'folder', CALENDAR_ID: 'calendar' };
  const sheets = {};
  function sheet(name, row = []) {
    const s = { row, getMaxColumns: () => 150, getLastRow: () => 1, appendRow() {}, getRange(...args) {
      const start = typeof args[0] === 'number' ? args[1] - 1 : 0;
      const count = typeof args[0] === 'number' ? args[3] : args[0] === 'A1:D1' ? 4 : 2;
      return { getValues: () => [s.row.slice(start, start + count)], setValues: rows => {
        if (failSheet === name) throw Error('Simulated interrupted storage write');
        s.row.splice(start, rows[0].length, ...rows[0]);
      } };
    } };
    return sheets[name] = s;
  }
  sheet('Hub_Control', ['A', 0, '', '']); sheet('Hub_State_A'); sheet('Hub_State_B'); sheet('Activity');
  const book = {getSheetByName: n => sheets[n], insertSheet: sheet};
  const p = {getProperty: k => properties[k], setProperty: (k, v) => properties[k] = v, deleteProperty: k => delete properties[k], getProperties: () => properties};
  const ctx = vm.createContext({Hub, console, PropertiesService: {getScriptProperties: () => p},
    LockService: {getScriptLock: () => ({tryLock: () => held ? false : (held = true), releaseLock: () => held = false})},
    SpreadsheetApp: {openById: () => book, flush() {}},
    Utilities: {computeDigest: (_, text) => crypto.createHash('sha256').update(text).digest(), base64Encode: b => Buffer.from(b).toString('base64'), DigestAlgorithm: {SHA_256: 'sha'}, Charset: {UTF_8: 'utf8'}},
    ContentService: {MimeType: {JSON: 'json'}, createTextOutput: text => ({setMimeType: () => JSON.parse(text)})}
  });
  vm.runInContext(fs.readFileSync('apps-script/Code.gs', 'utf8'), ctx);
  const request = (action, extra = {}) => ctx.doPost({postData: {contents: JSON.stringify({action, key: properties.FAMILY_KEY, ...extra})}});
  return {ctx, request, sheets, properties, fail: name => failSheet = name};
}

test('all record actions authenticate; reads do not reveal data with a wrong key', () => {
  const b = backend();
  for (const action of ['read','save','calendar','backup','upload']) {
    const reply = b.request(action, {key: 'b'.repeat(64)});
    assert.equal(reply.ok, false); assert.equal(reply.state, undefined);
  }
  assert.equal(b.request('read').revision, 0);
});

test('CAS rejects stale writers, accepts valid saves, and reads exact Unicode state', () => {
  const b = backend(), s = plan(); s.meta.bride = 'सैमुएल =IMPORTXML()';
  assert.equal(b.request('save', {state: s, revision: 0}).revision, 1);
  const conflict = b.request('save', {state: plan(), revision: 0});
  assert.equal(conflict.conflict, true); assert.deepEqual(conflict.state, s);
  assert.equal(b.request('read', {revision: 1}).unchanged, true);
  for (const value of b.sheets.Hub_State_B.row.slice(2)) assert.equal(value[0], '"');
  s.meta.budget = -1;
  assert.equal(b.request('save', {state: s, revision: 1}).ok, false);
  assert.equal(b.request('read').revision, 1);
});

test('inactive snapshot failure and header failure keep the last complete plan', () => {
  for (const fail of ['Hub_State_A','Hub_Control']) {
    const b = backend(), original = plan(); b.request('save', {state: original, revision: 0});
    const changed = Hub.clone(original); changed.meta.bride = 'Unsaved';
    b.fail(fail);
    assert.equal(b.request('save', {state: changed, revision: 1}).ok, false);
    b.fail('');
    assert.deepEqual(b.request('read').state, original);
  }
});

test('corrupt snapshot and invalid header never look like an empty workspace', () => {
  const b = backend(); b.request('save', {state: plan(), revision: 0});
  b.sheets.Hub_State_B.row[2] = '"broken"';
  assert.equal(b.request('read').ok, false);
  b.sheets.Hub_Control.row[1] = 'invalid';
  assert.equal(b.request('read').ok, false);
});

test('calendar publishing updates stable events and only deletes hub-managed events', () => {
  const b = backend(), s = plan(); let created = 0, deleted = 0;
  s.events = [{id: 'event', name: 'Church', active: true, start: '2027-01-02T10:00', end: '2027-01-02T11:00', desc: '', venue: ''}];
  const event = {getId: () => 'google-event', getDescription: () => '[WeddingHub:event]', setTitle() {return this;}, setTime() {return this;}, setLocation() {return this;}, setDescription() {return this;}, deleteEvent() {deleted++;}};
  b.ctx.CalendarApp = {getCalendarById: () => ({getEventById: id => id === 'google-event' ? event : null, getEvents: () => [], createEvent: () => {created++; return event;}})};
  b.ctx.publishCalendar_(s); b.ctx.publishCalendar_(s);
  assert.equal(created, 1);
  s.events[0].end = '';
  assert.throws(() => b.ctx.publishCalendar_(s)); assert.equal(deleted, 0);
  s.events = []; b.ctx.publishCalendar_(s); assert.equal(deleted, 1);
});
