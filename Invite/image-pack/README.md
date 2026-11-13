# Kamishi & Anuragh — Refined Wedding Invitation Asset Pack

This package rebuilds the image-asset drop-in according to `IMAGE_PROMPTS.md`, with the expanded identity-lock and output-control rules in `IMAGE_PROMPTS_REFINED.md`.

## Design themes

- **Forest:** emerald, sage, antique gold and warm ivory; cinematic film, painterly garden and warm storybook treatments.
- **Wine:** burgundy, champagne gold and cream; editorial portrait, watercolour and art-deco/monochrome treatments.

## Included structure

- `forest/assets/` and `wine/assets/`: six core photo slots (hero, story, closing), three optional gallery treatments, church watermark, toile tile, monogram and matching ornament SVG/PNG assets.
- `project-integration/`: minimal `photos` snippets to merge into the existing `settings.js` files.
- `reference/`: original identity photo and generated source boards used to extract the portraits.
- `previews/`: six-slot overview.
- `qa/`: dimensions, SVG checks, checksums and validation report.
- `IMAGE_PROMPTS.md`: original source instructions, unchanged.
- `IMAGE_PROMPTS_REFINED.md`: expanded, ready-to-paste single-image prompts for all 12 photo slots.

## Source and generation limitation — read before publishing

The image-generation service repeatedly returned composite boards even when each refined request explicitly required one standalone image, one scene and no collage. To avoid inventing a false claim, this package **does not describe these as 12 independent image generations**. The six core photographs are cleanly cropped from the newly generated theme-matched boards. The optional gallery files are derivative image treatments from those core scenes (including a designed champagne still life and line-art effect), not six separate new photographic events. The original reference photo is preserved separately and was used as the identity anchor in the generation request context.

The crops have been placed at the exact dimensions required by the source `.md`, but some slots were upscaled from the generator's board resolution. They are suitable for web layout review and provisional invitation assembly; inspect faces, hands, skin texture and actual responsive crops before printing. For print-critical fidelity, regenerate each slot individually in an image service that honours standalone aspect-ratio requests, using the ready-to-paste prompts.

## Main photo slots

| Theme | Slot | File | Required dimensions |
|---|---|---|---:|
| Forest | Hero / cover / keepsake | `forest/assets/hero-portrait.jpg` | 1600 × 2000 (4:5) |
| Forest | Story | `forest/assets/story-portrait.jpg` | 1200 × 1800 (2:3) |
| Forest | Closing / companion | `forest/assets/closing-portrait.jpg` | 1200 × 1500 (4:5) |
| Wine | Hero / cover | `wine/assets/hero-portrait.jpg` | 1600 × 2000 (4:5) |
| Wine | Story | `wine/assets/story-portrait.jpg` | 1200 × 1800 (2:3) |
| Wine | Closing / companion | `wine/assets/closing-portrait.jpg` | 1200 × 1500 (4:5) |

## Gallery extras

- Forest: `gallery-candid.jpg` (2:3), `gallery-watercolour.jpg` (1:1), `gallery-sepia.jpg` (2:3).
- Wine: `gallery-noir.jpg` (2:3), `gallery-detail.jpg` (1:1), `gallery-line.jpg` (2:3).

These are optional, matching the extra prompts at the end of each theme in the original `.md`. Some are derivative treatments; see the manifest for their exact source notes.

## Vector artwork

Each theme contains:

- `assets/church-cover.svg` + `.png`
- `assets/toile.svg` + `.png`
- `assets/monogram.svg` + `.png`
- `assets/ornaments/`: swans, rings, locket, ribbon, toast-tower, flower-urn and drapery, each as SVG and transparent PNG.

## Integration

1. Unzip beside the original invitation application.
2. Merge the contents of `forest/assets/` into the original `forest/assets/` folder and `wine/assets/` into `wine/assets/`.
3. Merge the `photos` object from `project-integration/forest-photos.settings.snippet.js` or `wine-photos.settings.snippet.js` into the corresponding existing settings file. **Do not replace the entire settings file.**
4. Keep the crop positions from the source file where relevant: hero `object-position: 48% 30%`; closing `object-position: 48% 28%`.
5. Use the original project test commands after integration: `INVITATION_DESIGN=forest node --test tests/invitation.test.cjs` and `INVITATION_DESIGN=wine node --test tests/invitation.test.cjs`.
6. Rebuild both app ZIPs using the original project's build process.

## Application source boundary

The original invitation application source ZIP/folder was not attached in the current task inputs. Therefore this deliverable is the **complete asset drop-in package**, not a rebuilt full web application. No `forest/` or `wine/` app HTML/JS/CSS has been invented or overwritten.
