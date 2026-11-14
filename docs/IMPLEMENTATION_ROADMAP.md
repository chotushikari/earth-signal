# Earth Signal V2 Implementation Roadmap

## Phase 0 Audit

Completed on `earth-signal-v2`: source audit and V2 product, journey, design, architecture and science boundaries are documented. No legacy feature was removed.

## Phase 1 Foundation

Create a typed domain vocabulary and product registry; align navigation to Discover, Explore Map, Investigations, My Earth and Reports; preserve the legacy explorer behind an explicit legacy/demo route while replacements mature. Add input validation and shared state contracts. Gate: build, unit tests for contracts and route smoke tests.

## Phase 2 Discovery and readiness

Harden server-side ASF discovery; implement normalized response/provenance contracts and a no-live-data fallback state. Build a product-specific compatibility/readiness engine with tests. Gate: real provider response or labelled fixture, plus compatibility fixtures.

## Phase 3 Investigation experience

Connect an approved map adapter to selected AOIs and actual observation footprints. Add investigation persistence model, timeline, evidence inspector and error states. Gate: real normalized inputs drive all displayed values.

## Phase 4 Science engines

Implement and independently validate SME2, then GCOV. GUNW and GOFF remain metadata-only until their product-specific validation gates pass. Gate: source granule fixtures, unit/mask/georeferencing tests and structured evidence record.

## Phase 5 Monitoring and reports

Add authenticated ownership, additive migrations, watchpoint status, evidence ledger and report generation from immutable analysis records. Gate: no seeded/demo watchpoint or report can appear as a user record.

## Phase 6 Release

Run accessibility, performance, security and deployment validation. Provide environment guidance and a live/demo walkthrough that distinguishes every data mode.
