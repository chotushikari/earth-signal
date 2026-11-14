# UX / UI Specification — Earth Signal

## 1. Experience principles

- Start with what a user wants to discover, not product abbreviations.
- Explain data availability before asking the user to wait for analysis.
- Keep one primary action per screen.
- Map and timeline should be synchronized, but the map must not overwhelm the evidence explanation.
- Show plain-language summary first; technical metadata is one click away.
- Every measurement must have source, date, unit, quality and limitation.
- Make live, cached, precomputed, sample and simulated data visually distinct.
- No fake telemetry, fake activity feeds, fake coverage badges or invented statistics.

## 2. Primary navigation

1. **Discover** — topics, curated investigations, recently explored locations.
2. **Map** — global/region map and AOI search.
3. **My Places** — saved locations and watchlists (requires a privacy-aware storage choice).
4. **Methodology** — what NISAR measures, product readiness and how each analysis works.

Keep account/settings actions separate from the core flow.

## 3. Discovery home screen

### Header
- Brand: Earth Signal.
- Main navigation.
- Search input: "Search a place, coordinates or region".
- Optional account/watchlist entry.

### Hero
- Headline: "Discover what is changing on Earth."
- Short explanation of NISAR radar observations.
- Primary CTA: "Explore the Earth".
- Secondary CTA: "How the evidence works".

### Discovery lens cards
- Water & Wetlands.
- Forests & Vegetation.
- Farms & Soil.
- Ground Movement.
- Ice & Glaciers.
- Explore Any Area.

Each card includes: user question, what can be measured, supported NISAR product(s), readiness state, and a clear CTA. Readiness states: Ready / Limited / Not yet supported.

### Curated discoveries
Only show stories generated from verified source granules and processing outputs. Include location, date(s), product maturity and one-sentence reason to explore. Do not fabricate headlines such as "rapidly disappearing" without computed evidence.

## 4. Core user journeys

### Journey A — Discover by topic
1. User selects a lens.
2. User sees an explanation of what the radar product can and cannot measure.
3. User searches or chooses a curated AOI.
4. System searches ASF and returns observations.
5. Data Readiness screen explains what is available and whether analysis is possible.
6. User selects a compatible time series/pair.
7. Analysis job runs or a verified precomputed result is loaded.
8. Result workspace displays summary, map, timeline, evidence and limitations.
9. User saves or exports the investigation.

### Journey B — Discover by location
1. User searches a place/coordinates or draws AOI.
2. System resolves/validates the AOI (geocoding is a separate optional API requiring approval; coordinate and map-draw paths must work without it).
3. ASF search discovers intersecting NISAR granules.
4. System groups results by product and dates.
5. Readiness report shows available investigations by lens.
6. User opens a supported lens.

### Journey C — Open a curated discovery
1. User opens a curated item.
2. UI identifies it as precomputed/verified and shows observation dates.
3. User inspects the result and evidence.
4. User can replay the investigation or create a copy with a different AOI/date range where supported.

### Journey D — Save and revisit a place
1. User saves an AOI and selected topics.
2. App stores it under an authenticated account if auth is approved, otherwise explicitly as browser-local data.
3. User revisits My Places.
4. App checks for new relevant observations when requested or on an approved schedule.
5. New data is labelled "new observation available", never "new disaster detected" without analysis.

## 5. Screen specifications

### Screen 1: Discover
- Cards for each lens.
- Search entry point.
- Curated regions/stories with freshness labels.
- Intro explaining radar works day/night and through clouds, but does not make every variable observable.
- Empty state if no verified stories are prepared.

### Screen 2: Topic landing
- Plain-language problem statement.
- "What NISAR can measure" and "What it cannot prove".
- Supported products and analysis readiness.
- AOI search/map preview.
- Example result only if clearly labelled as real verified or illustrative.

### Screen 3: Location/AOI selection
- Search by coordinates and place text.
- Map click/draw polygon.
- AOI size validation and simplification limits.
- Date range.
- Search button.
- No geocoding provider unless approved.

### Screen 4: Data readiness
- Observation count by product and maturity.
- Footprint coverage preview.
- Acquisition dates.
- Candidate pair/time-series groups.
- Compatibility result and reason codes.
- Required variables and QA layers.
- Clear next action or "not enough data" message.

### Screen 5: Investigation workspace
- Summary card: measured change, unit, time interval, valid coverage, data-quality status.
- Main map: selected layer and AOI boundary.
- Date/timeline control.
- Before/after or time-series view.
- Layer control.
- Evidence drawer: products, granule IDs, DOI/URLs, variables, processing and QA.
- Methodology drawer: formulas, parameters, limitations and interpretation.
- Export/save actions.

### Screen 6: My Places
- Saved AOIs.
- Topics followed.
- Last checked date.
- New source observation availability.
- Open investigation / remove saved place.
- No notifications unless a provider/cadence has been approved.

## 6. Common UI states

Every network- or science-dependent screen must include:
- Initial/idle.
- Loading with actual stage description.
- Success.
- Partial coverage.
- No data.
- Unsupported product/analysis.
- Incompatible observations.
- Low-quality or invalid result.
- NASA/API unavailable.
- Cached data available (show original acquisition date and cache timestamp).
- Authentication missing/expired.
- Analysis failed with a traceable error ID.

## 7. Visual system direction

- Use a restrained geospatial editorial aesthetic: deep neutral map workspace, light readable content panels, strong typography and accessible contrast.
- Use a consistent semantic palette for measured layers; document meaning and avoid using color alone.
- Design mobile and desktop states deliberately. The investigation workspace can prioritize desktop, but discovery and reports should remain responsive.
- Use a map-first layout only after the AOI is selected. The Discover page should be content-first.
- Reuse Zenith's Cesium globe where useful, but reduce decorative visual noise and remove fake orbit telemetry.

## 8. Accessibility and usability

- Keyboard-accessible controls and visible focus states.
- Text labels for all map symbology.
- Do not encode readiness only by color.
- Respect reduced motion.
- Provide textual table/list alternative to map-only findings.
- Use plain language; technical acronyms receive inline explanations.
- Validate responsive layout, loading/error states and contrast before release.
