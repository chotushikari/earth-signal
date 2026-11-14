# Zenith Source Baseline — Verified Starting Point

**Repository:** https://github.com/nabil24024004/Team-Zenith-Dancing-With-SARs  
**Inspected by:** source-level review of README and selected source files via GitHub repository file access.  
**Important:** this is a source review snapshot, not a live end-to-end production verification. Reinspect the current repository before making changes.

## What exists in the repository

- React 18 + Vite 5 application using JavaScript, Tailwind, Framer Motion and Lucide.
- CesiumJS/Three.js globe experience.
- `api/asf-search.js`: calls ASF Search API using `platform`, optional processing level, `intersectsWith`, dates and result limit. Returns live results when ASF succeeds; on failure it may retrieve a cached query object from Supabase Storage. It also attempts background persistence of query JSON and normalized metadata to Supabase; persistence errors are caught/ignored.
- `api/earthdata-asset.js`: allows selected NASA Earthdata hosts, attaches server environment Bearer token, checks a Supabase Storage cache for certain small companion assets and fetches from upstream otherwise. It reads full upstream response into a Buffer via `arrayBuffer()`. It does not implement proper upstream Range forwarding in the inspected version. Only selected extensions are cached when under 12 MB; HDF5 is not in that cache allowlist.
- `api/watchpoints.js`: Supabase CRUD with local default fallback. The inspected SQL allows public select/insert/delete for watchpoints. POST/DELETE fetch responses are not checked before proceeding to return refreshed/default data.
- `resources/asf-results-2026-10-08_23-06-00.json`: README identifies it as a 153-granule local catalog snapshot.
- `src/features/explorer/ExplorerPage.jsx`: imports the baseline JSON and injects a synthesized SME2 record from `sme2Data.js`; supports live point-based ASF queries and fallback to the baseline; selects comparison pairs and invokes the browser change engine.
- `src/features/explorer/catalog.js`: normalizes ASF records, WKT footprints, dates, product-level labels and candidate repeat-pass grouping. Candidate grouping is not a complete scientific compatibility test.
- `CatalogTimeline.jsx`, `CatalogFilters.jsx`, `RecordDetails.jsx`: timeline/filter/detail inspector; details can access browse and QA companion assets.
- `GlobeViewer.jsx`: Cesium scene; inspected source references Natural Earth fallback, Cesium ion imagery/terrain if token exists, and Esri imagery/labels as fallback/reference layers. Confirm terms and current token configuration.
- `sme2Data.js`: embeds a large extracted point array for an SME2 granule. It records stats min `0.02`, max about `0.41265`, mean about `0.120895`, units `m^3/m^3`.
- `README.md` claims 561 pixels and stats min `0.088`, mean `0.214`, max `0.349`; these do not match the `sme2Data.js` stats inspected. Treat the inconsistency as a data-provenance blocker. Re-extract/recompute from source HDF5 before using the dataset as a verified benchmark.
- `sarChangeEngine.js`: browser canvas pipeline. It loads browse imagery or procedural synthetic imagery, turns RGB luminance into assumed intensity and then uses an invented mapping to assumed dB values before Otsu thresholding and water classes. This is not calibrated science processing. It must not be used as evidence for real NISAR change.
- `supabase/schema.sql`: includes `drop table if exists public.nisar_granules cascade` and `drop extension if exists postgis cascade`; do not rerun as a production migration. Watchpoint public write/delete policies are not suitable for private user watchlists.
- `package.json`: no Python science backend is present.

## What appears live vs static

| Capability | Source mechanism | Interpretation |
|---|---|---|
| ASF metadata search | Browser calls app API; API calls ASF | Live when upstream succeeds |
| ASF cache fallback | Supabase Storage object | Cached metadata, not live |
| Baseline catalog | JSON bundled in repository | Static snapshot |
| SME2 points | JavaScript data file | Pre-extracted static data |
| Browse/QA assets | Earthdata proxy and optional Supabase cache | Live fetch or cached companion asset |
| HDF5 access | Proxy reads full body into memory | Asset retrieval path, not efficient large-file processing |
| Watchpoints | Supabase if configured; defaults otherwise | DB-backed or local fallback; verify writes |
| Change result | Browse RGB/synthetic canvas | Not valid calibrated measurement |

## First code review blockers

1. Quarantine `sarChangeEngine.js` from real science results.
2. Resolve SME2 stats/provenance mismatch.
3. Remove any client-exposed token fallback (`VITE_EARTHDATA_TOKEN`) and ensure secrets remain server-side.
4. Harden asset proxy with host allowlist, file-size bounds, timeouts and no arbitrary URL proxying.
5. Replace destructive Supabase schema operations with versioned migrations.
6. Replace public watchpoint write/delete with owner-based RLS and test it.
7. Ensure failed database writes are returned as failures.
8. Add data source/cache labels to the UI.
9. Audit ArcGIS/Cesium/CARTO/basemap terms and attribution.
10. Benchmark Harmony extraction and CPU processing before buying or provisioning compute.

## Codex instruction

Reopen the current source files and verify this baseline. The repository may have changed since review. Never copy a flaw forward just because it already exists.
