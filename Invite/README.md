# Kamishi & Anuragh — two wedding invitation designs

Two independent English/Hindi invitations for **Kamishi Shutul Austin** and **Anuragh Kashyap**:

| Design | Folder / upload ZIP | Opening |
|---|---|---|
| Forest — Emerald heirloom | `forest/` / `forest.zip` | Gold-sealed green card unfolds against a dark emerald cover. Script names, gilded arches, botanical framing and deep-green ceremony cards follow. |
| Wine — Champagne atelier | `wine/` / `wine.zip` | Burgundy seal releases a tilted champagne envelope. Matted rectangular photographs, oversized serif names, asymmetrical typography and fine-rule cards follow. |

Each folder contains its own `index.html`, editor, settings, scripts, local fonts and photographs. Either folder can be copied, opened or published on its own. The guest-visible design name on each cover (**FOREST** / **WINE**) comes from the same cover copy, so the two invitations never look like the same card.

Both keep a centered **430px maximum-width** invitation even on desktop, local fonts, English/Hindi text and native scrolling. Forest is ornate and arched; Wine is restrained and rectangular, with serif headings and more open space. The latest Maison Dorée / Royal reference pass adds the same guest features in each design, expressed in its own visual style. Future enhancement requests apply to **both**, recorded in `AGENTS.md`.

New interactions include a **turn-over 3D photo/blessing card**, metallic dimensional rings, pointer-responsive photographs, once-per-section scroll reveals, a clickable celebration programme, expandable venue cards with copy-address/fallback tools, gallery previous/next buttons and a bottom section dock with reading progress. The attire guide, paired portraits, accommodation and gifts note remain editable through the existing wedding settings. Opening effects take 2.8 seconds; reduced motion opens and turns cards immediately and disables decorative animation.

### Try the new details

- **Keepsake:** use “Turn the card” to reveal the couple’s editable Bible blessing; press Enter or Space from the keyboard. The card and portraits gently tilt under a mouse. Touch scrolling works normally.
- **Programme:** select a celebration to jump to its full event card, including when another event filter was selected. Dates/times and confirmation labels come from settings.
- **Places:** expand “Plan your visit”, view the address and venue note, or copy the address. If copying is unavailable, a selectable address appears.
- **Gallery:** the four photographs drift on their own, one slow step every few seconds, then back again at the end and carry on. Swipe, use arrow keys, or tap the previous/next buttons to take over — the slideshow then stops and yours is the only movement. It also stays still when reduced motion is enabled. The counter follows the visible photograph. Tap a photograph to enlarge it.
- **Navigation:** the bottom dock links to the invitation, programme, venues and RSVP. Language and sound controls stay at the upper right.
- **Cinematics (both designs):** each folder loads its own additive layer — Forest `invitation.css` + `invitation.js`, Wine `invite.css` + `invite.js`. Both add a double-line gold frame around the 430px card, drifting gold dust, scroll parallax, blur-to-sharp reveals and a spark burst when the envelope opens. Forest keeps its emergent arch, botanical page and turning wax seal. Wine centres one formal axis on a deep burgundy surround: an arched photograph window in a gold outline, a centred monogram header, a gold reading-progress ribbon along the top, drifting petals, gold frames settling around the keepsake sections, photographs that develop like prints, and each name written in after the seal breaks. Wine hides its decorative website chrome (nav, brand caption, chapter numbers, photo hints, scroll cue, portrait labels, footer links) but keeps the guest dock and event filters working. Both layers are motion-gated; delete the two files and their two `<head>` lines to return a card to plain.

## Preview and edit

From `G:\Shanu Marrige\Invite`:

```powershell
node preview.cjs wine
```

In another terminal, run `node preview.cjs forest` to preview both at once.

- **Wine:** <http://127.0.0.1:4174> · [Editor](http://127.0.0.1:4174/editor.html)
- **Forest:** <http://127.0.0.1:4175> · [Editor](http://127.0.0.1:4175/editor.html)
- Stop the server with **Ctrl+C**. These addresses work only on this computer.
- Each folder's `index.html` also opens directly for a basic offline preview; use the server for reliable editor storage. The separate preview ports keep the two editors' local drafts independent.

Tap the envelope or folded card to open the invitation. The 2.8-second sequence gives the paper time to unfold, lift and expand while the invitation page comes into view. Choose Hindi on the cover or use **EN / हिंदी** in the header. Both covers open with the keyboard; **Escape** skips the animation, and reduced-motion settings open immediately. Direct section links such as `#rsvp` and editor draft previews open the details immediately. Scroll through the celebrations and tap photographs to enlarge them. The floating **speaker** starts music; the **microphone** starts narration. Both begin off. Language changes stop narration, and backgrounding the page stops sound.

## Everything free: publishing, storage and sharing

Use the free plans and included addresses below. No paid template, domain, database, API or subscription is needed for this setup.

| Need | Free setup | Where it lives |
|---|---|---|
| Hosting and HTTPS address | Cloudflare Pages Free, `YOUR-SITE.pages.dev` | Your Cloudflare account |
| Photographs, fonts, settings and optional recordings | Upload them with the website | The same Pages deployment |
| Guest RSVPs | Google Forms with a personal Google account | Your Google Form |
| Response spreadsheet | Link the form to Google Sheets | Your Google Drive |
| Sharing | Invitation Share button, WhatsApp or copy/paste the link | Guests open the same website |
| Editor drafts | Browser local storage; export JSON for backup | The browser/computer being used |

Cloudflare documents free, unlimited **static-asset requests**. Direct drag-and-drop uploads allow **1,000 files, each at most 25 MiB**; keep added audio within that per-file limit. A personal Google account includes **15 GB shared with Drive, Gmail and Photos**, so use an account with space available. These are current free services within their published limits, not a promise about future provider pricing.

**Publication status:** the upload package is ready, but no public site or Google Form has been created or connected. RSVP remains `off` until a real form URL is provided.

### 1. Create the free RSVP form and response Sheet

1. Sign in to [Google Forms](https://forms.google.com/) using your personal Google account and create a blank form.
2. Title it **Kamishi & Anuragh — RSVP / उपस्थिति**. Put English and Hindi together in each question so guests can use either language.
3. Add these questions:

| Question | Type / settings |
|---|---|
| Full name / पूरा नाम | Short answer, required |
| Email or phone / ईमेल या फ़ोन | Short answer, required |
| Will you attend? / क्या आप आएँगे? | Multiple choice: Yes / हाँ; No / नहीं; required |
| Guests including you / आपके सहित अतिथियों की संख्या | Short answer; number validation, 0–30; use 0 for a decline |
| Celebrations / समारोह | Checkboxes: Engagement, Mehendi, Haldi, Sangeet, Holy Matrimony, Reception, with Hindi labels |
| Additional guest names / अन्य अतिथियों के नाम | Paragraph; include each guest's contact and dietary needs if relevant |
| Children attending? / क्या बच्चे आएँगे? | Multiple choice: Yes / हाँ; No / नहीं |
| Stay, travel, dietary needs or a message / आवास, यात्रा, भोजन या संदेश | Paragraph, optional |
| Share these details with the hosts for planning / व्यवस्था हेतु परिवार से विवरण साझा करने की सहमति | Required checkbox |

4. For guest access, allow **anyone with the link** to respond. Turn **Limit to 1 response** off and avoid verified-email collection or file-upload questions, which can require sign-in. Use the ordinary contact question above.
5. Keep **View results summary** off. Under **Responses**, select the Google Sheets icon / **Select destination for responses → Create a new spreadsheet**. Keep that Sheet restricted to the wedding hosts. Only the responder form link belongs on the invitation.
6. Publish the form if prompted and copy its **responder link** (`https://forms.gle/...` or a `docs.google.com/forms/.../viewform` address).
7. In the invitation editor, expand **RSVP setup**, choose **link — Free Google Form**, and paste the URL into `formUrl`. Add a deadline if known.
8. Download `settings.js`, replace it in your chosen design folder, and publish that folder using the next section.
9. Open the form signed out, submit a test response, and confirm it appears in the linked Sheet. Guests submit on Google Forms; merely opening it does not send an RSVP.

The equivalent settings are:

```js
rsvp: {
  mode: "link",
  formUrl: "https://forms.gle/YOUR-ACTUAL-FORM-LINK",
  deadline: ""
},
```

Replace the example with your real responder link. Google stores the replies; the invitation displays neither guest responses nor your spreadsheet.

### 2. Publish on Cloudflare Pages Free

1. Sign in to [Cloudflare](https://dash.cloudflare.com/) and open **Workers & Pages**.
2. Choose **Create application → Get started → Drag and drop your files** in the Pages flow.
3. Enter a project name and upload **`G:\Shanu Marrige\Invite\forest`** or **`G:\Shanu Marrige\Invite\wine`**, or the matching ZIP. `index.html` must be at the upload root. There is no build command. To publish both, use two separate Pages projects.
4. Select **Deploy site**. Cloudflare assigns the available `PROJECT-NAME.pages.dev` address with HTTPS.
5. Test that address on a phone, including both languages, maps, photo enlargement, sound and your RSVP link.
6. For updates, use **Create a new deployment** in the same project and deploy to production. Share its stable production address rather than a temporary preview address.

Upload only the chosen design folder. The parent repository's `site/` is a separate family planner; a Git-based deployment needs **`Invite/forest`** or **`Invite/wine`** as its publish directory.

### 3. Share with guests

Use **Share this invitation** near the end of the page, or paste the production URL into WhatsApp. On supported phones it opens the native share sheet; otherwise it copies the link or displays a selectable link. No invitation account or app is needed.

- English: `https://YOUR-SITE.pages.dev/?lang=en`
- Hindi: `https://YOUR-SITE.pages.dev/?lang=hi`

These are examples, not live deployments. Replace `YOUR-SITE` with the assigned name.

> With love and God's blessings, we invite you to celebrate the wedding of Kamishi Shutul Austin & Anuragh Kashyap. Open our invitation in English or Hindi: [your public link]

> प्रेम और परमेश्वर के आशीर्वाद के साथ, हम आपको हमारे विवाह समारोह में सादर आमंत्रित करते हैं। हिंदी या अंग्रेज़ी में निमंत्रण खोलें: [आपका सार्वजनिक लिंक]

Share the website address rather than the ZIP or local preview address. Updates to that production deployment appear at the same address.

## Wedding details and editing

The current plan has family celebrations/stay at **Mandapam Marriage Resort, Tifra**, Holy Matrimony at **CNI Church, Civil Lines**, and reception at **Hotel Central Point International**, Bilaspur. Dates, times, bookings and the public family contact are unconfirmed; the page labels them as planned. Verify the editable Hindi name spellings with the couple.

1. Open the editor and edit English and Hindi together.
2. Use **Save draft → Preview saved draft**. Drafts are local and load only with `?preview=1`; ordinary guest viewing uses the deployed settings.
3. **Download settings.js**, replace `forest/settings.js` or `wine/settings.js` with that exact filename, and redeploy the matching folder.
4. Use **Backup JSON** and **Import backup JSON** to transfer editor work between computers. The editor cannot publish by itself.

Edits in one design do not automatically update the other. To use identical wedding details, copy your exported `settings.js` into both folders and include any newly referenced photo/audio files in both `assets/` folders.

Event dates use `YYYY-MM-DD`; times use 24-hour `HH:MM` in **IST**. Leave unknown values blank. A confirmed main ceremony enables the countdown; calendar downloads also need a start and a later same-day end time. Keep the event ID `ceremony`. Hide individual functions with `enabled`; event venue IDs must match the venue list.

The editor supports the blessing and three additional Bible quotations, photos, FAQs, travel notes, family contact, event descriptions and attire. All published settings are public invitation content; keep private guest lists and budgets outside both design folders.

- **Dress code** is built from enabled events' `attire` fields, so editing an event updates both its card and the guide. Blank attire is omitted.
- **Accommodation → venue** selects an existing venue ID (currently `mandapam`). The section reuses that venue's name, address, note and map link; clear this field to hide it. Room availability is still unconfirmed.
- **Gifts & blessings note** edits `giftNote.en` and `giftNote.hi`. Blank text hides the section in that language. The default is a message of gratitude; no banking details are published.
- Older saved drafts remain supported. They use their existing Mandapam venue if available and start with an empty gifts note.

### Photos and sound

The real photograph `Image.jfif` is bundled as `assets/couple.jpg` in each design, and remains the no-JavaScript fallback and the editor's reset photo. The portrait, story photo and closing cameo use the three `photos` settings; the opening card also uses `photos.hero`. The current build uses the refined generated portraits — `assets/hero-portrait.jpg`, `assets/story-portrait.jpg` and `assets/closing-portrait.jpg` in each folder. Replace a file or point the settings at any other image in that design's `assets/` folder. Approximately 1,200–1,600 px wide is sufficient. Keep both faces near the centre for the phone crop. Generated likenesses are approximations: compare them with the family before publishing, and swap in the real photograph if preferred. Standalone prompts for every image slot — cinematic, Ghibli-inspired, cartoon, watercolour, black-and-white and more, per design — are in `IMAGE_PROMPTS.md`.

The paired portraits use `photos.story` and `photos.closing`; the horizontal gallery uses those three plus `photos.hands`, a warm sepia close-up of the couple's clasped hands and the ring made from `image-pack/source/hand-pic.jpeg`. The keepsake uses `photos.hero`, `blessing`, `blessingSource` and the couple’s names. Forest's closing cameo is a painted emerald portrait so its small circle stays in the gold/green palette. The dimensional effects use CSS perspective and layered local artwork; no 3D model is bundled.

The merged source pack lives in `image-pack/` (portraits, ornaments, prompts, QA and the original identity photo); superseded drafts and the old studio/video references are in `archive/`.

Default music works without a paid API:

```js
audio: { music: "" },
```

Blank music uses a synthesized melody. For your own track, put the file in the chosen design's `assets/` folder and enter its path:

```js
audio: { music: "assets/wedding-music.mp3" },
```

Supply that actual file before using the example path. MP3 is a practical phone format. Playback starts only from the speaker button, so the invitation stays quiet until a guest asks for sound. Scrolling does not restart it. If the file fails, the readable invitation remains usable.

### Existing Netlify setups

The previous `netlify` RSVP mode is retained for compatibility. It requires a Netlify deployment with Forms detection enabled and a redeploy, followed by a live submission check in **Forms → wedding-rsvp**. It does not process responses on Cloudflare Pages. Use **Google Forms / link mode** for the free setup above. With `off`, no response collection is attempted.

The built-in form now has attendance radio buttons, a **1–30 guest stepper**, additional guest name/email/dietary blocks, a main-contact dietary field, optional children attendance and a message. Reducing the count or changing attendance preserves typed guest details in the current page; hidden guests are excluded from submission. A decline sends party size zero and omits all attendance-only fields. Additional guests are sent in the static `guest-details` field as JSON; redeploy to register this plus `dietary` and `children` with Netlify. These controls belong to the built-in form; Google Forms / link mode uses the questions you create in Google Forms.

## Upload ZIPs and checks

Working files are in `forest/` and `wine/`. Refresh their ZIPs after editing:

```powershell
Compress-Archive -Path .\forest\* -DestinationPath .\forest.zip -Force
Compress-Archive -Path .\wine\* -DestinationPath .\wine.zip -Force
```

Run the existing browser checks with the parent project's Playwright dependency and installed Chrome:

```powershell
$env:INVITATION_DESIGN = 'wine'
node --test tests/invitation.test.cjs
$env:INVITATION_DESIGN = 'forest'
node --test tests/invitation.test.cjs
```

Seventeen checks run against each design: bilingual rendering, safe edited text, photos, English/Hindi at 320/375/390/430px, touch scrolling, the desktop 430px frame, local fonts, keyboard opening/Escape/deep links, IST calendar export, editor drafts, RSVP errors and payloads, form links, sharing, music and failure handling. Guide/gallery checks verify edited content, fixed controls, keyboard scrolling and photo focus restoration. Guest checks cover count limits, preserving entries, language changes and excluding hidden guests. Animation checks inspect the lifted photo card, use a changed CSS duration, and interrupt opening with Escape or a reduced-motion preference. New checks cover keyboard card turning, hidden-face accessibility, preserving the turned card and expanded venue across language changes, programme/filter handoff, address copying and fallback, gallery bounds and the slow slideshow stopping for a guest, navigation and stopping 3D/reveal motion. Screenshots are written under `screenshots/forest-.../` and `screenshots/wine-.../`.

RSVP delivery and music playback failures are mocked in tests. Live Google Forms delivery and physical iPhone/Android playback still require the setup check above.

| File within either design | Purpose |
|---|---|
| `index.html`, `styles.css` | Design-specific guest layout |
| `opening.js`, `opening.css` | Opening animation and accessible handoff to the page |
| `invitation.*` (Forest), `invite.*` (Wine) | Optional decorative layer: frame, dust, parallax, seal sparks, arched hero |
| `experience.js` | Keepsake turning, photograph tilt, scroll reveals, gallery controls and section dock |
| `settings.js` | Editable wedding details |
| `app.js`, `shared.js` | Bilingual rendering, validation, guest actions and calendar |
| `audio.js` | Optional background music |
| `fonts.css`, `assets/` | Local fonts, licenses and photo assets |
| `editor.html` | Local editor and export |

At the project root, `preview.cjs` serves only the selected design; `DESIGN_NOTES.md` records reference findings and design history. The copies of `app.js`, `styles.css`, `shared.js`, `editor.js`, `opening.js`, `opening.css` and `experience.js` are identical for standalone uploads; apply common changes to both. The `forest-page` / `wine-page` body classes and each design's HTML select the palette, typography, card shapes, layout and opening cover.

The browser skill is installed at **`C:\Users\derek\.agents\skills\agent-browser\SKILL.md`**, the shared agents discovery location. The global `agent-browser` CLI was used to inspect the reference demos and local invitation.

### Free-service documentation

- [Cloudflare Pages direct uploads](https://developers.cloudflare.com/pages/get-started/direct-upload/)
- [Pages limits](https://developers.cloudflare.com/pages/platform/limits/)
- [Free static-asset requests](https://developers.cloudflare.com/pages/functions/pricing/#static-asset-requests)
- [Link Google Forms responses to Sheets](https://support.google.com/docs/answer/2917686?hl=en)
- [Google account storage](https://support.google.com/drive/answer/6374270?hl=en)
