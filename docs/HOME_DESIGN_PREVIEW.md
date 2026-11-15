# Home design preview

## Overview

Local preview at http://127.0.0.1:5173/, extended alongside Explore from the user's pinned reference: dark header and globe-led Home, light panels around a dominant satellite map on Explore. This is a scoped surface preview, not a replacement global design system. `DESIGN.md` and `.impeccable/design.json` remain unchanged; preexisting design drift is outside this pass. The detector's 56 advisories against the older system contain no mandatory findings for this pinned preview. No deployment, push or Supabase change is included.

## Layout

Compact dark navigation sits above a fixed two-line headline and coordinate search, a central textured Earth with atmospheric rim and orbital geometry, and a slim mission/source rail. Six illustrated topic cards form one desktop row. At 390px the globe leads, copy and search follow, mission links form two columns, and topic cards form two columns. The shared dark header now carries across all routes.

## Components

The coordinate form validates latitude/longitude and passes the point to `/explore`; it has an announced error state and visible focus. Home does not provide place-name geocoding. Topic buttons open their topic routes or Explore; mission links and the source caption open Sources.

The Earth is contextual imagery credited to NASA / Three.js with a 23.44° display axial tilt, not a NISAR measurement or spacecraft tracking instrument. Pause/resume controls rotation and orbital motion. Reduced-motion preferences stop rotation and CSS animations/transitions; rendering also pauses when hidden or offscreen. The current headline is fixed. Topic artwork is visibly labelled AI-generated illustration, not observation data. Home does not claim computed scientific results. The connected source-record workflow is documented in `EVIDENCE_PIPELINE.md` and the Explore preview boundary.

## Review evidence

Captures: `.impeccable/review/home-design-desktop.png` and `.impeccable/review/home-design-mobile.png`; captures wait for texture readiness. The updated pipeline received an initial **Ship** verdict. Its two named checks have been addressed: numeric coordinates now appear in query context and saved titles, and refreshed readiness screenshots wait for settled status. The final reviewer scored both named changes resolved and returned **Ship**; the verdict does not establish scientific validation. No deployment is included.

Reported verification: `npm run verify` passed, including workflow checks; `npm run test:ui` passed all nine tests in 46.6 seconds. The final workflow rerun passed both tests in 18.4 seconds, and the final production build passed with only Vite's chunk-size warning above 500 kB. The connected workflow remains documented in `EVIDENCE_PIPELINE.md`.
