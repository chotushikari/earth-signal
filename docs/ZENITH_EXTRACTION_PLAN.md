# Zenith Extraction Plan

## Evidence reviewed

The public Team Zenith repository, its deployed landing page and deployed dashboard were reviewed on 2026-11-15. The dashboard exposes a coordinate query flow, product/date filters, a Cesium footprint globe, chronological observation list, pair selection, observation metadata, Earthdata asset links and QA/watchpoint panels. The local source copy was reviewed against that behavior.

## Reuse boundary

Earth Signal is a distinct product with a separate Git history and visual system. This plan extracts engineering mechanisms and public data-model ideas, not the Zenith identity, visual treatment, narrative copy, demos or scientific claims.

## Extract and adapt

| Zenith source | Earth Signal destination | Change required | Promotion gate |
|---|---|---|---|
| `catalog.js` WKT parsing and normalization | `services/discovery` | Add typed response contract, source mode, query provenance and unit tests | Malformed geometry and metadata fixture tests pass |
| `/api/asf-search` request shape | `/api/v1/discovery` | Strict AOI/date/product validation, server-only credentials, pagination, structured provider failures | A real ASF response is normalized and attributed |
| Coordinate query flow | Home then Explore Map | Validate coordinates, persist only after approved account/persistence work | Invalid/edge coordinate tests pass |
| Cesium footprint selection | Explore Map | Render only real normalized footprints; separate map adapter from UI | Real observation fixture renders with correct selection state |
| Timeline and A/B selection | Investigation workspace | Use compatibility engine rather than same-track/frame heuristic alone | Product-specific compatibility tests pass |
| Record details and asset links | Evidence inspector | Include source URL, product version/maturity, QA and processing provenance | Real normalized record has complete fields |
| QA summary viewer | Evidence panel | Treat an asset as evidence, not an automatic analysis verdict | QA schema and source retrieval are validated |

## Do not copy

| Zenith behavior | Reason | Earth Signal replacement |
|---|---|---|
| Hard-coded “verified” regional narratives and metric cards | They may be static or unverified and read as live findings | Source-labelled discovery results only |
| Browser browse-image change engine and procedural fallback | PNG luminance and generated images cannot be scientific measurement | Product-specific worker using calibrated variables and masks |
| Pairing based mainly on track/frame | It is insufficient compatibility evidence | Registry-driven compatibility with coverage, version, QA, channel and product requirements |
| Earthdata token `VITE_` fallback | It risks client exposure | Server-only secret configuration |
| Full asset buffering proxy | It risks memory/cost exhaustion | Bounded metadata/browse proxy and approved extraction workflow |
| Default seeded watchpoints and public inserts/deletes | It is not user ownership or monitoring | Authenticated, additive persistence later in Phase 5 |
| Zenith design language, logo, route naming and copy | Earth Signal must be original | Earth Signal operating workspace and product language |

## Home page implementation contract

The first functional Earth Signal page will consume a `DiscoverySummary` object with this shape:

```text
source: live | snapshot | unavailable
fetchedAt: ISO timestamp | null
sourceLabel: string
observationCount: number | null
dateRange: { start, end } | null
productFamilies: string[]
topicAvailability: TopicAvailability[]
warnings: string[]
```

The bundled ASF catalog snapshot currently has 153 records across GCOV, GOFF, GSLC, GUNW, RIFG, ROFF, RRSD, RSLC, RUNW and SME2, with acquisition times from 2026-06-18 to 2026-10-04. It can power the first functional reflection surface only when visibly labelled `Catalog snapshot`, including the source file date; it must never present itself as live coverage.

## Build sequence

1. Create the read-only discovery contract and snapshot adapter, with tests.
2. Build the Home page around that contract: source status, coordinate validation, product coverage, topic availability and clear unavailable/error states.
3. Harden the live ASF adapter before adding it as an optional source.
4. Reuse the map, timeline and metadata mechanics only after the adapter provides normalized real records.

## Known limits

The deployed Zenith dashboard demonstrates catalog navigation successfully, but its own UI showed a browse-preview proxy failure during review. The deployed interface and README also make data/science claims that Earth Signal will not adopt until the corresponding source, processing and validation records exist.
