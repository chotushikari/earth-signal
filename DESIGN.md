---
name: Earth Signal
description: Forest observatory navigation, an immersive Discover canvas, and quiet science workspaces.
colors:
  night: "#031613"
  forest: "#075c34"
  paper: "#f5f7f3"
  line: "#dce3da"
  discover-ink: "#f1f8f0"
  discover-muted: "#bdd0be"
typography:
  display:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "clamp(38px, 3.9vw, 62px)"
    fontWeight: 760
    lineHeight: 1.04
    letterSpacing: "-0.035em"
  body:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  nav: "6px"
  panel: "9px"
  control: "14px"
spacing:
  shell: "28px"
  mobile-shell: "16px"
components:
  button-primary:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.discover-ink}"
    rounded: "{rounded.nav}"
    padding: "10px 16px"
  nav-active:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.discover-ink}"
    rounded: "{rounded.nav}"
    padding: "10px 12px"
---

# Earth Signal application visual system

**Scope:** A shared global shell, dark Discover (`/`), and light science/workspace routes. Explore, readiness, observation, investigation, My Earth, and Reports retain their working structures while adopting the shared shell tokens.

## Visual world

Earth Signal is a forest observatory: a dark forest shell carries mission and navigation, a dark Discover canvas introduces the work through rotating Earth context and generated editorial topic art, and light paper workspaces support scientific reading and review. Forest green identifies decisions; dark spatial canvases remain functional map surfaces. It is not a generic SaaS dashboard or a themed space console.

## Direction contract

- **Mode:** Operate.
- **First viewport:** the visitor understands the mission in one short statement, sees a properly credited rotating Earth, can pause that motion, and can begin with coordinates without searching ambiguous place names.
- **Navigation:** a compact dark-forest horizontal shell across routes; one forest-green active state, no decorative rails. It collapses to the existing accessible drawer on narrow screens.
- **Surfaces:** one 14px radius and restrained hairline borders. Elevation is used only where a real floating control needs separation.
- **Typography:** professional sans; rank comes from scale, weight, and layout, not all-caps labels or synthetic display fonts.
- **Discovery data:** the bundled ASF catalog remains visibly labelled as a snapshot. Counts and coverage dates are derived from the normalized summary. Topic availability remains “Needs location” until a location-aware query exists.
- **Imagery:** every supplied image has a source record and credit. Generated editorial topic art carries a visible label; optical, artist-concept, and illustrative media are context only, never represented as NISAR measurements.
- **Maps and workspaces:** maps remain dark, spatially focused canvases inside light readiness, observation, evidence, account, and report workspaces.

## Product rules

- Do not create named investigations, curated places, saved items, observation dates, or readiness scores without verified source data.
- Keep working Cesium, catalog, and API paths; visual work must not swap them for mock data.
- Every control has focus, hover, disabled, error, empty, and mobile states where applicable.
- Avoid gradients, glassmorphism, fake telemetry, metric tiles, decorative maps, and generic icon-card mosaics.
