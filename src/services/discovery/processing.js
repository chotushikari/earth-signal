const methods = {
  GCOV: {title:'Radar backscatter', paired:true, url:'https://nisar-docs.asf.alaska.edu/gcov/'},
  SME2: {title:'Soil moisture', paired:true, url:'https://nisar-docs.asf.alaska.edu/sme2/'},
  GUNW: {title:'Interferometric coherence', paired:false, url:'https://nisar-docs.asf.alaska.edu/gunw/'},
  GOFF: {title:'Radar pixel offsets', paired:false, url:'https://nisar-docs.asf.alaska.edu/goff/'},
};

export const processingMethod = product => Object.hasOwn(methods, product) ? methods[product] : null;

export function processingCoordinates(context) {
  return {lat:context.place.latitude, lon:context.place.longitude, bounds:context.area?.bounds};
}

export function observationPath(record, context) {
  const {lat, lon, bounds} = processingCoordinates(context);
  const query = new URLSearchParams({granule:record.granuleName || record.granuleUr, lat, lon});
  if (bounds) query.set('bounds', bounds.join(','));
  return `/observations?${query}`;
}

export function recommendAnalysis(records) {
  const supported = records.filter(record => processingMethod(record.processingLevel) && record.granuleName)
    .sort((a,b) => String(b.startTime).localeCompare(String(a.startTime)));
  const earlierByGroup = new Map();
  for (const record of supported) {
    const product = record.processingLevel;
    if (!methods[product].paired) continue;
    const geometry = record.granuleName.split('_').slice(5, 10);
    if (geometry.length !== 5 || !record.startTime) continue;
    const key = [product, ...geometry].join('|');
    const latest = earlierByGroup.get(key);
    if (!latest) earlierByGroup.set(key, record);
    else if (latest.startTime.slice(0, 10) !== record.startTime.slice(0, 10)) {
      return [record.granuleName, latest.granuleName];
    }
  }
  return supported.length ? [supported[0].granuleName] : [];
}

export function measurementSummary(result) {
  const delta = result.medianChange ?? result.medianChangeDb;
  const sample = result.medians?.[0] ?? result.medianBackscatterDb?.[0];
  const unit = result.unit || 'dB';
  return delta == null
    ? `Median ${(result.measurementLabel || 'backscatter').toLowerCase()}: ${sample} ${unit}`
    : `Median matched ${result.measurementLabel ? result.measurementLabel.toLowerCase() : 'backscatter'} difference: ${delta} ${unit}`;
}

export function exportPixelCsv(result) {
  const {pixelValues, windowPixels, sources} = result;
  const source = sources[0];
  const [x,y] = source.firstPixelCenter, [dx,dy] = source.spacing;
  const row = ['epsg','x_pixel_center','y_pixel_center', ...sources.map((s,i) => `value_${i+1}_${s.acquiredAt?.slice(0,10) || 'undated'}`)].join(',');
  const rows = pixelValues[0].flatMap((value,index) => value == null ? [] : [[source.epsg,
    (x+(index%windowPixels)*dx).toFixed(4),
    (y+Math.floor(index/windowPixels)*dy).toFixed(4),
    ...pixelValues.map(values => values[index]),
  ].join(',')]);
  const url = URL.createObjectURL(new Blob([[row,...rows].join('\n')],{type:'text/csv'}));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'earth-signal-pixels.csv';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
