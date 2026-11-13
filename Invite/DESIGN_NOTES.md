# Invitation review & design notes

## Refined image pack, the ring photo and folder tidy-up — 13 November 2026

The supplied `Kamishi_Anuragh_Wedding_Invitation_Assets_REFINED` pack replaces the first pack's photos, and the two packs are now one folder.

- **One pack:** both `Kamishi_Anuragh_*` folders are merged into `image-pack/` (the refined set plus the one older board image it lacked), and the originals are deleted. Its own `README.md`, `IMAGE_PROMPTS.md`, `IMAGE_PROMPTS_REFINED.md`, `manifest.json`, `qa/` and `previews/` stay inside it as provenance.
- **Better portraits:** all six core slots now come from the refined pack — `assets/hero-portrait.jpg`, `assets/story-portrait.jpg`, `assets/closing-portrait.jpg` in each design. Faces, glasses, the groom's shaved head and the bride's hair read far closer to the couple than the first set, and the story frames are full painted scenes rather than tight crops.
- **New gallery photo:** `assets/gallery-hands.jpg` in both designs, from `image-pack/source/hand-pic.jpeg` (the supplied phone photo of the clasped hands and the ring). It is cropped to 2:3 around the hands and the gold ring, converted to a warm sepia wash so the phone's purple ambient light disappears, and given a soft vignette. That keeps the couple's real hands untouched — no generated fingers.
- **Gallery is now four photos** (hero, story, closing, hands) and is driven by `photos.hands` in `settings.js`, so the editor exposes it as another photo field. `tests/invitation.test.cjs` counts the slides instead of hard-coding `3`.
- **Rejected from the refined pack:** its gallery extras (`gallery-candid`, `gallery-watercolour`, `gallery-detail`, `gallery-line`, the sepia/noir treatments). They are re-crops or broken composites of the same three scenes, so they would have repeated the same photo in one row. Its `church-cover`, `toile`, `monogram` and ornament vectors are also unused — the existing line artwork is finer.
- **Root folder tidied:** superseded work moved to `archive/` (`interactive_wedding_invitation_studio.html`, `Sample.mp4`). `Image.jfif` stays at the root as the identity photograph.
- **`forest-invitation-v2` merged into `forest/`:** that folder and its ZIP were the enhanced Forest build, and the enhancement was the `invitation.css` + `invitation.js` layer — gold frame on the 430px card, fireflies, scroll parallax on the arch, wax-seal rotation, blur-to-sharp reveals and a spark burst on opening. Both files and their two `<head>` lines are now in `forest/`, and the archived copies are deleted, so one Forest remains. One rule was dropped: `.hero-art{order:-1}` reversed the phone hero so the photograph came before the names; Forest keeps names first. Two tests were scoped to the opening card (`getAnimations({subtree:true})` and the gallery slide count) because the layer's decorative infinite animations are legitimate.
- **`wine-invitation-v2` merged into `wine/`:** that folder and its ZIP were an enhanced Wine build, and the enhancement was the `invite.css` + `invite.js` stationery layer. Both files and their two `<head>` lines are now in `wine/`, replacing the earlier `wine/invitation.css` + `wine/invitation.js` (deleted). The layer turns the rectangular cream print into an arched hero window — `min(80%, 340px)` wide at a .8 ratio, inside a `999px 999px 6px 6px` gold outline on a deep burgundy page surround — and pulls everything onto one centred axis: a centred monogram header, a 2px gold reading-progress ribbon across the top, a breathing wax seal on a floating envelope with a 22-spark burst when it breaks, then a hero choreography that raises the arch and writes each name in (`--t: 1.3s` only when the seal itself was opened). It settles a thin gold frame around the keepsake, scripture, gifts and closing sections, lets photographs develop out of blur and sepia as they scroll in, and drifts gold dust and falling petals on a fixed canvas. Two v2 rules were dropped: the layer hid `.guest-dock` and `.event-filters`, which are working navigation controls (and are checked by the tests), so only decorative chrome is hidden — nav, brand caption, chapter numbers, photo hints, scroll cue, portrait labels and footer links. An older v2 snapshot's shared files (three-photo gallery, microphone control, older portraits) were rejected in favour of the current ones, and the folder and ZIP are deleted, so one Wine remains.
- **Gallery is now a slow slideshow:** the four photographs advance one at a time every 4.5 seconds, reverse at the last photograph and carry on back and forth (0-1-2-3-2-1-0...). `experience.js` keeps the existing scroll-snap track, arrows and counter, so swipe, keyboard and tap-to-enlarge still work; any pointer, wheel, key or focus on the gallery stops the automatic movement, and it never starts under reduced motion or while off screen. `tests/invitation.test.cjs` adds one check that it advances by itself and stops after an arrow.
- **Microphone control removed:** the read-aloud narration is gone from both designs — the button, the speech synthesis and recording fallback in `audio.js`, the `audio.narration` setting and its validation, and the editor's narration fields. The speaker/music control stays, with the synthesized melody or `audio.music`.

## Generated image pack — applied 12 November 2026

The first supplied pack was integrated from the prompts in `IMAGE_PROMPTS.md` (its folder is now merged into `image-pack/`):

- Each design now uses its three generated portraits — `assets/hero-portrait.jpg` (4:5), `assets/story-portrait.jpg` (2:3) and `assets/closing-portrait.jpg` (4:5) — through `photos.hero/story/closing`. `assets/couple.jpg` stays as the supplied original, the no-JS fallback and the honest comparison.
- Forest's closing cameo uses the pack's sepia framed alternative instead of the burgundy-washed version, so the small circle does not clash with emerald/gold.
- Forest's opening-card strip crop moved from `48%` to `60%` horizontally, because the wider generated composition cut the bride at the strip edge.
- Deliberately not used: the pack's `church-cover.svg/png`, `toile` and `ornaments` (far simpler than the existing line artwork), and the six extra gallery treatments (there is no separate gallery schema; they remain in the pack folder for later).
- Generated likenesses are approximations of real people. Verify faces, glasses, hair and hands with the family, or swap `couple.jpg` back in, before publishing.

## Forest & Wine naming, cover names and the bride illustration — 11 November 2026

- The user renamed the two cards: `classic/` → **`forest/`**, `editorial/` → **`wine/`**. Folders, ZIPs, body classes (`forest-page` / `wine-page`), preview and test design keys all follow the new names; the preview ports stay 4175 (Forest) and 4174 (Wine), with `wine` as the default preview.
- Each cover now prints its own design name above the eyebrow, from the same bilingual copy key (`FOREST` / `फ़ॉरेस्ट`, `WINE` / `वाइन`). Forest sets it in pale gold on the dark cover; Wine sets it in burgundy on cream. It is decoration only, so no extra guest feature was added.
- The “bald bride” was the illustrated bride in `assets/church-cover.svg`, not the photograph. Her hair was a thin crescent that disappeared at card size; the real `assets/couple.jpg` always showed her hair. She now has a full dark wavy updo with volume above the head, a visible forehead and hairline, a centre parting, face-framing waves and the three hair flowers. Both folders ship the identical SVG, so no generated portrait is needed. The optional watercolour prompts below remain available.

## Reference component inventory — for future use

The two Digital Yes demos were re-read on 11 November 2026 to harvest their component and animation vocabulary. Both are plain HTML/CSS with images and `<video>`; **neither** uses WebGL, THREE.js, canvas, GSAP, Lottie, AOS or Lenis, so their “3D” is CSS perspective and layered illustration. Their artwork is paid template art and was **not** copied. This list maps each reference component to the original implementation already in both designs, so later sections can be rebuilt without duplicating code.

| Reference component | What it does | Our equivalent |
|---|---|---|
| Intro/cover film | Full-bleed muted autoplay `<video>` with a poster, dismissed by a tap overlay, fixed language and mute buttons | `opening.js` + `opening.css` paper opening: folded card (Forest) / envelope (Wine), CSS-only, keyboard and reduced-motion aware |
| Cut-out illustration layers | Transparent PNG columns, curtains, candles, bouquets, yacht, hotels, champagne tower, teacup, cupid, swans, rings, locket, watermark | Original local SVGs: `assets/church-cover.svg` (church, couple, altar, veil), `assets/toile.svg` watermark, `assets/monogram.svg`, and the inline `#rings` / cross icon sprite in `index.html` |
| Frosted card | `rgba(255,255,255,.8)` + `backdrop-filter: blur()`, 1px gold border at ~20% alpha, 16px radius, soft shadow, over textured paper | `.event-card`, `.venue-card`, `.keepsake-card` in `styles.css`, with design-specific radii and paper backgrounds |
| Divided list card | One card, centred rows separated by hairlines (hotels, gifts) | `.stay-list`, `.gift-note`, `.faq-list` |
| Fade-up on scroll | `opacity: 0 → 1` with `translateY(20px)`, staggered per child, once only | `experience.js` reveals plus `[data-reveal]` rules in `styles.css` |
| `float` / `marquee` loops | Endless gentle drift on decorative objects; horizontal band of names | `@keyframes float` for ornaments; no marquee, to keep text readable and accessible |
| Fixed utility controls | Language switch, mute button, RSVP shortcut pinned over the page | `.language-switch`, `.audio-controls`, `.section-dock` |
| Countdown / programme | Live countdown; numbered day timeline linking to details | `#countdown` and the clickable celebration programme with filter handoff |
| Practical guest tools | Per-event map links, calendar downloads, dress code, accommodation, travel notes, gifts | `app.js` maps/calendar links, attire-derived dress code, stay, gifts and FAQ sections |
| RSVP form | Attendance, guest count, notes; submitted to the vendor backend | Bilingual RSVP with stepper, guest blocks, dietary/children fields; free Google Forms or Netlify modes |

Reusable rules worth copying into a new section: put the couple, date and RSVP shortcut in the first screen; keep the language switch reachable while scrolling; pair practical actions with the celebration they belong to; animate only transform and opacity, once, and disable it under reduced motion.

## Current delivery: distinct identities, matching guest features

The latest user request asks to recover the previous context, apply future changes to **both designs**, make them visibly different, and use Maison Dorée / Royal for more interactive, animated, minimal-but-grand ideas. `README.md` and this file supplied the saved context; the continuing both-designs instruction is now in `AGENTS.md`.

### Reference review, 11 November 2026

- [Maison Dorée](https://www.thedigitalyes.com/demo/maison-doree) was inspected through its live iframe, `https://tdy-excellence-template.thedigitalyes.com/?embed=1`. Observed: textured envelope/seal opening, a script-led invitation, illustrations above rounded celebration cards, wedding-weekend programme, attire, hotel choices and an attendance/guest-count RSVP.
- [Royal](https://www.thedigitalyes.com/demo/royal) was reopened through `https://premiumelegante.thedigitalyes.com/?embed=1`. Observed: invitation opening, fixed EN/ES and sound controls, map, a fine-line day programme, dress code, welcome/farewell gatherings, travel, accommodation and RSVP.
- These informed the composition, reading sequence and practical guest tools. The new flip card, pointer tilt, address-copy controls and bottom dock are our own adaptations. Reference forms were not submitted.

### What differs now

| Forest: emerald heirloom | Wine: champagne atelier |
|---|---|
| Dark emerald opening with gold arch framing and a folded card | Cream opening with a tilted envelope, burgundy seal and serif title |
| Light script names on an emerald architectural hero | Photo-print opening, left-aligned serif names and champagne space |
| Arched, gilded cards; dark-green featured ceremonies | Rectangular cards, large event numerals and thin dividing rules |
| Botanical portrait pairing and a circular-marker programme | Offset photo prints and a numbered editorial programme |
| Ivory blessing reverse on the dimensional keepsake | Burgundy reverse on the rectangular keepsake |

Both still have the 430px reading frame, identical editable wedding information and English/Hindi support. Added in both: a keyboard-operable photo/blessing flip card with inactive-face accessibility, CSS dimensional rings and photograph tilt, once-only scroll reveals, a programme that links to the correct event even through active filters, expandable venue details, copy-address with a selectable fallback, gallery navigation/counter, and a section dock with reading progress. Sound controls sit below the language switch. Reduced motion disables tilt/reveals and makes turning immediate; touch gestures remain native.

The visuals use the supplied real photograph and local artwork. No new dependency, generated portrait, WebGL model, invented date or booking is included. The two full browser suites each pass **16 checks**. A lazy-image route teardown race exposed during the Editorial run was fixed in the existing test cleanup, then the full Editorial suite passed. Physical-device sound and live RSVP delivery still need the publication checks in `README.md`.

Pre-change folders, ZIPs, tests and docs: `C:\Users\derek\AppData\Local\Temp\opencode\invite-before-distinct-designs-20261111-084433`.

## Previous delivery: shared video-inspired styling

The latest request applies the user's detailed Digital Yes video breakdown to **both** designs. `forest/` keeps its forest-green palette, arched portrait and folded-card opening. `wine/` keeps its wine-red palette, leading photograph and envelope opening. Each is a complete standalone website with its own settings and editor, plus a matching upload ZIP.

Both are now centered, 430px-wide vertical invitations, including on desktop. They use the already bundled Pinyon Script, Cormorant Garamond and Hindi font; fixed language/audio controls align to the invitation frame. Rounded white cards, champagne details, a faint architectural watermark, paired colour/monochrome photographs, a native scroll-snap gallery and gold ornaments adapt the supplied reference. Decorative glimmer runs once for 4.5 seconds and respects reduced motion.

The dress-code guide derives from enabled events' attire. Accommodation selects the existing Mandapam venue and repeats its unconfirmed room note. A bilingual editable gifts note expresses gratitude. The supplied reference's Spanish hotels, dates, travel estimates and bank accounts are not wedding data. Gallery frames use the existing three editable photo slots, currently one supplied real photograph. Existing local SVG artwork is reused; no image-generation job or new dependency was needed.

The built-in Netlify form now includes attendance radios, a 1–30 guest stepper, dynamically generated additional guest fields, dietary needs and children attendance. Entries survive count reductions, language changes, decline/reaccept and request failures; hidden guests are excluded from submissions. Google Forms link mode still opens the user's own form and does not use the built-in fields.

The approved pre-enhancement folders, ZIPs, tests and docs are backed up at `C:\Users\derek\AppData\Local\Temp\opencode\invite-before-mobile-enhancement-20261111-011923`.

The 2.8-second sequence releases the seal, opens the flap or card leaves, lifts a personalised photo invitation, then expands it as the full page comes into view. Animation uses transforms and opacity. Completion follows the browser's actual animation rather than a fixed JavaScript timeout. Escape, reduced motion (including a preference change mid-animation), deep links and editor previews are supported. The opening card uses the editable `photos.hero` and bilingual names.

The preceding site, tests, docs and preview script, along with the previous upload snapshot and ZIP, are preserved at `C:\Users\derek\AppData\Local\Temp\opencode\invite-before-two-designs-20261111-010752`.

## Editorial reference direction

The earlier redesign request asked for a new invitation using the supplied websites as references. The editorial version uses an original stationery/editorial design, informed by the inspected Royal and Editorial guest flows. The restored first draft is now also retained as the classic version.

The earlier iteration introduced the CSS paper envelope and wine-red wax-style seal, animated opening, full-width mobile photograph, centered welcome, scripture, numbered chapters, events, venue cards, reply card, FAQs and signed closing. Its desktop split layout has now been replaced by the requested narrow frame, with script typography and more decorative sections.

The restored first draft, tests and documentation were backed up before this redesign at `C:\Users\derek\AppData\Local\Temp\opencode\invite-before-digital-yes-20261111-003947`. The earlier illustrated version remains at `C:\Users\derek\AppData\Local\Temp\opencode\invite-before-first-draft-restore`.

## New reference review

### Basic Invite

Requested: <https://www.basicinvite.com/websites/wedding.html?srsltid=AYCX9vLLoX5m8NLwI_Ab0AxfZqwtu8mwv6QqvIdOgHNGlljBsTsUT12A>

Both the supplied and clean URLs returned HTTP 403. Chrome showed **Performing security verification** with a Cloudflare challenge. The page and its demos could not be inspected; no claim is made that their layouts or features were verified. Screenshots or a directly accessible demo link would allow a later comparison.

### The Digital Yes — homepage and actual live demos

Reviewed the [homepage](https://www.thedigitalyes.com/) and opened two live invitation demos using the installed `agent-browser` skill. The catalog advertises paid invitations from €175; it is a design reference, not a service needed by this implementation.

| Demo | Direct live URL discovered in its iframe | Observed guest experience |
|---|---|---|
| [Royal](https://www.thedigitalyes.com/demo/royal) | <https://premiumelegante.thedigitalyes.com/?embed=1> | Click-to-open invitation, music control, EN/ES, names/date, early RSVP shortcut, countdown, welcome, map, day programme, dress code, additional gatherings, transport, accommodation, gifts and an RSVP form |
| [Editorial](https://www.thedigitalyes.com/demo/editorial) | <https://bodaeditorial.thedigitalyes.com?embed=1> | Click-to-open cover, large split editorial headings, persistent language/music buttons, event-specific map/calendar links, day timeline, attire, transport, accommodation, expandable recommendations and RSVP |

Royal was opened through its live iframe URL, its RSVP shortcut activated and its form controls inspected. Editorial was opened and switched from Spanish to English; its headings, map/calendar destinations and RSVP fields were inspected. The homepage and Editorial were revisited for this redesign, including visual inspection of the textured envelope and oversized opening typography. Forms expose attendance, guest count and practical guest needs. Reference forms were not submitted.

### What informed this invitation

- Keep the couple, date/location and an RSVP shortcut together near the top.
- Begin with a tactile envelope opening; use large editorial type and restrained stationery colours.
- Use a continuous reading sequence with clear headings and generous spacing.
- Keep language selection reachable while scrolling and provide an explicit sound control.
- Put practical map/calendar actions beside the relevant celebration, with attire and travel guidance nearby.
- Make RSVP straightforward and state where the response is submitted.

This is a fresh composition, rather than the first draft's arched/botanical layout. The envelope and seal are CSS, and all photographs/fonts are local. No paid template assets were copied. The native dialog supports keyboard opening and Escape, hands focus to the invitation on closing, and closes immediately with reduced motion. Deep links and draft previews skip it. Sound starts only from an explicit sound button. The page uses ordinary scrolling throughout.

## Supplied material and wedding content

- **`Image.jfif`** supplies the opening portrait, keepsake story photo and closing cameo; these are treatments of one real photograph. The three settings can point to separate images later.
- **`archive/interactive_wedding_invitation_studio.html`** supplies the inspiration for the synthesized melody. Its existing decorative church and ornament assets are now reused in both designs.
- **`archive/Sample.mp4`** was analysed previously through 41 sampled frames. This redesign uses its own CSS envelope, informed by the live website reference; the video's audio was not transcribed or reused.
- **Parent planning files** establish the intended Mandapam / CNI Church / CPI Bilaspur plan, not confirmed bookings or dates.
- Exact English names are retained. Hindi spellings remain editable and need the couple's confirmation.
- Bible passages include 1 Corinthians 13:13, 1 Corinthians 16:14, Ecclesiastes 4:9 and Mark 10:9, editable in English/Hindi.
- Edited text is rendered literally, and invalid imports preserve editor work. Local drafts require explicit export and redeployment.

## Free hosting, storage and sound

- **Cloudflare Pages Free:** upload `Invite/forest` or `Invite/wine`, or its matching ZIP; photos, local fonts and recordings are static website files. Use a separate project per design and its included `pages.dev` address. Static-asset requests are documented as free and unlimited; dashboard uploads allow 1,000 files up to 25 MiB each.
- **Google Forms + Sheets:** use a personal account, link the response Sheet and put only the form's responder link in `rsvp.formUrl` with `mode: "link"`. Google account storage is 15 GB shared across its services. Keep the Sheet private to the hosts. This uses the existing external-form feature without a custom backend.
- **Sharing:** native phone sharing or copying the production link; the chosen language is included and local-preview parameters are removed.
- **Audio:** a blank music path uses a synthesized melody; a custom recording can live in either design's `assets/` folder. Playback starts only after tapping the speaker, and backgrounding pauses it. The microphone/read-aloud control and its `audio.narration` setting are gone: guests read the bilingual invitation instead. No paid API or recorded voice is bundled.
- **Checks:** seventeen browser checks per design cover English/Hindi at 320, 375, 390 and 430px and the desktop frame; keyboard opening, Escape, reduced motion and deep links; the lifted photo-card stage, animation completion and interruption; native scrolling, the auto slideshow and gallery gestures; local assets; guest/editor actions; guide content, fixed controls, guest stepper limits, preserving entries and RSVP payloads; sharing and the broken-music fallback. Live delivery and physical-device listening remain unverified.
- The accounts/form are not connected and no public deployment exists yet. `README.md` contains the complete free setup and links to official service documentation.

The shared browser skill is installed at `C:\Users\derek\.agents\skills\agent-browser\SKILL.md`; its version-matched CLI guide was used for the demo and local-page inspection.

## Indian Christian wedding research

Indian Christian weddings vary by denomination, region and family. The CNI Holy Matrimony service is the central faith ceremony. Its vows, readings, prayers and order should be agreed with the couple's church; no generic internet source establishes the exact Bilaspur service.

The family's own plan includes Engagement, Mehendi, Haldi and Sangeet. They are shown as **planned family functions**, separately from Holy Matrimony. Each can be hidden in the editor. Roce is a coconut-milk/oil blessing custom associated particularly with Goan and Mangalorean Catholic communities; it has not been inserted as an obligatory CNI function.

Sources consulted:

1. WeddingWire India, Indian Christian wedding overview and regional variation: <https://www.weddingwire.in/wedding-tips/indian-christian--c6055>
2. Weddingz, community-specific Roce background: <https://weddingz.in/blog/roce-ceremony-a-to-z-of-this-special-catholic-pre-wedding-tradition/>
3. Church of England marriage liturgy index: <https://www.churchofengland.org/liturgy/common-worship/marriage> — background reference for Anglican marriage, **not** the confirmed local CNI service order.
4. Joy wedding websites: <https://withjoy.com/wedding-website/> — visual references including garden/arch/ivory designs, plus practical schedule, travel, FAQ and RSVP patterns. No paid template or artwork was copied.
5. Netlify Forms setup: <https://docs.netlify.com/manage/forms/setup/> — static form detection, form names and deployment setup.

## Artwork status and ready-to-use prompts

Every image slot now has its own prompt in **`IMAGE_PROMPTS.md`**: per-design hero, story and closing prompts in deliberately different styles (cinematic, Ghibli-inspired, cartoon, watercolour, risograph, black-and-white), gallery extras, the SVG ornament set, and swap-in style variants. The older single-prompt notes below are kept for the two portrait paths they named.

Two API image-generation jobs failed with an insufficient-credits error. A subsequent automated Chrome visit to ChatGPT remained on its “Just a moment…” verification screen and never exposed the chat composer. The already-running personal Chrome process did not expose a remote-debugging session that the browser tools could attach to. No generated wedding-outfit artwork is included or claimed.

When image generation is available, upload **`Image.jfif`** as the identity reference and use these prompts. Export the finished images to the chosen design's `assets/` folder using the paths below, then edit the photo settings.

### Welcome photograph — `assets/church-portrait.jpg`

> Create a refined, romantic watercolor wedding portrait of the two adults in the supplied reference photograph. Preserve their recognizable facial features, skin tones, relative proportions and glasses. The groom is on the left: bald head, rectangular glasses, moustache and short goatee. The bride is on the right: oval glasses and dark curly hair. Dress the groom in a tailored black tuxedo with an ivory shirt and understated boutonnière. Dress the bride in an elegant ivory lace Christian wedding gown with a light veil and a small white-and-sage bouquet. They stand together naturally beneath a graceful church arch with restrained olive/sage foliage and ivory flowers. Hand-painted editorial watercolor on warm ivory paper, forest-green and champagne accents, warm soft light, dignified and affectionate, no exaggerated features. Vertical 2:3 composition, both faces comfortably inside the central area with generous margin for a narrow portrait crop. No text, logos or invented lettering.

### Story — `assets/reception-portrait.jpg`

> Using the supplied photograph as the identity reference, create a warm editorial wedding-reception portrait of this same couple. Preserve their real faces, skin tones and glasses. Groom: bald, rectangular glasses, moustache and short goatee; elegant dark dinner jacket. Bride: oval glasses, dark curly hair; graceful ivory embroidered saree with delicate wedding jewellery. A softly lit garden reception in Bilaspur, gentle fairy-light bokeh, ivory flowers and sage foliage. Romantic fine-art illustration with painterly texture, natural expressions, understated celebration, no fantasy skin smoothing or exaggerated facial features. Compose a medium portrait of both people, with ample margin for square and portrait crops. No text, logos or watermarks.

A fresh real photograph in wedding clothing can be used in exactly the same slots. The image paths are ordinary public files and do not depend on the generator.
