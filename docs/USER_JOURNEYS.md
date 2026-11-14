# Earth Signal User Journeys

## Coordinate based discovery

1. A visitor enters valid latitude/longitude values.
2. The app validates bounds and opens Explore Map with the selected area.
3. The visitor chooses an understandable topic.
4. The app either requests real discovery data or explicitly reports that the adapter is unavailable.
5. The visitor sees readiness reasons before any investigation action is enabled.

## Readiness to investigation

1. A researcher selects an AOI, date range and topic.
2. The readiness service evaluates actual normalized observations against a product-specific registry.
3. `Ready`, `Limited` or `Coming next` is returned with coverage, compatibility and QA reasons.
4. Only a Ready workflow can create an analysis job; Limited can open evidence/metadata only.
5. An investigation preserves its query, AOI, inputs, status and limitations.

## Evidence inspection

1. From an investigation, a user opens an input observation or result.
2. The inspector shows granule ID, product/version, acquisition time, source URL, QA, variable/mask and processing parameters.
3. Missing information is shown as missing, not inferred.

## Monitoring and reports

My Earth is empty until authenticated, user-owned records exist. Monitoring is labelled manual until a scheduler is implemented. Report export remains disabled until a completed analysis has an immutable evidence ledger.
