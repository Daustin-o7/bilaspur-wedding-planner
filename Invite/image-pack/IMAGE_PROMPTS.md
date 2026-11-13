# Image generation prompts — Forest & Wine

Every image on both invitations, with one deliberate style per section. Copy a prompt, attach `Image.jfif` as the identity reference, generate, save to the path shown, then point `settings.js` at it.

## Before you generate

### Who is in the picture

Keep these real, recognisable people in every frame:

- **Groom, Anuragh Kashyap** — on the left: bald/shaved head, rectangular glasses, moustache and short goatee, warm smile.
- **Bride, Kamishi Shutul Austin** — on the right: dark curly/wavy hair, oval glasses, drop earrings.
- Indian Christian wedding, Bilaspur, Chhattisgarh. Do not invent dates, venues, congregation names or lettering.

The supplied `Image.jfif` (also `forest/assets/couple.jpg`) is the only identity reference. A fresh real photograph in wedding clothes can replace any result here.

### Master prefix — put this before every prompt

```text
Use the supplied photograph as the identity reference for both people. Preserve their real faces, skin tones, glasses, hair and relative heights. Groom on the left: bald shaved head, rectangular glasses, moustache and short goatee. Bride on the right: dark curly hair, oval glasses. Both are adults at their own Indian Christian wedding in Bilaspur, Chhattisgarh. Natural, affectionate, dignified; no exaggerated features, no beauty-filter skin, no text, no logos, no watermark, no border, no collage.
```

### Master negative prompt

```text
text, lettering, calligraphy, logos, watermarks, signature, frame, border, collage, split screen, extra fingers, deformed hands, extra people, duplicate faces, plastic skin, heavy HDR, lens flare wash, neon, horror, children, wedding cake toppers, western church interior, invented dates
```

### Sizes, crops and safe areas

The page crops every photo, so compose for the crop:

| Slot | Save as | Generate | Used by | Crop behaviour |
|---|---|---|---|---|
| Hero / cover / keepsake | `assets/hero-portrait.jpg` | 4:5 portrait, 1600×2000 | Arch hero photo, opening card strip (only ~42% width visible), keepsake front | `object-position: 48% 30%` — faces centred horizontally, about 30% from the top |
| Story | `assets/story-portrait.jpg` | 2:3 portrait, 1200×1800 | Main story photo and gallery frame 2 | 0.65–0.73 portrait crop, sepia-tinted in Forest |
| Closing / companion | `assets/closing-portrait.jpg` | 4:5 portrait, 1200×1500 | Small tilted companion photo and closing cameo (circle in Forest, print in Wine) | `object-position: 48% 28%`, converted to greyscale in Forest |

Keep faces inside the central 60% and the top half; leave quiet margin at the bottom for the arched frame, the polaroid lip and the bottom dock. Tall 2:3 files are safest because every slot crops harder than it looks.

### Where the images go

1. Save the generated file into `forest/assets/` and/or `wine/assets/`.
2. Set `photos.hero`, `photos.story` and `photos.closing` in that folder's `settings.js`.
3. Copy the same files and settings into the other design if you want both to match; images can also differ per design.
4. Rebuild both ZIPs and run the checks (see `README.md`).

**Gallery note:** the gallery shows the same three photo slots, so a fourth "gallery-only" image needs a settings/code change. The extra prompts below are for the slot you like least, or for when you split the gallery later.

## Style map

| Slot | Forest (emerald / gold, arched heirloom) | Wine (champagne / burgundy, editorial) |
|---|---|---|
| Hero + cover + keepsake | **Cinematic film still** — golden hour, emerald foliage | **Large-format editorial photograph** — warm neutral, fine grain |
| Story | **Ghibli-inspired hand-painted animation** | **Watercolour editorial** |
| Closing / companion | **Warm cartoon line-art** with flat colour | **Art-deco risograph** duotone |
| Illustrated artwork | Flat-vector emerald/gold line work | Flat-vector champagne/burgundy line work |

Variants for the remaining slots are in "Swap-in style variants" at the end.

---

## Forest prompts

### F1 · Hero, cover and keepsake — cinematic film still

Save as `assets/hero-portrait.jpg` · 4:5 portrait · `photos.hero`

```text
Cinematic 35mm film still, shallow depth of field. The couple stand close together in the arched stone doorway of a small Indian church at golden hour, her hand resting on his forearm, both looking into the camera with quiet joy. She wears an ivory lace Christian bridal gown with a soft cathedral veil and a small white-and-sage bouquet; he wears a tailored deep emerald-charcoal suit with an ivory rose boutonnière. Warm late sunlight rims their faces; deep emerald foliage and old stone fall softly out of focus behind them. Rich teal-and-gold grade, gentle halation on the highlights, subtle 35mm grain, natural skin texture. Vertical 4:5, both faces fully visible in the upper third, generous quiet margin at the bottom.
```

### F2 · Story photograph — Ghibli-inspired hand-painted frame

Save as `assets/story-portrait.jpg` · 2:3 portrait · `photos.story`

```text
Hand-painted animation background in the spirit of Studio Ghibli, gouache and watercolour on paper. The same couple walk hand in hand along a garden path at the family home, evening light through broad green leaves, marigold garlands and small oil lamps along the edge, a few fireflies in the air. She wears a soft ivory saree with a light dupatta; he wears a simple dark bandhgala. Warm cel-style shading, visible brush texture, painterly foliage and a pale green-gold sky, calm and romantic rather than cartoonish. Faces stay faithful to the reference, gently simplified but recognisable. Vertical 2:3.
```

### F3 · Closing cameo and companion — warm cartoon line-art

Save as `assets/closing-portrait.jpg` · 4:5 portrait · `photos.closing`

```text
Charming hand-drawn couple portrait in warm cartoon line-art. Clean confident ink outlines, flat muted colour fills, soft paper grain, no gradients. The couple face each other, foreheads almost touching, laughing; she has dark curly hair with a small flower, oval glasses and an ivory gown; he has a bald head, rectangular glasses, moustache and goatee, in a dark suit with a white rose. Background: a simple ivory field with a sparse emerald-and-gold botanical sprig and a single gold ring motif. Palette limited to ivory, emerald, sage and antique gold. Wholesome, affectionate, storybook charm, flat even lighting. Vertical 4:5, both faces centred.
```

### F4 · Gallery extra — documentary candid (Forest)

Save as `assets/gallery-candid.jpg` · 2:3 portrait

```text
Honest documentary wedding photograph, available light only. The couple share a quiet unposed moment during the mehendi evening: she is laughing mid-sentence with henna on her hands, he is leaning in to listen, warm string lights blurred behind them, other guests only as soft silhouettes at the edge of frame. Slight motion blur, natural ISO grain, no posed smiles, no direct flash, muted sage and amber tones. Looks like a real photograph from the family album. Vertical 2:3.
```

### F5 · Gallery extra — heirloom watercolour (Forest)

Save as `assets/gallery-watercolour.jpg` · 1:1 square

```text
Loose fine-art watercolour on cold-pressed ivory paper, edges bleeding softly into the paper. Close, warm portrait of the couple from the shoulders up, she leaning her head towards his shoulder, he smiling with eyes crinkled. Pigment palette: emerald green, sage, warm ochre, gold accents, skin left as luminous paper-toned washes. Visible brush marks, one or two intentional blooms of colour, no hard outlines, no digital gloss. Square 1:1 composition with generous ivory margin.
```

### F6 · Gallery extra — vintage sepia print (Forest)

Save as `assets/gallery-sepia.jpg` · 2:3 portrait

```text
Vintage 1970s medium-format wedding photograph, warm sepia with slightly faded highlights and gentle vignetting. The couple stand side by side on stone steps, she holds her bouquet low, he has one hand in his pocket, both calm and unsmiling in the formal manner of old family photographs. Soft directional light, fine film grain, slight dust and a barely visible scratch or two, as if scanned from a family album. No text, no border, no modern styling. Vertical 2:3.
```

---

## Wine prompts

### W1 · Hero and cover — large-format editorial photograph

Save as `assets/hero-portrait.jpg` · 4:5 portrait · `photos.hero`

```text
Large-format editorial wedding photograph, 85mm, wide open aperture. The couple stand in a champagne-lit hotel corridor before the reception, she in an ivory embroidered saree with delicate gold jewellery and a burgundy shawl, he in a black dinner jacket with a single white rose. She looks at the camera; he looks at her. Warm cream walls, brass sconces and deep burgundy drapes dissolve into soft bokeh. Neutral warm grade with restrained contrast, fine natural grain, honest skin texture, no gloss. Vertical 4:5, faces in the upper third, calm negative space below for the polaroid frame.
```

### W2 · Story photograph — watercolour editorial

Save as `assets/story-portrait.jpg` · 2:3 portrait · `photos.story`

```text
Refined editorial watercolour on warm ivory paper. A softly lit garden reception: the couple sit together at a small table, she in an ivory saree with a delicate gold necklace, he in a dark dinner jacket with the jacket open, both mid-laugh. Fairy-light bokeh and champagne-coloured flowers in the background, painted loosely and left slightly unfinished at the edges. Controlled washes, restrained burgundy and gold accents, natural paper texture, painterly but composed rather than whimsical. Faithful likeness, no smoothing of features. Vertical 2:3.
```

### W3 · Closing cameo and companion — art-deco risograph

Save as `assets/closing-portrait.jpg` · 4:5 portrait · `photos.closing`

```text
Art-deco risograph portrait in two inks: burgundy and champagne on cream paper. Bold geometric framing — a slim gold arch and a fine sunburst behind the couple — with the couple rendered in confident simplified shapes, she with dark curly hair and oval glasses, he bald with rectangular glasses, moustache and goatee. Visible risograph texture, slight ink misregistration, halftone dots in the shadows. Elegant 1930s wedding-poster mood, flat colours, no gradients, no lettering. Vertical 4:5, symmetrical composition.
```

### W4 · Gallery extra — black-and-white film (Wine)

Save as `assets/gallery-noir.jpg` · 2:3 portrait

```text
Black-and-white 35mm film wedding photograph, Tri-X look. The couple stand close in a doorway, half in light, half in shadow; she is adjusting his collar, he is smiling down at her. Strong directional window light, deep but detailed shadows, visible grain, a little highlight roll-off. Quiet, intimate, cinematic; no direct flash, no modern crispness. Converted honestly, not stylised with fake scratches. Vertical 2:3.
```

### W5 · Gallery extra — champagne still life with the couple (Wine)

Save as `assets/gallery-detail.jpg` · 1:1 square

```text
Editorial detail photograph, square. Foreground: two coupe glasses of champagne on a linen-covered table with a sprig of olive and a folded burgundy napkin, condensation on the glass. Background, deliberately out of focus: the couple mid-conversation, she laughing, he leaning in, warm candlelight and cream flowers bokeh. Shallow depth of field, soft window light, restrained champagne and burgundy palette, fine grain. No text, no logos on the glassware. Square 1:1.
```

### W6 · Gallery extra — minimal line portrait (Wine)

Save as `assets/gallery-line.jpg` · 2:3 portrait

```text
Single-weight ink line portrait on cream paper, minimal and confident: a continuous line drawing of the couple's faces in profile, foreheads close, plus two or three fine botanical lines suggesting leaves and a ring. No fill, no shading, no colour except a single restrained burgundy accent line and one champagne-gold dot. Elegant, spacious, lots of empty paper, gallery-print quality. Faithful to their silhouettes: his bald head, moustache and glasses; her curly hair and oval glasses. Vertical 2:3.
```

---

## Illustrated artwork (SVG ornaments)

These replace or extend the existing line artwork: `assets/church-cover.svg` (7% hero watermark), `assets/toile.svg`, `assets/monogram.svg`, and the ornaments `swans.svg`, `locket.svg`, `ribbon.svg`, `toast-tower.svg`, `flower-urn.svg`, `drapery.svg`.

Generators output raster files. Either export a transparent PNG and point the CSS/`<img>` at it, or trace the result to SVG and keep the current file name. Match the current single-weight line style so the page keeps one visual language.

### A1 · Church watermark replacement

Save as `assets/church-cover.png` (or trace to `church-cover.svg`) · 4:5 portrait, transparent background

```text
Flat vector line illustration, transparent background, single consistent line weight, no fill except two flat accent tones. A graceful Indian church facade with one dome, a slim cross, an arched doorway and two flanking pillars, framed by a soft arch of botanical sprigs and two small climbing vines. In front of the steps stand a groom in a suit and a bride in a lace gown holding a small bouquet, drawn simply and elegantly at about one-third of the height. Palette: emerald green, antique gold, warm ivory. Centred symmetrical composition, generous empty margin, no shading gradients, no text.
```

### A2 · Toile / botanical watermark tile

Save as `assets/toile.png` (or trace to `toile.svg`) · square, transparent background

```text
Seamless toile-style botanical tile, flat vector, one line weight, transparent background, single emerald or antique-gold ink. Repeating fine sprigs of olive, fern and jasmine with small five-petal flowers, tiny leaves and two intertwined rings hidden in the pattern. Even spacing, edges designed to tile without a visible seam, delicate and sparse so it works at 6% opacity behind text. No shading, no text, no border.
```

### A3 · Ornament set

Save each as a separate file · 512×512, transparent background

```text
A set of six small flat-vector wedding ornaments, each on its own transparent 512×512 canvas, identical line weight and palette: (1) two swans facing each other; (2) a pair of interlocking wedding rings; (3) a toast tower of three champagne coupes; (4) a small lock and key; (5) a ribbon bow; (6) a classical urn with a compact bouquet. Antique-gold outlines with a single emerald accent each, no gradients, no shadows, no text, generous margin around every object, consistent scale across the set.
```

---

## Swap-in style variants

Use these on any slot when you want a different register. Keep one style per section so the page stays coherent.

### Cinematic (any design)

```text
Cinematic film still, anamorphic 40mm, shallow depth of field, motivated golden-hour light, warm highlights and cool emerald shadows, gentle halation, 35mm grain, natural skin, quiet intimate framing, no direct flash.
```

### Ghibli-inspired (any design)

```text
Hand-painted animation background in the spirit of Studio Ghibli, gouache and watercolour, soft cel shading, painterly foliage, warm evening light, visible brush texture, gentle and nostalgic, faces simplified but faithful to the reference.
```

### Cartoon (any design)

```text
Warm storybook cartoon portrait, clean confident ink outlines, flat muted colour fills, paper grain, simple botanical background, limited palette, wholesome and affectionate, no shading gradients.
```

### Black-and-white editorial (any design)

```text
Large-format black-and-white editorial wedding portrait, soft window light, deep detailed shadows, fine grain, calm composition, honest skin texture, no flash, no fake film damage.
```

### Watercolour heirloom (any design)

```text
Fine-art watercolour on cold-pressed ivory paper, loose confident washes, pigment blooms left visible, luminous skin, restrained palette, generous unpainted margin, signed only by the brushwork.
```

### Vintage print (any design)

```text
Vintage medium-format wedding photograph scanned from a family album, warm sepia, soft highlight roll-off, gentle vignette, fine grain, a little dust, formal calm poses, no modern styling.
```

---

## Check before you publish

- Faces still look like the couple, and both wear glasses; the groom stays bald by choice, the bride keeps full dark hair.
- No generated text, dates, venue names or bank details anywhere in the artwork.
- The image works at the real crop: hero in a 4:5 arch, story in a tall portrait, closing in a small cameo (circle in Forest, print in Wine).
- File sizes stay reasonable (aim under ~400 KB per photo; export 1600–2000px on the long edge, quality ~82).
- Both languages and all four phone widths still pass: `INVITATION_DESIGN=forest` and `wine` with `node --test tests/invitation.test.cjs`.
- Rebuild `forest.zip` and `wine.zip` after adding files.
