# Earth Signal verification

Run from `D:\EARTH SIGNAL\earth-signal` (prefix with `rtk` in this workspace).

```powershell
npm ci
npm run verify
npm run test:ui
npm run test:live -- https://earth-signal-seven.vercel.app
```

- `verify`: API validation, upstream errors, credential redaction, redirect restrictions, no credential forwarding to CDN, asset limits, disabled public writes, coordinate validation, catalog summary, readiness truth boundary, tracked secret scan and production build.
- `test:ui`: actual Chromium journeys for Discover, visible animation pause, source navigation, mobile overflow/drawer, local saved-place persistence, report preview, comparison slider, readiness empty state, live catalog and exact observation evidence page. Uses installed Chrome/Edge on Windows; elsewhere install a Playwright Chromium browser using `npx playwright install chromium`. Screenshots go to `.impeccable/review/`.
- `test:live`: production configuration health, real ASF GCOV search, exact granule lookup, actual NASA browse thumbnail through the bounded proxy when configured, invalid coordinate rejection, and blocked unauthenticated watchpoint writes. External provider failures intentionally fail the check.

Manual account check: open `/my-earth`, create/confirm your account, sign in, save a place, add local saves to cloud, and merge them from another signed-in browser. No confirmation emails are automatically sent by the tests. Prior database transaction verification confirmed owner visibility and cross-user isolation, rolling back fixtures.

Test scope is explicit: these checks do not certify scientific processing. GCOV/SME2 extraction, pixel quality masks, calibrated change measurement, background monitoring and scientific reports remain pending the validated worker pipeline. Demonstration analysis and report pages retain visible labels.

Visual system: the latest user reference supplies a dark forest navigation bar across routes, a dark image-led Discover page with real rotating globe, and light map/evidence/account/report workspaces. Topic cards use generated editorial artwork with a visible label; observation footprints, acquisition metadata and evidence exports use ASF source records.

Dependency note: the inherited Vite 5 development toolchain still has audit findings requiring a major-version upgrade. Nonbreaking dependency fixes were applied previously. Keep development servers bound to loopback; schedule a separate Vite/plugin upgrade with regression tests before exposing development infrastructure.
