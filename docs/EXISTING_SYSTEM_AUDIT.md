# Existing System Audit

## Scope and conclusion

Earth Signal currently has two layers: an active React/Vite product shell and a retained Team Zenith explorer. The shell is an honest frontend foundation. The explorer contains useful discovery infrastructure but also contains demo-only and unsafe paths that must not be presented as validated scientific analysis. V2 will reuse adapters and metadata UI selectively, behind explicit data-source and science gates.

## Current structure

| Area | Current implementation | Assessment |
|---|---|---|
| Application shell | `src/App.jsx` with a small History API router; `AppShell.jsx`; dedicated discovery, explore, investigation, account, report and methodology pages | Active; usable frontend foundation |
| Legacy explorer | `src/features/explorer/ExplorerPage.jsx` and Cesium viewer components | Retained but not routed by the active shell |
| Catalog | `catalog.js` normalizes ASF-shaped records, WKT polygons and simple date/type filters | Reusable after unit tests and stricter contracts |
| Map | Cesium globe, footprint entities, static SME2 point layer and imagery support | Reusable as an adapter; requires availability, licensing and token review |
| Data APIs | Vercel-style ASF search, Earthdata asset proxy, Supabase watchpoint route | Exists; needs security and provenance hardening |
| Database | One destructive `supabase/schema.sql` defining granules and watchpoints | Not safe for deployment or migration use |
| Science | Browser browse-image comparison, static SME2 sample points, local Python output artifacts | Demo/reference only; not production science |

## Working functionality retained

- React 18, Vite 5, Cesium, Lucide and Vercel SPA configuration build successfully.
- `api/asf-search.js` calls ASF's parameter-search endpoint with bounded `maxResults` and can pass a server-side Earthdata bearer token.
- `api/earthdata-asset.js` checks an HTTPS allowlist before proxying selected NASA asset hosts.
- `catalog.js` handles common NISAR metadata normalization, WKT footprints, date filtering and a preliminary repeat-pass partner heuristic.
- Legacy Cesium and timeline/detail components provide useful interaction patterns for a later map workspace and evidence inspector.
- `resources/asf-results-2026-10-08_23-06-00.json` provides a static catalog snapshot. It is not live discovery.

## Live, static and demo boundaries

| Capability | State | Required label or restriction |
|---|---|---|
| ASF search endpoint | Potentially live when deployed with a server token | Show provider, query time and failure state |
| Earthdata asset proxy | Potentially live when a server token exists | Metadata/browse use only until bounded range or extraction design is implemented |
| Catalog JSON | Static snapshot | Always display `Static catalog snapshot` and source date |
| SME2 point dataset | Embedded sample | Fixture or demo only until verified against a source granule |
| `sarChangeEngine.js` | Procedural fallback and browse-image calculation | Quarantine; never emit a scientific result |
| `outputs/` and `nisar_area3/outputs/` | Local artifacts with no result record | Reference materials only; no product result claims |
| Watchpoint defaults | Hard-coded example records | Demo-only; never label as active monitoring |

## Authentication and database

The frontend public configuration is limited to Cesium and Supabase anonymous values. Server routes currently fall back to `VITE_EARTHDATA_TOKEN` and `VITE_SUPABASE_ANON_KEY`; V2 must remove these unsafe server fallbacks. The existing SQL drops a table and PostGIS extension, and grants public select/insert/delete policies on watchpoints. It is unsuitable for an existing project and will be replaced only by additive, versioned migrations after authentication and ownership rules are approved.

## Scientific limitations

- The legacy SAR engine derives a pseudo-dB product from PNG/browse image luminance and can generate procedural imagery on fetch failure. This is not calibrated GCOV, GUNW, GOFF or SME2 processing.
- The preliminary compatibility heuristic is useful for discovery but does not fully test product version/maturity, valid coverage, geometry, channel, QA or product-specific requirements.
- GUNW output artifacts cannot be promoted without documented variable paths, LOS semantics, masks, coherence/quality interpretation, reference strategy and independent validation.
- No active worker, Harmony extraction adapter, reproducible analysis record, schema migration set, automated test suite, or verified real-data processor exists.

## Security concerns

1. `VITE_` token and service/anonymous-key fallbacks must be removed from server credential resolution.
2. `watchpoints.js` seeds sample data and permits unauthenticated writes/deletes when Supabase is configured.
3. `schema.sql` performs destructive DDL and public write policies.
4. Asset proxy fetches full response bodies into memory and lacks content-length/range safeguards.
5. Search caching uses public Supabase object paths with no explicit provenance, TTL record or failure audit.

## Retain, replace and quarantine

Retain the React/Vite/Cesium foundation, catalog normalization concepts, source metadata panels and server-side adapter boundary. Replace the router navigation, input contracts, data-readiness model, persistence model, API validation, credential resolution and evidence model incrementally. Quarantine `sarChangeEngine.js`, `SyntheticPreview.jsx`, seeded watchpoints and local output claims from every real-data route.

## Phase 0 exit criteria

V2 begins on branch `earth-signal-v2`. No source behavior or database object has been removed. The next phase may build shared contracts and navigation, but live search, persistence, map layers and science results remain disabled until their named gates pass.
