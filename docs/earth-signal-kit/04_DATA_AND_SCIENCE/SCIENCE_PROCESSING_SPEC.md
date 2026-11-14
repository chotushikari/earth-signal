# Science Processing Specification

## 1. General rule

The application analyses processed NISAR science products. It does not re-create the mission's full Level-0/Level-1 processing chain. Use the correct product-specific input, variable, units, mask and QA interpretation. The exact HDF5 paths/variables must be confirmed from the product guide and a real granule before coding.

## 2. Common pre-processing gate

Before any pair/time-series calculation:
1. Confirm product type and product version match the analysis module.
2. Confirm maturity status and disclose it.
3. Confirm spatial overlap and valid common coverage.
4. Check acquisition dates, orbit/pass direction and geometry as relevant.
5. Check frequency and polarization/channel compatibility as relevant.
6. Check product variable, unit, scale/offset and fill-value metadata.
7. Read and apply valid-data, QA and no-data masks.
8. Confirm spatial reference, pixel spacing and geotransform.
9. Co-register/resample only when scientifically justified and record the method.
10. Return `not_ready` if required evidence or compatibility checks fail.

## 3. SME2 — soil moisture

### Intended output

A georeferenced map of the selected soil-moisture estimate, uncertainty/quality overlays and temporal difference where compatible observations exist.

### Processing outline
1. Search ASF for SME2 granules intersecting AOI and date range.
2. Inspect actual HDF5 metadata and Harmony variable-subsetting support.
3. Select a documented soil-moisture estimate (e.g. algorithm-specific product layer) and associated uncertainty/quality variables.
4. Extract only the AOI and needed variables.
5. Validate output CRS, coordinate grid, units, fill values and flags.
6. Build a validity mask using official product definitions.
7. Produce map layer and summary: min/median/mean/max, valid pixel count, valid coverage, distribution and uncertainty summary.
8. For two dates, validate spatial grid/algorithm compatibility and calculate `delta_sm = sm_t2 - sm_t1` on valid common pixels.
9. Visualize change with an explicit unit and neutral scale.
10. State that a moisture change is not, by itself, proof of crop health, irrigation, drought or rainfall cause.

### Provisional/validated policy

Store maturity status and make it visible. If the selected product is provisional, label all results as provisional and describe known input/calibration limitations. Do not mix validated and provisional data in one result without explicit explanation.

## 4. GCOV — calibrated radar response

### Intended output

A spatially referenced map of a selected calibrated radar covariance/backscatter layer and a compatible temporal difference layer.

### Processing outline
1. Find GCOV granules and confirm product maturity/version.
2. Select corresponding frequency/polarization/covariance variable(s) from the product guide.
3. Extract measurement and QA/mask/number-of-looks layers needed by the analysis.
4. Validate units, scale, polarization, frequency, incidence/acquisition geometry and common footprint.
5. Build valid masks; do not treat missing pixels as zero.
6. Apply only documented/justified filtering. Record window size and algorithm.
7. Convert to dB only when input is calibrated linear power and product definition supports it: `10 * log10(power)`; do not apply to arbitrary browse RGB.
8. Compute temporal delta only for compatible observations and common valid pixels.
9. Compute distribution summaries and coverage statistics.
10. For water or vegetation interpretation, include limitations and contextual validation; do not infer cause from backscatter change alone.

## 5. GUNW — ground deformation

GUNW is an interferometric product. It is not a generic image-difference product.

Before enabling an analysis:
- identify unwrapped phase variable and documented units/conventions;
- identify coherence and connected-component layers;
- inspect quality flags and masks;
- verify reference pixel/area strategy;
- account for phase-to-LOS displacement relationship and radar wavelength/conventions;
- understand corrections, atmospheric/orbital residuals and unwrapping limitations;
- preserve LOS semantics; do not relabel LOS displacement as vertical motion without geometry and assumptions.

If these requirements are not met, ship a metadata/evidence viewer only and mark analysis as Limited.

## 6. GOFF — pixel-offset / motion

Before enabling:
- identify range and azimuth offsets and units;
- identify SNR/quality layers and nodata conventions;
- remove invalid/outlier measurements with documented rules;
- verify geometry and transform offset vectors appropriately;
- calculate velocity only with valid time interval and coordinate conversion;
- do not show a motion vector without units, direction convention and quality context.

## 7. Cross-topic common outputs

Every processor must return:
- status: `ready`, `limited`, `not_ready`, `failed`;
- summary in plain language;
- measurements with units;
- input granules and product maturity;
- selected variable names/paths;
- source metadata and asset URLs/DOIs;
- AOI and CRS;
- observation dates;
- processing method and parameters;
- valid-pixel/coverage statistics;
- QA/uncertainty metadata;
- output layers and checksums;
- limitations and interpretation notes;
- software and processor version;
- warnings and trace IDs.

## 8. Browse imagery policy

Browse PNG/JPEG may be used for preview and UI only. It is not a substitute for calibrated measurement arrays. Never derive physical dB/soil moisture/displacement from browse luminance.

## 9. Simulation policy

Synthetic data is allowed for UI development and unit-test fixtures only. It must be physically labelled `SIMULATED`/`DEMO`, stored separately from real result records and excluded from result claims, metrics and curated discovery stories.

## 10. Validation strategy

- Validate georeferencing by overlaying output against known footprint/AOI.
- Compare extracted values against a trusted source file or NASA example where available.
- Check masks, units, scale/offset and nodata.
- Use controlled synthetic arrays to test calculations, not as evidence.
- Add test fixtures with known expected statistics.
- Record the exact source granule and request so every real result is reproducible.
