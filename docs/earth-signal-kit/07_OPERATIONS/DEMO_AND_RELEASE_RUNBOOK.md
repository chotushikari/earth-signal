# Demo and Release Runbook

## 1. Demo strategy

Show one product that is broad in discovery but deep in verified science.

Suggested narrative:
1. Open Earth Signal and show topic discovery.
2. Select Farms & Soil or Water & Wetlands.
3. Search a pre-verified region.
4. Show the live ASF discovery result and maturity/coverage metadata.
5. Open the Data Readiness report.
6. Run or load a real, precomputed SME2/GCOV result.
7. Explain the measured layer, time interval, unit and quality mask.
8. Open the Evidence drawer and show exact source granule IDs and processing method.
9. Move the timeline and show the observation history.
10. Save the area and export a report.

Do not start the demo with a code walkthrough or a globe spin. Start with the user question and show how the evidence answers it.

## 2. Demo data labelling

Every item must be labelled as one of:
- `LIVE SOURCE METADATA` — fetched from NASA during the session.
- `CACHED SOURCE METADATA` — previously fetched, with fetched-at timestamp.
- `PRECOMPUTED REAL ANALYSIS` — computed from real source data earlier, with original granules and processing timestamp.
- `SIMULATED UI DATA` — synthetic fixture, never presented as a NASA observation.

## 3. Pre-demo checklist

- Confirm frontend deployment and route health.
- Confirm NASA auth is configured server-side, if needed.
- Run live ASF query for demo AOI.
- Verify at least one extraction/result artifact is accessible.
- Validate the source granule IDs and maturity.
- Verify result map coordinates/CRS.
- Confirm evidence panel opens.
- Confirm local precomputed fallback is labelled honestly.
- Check no secret appears in browser network logs, source maps or console.
- Check free-tier quota and map-provider terms.
- Prepare static screenshots/video only as fallback; label pre-recorded content if used.

## 4. Failure fallback

If ASF is down: show cached metadata with original fetch date and a visible stale label.
If Harmony is unavailable: show a precomputed real analysis artifact with the original source granules, and say it was precomputed. Do not imply it just ran.
If local worker fails: show error ID and switch to verified precomputed output, not synthetic science.
If map imagery fails: retain the map with a documented fallback basemap or simple footprint view.

## 5. Release notes template

- Release/version:
- Date:
- Supported lenses:
- New analysis processors:
- Data maturity covered:
- Source services:
- Known limitations:
- API/provider terms checked on:
- Tests run:
- Known bugs:
- Rollback plan:
