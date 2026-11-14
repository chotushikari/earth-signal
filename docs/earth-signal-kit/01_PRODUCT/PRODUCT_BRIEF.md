# Product Brief — Earth Signal

**Working name:** Earth Signal (rename only by explicit user decision)  
**Category:** Earth observation discovery, change intelligence and location monitoring  
**Scientific foundation:** NASA–ISRO NISAR products and supporting geospatial context  
**Starting codebase:** Team Zenith — Dancing With the SARs

## 1. One-sentence goal

Help people discover, investigate and follow meaningful changes on Earth's surface by translating real NISAR radar observations into understandable, traceable geographic evidence.

## 2. Problem

NISAR data is scientifically rich but difficult for non-specialists to navigate. Finding a useful observation is not the same as knowing whether it can support a valid comparison, what measured variable changed, whether the change is reliable, or why someone should care. The product gap is between satellite data availability and usable, trustworthy understanding.

## 3. Product promise

**Discover what is changing on Earth. Understand the evidence. Follow places that matter.**

Earth Signal is not just a globe or image catalogue. It gives users a guided way to ask a question about a topic or location, find suitable observations, inspect evidence, understand limitations and save the investigation.

## 4. Target users and needs

| User | Need | Product value |
|---|---|---|
| Environmental researcher | Explore wetland/forest/land-surface observations | Product-aware discovery, temporal analysis, evidence provenance |
| Agricultural researcher/advisor | Examine soil-moisture conditions | SME2 values, uncertainty, date comparisons and spatial context |
| Geoscience researcher | Investigate ground motion | GUNW displacement-oriented view with quality checks |
| Cryosphere researcher | Inspect ice/glacier movement | GOFF offsets and quality-aware motion layers |
| Educator/student | Understand what radar observations show | Plain-language explanations, maps and source evidence |
| Local analyst/NGO | Explore changes in a location | Location-first discovery and contextual overlays where data is approved |

The first release is a research/educational decision-support tool. Do not market it as an operational emergency alert, agricultural prescription or regulatory monitoring system.

## 5. Discovery lenses

1. **Water & Wetlands** — inundation-related and wetland/surface change investigations using suitable GCOV evidence and contextual layers.
2. **Forests & Vegetation** — radar-response disturbance and temporal patterns; avoid direct claims of deforestation/fire cause without independent validation.
3. **Farms & Soil** — soil-moisture fields and changes using SME2, including valid masks and uncertainty.
4. **Ground Movement** — LOS displacement investigations using GUNW, with coherence and reference/quality requirements.
5. **Ice & Glaciers** — motion/offset investigations using GOFF where appropriate coverage and quality exist.
6. **Explore Any Area** — discover which NISAR products and analysis paths are actually available for a selected AOI.

A lens can be Ready, Limited or Not yet supported. A topic card must not imply a complete processor exists until the relevant pipeline has passed acceptance tests.

## 6. MVP definition

### Product MVP

- Discovery home with the six lenses.
- Curated regions whose source products have been verified.
- Search by place/coordinates and AOI selection/drawing if feasible.
- Live ASF search through a server-side client.
- NISAR data-readiness report: availability, product type, maturity, spatial coverage, dates and compatible pairs.
- Two fully demonstrated analysis workflows:
  - SME2 soil-moisture map/time comparison with uncertainty and quality handling.
  - GCOV calibrated backscatter temporal comparison with masks and explicit interpretation limits.
- Common investigation result card and evidence ledger.
- Map layers, timeline and before/after comparison.
- Save investigations/watchlist (with correct privacy controls).
- Export/share an evidence-backed report.

### Conditional/next-stage capabilities

- GUNW ground deformation workflow, enabled only after a real product pair and science validation are available.
- GOFF movement workflow, enabled only after a real product and quality handling are validated.
- Forest and water interpretations with contextual reference data and validation.
- Optional population, roads, protected areas, active-fire context or elevation overlays, each approved separately.

## 7. Non-goals for MVP

- Reprocessing raw Level-0/Level-1 satellite data into all NISAR science products.
- Global complete coverage or guaranteed fresh observations every 12 days.
- Predicting earthquakes, floods, fires, crop yields or disasters.
- Diagnosing exact causes from radar change alone.
- Replacing field verification or expert scientific interpretation.
- Building a generic AI chatbot as the main product.
- Downloading and hosting the entire NASA archive.
- Running arbitrary multi-gigabyte raster analysis inside Vercel functions.
- Claiming every lens is operational just because NISAR has a related product.

## 8. Product differentiators

1. **Data readiness before analysis:** clearly tell users whether an AOI and selected question have adequate, compatible observations.
2. **Product-aware analysis:** route each topic to the correct NISAR measurement and algorithm.
3. **Evidence-first results:** every map/statistic links back to source granules, dates, variables, units and processing.
4. **Plain language + scientific detail:** default accessible mode with a detailed scientist panel.
5. **Follow a place:** saved watchlists and new-observation discovery, not just one-time browsing.
6. **Honest uncertainty:** show masks, quality, uncertainty and alternative explanations; say when no conclusion is possible.

## 9. Success metrics

- User can find a region and see whether a requested analysis is feasible without understanding NISAR product codes.
- A valid SME2 result is reproducible from identified NASA inputs and saved parameters.
- A valid GCOV difference layer is computed from calibrated science inputs, not preview images.
- Every result has a complete evidence record.
- An unsupported/low-quality case fails safely and explains why.
- A first-time user can complete a guided investigation without reading API documentation.
- The demo clearly distinguishes live discovery, cached data, precomputed results and simulations.

## 10. Competitive position relative to Zenith

Zenith provides a strong technical starting point: globe, ASF search route, Earthdata asset proxy, catalog, timeline, observation details, browse display, SME2 static point layer, watchpoints and comparison UI. Earth Signal changes the central workflow from inspecting satellite granules to discovering and investigating a user's Earth-change question. We preserve working infrastructure, but replace scientifically invalid browse-image change calculations and improve security, processing, provenance and user journey.
