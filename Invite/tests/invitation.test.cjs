const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const vm = require('node:vm');
const { chromium, expect } = require('@playwright/test');
const { createServer } = require('../preview.cjs');

let server, browser, origin, settings, source;
const design = process.env.INVITATION_DESIGN || 'wine';
const screenshots = path.join(__dirname, '..', 'screenshots', `${design}-${Date.now()}`);
before(async () => {
  source = await fs.readFile(path.join(__dirname, '..', design, 'settings.js'), 'utf8');
  const sandbox = { window: {} }; vm.runInNewContext(source, sandbox); settings = JSON.parse(JSON.stringify(sandbox.window.INVITATION));
  server = createServer(design); await new Promise(resolve => server.listen(0, '127.0.0.1', resolve)); origin = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch({ ...(process.platform === 'win32' ? { executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' } : {}), headless: true });
  await fs.mkdir(screenshots, { recursive: true });
});
after(async () => { await browser?.close(); if (server) await new Promise(resolve => server.close(resolve)); });
async function pageFor(config = settings, publicHost = false) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce', timezoneId: 'America/New_York' });
  const page = await context.newPage();
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  if (publicHost) await page.route('https://invite.test/**', async route => {
    const requested = new URL(route.request().url());
    const response = await context.request.get(origin + requested.pathname);
    await route.fulfill({ response });
  });
  await page.route('**/settings.js', route => route.fulfill({ contentType: 'text/javascript', body: `window.INVITATION = ${JSON.stringify(config)};` }));
  return { page, context, errors, base: publicHost ? 'https://invite.test' : origin };
}
async function openCover(page) {
  await page.locator('#open-invitation').click({ force: true }); // the cover floats, so the hit box never settles
  await expect(page.locator('#invitation-cover')).not.toBeVisible();
}
test('bilingual invitation, safe draft values, image dialog and mobile layout', async () => {
  const config = structuredClone(settings); config.invitation.en = 'Welcome <img src=x onerror="alert(1)"> & family';
  const { page, context, errors, base } = await pageFor(config);
  try {
    await page.goto(base); await openCover(page); await expect(page.locator('#bride-name')).toHaveText('Kamishi Shutul Austin');
    await expect(page.locator('#groom-name')).toHaveText('Anuragh Kashyap');
    await expect(page.locator('#invitation-copy')).toHaveText(config.invitation.en);
    assert.equal(await page.locator('#invitation-copy img').count(), 0);
    await expect(page.locator('.event-card')).toHaveCount(6);
    await expect(page.locator('.scripture-card blockquote')).toHaveText(settings.bibleQuotes.map(quote => quote.text.en));
    await expect(page.locator('.scripture-reference')).toHaveText(settings.bibleQuotes.map(quote => quote.reference.en));
    await expect(page.locator('#countdown-section')).toBeHidden();
    assert.equal(await page.locator('.event-actions button').count(), 0);
    await expect(page.locator('#rsvp-off')).toBeVisible();
    for (const width of [320, 375, 390, 430, 768, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `No horizontal overflow at ${width}px`);
    }
    await page.locator('.hero-photo').click(); await expect(page.locator('#photo-dialog')).toBeVisible();
    await page.keyboard.press('Escape'); await expect(page.locator('#photo-dialog')).toBeHidden();
    await page.locator('[data-filter=wedding]').click(); await expect(page.locator('.event-card')).toHaveCount(2);
    await page.locator('[data-lang=hi]').click(); await expect(page.locator('html')).toHaveAttribute('lang', 'hi');
    await expect(page.locator('#bride-name')).toHaveText(settings.bride.hi);
    await expect(page.locator('#event-ceremony h3')).toHaveText('पवित्र विवाह');
    await expect(page.locator('.scripture-card blockquote')).toHaveText(settings.bibleQuotes.map(quote => quote.text.hi));
    await expect(page.locator('.scripture-reference')).toHaveText(settings.bibleQuotes.map(quote => quote.reference.hi));
    await page.setViewportSize({ width: 390, height: 844 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Hindi mobile has no overflow');
    await page.reload(); await expect(page.locator('html')).toHaveAttribute('lang', 'hi');
    assert.deepEqual(errors, []);
  } finally { await context.close(); }
});
test('published artwork loads and desktop/mobile screenshots are captured', async () => {
  const { page, context, base, errors } = await pageFor();
  try {
    await page.goto(base); await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(screenshots, 'envelope-desktop.png') });
    await openCover(page);
    await page.screenshot({ path: path.join(screenshots, 'desktop-top.png') });
    assert.equal(await page.locator('#main').evaluate(node => node.getBoundingClientRect().width), 430, 'Desktop keeps the 430px invitation frame');
    assert.equal(await page.locator('.event-grid').evaluate(node => getComputedStyle(node).gridTemplateColumns.split(' ').length), 1, 'Celebrations stay vertically stacked');
    for (const selector of ['#hero-image', '#story-image', '#closing-image']) {
      await page.locator(selector).scrollIntoViewIfNeeded();
      await expect.poll(() => page.locator(selector).evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true);
    }
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: path.join(screenshots, 'desktop.png'), fullPage: true });
    await page.setViewportSize({ width: 390, height: 844 }); await page.screenshot({ path: path.join(screenshots, 'mobile.png'), fullPage: true });
    await page.locator('[data-lang=hi]').click(); await page.screenshot({ path: path.join(screenshots, 'mobile-hindi.png'), fullPage: true });
    assert.deepEqual(errors, []);
  } finally { await context.close(); }
});
test('calendar preserves IST across browser time zones and folds Hindi text safely', async () => {
  const config = structuredClone(settings), ceremony = config.events.find(event => event.id === 'ceremony');
  Object.assign(ceremony, { confirmed: true, date: '2027-02-21', time: '16:30', endTime: '18:00' });
  ceremony.description.hi = 'परिवार, मित्र; प्रेम\\आशीर्वाद\nनई शुरुआत। '.repeat(6);
  const { page, context, base } = await pageFor(config);
  try {
    await page.goto(base + '/?lang=hi'); await openCover(page); await expect(page.locator('#countdown-section')).toBeVisible();
    const pending = page.waitForEvent('download'); await page.locator('#event-ceremony button').click(); const download = await pending;
    const contents = await fs.readFile(await download.path(), 'utf8');
    assert.match(contents, /DTSTART:20270221T110000Z/); assert.match(contents, /DTEND:20270221T123000Z/);
    assert.match(contents.replace(/\r\n /g, ''), /परिवार\\, मित्र\\; प्रेम\\\\आशीर्वाद\\nनई शुरुआत/);
    assert.ok(contents.split('\r\n').every(line => Buffer.byteLength(line) <= 75));
    assert.ok(!contents.includes('\ufffd'));
    const invalid = await page.evaluate(() => { const value = structuredClone(window.INVITATION); value.events[0].date = '2027-02-30'; try { Invite.validate(value); return false; } catch { return true; } });
    assert.equal(invalid, true);
    const unsafe = await page.evaluate(() => { const value = structuredClone(window.INVITATION); value.photos.hero = 'javascript:alert(1)'; try { Invite.validate(value); return false; } catch { return true; } });
    assert.equal(unsafe, true);
  } finally { await context.close(); }
});
test('editor saves isolated draft, exports actual edits, and preserves invalid-import work', async () => {
  const { page, context, base, errors } = await pageFor();
  try {
    const olderDraft = structuredClone(settings); delete olderDraft.bibleQuotes; delete olderDraft.audio; delete olderDraft.stay; delete olderDraft.giftNote; olderDraft.city.en = 'Saved city';
    await page.goto(base);
    await page.evaluate(draft => localStorage.setItem('ka-invitation-draft', JSON.stringify(draft)), olderDraft);
    await page.goto(base + '/editor.html');
    await page.getByText('Accommodation / आवास', { exact: true }).click();
    await expect(page.locator('[name="stay.venue"]')).toHaveValue('mandapam');
    await page.getByText('Gifts & blessings note / उपहार और आशीर्वाद', { exact: true }).click();
    await page.locator('[name="giftNote.en"]').fill('Your blessings are our joy.');
    await page.getByText('Music / संगीत', { exact: true }).click();
    await expect(page.locator('[name="audio.music"]')).toHaveValue('');
    await page.locator('[name="audio.music"]').fill('assets/background.mp3');
    await page.getByText('Bible quotations / बाइबल के वचन', { exact: true }).click();
    await expect(page.locator('[name="bibleQuotes.0.reference.en"]')).toHaveValue('1 Corinthians 16:14');
    await page.locator('[name="bibleQuotes.0.text.en"]').fill('Love never fails.');
    await page.locator('[name="bibleQuotes.0.reference.en"]').fill('1 Corinthians 13:8');
    await page.locator('[name="bride.en"]').fill('Kamishi Shutul Austin — edited');
    await page.locator('[name="events.4.date"]').fill('2027-02-21');
    await page.locator('[name="events.4.time"]').fill('16:30'); await page.locator('[name="events.4.endTime"]').fill('18:00');
    await page.locator('[name="events.4.confirmed"]').check();
    await page.locator('button[type=submit]').click(); await expect(page.locator('#editor-status')).toContainText('Draft saved');
    const pending = page.waitForEvent('download'); await page.locator('#download-settings').click(); const download = await pending;
    const exported = await fs.readFile(await download.path(), 'utf8'), sandbox = { window: {} }; vm.runInNewContext(exported, sandbox);
    assert.equal(sandbox.window.INVITATION.bride.en, 'Kamishi Shutul Austin — edited'); assert.equal(sandbox.window.INVITATION.events[4].date, '2027-02-21');
    assert.equal(sandbox.window.INVITATION.city.en, 'Saved city');
    assert.equal(sandbox.window.INVITATION.giftNote.en, 'Your blessings are our joy.');
    assert.equal(sandbox.window.INVITATION.audio.music, 'assets/background.mp3');
    assert.equal(sandbox.window.INVITATION.bibleQuotes[0].text.en, 'Love never fails.');
    assert.equal(sandbox.window.INVITATION.bibleQuotes[0].reference.en, '1 Corinthians 13:8');
    await page.locator('.editor-tools summary').click();
    await page.locator('#import-json').setInputFiles({ name: 'invalid.json', mimeType: 'application/json', buffer: Buffer.from('{"bad":true}') });
    await expect(page.locator('#editor-status')).toContainText('Import failed');
    await expect(page.locator('[name="bride.en"]')).toHaveValue('Kamishi Shutul Austin — edited');
    await page.goto(base + '/?preview=1'); await expect(page.locator('#bride-name')).toHaveText('Kamishi Shutul Austin — edited'); await expect(page.locator('#preview-banner')).toBeVisible();
    await expect(page.locator('.scripture-card blockquote').first()).toHaveText('Love never fails.');
    await page.goto(base); await expect(page.locator('#bride-name')).toHaveText('Kamishi Shutul Austin'); await expect(page.locator('#preview-banner')).toBeHidden();
    await page.goto(base + '/editor.html');
    for (const width of [320, 390, 1440]) {
      await page.setViewportSize({ width, height: 844 });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Editor fits ${width}px`);
    }
    assert.deepEqual(errors, []);
  } finally { await context.close(); }
});
test('Netlify RSVP fails honestly, retains entries, then submits expected fields once', async () => {
  const config = structuredClone(settings); config.rsvp.mode = 'netlify';
  const { page, context, base, errors } = await pageFor(config, true);
  let attempts = 0, payload;
  await page.route('https://invite.test/thank-you.html', async route => {
    attempts++; payload = new URLSearchParams(route.request().postData());
    await route.fulfill({ status: attempts === 1 ? 503 : 200, contentType: 'text/html', body: 'Form endpoint test response' });
  });
  try {
    await page.goto(base + '/#rsvp'); await expect(page.locator('#rsvp-form')).toBeVisible();
    await page.locator('[name="guest-name"]').fill('A Guest <script>'); await page.locator('[name=email]').fill('guest@example.com');
    await page.locator('[name=attendance][value=yes]').check(); await page.locator('[name="party-size"]').fill('3');
    await page.locator('[data-guest-field=guestName]').nth(0).fill('Second guest');
    await page.locator('[data-guest-field=guestName]').nth(1).fill('Third guest');
    await page.locator('[data-guest-field=dietary]').nth(0).fill('Vegetarian');
    await page.locator('[name=children][value=yes]').check();
    await page.locator('[name=consent]').check(); await page.locator('#rsvp-form button[type=submit]').click();
    await expect(page.locator('#rsvp-status')).toContainText('at least one'); assert.equal(attempts, 0);
    await page.locator('[name=events][value=ceremony]').check(); await page.locator('[name=message]').fill('Thank you!');
    await page.locator('#rsvp-form button[type=submit]').click(); await expect(page.locator('#rsvp-status')).toContainText('could not be sent');
    await expect(page.locator('[name="guest-name"]')).toHaveValue('A Guest <script>');
    await page.locator('[data-lang=hi]').click(); await expect(page.locator('[name=events][value=ceremony]')).toBeChecked();
    await page.locator('#rsvp-form button[type=submit]').click(); await expect(page.locator('#rsvp-status')).toContainText('धन्यवाद');
    assert.equal(attempts, 2); assert.equal(payload.get('form-name'), 'wedding-rsvp'); assert.equal(payload.get('party-size'), '3'); assert.equal(payload.get('language'), 'hi'); assert.deepEqual(payload.getAll('events'), ['ceremony']);
    assert.equal(payload.get('children'), 'yes');
    assert.deepEqual(JSON.parse(payload.get('guest-details')), [{ guestName: 'Second guest', additionalEmail: '', dietary: 'Vegetarian' }, { guestName: 'Third guest', additionalEmail: '', dietary: '' }]);
    await expect(page.locator('#rsvp-form')).toBeHidden(); assert.deepEqual(errors, []);
  } finally { await page.unrouteAll({ behavior: 'wait' }); await context.close(); }
});
test('local RSVP never posts; decline omits stale event choices; external form works', async () => {
  const config = structuredClone(settings); config.rsvp.mode = 'netlify';
  const local = await pageFor(config);
  try {
    await local.page.goto(local.base + '/#rsvp'); await local.page.locator('[name="guest-name"]').fill('Guest'); await local.page.locator('[name=email]').fill('guest@example.com'); await local.page.locator('[name=attendance][value=no]').check(); await local.page.locator('[name=consent]').check(); await local.page.locator('#rsvp-form button[type=submit]').click();
    await expect(local.page.locator('#rsvp-status')).toContainText('nothing was sent'); await expect(local.page.locator('#rsvp-form')).toBeVisible();
  } finally { await local.context.close(); }
  const live = await pageFor(config, true); let payload;
  await live.page.route('https://invite.test/thank-you.html', async route => { payload = new URLSearchParams(route.request().postData()); await route.fulfill({ status: 200, body: 'Accepted' }); });
  try {
    await live.page.goto(live.base + '/#rsvp'); await live.page.locator('[name="guest-name"]').fill('Guest'); await live.page.locator('[name=email]').fill('guest@example.com'); await live.page.locator('[name=attendance][value=yes]').check(); await live.page.locator('[name=events][value=ceremony]').check();
    await live.page.locator('#guest-plus').click(); await live.page.locator('[data-guest-field=guestName]').fill('Omitted guest'); await live.page.locator('[name=children][value=yes]').check();
    await live.page.locator('[name=attendance][value=no]').check(); await live.page.locator('[name=consent]').check(); await live.page.locator('#rsvp-form button[type=submit]').click();
    await expect(live.page.locator('#rsvp-status')).toContainText('Thank you'); assert.equal(payload.get('party-size'), '0'); assert.deepEqual(payload.getAll('events'), []);
    assert.equal(payload.has('guest-details'), false); assert.equal(payload.has('children'), false); assert.equal(payload.has('dietary'), false);
  } finally { await live.page.unrouteAll({ behavior: 'wait' }); await live.context.close(); }
  config.rsvp = { mode: 'link', formUrl: 'https://forms.gle/test-form', deadline: '' };
  const external = await pageFor(config);
  try {
    await external.page.goto(external.base + '/?lang=hi#rsvp');
    await expect(external.page.locator('#external-form')).toHaveAttribute('href', config.rsvp.formUrl);
    await expect(external.page.locator('#external-form')).toHaveAttribute('target', '_blank');
    await expect(external.page.locator('#external-form')).toHaveText('उपस्थिति फ़ॉर्म खोलें ↗');
    await expect(external.page.locator('#rsvp-form')).toBeHidden();
  }
  finally { await external.context.close(); }
});
test('preview server rejects submissions and cannot serve family planning files', async () => {
  assert.throws(() => createServer('../site'), /Choose forest or wine/);
  assert.equal((await fetch(origin + '/thank-you.html', { method: 'POST' })).status, 405);
  assert.equal((await fetch(origin + '/..%5CREADME.md')).status, 403);
  assert.equal((await fetch(origin + '/settings.js')).status, 200);
});
test('sharing keeps the chosen language and removes local draft parameters', async () => {
  const { page, context, base } = await pageFor(settings, true);
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'share', { value: async data => { window.sharedInvitation = data; } });
  });
  try {
    await page.goto(base + '/?lang=hi&preview=1#rsvp');
    await page.locator('#share').click();
    assert.equal(await page.evaluate(() => sharedInvitation.url), base + '/?lang=hi');
    assert.equal(await page.evaluate(() => sharedInvitation.title), `${settings.bride.hi} & ${settings.groom.hi}`);
  } finally { await page.unrouteAll({ behavior: 'wait' }); await context.close(); }
});
test('envelope opens by keyboard, preserves language and supports native scrolling and music', async () => {
  const { page, context, base, errors } = await pageFor();
  try {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto(base);
    await expect(page.locator('#invitation-cover')).toBeVisible();
    await expect(page.locator('#open-invitation')).toBeFocused();
    await page.keyboard.press('Tab'); await expect(page.locator('#cover-language')).toBeFocused();
    await page.keyboard.press('Shift+Tab'); await expect(page.locator('#open-invitation')).toBeFocused();
    await page.locator('#cover-language').click();
    await expect(page.locator('#cover-title')).toHaveText('आप आमंत्रित हैं।');
    await expect(page.locator('#cover-names')).toHaveText(`${settings.bride.hi} & ${settings.groom.hi}`);
    await expect(page.locator('#open-invitation')).toHaveAccessibleName('निमंत्रण खोलें');
    await page.locator('#open-invitation').focus(); await page.keyboard.press('Enter');
    await expect(page.locator('#invitation-cover')).not.toBeVisible();
    await expect(page.locator('#main')).toBeFocused();
    await expect(page.locator('#audio-controls')).toBeVisible();
    await expect(page.locator('#bride-name')).toHaveText(settings.bride.hi);
    await expect(page.locator('#music-toggle')).toHaveAttribute('aria-pressed', 'false');
    await expect(page.locator('#voice-toggle')).toHaveCount(0);
    await page.locator('#music-toggle').click();
    await expect(page.locator('#music-toggle')).toHaveAttribute('aria-pressed', 'true');
    assert.equal(await page.locator('#home').evaluate(node => node.getBoundingClientRect().width), 390);
    await page.mouse.move(190, 420); await page.mouse.wheel(0, 700);
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(100);
    await page.locator('#music-toggle').click(); await expect(page.locator('#music-toggle')).toHaveAttribute('aria-pressed', 'false');
    await page.locator('[data-lang=en]').click();
    await expect(page.locator('#music-toggle')).toHaveAttribute('aria-pressed', 'false');
    await page.locator('.button-row a[href="#rsvp"]').click(); await expect(page.locator('#rsvp')).toBeInViewport();
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.goto(base); await page.keyboard.press('Escape');
    await expect(page.locator('#invitation-cover')).not.toBeVisible();
    await expect(page.locator('#main')).toBeFocused();
    await page.goto(base + '/#rsvp');
    await expect(page.locator('#invitation-cover')).not.toBeVisible();
    await expect(page.locator('#rsvp')).toBeInViewport();
    await page.goto(base + '/?preview=1');
    await expect(page.locator('#invitation-cover')).not.toBeVisible();
    assert.deepEqual(errors, []);
  } finally { await context.close(); }
});
test('a broken music file leaves the invitation usable', async () => {
  const config = structuredClone(settings); config.audio.music = 'assets/missing-music.mp3';
  const recorded = await pageFor(config);
  try {
    await recorded.page.goto(recorded.base); await openCover(recorded.page);
    await recorded.page.locator('#music-toggle').click();
    await expect(recorded.page.locator('#audio-status')).toContainText('music could not play');
    await expect(recorded.page.locator('#music-toggle')).toHaveAttribute('aria-pressed', 'false');
    await recorded.page.locator('#scripture-section').scrollIntoViewIfNeeded(); await expect(recorded.page.locator('#scripture-section')).toBeInViewport();
    assert.deepEqual(recorded.errors, []);
  } finally { await recorded.context.close(); }
});
test('phone touch scrolling, readable forms, local fonts and bilingual hero layout', async () => {
  const context = await browser.newContext({ isMobile: true, hasTouch: true, deviceScaleFactor: 2, viewport: { width: 375, height: 667 }, reducedMotion: 'reduce' });
  const page = await context.newPage(), errors = [], external = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route('https://**', route => { external.push(route.request().url()); return route.abort(); });
  try {
    for (const viewport of [{ width: 320, height: 568 }, { width: 375, height: 667 }, { width: 390, height: 844 }, { width: 430, height: 932 }]) {
      await page.setViewportSize(viewport);
      for (const language of ['en', 'hi']) {
        await page.goto(`${origin}/?lang=${language}`); await page.evaluate(() => document.fonts.ready);
        await expect(page.locator('#invitation-cover')).toBeVisible();
        assert.ok(await page.locator('#invitation-cover').evaluate(node => node.scrollWidth <= innerWidth), 'Envelope fits the phone');
        await page.screenshot({ path: path.join(screenshots, `envelope-${viewport.width}-${language}.png`) });
        await openCover(page);
        const layout = await page.evaluate(() => {
          const bounds = selector => { const r = document.querySelector(selector).getBoundingClientRect(); return { top: r.top, bottom: r.bottom, width: r.width }; };
          return { text: bounds('.hero-copy'), photo: bounds('.hero-art'), width: innerWidth, scrollWidth: document.documentElement.scrollWidth };
        });
        assert.equal(layout.width, viewport.width, 'Mobile viewport is not zoomed out');
        assert.ok(layout.scrollWidth <= viewport.width, 'No horizontal page overflow');
        assert.ok(design === 'wine' ? layout.photo.bottom <= layout.text.top : layout.text.bottom <= layout.photo.top, `${language} names and photograph do not overlap at ${viewport.width}px`);
        assert.ok(await page.evaluate(() => document.fonts.check('40px "Cormorant Garamond"')));
        await page.screenshot({ path: path.join(screenshots, `hero-${viewport.width}-${language}.png`) });
      }
    }
    await page.setViewportSize({ width: 375, height: 667 });
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
    const cdp = await context.newCDPSession(page);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 170, y: 550 }] });
    for (const y of [490, 420, 350, 280, 180]) {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 170, y }] });
      await page.evaluate(() => new Promise(requestAnimationFrame));
    }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(150);
    const gallery = page.locator('.gallery-track');
    await gallery.scrollIntoViewIfNeeded();
    const bounds = await gallery.boundingBox(), y = bounds.y + 60;
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 300, y }] });
    for (const x of [260, 210, 160, 100, 60]) {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y }] });
      await page.evaluate(() => new Promise(requestAnimationFrame));
    }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await expect.poll(() => gallery.evaluate(node => node.scrollLeft)).toBeGreaterThan(20);
    await cdp.detach();
    assert.ok(await page.locator('[name=guest-name]').evaluate(node => parseFloat(getComputedStyle(node).fontSize) >= 16), 'Form text avoids iPhone input zoom');
    assert.deepEqual(external, [], 'All guest assets and fonts are served locally');
    assert.deepEqual(errors, []);
  } finally { await context.close(); }
});
test('opening lifts the photo card, follows its animation and cleans up on interruption', async () => {
  const { page, context, base, errors } = await pageFor();
  try {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    for (const width of [320, 390, 1440]) {
      await page.setViewportSize({ width, height: width === 320 ? 568 : 900 });
      await page.goto(base + '/?lang=hi');
      await page.evaluate(() => document.fonts.ready);
      await page.addStyleTag({ content: ':root { --opening-duration: 5000ms; }' });
      const restingTop = await page.locator('.invitation-letter').evaluate(node => node.getBoundingClientRect().top);
      await page.locator('#open-invitation').click({ force: true }); // the cover floats, so the hit box never settles
      const phase = await page.evaluate(() => {
        window.openingAnimations = document.querySelector('#invitation-cover').getAnimations({ subtree: true });
        for (const animation of openingAnimations) { animation.pause(); animation.currentTime = 3000; }
        const letter = document.querySelector('.invitation-letter');
        return { top: letter.getBoundingClientRect().top, opacity: getComputedStyle(letter).opacity, duration: document.querySelector('#invitation-cover').getAnimations()[0].effect.getTiming().duration };
      });
      assert.equal(phase.duration, 5000, 'Completion follows CSS duration rather than a fixed timer');
      assert.ok(phase.top < restingTop - 30, 'The invitation visibly emerges from its cover');
      assert.equal(phase.opacity, '1', 'The photo card stays visible through the lift');
      await expect(page.locator('#invitation-cover')).toBeVisible();
      await page.screenshot({ path: path.join(screenshots, `opening-lift-${width}.png`) });
      await page.evaluate(() => openingAnimations.forEach(animation => animation.finish()));
      await expect(page.locator('#invitation-cover')).not.toBeVisible();
      await expect(page.locator('#main')).toBeFocused();
      assert.equal(await page.locator('#main').evaluate(node => getComputedStyle(node).transform), 'none');
      assert.notEqual(await page.locator('body').evaluate(node => getComputedStyle(node).overflow), 'hidden');
    }
    for (const interrupt of ['escape', 'reduced-motion']) {
      await page.goto(base);
      await page.locator('#open-invitation').click({ force: true }); // the cover floats, so the hit box never settles
      if (interrupt === 'escape') await page.keyboard.press('Escape');
      else await page.emulateMedia({ reducedMotion: 'reduce' });
      await expect(page.locator('#invitation-cover')).not.toBeVisible();
      await expect(page.locator('body')).not.toHaveClass(/invitation-opening/);
      await expect(page.locator('#main')).toBeFocused();
    }
    assert.deepEqual(errors, []);
  } finally { await context.close(); }
});
test('guest guide uses edited wedding data; frame, floating controls and swipe gallery fit', async () => {
  const config = structuredClone(settings);
  config.events[0].enabled = false;
  config.events[1].attire.en = 'Green <b>optional</b>';
  config.giftNote.en = 'Blessings <script>stay text</script>';
  config.venues[0].note.en = 'Rooms await family confirmation.';
  const { page, context, base, errors } = await pageFor(config);
  try {
    await page.goto(base + '/#dress-code');
    await expect(page.locator('#dress-list > div')).toHaveCount(5);
    await expect(page.locator('#dress-list dd').first()).toHaveText(config.events[1].attire.en);
    await expect(page.locator('#dress-list b')).toHaveCount(0);
    await expect(page.locator('#gift-note')).toHaveText(config.giftNote.en);
    await expect(page.locator('#gift-note script')).toHaveCount(0);
    await expect(page.locator('#stay-card')).toContainText(config.venues[0].note.en);
    await expect(page.locator('#stay-card a')).toHaveAttribute('href', /google.com\/maps/);
    for (const width of [320, 430, 768, 1440]) {
      await page.setViewportSize({ width, height: 844 });
      const geometry = await page.evaluate(() => {
        const frame = document.body.getBoundingClientRect();
        const controls = ['.language-switch', '.audio-controls'].map(selector => {
          const node = document.querySelector(selector), r = node.getBoundingClientRect();
          return { left: r.left, right: r.right, position: getComputedStyle(node).position };
        });
        return { width: frame.width, left: frame.left, right: frame.right, controls, overflow: document.documentElement.scrollWidth > innerWidth };
      });
      assert.equal(geometry.width, Math.min(width, 430)); assert.equal(geometry.overflow, false);
      for (const control of geometry.controls) { assert.equal(control.position, 'fixed'); assert.ok(control.left >= geometry.left && control.right <= geometry.right); }
    }
    await page.setViewportSize({ width: 390, height: 844 });
    const track = page.locator('.gallery-track');
    await track.scrollIntoViewIfNeeded(); await track.focus(); await page.keyboard.press('ArrowRight');
    await expect.poll(() => track.evaluate(node => node.scrollLeft)).toBeGreaterThan(0);
    await page.locator('.gallery-track [data-photo=closing]').click();
    await expect(page.locator('#photo-dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('.gallery-track [data-photo=closing]')).toBeFocused();
    await page.locator('[data-lang=hi]').click();
    await expect(page.locator('#dress-heading')).toHaveText('परिधान');
    await expect(page.locator('#stay-heading')).toHaveText('आवास');
    assert.equal(await page.evaluate(() => {
      const invalid = structuredClone(INVITATION); invalid.stay.venue = 'missing';
      try { Invite.validate(invalid); return false; } catch { return true; }
    }), true);
    assert.deepEqual(errors, []);
  } finally { await context.close(); }
});
test('guest stepper is bounded and preserves entries across count, attendance and language changes', async () => {
  const config = structuredClone(settings); config.rsvp.mode = 'netlify';
  const { page, context, base, errors } = await pageFor(config);
  try {
    await page.setViewportSize({ width: 320, height: 700 });
    await page.goto(base + '/#rsvp');
    await page.locator('[name=attendance][value=yes]').check();
    await expect(page.locator('#guest-minus')).toBeDisabled();
    await page.locator('#guest-plus').click();
    await expect(page.locator('#party-size')).toHaveValue('2');
    await page.locator('[data-guest-field=guestName]').fill('Guest <b>two</b>');
    await page.locator('[data-guest-field=dietary]').fill('No peanuts');
    await page.locator('#guest-minus').click();
    await expect(page.locator('#additional-guests fieldset')).toBeHidden();
    await page.locator('#guest-plus').click();
    await expect(page.locator('[data-guest-field=guestName]')).toHaveValue('Guest <b>two</b>');
    await page.locator('[data-lang=hi]').click();
    await expect(page.locator('#additional-guests legend')).toHaveText('अतिथि 2');
    await expect(page.locator('[data-guest-field=dietary]')).toHaveValue('No peanuts');
    await page.locator('[name=attendance][value=no]').check();
    await expect(page.locator('[data-guest-field=guestName]')).toBeDisabled();
    await page.locator('[name=attendance][value=yes]').check();
    await expect(page.locator('[data-guest-field=guestName]')).toBeEnabled();
    await page.locator('#party-size').fill('30');
    await expect(page.locator('#additional-guests fieldset:not([hidden])')).toHaveCount(29);
    await expect(page.locator('#guest-plus')).toBeDisabled();
    await page.locator('#party-size').fill('99999');
    assert.equal(await page.locator('#party-size').evaluate(node => node.checkValidity()), false);
    await page.locator('[name=attendance][value=no]').check();
    await expect(page.locator('#additional-guests fieldset')).toHaveCount(29);
    await page.locator('[name=attendance][value=yes]').check();
    await page.locator('#party-size').fill('2');
    await expect(page.locator('[data-guest-field=guestName]').first()).toHaveValue('Guest <b>two</b>');
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.screenshot({ path: path.join(screenshots, 'rsvp-guests-320-hi.png'), fullPage: true });
    assert.deepEqual(errors, []);
  } finally { await context.close(); }
});
test('gallery slideshow moves on its own, then stops for a guest', async () => {
  const { page, context, base } = await pageFor();
  try {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto(base + '/?preview=1');
    const position = page.locator('#gallery-position');
    await page.locator('.gallery-track').scrollIntoViewIfNeeded();
    await expect(position).toHaveText('1 / 4');
    await expect.poll(() => position.textContent(), { timeout: 9000 }).not.toBe('1 / 4');
    const auto = await position.textContent();
    await page.locator('[data-gallery-step="1"]').click();
    await expect.poll(() => position.textContent()).not.toBe(auto);
    const taken = await position.textContent();
    assert.notEqual(taken, auto, 'The arrow still moves the gallery');
    await page.waitForTimeout(5200);
    assert.equal(await position.textContent(), taken, 'Guest control stops the slideshow');
  } finally { await context.close(); }
});
test('keepsake, programme, venue tools and gallery work by keyboard in both languages', async () => {
  const config = structuredClone(settings);
  config.events[0].enabled = false;
  config.blessing.en = 'Love <b>is patient</b> & kind.';
  const { page, context, base, errors } = await pageFor(config);
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: async text => {
      if (window.denyClipboard) throw new Error('Unavailable');
      window.copiedAddress = text;
    } } });
  });
  try {
    await page.setViewportSize({ width: 320, height: 700 });
    await page.goto(base + '/#keepsake');
    await expect(page.locator('#keepsake-verse')).toHaveText(config.blessing.en);
    await expect(page.locator('#keepsake-verse b')).toHaveCount(0);
    await page.locator('#turn-keepsake').focus(); await page.keyboard.press('Enter');
    await expect(page.locator('#turn-keepsake')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('.keepsake-front')).toHaveAttribute('inert', '');
    await expect(page.locator('.keepsake-back')).toHaveAttribute('aria-hidden', 'false');
    await page.locator('[data-lang=hi]').click();
    await expect(page.locator('#keepsake-verse')).toHaveText(config.blessing.hi);
    await expect(page.locator('#turn-keepsake')).toHaveAttribute('aria-pressed', 'true');
    await page.locator('#turn-keepsake').click();
    await expect(page.locator('.keepsake-back')).toHaveAttribute('inert', '');
    await expect(page.locator('.keepsake-front')).toHaveAttribute('aria-hidden', 'false');
    await expect(page.locator('.programme-stop')).toHaveCount(5);
    await expect(page.locator('#programme-list')).not.toContainText(config.events[0].title.hi);
    await page.locator('[data-filter=wedding]').click();
    await expect(page.locator('#event-mehendi')).toHaveCount(0);
    await page.locator('.programme-stop[href="#event-mehendi"]').click();
    await expect(page.locator('#event-mehendi')).toBeFocused();
    await expect(page.locator('#event-mehendi')).toBeInViewport();
    await expect(page.locator('[data-filter=all]')).toHaveAttribute('aria-pressed', 'true');
    const visit = page.locator('.visit-details').first();
    await visit.locator('summary').click();
    await visit.locator('button').click();
    assert.equal(await page.evaluate(() => copiedAddress), `${config.venues[0].name.hi}, ${config.venues[0].address.hi}`);
    await expect(visit.locator('[role=status]')).toContainText('कॉपी हो गया');
    await page.locator('[data-lang=en]').click();
    await expect(visit).toHaveAttribute('open', '');
    await page.evaluate(() => { window.denyClipboard = true; });
    await visit.locator('button').click();
    await expect(visit.locator('input')).toHaveValue(`${config.venues[0].name.en}, ${config.venues[0].address.en}`);
    await expect(visit.locator('input')).toBeFocused();
    await page.locator('.gallery-controls').scrollIntoViewIfNeeded();
    const galleryTotal = await page.locator('.gallery-track .photo-button').count();
    await expect(page.locator('[data-gallery-step="-1"]')).toBeDisabled();
    await page.locator('[data-gallery-step="1"]').click();
    await expect(page.locator('#gallery-position')).toHaveText(`2 / ${galleryTotal}`);
    for (let step = 2; step < galleryTotal; step++) await page.locator('[data-gallery-step="1"]').click();
    await expect(page.locator('#gallery-position')).toHaveText(`${galleryTotal} / ${galleryTotal}`);
    await expect(page.locator('[data-gallery-step="1"]')).toBeDisabled();
    await page.locator('[data-gallery-step="-1"]').click();
    await expect(page.locator('#gallery-position')).toHaveText(`${galleryTotal - 1} / ${galleryTotal}`);
    for (const width of [320, 390, 430, 1440]) {
      await page.setViewportSize({ width, height: 844 });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      const dock = await page.locator('.guest-dock').boundingBox();
      assert.ok(dock.x >= 0 && dock.x + dock.width <= width);
      for (const button of await page.locator('.guest-dock a').all()) assert.ok((await button.boundingBox()).height >= 44);
    }
    await page.locator('.guest-dock a[href="#rsvp"]').click();
    await expect(page.locator('#rsvp')).toBeInViewport();
    await expect(page.locator('.guest-dock a[href="#rsvp"]')).toHaveAttribute('aria-current', 'location');
    assert.deepEqual(errors, []);
  } finally { await context.close(); }
});
test('3D tilt and scroll reveals stop when reduced motion is enabled', async () => {
  const { page, context, base, errors } = await pageFor();
  try {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto(base + '/#keepsake');
    const scene = page.locator('.keepsake-scene');
    await scene.scrollIntoViewIfNeeded();
    await expect.poll(() => scene.evaluate(node => node.getAnimations().length)).toBe(0);
    const bounds = await scene.boundingBox();
    await page.mouse.move(bounds.x + bounds.width * .8, bounds.y + bounds.height * .4);
    await expect.poll(() => scene.evaluate(node => node.style.getPropertyValue('--tilt-y'))).not.toBe('');
    await page.locator('#turn-keepsake').click();
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(page.locator('#turn-keepsake')).toHaveAttribute('aria-pressed', 'true');
    assert.equal(await scene.evaluate(node => getComputedStyle(node).transform), 'none');
    assert.equal(await page.locator('#keepsake-card').evaluate(node => getComputedStyle(node).transitionDuration), '0s');
    await page.locator('#travel').scrollIntoViewIfNeeded();
    assert.equal(await page.locator('#travel .section-heading').evaluate(node => node.getAnimations().length), 0);
    assert.deepEqual(errors, []);
  } finally { await context.close(); }
});
