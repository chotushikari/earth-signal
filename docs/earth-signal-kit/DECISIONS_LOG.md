# Decisions Log

Codex: append decisions here; do not silently overwrite earlier decisions. New decisions should include date, alternatives, rationale, approval and rollback.

| ID | Date | Decision | Options considered | Rationale | User approval | Status |
|---|---|---|---|---|---|---|
| D-001 | 2026-11-14 | Working product name: Earth Signal | Earth Signal / other | Broad discovery and monitoring product | User to confirm if name should be final | Proposed |
| D-002 | 2026-11-14 | Evolve Zenith rather than rebuild globe/catalog | Reuse vs rewrite | Preserve useful working infrastructure | In scope direction | Proposed |
| D-003 | 2026-11-14 | Core first processors: SME2 and GCOV | SME2/GCOV/GUNW/GOFF | Two reliable end-to-end slices before more breadth | Proposed | Proposed |
| D-004 | 2026-11-14 | Local CPU worker first | Local / hosted service | Avoid unproven paid/free compute commitment | Proposed | Proposed |
| D-005 | 2026-11-14 | No new third-party APIs without approval | OSM, WorldPop, FIRMS, geocoder, LLM, etc. | User wants to approve integrations individually | Explicitly required | Active |

## Decision entry template

### D-XXX — Short title
- Date:
- Decision owner:
- Context/problem:
- Options:
- Official docs/pricing/licence:
- Data/privacy impact:
- Cost/quota impact:
- Decision:
- User approval:
- Files/config changed:
- Rollback:

### D-006 — Product assumptions locked for the first Earth Signal milestone
- Date: 2026-11-14
- Decision owner: Project owner
- Context/problem: The implementation needs a bounded, evidence-first MVP before any scientific or infrastructure work begins.
- Options: Broad multi-topic implementation; or a staged MVP centred on verified science workflows.
- Official docs/pricing/licence: No provider or plan selected in this decision.
- Data/privacy impact: No credentials, user data, external API requests, or storage integrations are enabled.
- Cost/quota impact: No cost-bearing service is approved.
- Decision: Keep the name Earth Signal. Serve researchers, educators, and local analysts first. Start with SME2 soil-moisture and GCOV calibrated radar-response workflows. Keep GUNW and GOFF Limited until real-data validation passes. Use Ready only after passing scientific and UX acceptance checks. Defer curated regions until live NASA coverage is verified. Use the defined discovery, AOI, readiness, evidence, and local-first saved-place MVP scope.
- User approval: Approved in chat on 2026-11-14.
- Files/config changed: docs/earth-signal-kit/DECISIONS_LOG.md
- Rollback: Revise this decision before implementation of the affected step; no code, data, or provider configuration requires rollback.

### D-007 — Discovery-first Earth Signal interface
- Date: 2026-11-14
- Decision owner: Project owner
- Context/problem: The inherited mission-console UI presented legacy branding and could imply live scientific capability before the evidence workflow exists.
- Options: Preserve the legacy interface; lightly rebrand it; or introduce a new discovery-first interface while retaining legacy code only as quarantined source.
- Official docs/pricing/licence: No provider or paid service selected.
- Data/privacy impact: The new interface makes no external data request and collects no persisted user data.
- Cost/quota impact: No cost impact.
- Decision: Use a calm editorial field-workspace style. Lead with location/AOI discovery, truthful lens states, data readiness, evidence, and limitations. Remove the legacy dashboard route from the production frontend path until its data and science logic are replaced. Keep every current result state explicitly non-live.
- User approval: Approved in chat on 2026-11-14.
- Files/config changed: src/App.jsx, src/index.css, src/main.jsx, .gitignore, and UI QA artifacts.
- Rollback: Restore the earlier route in src/main.jsx from Git history; no provider or data migration is involved.

### D-008 — Modular evidence-first frontend shell
- Date: 2026-11-14
- Decision owner: Project owner
- Context/problem: Earth Signal needs a complete, coherent frontend before real catalogue, map, processing, persistence, and report services are approved and connected.
- Options: Keep a single dashboard; expose placeholder outputs as live; or build a modular product shell with explicit availability states.
- Official docs/pricing/licence: No provider or paid service selected.
- Data/privacy impact: The frontend makes no new external requests and does not persist user data.
- Cost/quota impact: No cost impact.
- Decision: Ship the discovery, topic, map, investigation, saved-workspace, report, and methodology surfaces as reusable frontend modules. Every unavailable workflow must use an honest empty, limited, or not-implemented state; reports and exports remain disabled until reproducible result data exists.
- User approval: Approved in chat on 2026-11-14.
- Files/config changed: src/App.jsx, src/index.css, src/components/, src/data/, src/features/, docs/FRONTEND_IMPLEMENTATION.md, and this log.
- Rollback: Revert the frontend commit; no external data or provider state is changed.
