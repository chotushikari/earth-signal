# Earth Signal Technical Architecture

## Target boundaries

React/Vite provides the interface. Lightweight server routes validate requests, query discovery providers and expose bounded metadata. A separate worker executes approved product-specific processing. PostgreSQL/PostGIS stores identities, metadata, investigations, analysis records and evidence references; raw science files remain at NASA or approved object storage.

## Required modules

| Module | Responsibility | Current state |
|---|---|---|
| Observation adapter | Validate ASF query, normalize metadata, record provenance and cache freshness | Legacy concept exists; hardening required |
| Readiness engine | Evaluate product-specific availability and compatibility | Not implemented |
| Product registry | Bind topic to product/method/status requirements | Basic topic metadata only |
| Investigation service | Persist reproducible query/input/run states | Not implemented |
| Worker | SME2/GCOV processing with bounded resource use | Not implemented |
| Evidence ledger | Preserve inputs, variables, masks, parameters, outputs and limits | Not implemented |
| Map adapter | Render real footprints and approved result layers | Legacy Cesium foundation exists |

## API rules

All new APIs use a versioned path where practical, validate input, bound AOI/date/result sizes, return structured error codes, identify data source/fetched time, and never return credentials. Asset access must use allowlisted hosts and bounded range/content-length controls.

## Data model

The planned entities are Observation, DataCollection, DataReadiness, ProductCompatibility, Investigation, AnalysisRun, ChangeFeature, EvidenceRecord, Watchpoint and Report. New SQL is additive and versioned; no drop statements or public user-data write policies are permitted.
