# Earth Signal Scientific Methods

## Common gate

No analysis runs until product family/version, AOI overlap, spatial reference, acquisition compatibility, relevant channel, valid-data mask, QA and units are verified. A failed gate returns a reasoned `not_ready` or `limited` state.

## SME2

Use an official soil-moisture estimate with its documented uncertainty/quality layers, fill values and coordinate grid. Compute statistics only over valid pixels. Temporal differences require compatible grids and algorithms. A soil-moisture result is not a finding about irrigation, crop health, drought or rainfall cause by itself.

## GCOV

Use documented calibrated measurement variables, relevant QA/masks and common valid coverage. Convert calibrated linear power to dB only when product documentation permits it. Record filtering/resampling choices. Radar-response change is not automatically flood, forest loss or fire evidence.

## GUNW and GOFF

GUNW requires documented LOS, coherence/quality, connected-component and reference controls; it must never be labelled vertical displacement without justified geometry. GOFF requires documented offset variables, unit/direction conventions, quality thresholds and temporal conversion. Both remain gated.

## Prohibited methods

Never derive physical quantities from browse image luminance, turn a generated preview into a result, calculate against nodata, invent uncertainty/confidence, or mix simulated arrays with real evidence records.
