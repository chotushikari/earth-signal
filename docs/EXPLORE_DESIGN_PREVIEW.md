# Explore design preview

## Overview

Local preview at http://127.0.0.1:5173/explore, extended alongside Home from the user's pinned reference. A shared dark header across all routes frames light search and evidence panels around a dominant satellite map. This boundary document records the implemented preview without changing `DESIGN.md` or `.impeccable/design.json`, repairing preexisting drift, or promoting surface decisions into global rules. The detector's 56 advisories contain no mandatory findings for this pinned preview. No deployment, push or Supabase change is included. `EVIDENCE_PIPELINE.md` is the source of truth for the connected workflow.

## Layout

Desktop uses a three-column search/map/inspector arrangement with independently scrolling panel content and persistent search action. Below 850px the search panel, 520px map and inspector stack in that order. Light paper surfaces, restrained borders and forest-green selection states preserve legibility around the map.

## Components

Search supports latitude/longitude and four case-insensitive exact suggested names: Vembanad Lake, Kerala; Sundarbans Delta; Pine Island Glacier; North Dakota Farmlands. It is not a general geocoder. Draw Area accepts two opposite map corners or west/south/east/north bounds; validated rectangles must fit within 5° per side. Search submits the rectangle's WKT polygon, or the selected point, with optional product and date filters.

Live ASF metadata queries are capped at 80 records. Topic selection sets a product filter; it does not execute a science workflow. The source selector explicitly offers a bundled reference snapshot, labelled as a reference dataset rather than local coverage. An unavailable live request remains an error rather than silently switching sources.

The separate `CatalogMap` displays geographic satellite context and actual normalized catalogue footprint geometry on Cesium's WGS84 ellipsoid, with one camera owner and no terrain exaggeration or injected SAR examples. Map mode frames a local overhead view; Globe mode frames the whole Earth at the requested coordinates. Natural Earth provides a local fallback beneath attributed satellite layers. Zoom, recenter, footprint/layer toggles, acquisition timeline, acquisition selection and source-evidence navigation operate on returned metadata. Counts, dates and product families derive from those records; basemap imagery is not a computed change layer.

The workflow now preserves point or rectangular AOI, dates, product and source mode into readiness and record inspection. Readiness checks products with the same area/date filters and cap of 80 per product. A bounded dataset envelope retains source records, query and fetch timestamp in session storage; URL filters can reconstruct a missing live envelope by refetching, which may return newer results. It is not an immutable cloud archive.

Records provides a source table, map focus, filtering, search export and two-record selection. Conservative pair screening requires distinct dates, valid geometry and matching known product, track, frame, orbit direction, sensor, polarization, source configuration and processing version. Missing fields produce a limited result. A passing result is labelled **metadata candidate**, not scientifically compatible. Investigation displays official NASA browse previews through the server-side Earthdata proxy with loading/unavailable/ready states; source metadata remains available if browse access fails. Browse display values never become calibrated measurements. Common valid pixels, grid registration, calibration and QA remain unverified; measurements, confidence and change overlays are withheld.

Save location retains custom places in this browser's localStorage and shows them in My Earth. Manual GCOV checks on saved places can open their records; background alerts are not enabled. Investigations can save up to ten evidence records, including the selected source records, in this browser. Reports offer manifest JSON export and print/Save PDF with explicit processing limits. These saves do not imply cloud synchronization.

Map mode changes, recenter and location focus now use immediate camera positioning rather than animated flights. CSS panel entrances and control transitions respect reduced motion. Controls expose selection state, focus and loading/error/empty states; the footprint checkbox accessibility fix requested by review remains resolved.

## Review evidence

Captures: `.impeccable/review/explore-design-desktop.png` and `.impeccable/review/explore-design-mobile.png`. The updated pipeline received an initial **Ship** verdict. Its two named checks have been addressed: numeric coordinates now appear in query context and saved titles, and refreshed readiness screenshots wait for settled status. The final reviewer scored both named changes resolved and returned **Ship**; the verdict does not establish scientific validation. No deployment is included.

Reported verification: `npm run verify` passed, including workflow checks; `npm run test:ui` passed all nine tests in 46.6 seconds. The final workflow rerun passed both tests in 18.4 seconds, and the final production build passed with only Vite's chunk-size warning above 500 kB. Browser workflow tests use explicit fixtures for deterministic integration; separate live journeys retain actual ASF provenance. This update inspected `CatalogMap.jsx`, `workflow.js`, `EvidenceWorkspace.jsx`, `ReadinessPage.jsx` and `SavedObservationChecks.jsx` against `EVIDENCE_PIPELINE.md`. Home behavior is documented in `HOME_DESIGN_PREVIEW.md`. The older frontend-shell description in `PRODUCT.md` remains preserved rather than silently rewritten.
