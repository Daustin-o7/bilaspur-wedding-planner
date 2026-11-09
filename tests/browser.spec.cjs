const { test, expect } = require('@playwright/test');
const {plan} = require('./fixture.cjs');
const Hub = require('../site/core.js');
test('starts without runtime errors and supports task, guest, budget CRUD and reload', async ({page}) => {
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.route('https://www.google.com/**', r => r.abort());
  await page.goto('/', {waitUntil: 'domcontentloaded'});
  expect(errors).toEqual([]);
  await expect(page.locator('#last-saved-indicator')).toContainText('Local mode');
  await page.locator('#meta-bride').fill('Test Bride'); await page.locator('#meta-bride').blur();
  await page.locator('[data-tab=checklist]').click();
  await page.locator('#btn-open-add-task').click();
  await page.locator('#new-task-text').fill('Check ceremony documents');
  await page.locator('#btn-save-add-task').click();
  await page.locator('#filter-search').fill('Check ceremony documents');
  await expect(page.locator('.task-text-input')).toHaveCount(1);
  await page.locator('.task-check-input').check();
  await expect(page.locator('.task-check-input')).toBeChecked();
  await page.locator('.task-del-btn').click();
  await expect(page.locator('.task-text-input')).toHaveCount(0);
  await page.locator('[data-tab=guests]').click();
  await page.locator('#btn-add-guest-row').click();
  await page.locator('[data-g-id][data-field=name]').fill('सैमुएल परिवार'); await page.locator('[data-g-id][data-field=name]').blur();
  await page.locator('[data-g-id][data-field=adults]').fill('3'); await page.locator('[data-g-id][data-field=adults]').blur();
  await page.locator('[data-g-id][data-field=rsvp]').selectOption('Confirmed');
  await expect(page.locator('#guest-stat-confirmed')).toHaveText('3');
  await page.locator('[data-tab=budget]').click();
  await page.locator('[data-b-id="b-1"][data-field=agreed]').fill('100.10'); await page.locator('[data-b-id="b-1"][data-field=agreed]').blur();
  await page.locator('[data-b-id="b-1"][data-field=advance]').fill('40'); await page.locator('[data-b-id="b-1"][data-field=advance]').blur();
  await expect(page.locator('#budget-card-balance')).toHaveText('₹60.1');
  await page.reload({waitUntil: 'domcontentloaded'});
  await expect(page.locator('#meta-bride')).toHaveValue('Test Bride');
  expect(await page.evaluate(() => state.guests[0].name)).toBe('सैमुएल परिवार');
  expect(errors).toEqual([]);
});

async function sharedClient(browser, server) {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.route('https://www.google.com/**', r => r.abort());
  await page.route('https://script.google.com/**', async route => {
    const req = route.request().postDataJSON();
    let result;
    if (server.fail) { await route.abort('internetdisconnected'); return; }
    if (req.key !== 'a'.repeat(64)) result = {ok: false, error: 'Invalid key'};
    else if (req.action === 'read') result = req.revision === server.revision ? {ok: true, unchanged: true, revision: server.revision} : {ok: true, state: server.state, revision: server.revision};
    else if (req.action === 'save') {
      if (server.beforeSave) { server.beforeSave(server); server.beforeSave = null; }
      if (req.revision !== server.revision) result = {ok: true, conflict: true, state: server.state, revision: server.revision};
      else { server.state = Hub.clone(req.state); result = {ok: true, revision: ++server.revision}; }
    }
    const body = JSON.stringify(result);
    if (server.hold && req.action === 'read') await server.hold;
    await route.fulfill({status: 200, contentType: 'application/json', headers: {'Access-Control-Allow-Origin': '*'}, body});
  });
  await page.goto('/#' + new URLSearchParams({bridge: 'https://script.google.com/macros/s/test-deployment/exec', key: 'a'.repeat(64)}), {waitUntil: 'domcontentloaded'});
  await expect(page.locator('#last-saved-indicator')).toContainText('Saved to Google');
  return page;
}

test('two family clients merge independent edits and explicitly resolve concurrent field conflicts', async ({browser}) => {
  const server = {state: plan(), revision: 1};
  const a = await sharedClient(browser, server), b = await sharedClient(browser, server);
  await a.evaluate(() => {state.meta.bride = 'Bride from A'; saveState();});
  await b.evaluate(() => {state.meta.groom = 'Groom from B'; saveState();});
  await a.evaluate(() => syncCloud());
  await b.evaluate(() => syncCloud());
  await a.evaluate(() => syncCloud());
  expect(server.state.meta.bride).toBe('Bride from A'); expect(server.state.meta.groom).toBe('Groom from B');
  expect(await a.evaluate(() => state.meta.groom)).toBe('Groom from B');
  await a.evaluate(() => {state.meta.coordinator = 'A'; saveState();});
  await b.evaluate(() => {state.meta.coordinator = 'B'; saveState();});
  await a.evaluate(() => syncCloud()); await b.evaluate(() => syncCloud());
  await expect(b.locator('#cloud-problem')).toContainText('meta.coordinator');
  await b.getByRole('button', {name: 'Use Google for conflicts'}).click();
  await expect(b.locator('#last-saved-indicator')).toContainText('Saved to Google');
  expect(await b.evaluate(() => state.meta.coordinator)).toBe('A');
  expect(server.state.meta.groom).toBe('Groom from B');
  await a.context().close(); await b.context().close();
});

test('failed sync remains visible and a late read never replaces an in-progress typed field', async ({browser}) => {
  const server = {state: plan(), revision: 1}; const page = await sharedClient(browser, server);
  server.fail = true; await page.evaluate(() => syncCloud());
  await expect(page.locator('#cloud-problem')).toBeVisible();
  await expect(page.locator('#last-saved-indicator')).toContainText('Google unavailable');
  server.fail = false; server.state.meta.bride = 'Remote Bride'; server.revision++;
  let release; server.hold = new Promise(resolve => release = resolve);
  await page.evaluate(() => {window.pendingSync = syncCloud();});
  await page.locator('#meta-bride').fill('Typing right now');
  release(); server.hold = null;
  await page.evaluate(() => window.pendingSync);
  await expect(page.locator('#meta-bride')).toHaveValue('Typing right now');
  await page.locator('#meta-bride').blur();
  await page.evaluate(() => syncCloud());
  await expect(page.locator('#cloud-problem')).toContainText('meta.bride');
  await page.context().close();
});

test('save-time CAS conflict is not mislabeled as a successful merge', async ({browser}) => {
  const server = {state: plan(), revision: 1}; const page = await sharedClient(browser, server);
  server.beforeSave = s => {s.state.meta.bride = 'Other writer'; s.revision++;};
  await page.evaluate(() => {state.meta.bride = 'My change'; saveState();});
  await page.evaluate(() => syncCloud());
  await expect(page.locator('#last-saved-indicator')).toContainText('Two people edited');
  await expect(page.locator('#cloud-problem')).toContainText('meta.bride');
  await page.context().close();
});

test('restore validates data, keeps text inert, and backup exports current state', async ({page}) => {
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.route('https://www.google.com/**', r => r.abort());
  await page.goto('/', {waitUntil: 'domcontentloaded'});
  const s = plan(); s.roles[0].person = '</option><img src=x onerror="window.xss=1">'; s.meta.bride = 'Restored';
  page.on('dialog', dialog => dialog.accept());
  const backup = page.waitForEvent('download');
  await page.locator('#restore-backup').setInputFiles({name: 'plan.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify({state: s}))});
  await backup;
  await expect(page.locator('#meta-bride')).toHaveValue('Restored');
  expect(await page.evaluate(() => window.xss)).toBeUndefined();
  expect(await page.locator('img').count()).toBe(1);
  const bad = {...s, meta: {...s.meta, bride: {invalid: true}}};
  await page.locator('#restore-backup').setInputFiles({name: 'bad.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify({state: bad}))});
  await expect(page.locator('#toast-container')).toContainText('Invalid field: bride');
  await expect(page.locator('#meta-bride')).toHaveValue('Restored');
  const exported = page.waitForEvent('download'); await page.locator('#download-backup').click();
  const file = await exported; const stream = await file.createReadStream();
  let text = ''; for await (const chunk of stream) text += chunk;
  expect(JSON.parse(text).state.meta.bride).toBe('Restored');
  expect(errors).toEqual([]);
});

test('mobile tabs, event attendance, date links, and print remain usable', async ({page}, testInfo) => {
  await page.setViewportSize({width: 390, height: 844});
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.route('https://www.google.com/**', r => r.abort());
  await page.goto('/', {waitUntil: 'domcontentloaded'});
  await page.screenshot({path: testInfo.outputPath('mobile.png')});
  for (const tab of ['dashboard','checklist','roles','budget','guests','addons','schedules','workspace']) {
    await page.locator(`[data-tab=${tab}]`).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), tab + ' overflow').toBe(true);
  }
  await page.locator('[data-tab=guests]').click(); await page.locator('#btn-add-guest-row').click();
  await page.locator('[data-g-id][data-field=name]').fill('Family'); await page.locator('[data-g-id][data-field=name]').blur();
  await page.locator('#add-attendance').click();
  const guestId = await page.evaluate(() => state.guests[0].id);
  await page.locator('[data-record=attendance][data-field=guestId]').selectOption(guestId);
  await page.locator('[data-record=attendance][data-field=eventId]').selectOption('ev-8');
  await page.locator('[data-record=attendance][data-field=adults]').fill('4'); await page.locator('[data-record=attendance][data-field=adults]').blur();
  await page.locator('[data-record=attendance][data-field=status]').selectOption('Confirmed');
  await expect(page.locator('#event-attendance')).toContainText('Grand Wedding Reception: 4 confirmed');
  await page.evaluate(() => { state.events[7].start = '2027-01-02T19:00'; state.events[7].end = '2027-01-02T22:00'; saveState(); renderCalendarLinks(); });
  await expect(page.locator('#calendar-links a')).toHaveAttribute('href', /20270102T133000Z/);
  await page.evaluate(() => window.dispatchEvent(new Event('beforeprint')));
  await page.emulateMedia({media: 'print'});
  await expect(page.locator('#guest-table-body .print-value').filter({hasText: /^Family$/})).toBeVisible();
  await expect(page.locator('header')).toBeHidden();
  await page.pdf({path: testInfo.outputPath('guest-run-sheet.pdf')});
  expect(errors).toEqual([]);
});

test('common invitations have one sending control, and duplicate names need a locality', async ({page}) => {
  await page.route('https://www.google.com/**', r => r.abort());
  await page.goto('/', {waitUntil: 'domcontentloaded'});
  await page.locator('[data-tab=guests]').click();
  await page.locator('#quick-bride-name').fill('सैमुएल ऑस्टिन'); await page.locator('#btn-quick-bride-submit').click();
  await page.locator('#quick-common-name').fill('सैमुएल ऑस्टिन'); await page.locator('#btn-quick-common-submit').click();
  await expect(page.locator('#simple-bride-count')).toHaveText('1');
  await expect(page.locator('#simple-common-count')).toHaveText('1');
  await expect(page.locator('.simple-sent-chk').first()).toBeDisabled();
  await page.locator('.common-sender-select').selectOption('1 Invite Sent ✓');
  expect(await page.evaluate(() => [...state.extendedBride, ...state.extendedGroom].every(row => row.sent))).toBe(true);
  await page.locator('#quick-bride-name').fill('सैमुएल ऑस्टिन'); await page.locator('#btn-quick-bride-submit').click();
  await expect(page.locator('#simple-bride-count')).toHaveText('1');
});

test('uncommitted field saves on reload, recovered drafts survive, and matching drafts are bounded', async ({page}) => {
  await page.route('https://www.google.com/**', r => r.abort());
  await page.goto('/', {waitUntil: 'domcontentloaded'});
  await page.locator('#meta-bride').fill('Saved while closing');
  await page.reload({waitUntil: 'domcontentloaded'});
  await expect(page.locator('#meta-bride')).toHaveValue('Saved while closing');
  await page.reload({waitUntil: 'domcontentloaded'});
  expect(await page.evaluate(() => Object.keys(localStorage).filter(k => k.includes(':draft:')).length)).toBe(1);
  await page.evaluate(() => {
    localStorage.setItem(workspaceKey, 'broken draft');
    Object.keys(localStorage).filter(k => k.includes(':draft:')).forEach(k => localStorage.removeItem(k));
  });
  await page.reload({waitUntil: 'domcontentloaded'});
  await expect(page.locator('#cloud-problem')).toContainText('saved draft could not be read');
  expect(await page.evaluate(() => Object.keys(localStorage).some(k => k.includes(':unreadable:') && localStorage.getItem(k) === 'broken draft'))).toBe(true);
  await page.locator('#meta-bride').fill('New valid plan'); await page.locator('#meta-bride').blur();
  expect(await page.evaluate(() => Object.keys(localStorage).some(k => k.includes(':unreadable:')))).toBe(true);
});
