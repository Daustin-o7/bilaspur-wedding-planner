# Invitation session memory

- Apply every requested enhancement to **both** `forest/` and `wine/`, unless the user explicitly limits its scope.
- Keep the designs visibly distinct: **Forest** is emerald/gold, arched, botanical heirloom stationery; **Wine** is champagne/burgundy, rectangular, serif-led and spacious.
- Both are standalone, bilingual English/Hindi invitations with a 430px maximum reading frame. Shared scripts/styles are mirrored into both folders; preserve design-specific HTML. Each cover shows its own name (FOREST / WINE).
- The current names, photos, dates, venue notes and RSVP setup are in each `settings.js`. Do not invent confirmed dates or bookings.
- Context and reference findings: `DESIGN_NOTES.md`. Preview, editing, publishing and checks: `README.md`. Image-generation prompts for every section: `IMAGE_PROMPTS.md`.
- Source artwork and the supplied image packs live in `image-pack/` (one merged folder, with `source/hand-pic.jpeg` for the gallery ring photo); superseded drafts are in `archive/`. Do not re-add a second `Kamishi_Anuragh_*` folder.
- Check both designs with `INVITATION_DESIGN=forest` / `wine` and `node --test tests/invitation.test.cjs`; refresh both upload ZIPs after changes.
