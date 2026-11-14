# Earth Signal Product Specification

## Product promise

Earth Signal helps a person start with a place and question, determine whether NISAR evidence is suitable, and inspect traceable results without turning incomplete data into claims.

## Primary workflow

Discover -> select place or coordinates -> select topic -> inspect readiness -> investigate compatible observations -> inspect evidence and limitations -> save or report when a verified result exists.

## V2 navigation

- Discover
- Explore Map
- Investigations
- My Earth
- Reports

Methodology and settings stay secondary. Product codes are progressive disclosure, never the opening vocabulary.

## Capability contract

| Capability | V2 state at audit | Definition of done |
|---|---|---|
| Location entry | Coordinates only | Place name and map selection require an approved provider/workflow |
| Topic discovery | Frontend shell | Uses one topic registry and truthful readiness state |
| Live discovery | Not verified | Server-side ASF adapter returns normalized, provenance-labelled metadata |
| Data readiness | Not implemented | Evaluates a selected AOI and real normalized observations |
| Investigation | Frontend shell | Real result record, map/timeline/evidence view and failure states |
| Monitoring | Not implemented | Authenticated ownership and a real scheduler/query status |
| Reports | Structure only | Generated solely from a persisted verified analysis record |

## Product rules

- Never display a numeric result, acquisition count, change map or confidence score unless it comes from a real result record.
- Static, cached, live and simulated sources must be visually and programmatically distinct.
- An unavailable workflow is a valid outcome, with a reason and next action.
- Earth Signal is decision support, not disaster alerting, operational forecasting or causal diagnosis.
