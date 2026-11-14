# 29-Step Execution Roadmap

**Execution rule:** one step at a time. Open the matching prompt in `prompts/`. Do not run later steps automatically. Every step produces files, tests and a review report.

| # | Step | Output / exit gate |
|---:|---|---|
| 01 | Repository and runtime audit | Verified baseline, build status, risky files, no code rewrite |
| 02 | Product/assumption decisions | Confirm name, target users, initial lenses and non-goals |
| 03 | Dependency and environment audit | Reproducible frontend setup and safe env template |
| 04 | Architecture decisions | ADR for frontend, API, worker, storage and job lifecycle |
| 05 | Typed domain contracts | AOI, observation, readiness, job, result and evidence schemas |
| 06 | Source/API registry | Current official docs, exact service capabilities and integration approval list |
| 07 | ASF client | Server-side NISAR search with validated parameters and normalized response |
| 08 | Catalog normalization | Stable metadata/geometry normalization and robust tests |
| 09 | Topic-to-product routing | Lens map with truthful readiness statuses; no pretend processors |
| 10 | Data readiness engine | Product-specific candidate grouping and reason codes |
| 11 | Harmony feasibility spike | One supported variable extraction proven from official docs/sample data |
| 12 | Extraction adapter and job contract | Async extraction interface, state/status, safe retries and provenance |
| 13 | Python worker skeleton | FastAPI worker, config, job lifecycle and local execution |
| 14 | Raster validation/common geospatial utilities | CRS, transform, nodata, masks, windows and COG inspection |
| 15 | SME2 end-to-end processor | Real SME2 data layer, quality/uncertainty and evidence record |
| 16 | GCOV end-to-end processor | Calibrated backscatter layer and compatible temporal change |
| 17 | GUNW readiness/processor feasibility | Product metadata/quality review; implement only if data & method validated |
| 18 | GOFF readiness/processor feasibility | Offset/motion product review; implement only if data & method validated |
| 19 | Common result/evidence persistence | Reproducible results and source provenance |
| 20 | UI design system and app shell | Navigation, tokens, responsive shell and accessible controls |
| 21 | Discovery home and topic lenses | Explore entry points with Ready/Limited/Not supported state |
| 22 | Location/AOI search | Coordinates, map selection/drawing and date range |
| 23 | Data readiness UI | Observation availability, compatibility and limitations |
| 24 | Investigation workspace | Map, timeline, result summary, layer controls and details |
| 25 | Watchlists / My Places | User-owned or clearly local-only saved AOIs/topics |
| 26 | Report export / sharing | Evidence-backed report with sources, method and limitations |
| 27 | Optional context API integrations | Proposals and explicit approval before any provider is added |
| 28 | Security, resilience and performance hardening | RLS, secret scan, limits, error handling, benchmarks and licensing |
| 29 | Demo, deployment and final acceptance | Verified deployment/worker setup, fallback, demo story and release notes |

## Step acceptance rule

A step is complete only when: implementation (if applicable) is committed to the working tree, tests pass, actual command outputs are summarized, docs updated, known gaps listed and user decisions recorded. A compiled UI is not evidence that a scientific processor is correct.
