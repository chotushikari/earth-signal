# Earth Signal frontend implementation

## Delivered surface

The frontend is a modular, responsive, dark scientific workspace built around discovery and evidence rather than an operations dashboard. It provides:

- Discovery home redesigned as a scientific intake desk: decimal-coordinate validation, bundled-catalog provenance, a product-family strip, and a needs-location question register.
- Shared topic pages for water, ground movement, forests, farms, ice, and the exploration map.
- Map/AOI shell with coordinate entry and visible data-layer availability.
- A six-step investigation shell, readiness checks, scientific details, and a report outline.
- Local-only "My Earth" empty states for saved places, investigations, and observations.
- Evidence-report and methodology pages that clearly distinguish structure from generated results.

## Route map

| Route | Purpose |
|---|---|
| `/` or `/discover` | Discovery home |
| `/topics/:id` | Topic-specific discovery and data status |
| `/explore` | AOI/map shell |
| `/investigate/:id` | Investigation workflow shell |
| `/my-earth` | Local workspace states |
| `/reports/:id` | Evidence report structure |
| `/methodology` | Products, sources, and limitations |

## Reusable building blocks

`src/components/ui.jsx` centralizes the brand, buttons, status labels, headings, search control, empty states, notices, and mobile drawer. `src/components/AppShell.jsx` owns the primary navigation, global search, mobile navigation, and footer. Topic configuration lives in `src/data/topics.js`; every topic page reads the same status and limitations metadata.

The Home route is intentionally self-contained in `src/features/discovery/`: `HomePage.jsx` composes the intake surface; `CoordinateForm.jsx` validates decimal latitude/longitude before handing off to Explore; `SourceStatus.jsx` identifies the bundled catalog snapshot; and `TopicReadinessList.jsx` keeps every topic at the truthful “Needs location” state. `home.css` and `home-interactions.css` hold its responsive, reduced-motion-aware presentation. Coordinate parsing and range validation live in `src/services/discovery/coordinates.js` and are covered by `tests/coordinates.test.mjs`.

## Current capability boundary

This sprint intentionally does **not** claim that Earth Signal has a live NISAR catalogue, scientific processing, a connected map, account persistence, saved observations, downloadable reports, or verified curated regions. Home uses a visible bundled catalog snapshot, not a live search; its topic register signals “Needs location” rather than coverage or a detected event. Place-name search and drawn AOIs remain unavailable from Home. The UI exposes each missing dependency as unavailable, limited, or not implemented. No credentials, external services, or paid plans were introduced.

## Quality checks completed

- Production build completed with Vite.
- Repository secret scan passed.
- Browser review covered the discovery page, coordinate feedback, investigation empty state, and narrow responsive layout.
- Interactive visualizations are clearly labeled illustrative unless backed by data.

## Next implementation gate

Before enabling an active workflow, select and approve a real data/provider path, validate the processing method against source data, define provenance fields, and test the resulting flow with representative AOIs. Only then should the matching status move beyond its current limited or not-implemented state.
