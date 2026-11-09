# Bilaspur Wedding Family Planner

A collaborative planning website for Mandapam Marriage Resort pre-events and stay, the CNI Civil Lines church ceremony, and the CPI reception.

## Use it

Open the published website. The owner follows [Google setup](site/SETUP.html), connects the Apps Script deployment, then shares the **private family edit link**. Relatives edit through the website. The plain public URL contains a blank planning template, not the private wedding records.

- 674 editable tasks, including 27 bilingual three-venue operations additions.
- Family roles, deadlines, blockers, not-applicable tasks and coordinator summary.
- INR budget/payment ledger, vendor notes, receipt uploads and overpayment flags.
- Bride/groom/common invitation lists; separate household, travel, stay and event catering counts.
- Optional functions, dated IST calendar events, games, run sheets and backup matrix.
- Local drafts, JSON backup/restore, CSV exports and current-tab printing.
- Authenticated Google storage, ten-second active-tab polling, acknowledged saves, three-way merges and explicit same-field conflict resolution.

See [Planning review](PLANNING_REVIEW.md) for the operational recommendations. Source wedding documents and the original prototype are preserved locally and excluded from publication.

## Development

Node.js 22 or later:

```sh
npm ci
npm run build
npm test
npm run test:browser
```

Browser tests use installed Chrome on Windows; on Linux run `npx playwright install --with-deps chromium` first. For local use, run `node tests/server.cjs` and open `http://127.0.0.1:4173`.

`site/` is the Pages root. `apps-script/Code.gs` is the backend. Build copies `site/core.js` into `apps-script/Core.gs` and publishes text copies of all three Google setup files under `site/google-setup/`. Edit the shared validator only in `site/core.js`.

The Pages workflow builds, runs unit/backend/browser checks, and deploys only `site/`. No family key, account credential, guest data or Google deployment secret belongs in this repository.

## Storage behavior and limits

Apps Script executes as the owner. All record actions require a 64-character capability key. Requests use POST, not public JSONP. The family link supplies its key in the URL fragment, which is removed from the address bar after import; the browser remembers the connection locally.

The private Sheet holds lock-protected, versioned, double-buffered JSON snapshots. Writes commit the inactive snapshot before updating the header. Report tabs are generated views, not a second editing interface. Drive receives private receipts and backups; Calendar publishing targets a separate wedding calendar.

This is near-real-time polling, not a push service. Browser edits commit on change/blur; polling pauses during editing, open dialogs and hidden tabs. Independent records/fields merge; colliding values or delete-versus-edit changes require a choice. Concurrent edits to the priorities list can conflict as one list. Duplicate household/event attendance introduced concurrently is flagged and excluded from catering totals until resolved.

The workspace limit is 2 million serialized JSON characters, 100 events and 5 MB per receipt. Google quotas and browser storage limits apply. Keep dated JSON backups and final printed sheets. This site caches drafts but does not install an offline application shell: load the page while online before editing offline.

Tests cover local CRUD/reload, Hindi names, money, IST dates, malformed backups/XSS, mobile layout/print, two simulated clients, same-field/CAS conflicts, delayed reads, authentication and failed storage writes. Live Google authorization, CORS redirects, sharing and quotas must be checked against the owner’s deployed project; local mocks cannot establish that connection.
