import {useEffect, useRef, useState} from 'react';
import {Download} from 'lucide-react';
import {downloadJson} from '../../services/discovery/workflow';
import {exportPixelCsv,processingMethod} from '../../services/discovery/processing';

export default function RadarProcessing({granules, product = 'GCOV', coordinates, onResult, children}) {
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [quality, setQuality] = useState('0.3');
  const [channel, setChannel] = useState('');
  const active = useRef(null);
  useEffect(() => () => active.current?.abort(), []);

  async function process() {
    const controller = new AbortController();
    active.current = controller;
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/gcov', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({granules, ...coordinates, channel, minQuality: quality}),
        signal: controller.signal,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Radar processing failed.');
      setResult(data);
      const {pixelValues, ...report} = data;
      onResult?.(report);
    } catch (failure) {
      if (!controller.signal.aborted) setError(failure instanceof SyntaxError
        ? 'The radar backend did not return a result. Try again shortly.'
        : failure.message);
    } finally {
      if (!controller.signal.aborted) setBusy(false);
    }
  }

  const comparison = granules.length === 2;
  const method = processingMethod(product);
  const unit = result?.unit || 'dB';
  const range = result?.displayRange || result?.backscatterDisplayDb;
  const changeRange = result?.changeDisplay || result?.changeDisplayDb;
  const requiresPoint = product !== 'GCOV' && !coordinates;
  const changed = result && (product==='GCOV'
    ? channel && channel!==result.sources[0].channel
    : result.minimumQuality!=null && Number(quality)!==result.minimumQuality);
  return (
    <section className="radar-processing" aria-label="Radar pixel processing" aria-busy={busy}>
      <header className="radar-toolbar">
        <div>
          <h2>{method.title}{comparison && ' comparison'}</h2>
          <p>{comparison
            ? 'Compare matched pixels in a 128 × 128 window around the selected point.'
            : 'Read a 128 × 128 sample from the published NISAR product.'}</p>
          {coordinates?.bounds && <p>Pixels outside the drawn rectangle are excluded. Large areas are sampled around their center.</p>}
        </div>
        <button type="button" className="evidence-primary" onClick={process} disabled={busy || requiresPoint}>
          {busy ? 'Reading source pixels…' : result ? 'Run again' : comparison ? 'Process comparison' : product==='GCOV' ? 'Process radar pixels' : 'Process measurements'}
        </button>
      </header>
      {requiresPoint && <p>Choose a point in Explore, then open this acquisition from its search results.</p>}
      {product === 'GCOV' && <label>Covariance channel <select disabled={busy} value={channel} onChange={e => setChannel(e.target.value)}>
        <option value="">Auto (first available)</option>
        {['HHHH','VVVV','HVHV','VHVH','RHRH','RVRV'].map(value => <option key={value}>{value}</option>)}
      </select></label>}
      {['GUNW','GOFF'].includes(product) && <label>{product === 'GUNW' ? 'Minimum coherence' : 'Minimum correlation peak'} <select disabled={busy} value={quality} onChange={e => setQuality(e.target.value)}>
        {['0.1','0.2','0.3','0.4','0.5','0.6','0.7','0.8','0.9'].map(value => <option key={value}>{value}</option>)}
      </select></label>}
      {busy && <p role="status">Reading and validating source data. This can take up to two minutes.</p>}
      {error && <p role="alert" className="radar-error">{error}</p>}
      {changed && <p>Settings changed. Run again to apply them to the measurements.</p>}
      {result ? (
        <>
          <div className="radar-previews">
            {result.previews.map((src, index) => {
              const source = result.sources[index];
              const label = comparison ? (index === 0 ? 'Earlier' : 'Later') : 'Acquisition';
              return <figure key={source.granule}>
                <img src={src} alt={`${label} NISAR ${result.measurementLabel || 'backscatter'} window`}/>
                <figcaption>{label} · {source.acquiredAt?.slice(0, 10)} · {(result.medians || result.medianBackscatterDb)[index]} {unit} median</figcaption>
              </figure>;
            })}
            {result.changePreview && <figure>
              <img src={result.changePreview} alt={product === 'GCOV' ? 'Later minus earlier matched backscatter in decibels' : 'Later minus earlier matched soil moisture'}/>
              <figcaption>Later minus earlier · {result.medianChange ?? result.medianChangeDb} {unit} median</figcaption>
            </figure>}
          </div>
          <div className="radar-result-meta">
            <p role="status">{result.validPixels.toLocaleString()} of {result.totalPixels.toLocaleString()} sampled pixels passed screening. {result.sources[0].channel && `${result.sources[0].channel} · `}{result.sources[0].spacing[0]} m grid.</p>
            <p>Display range {range.join(' to ')} {unit}. {changeRange && `Difference scale ${changeRange.join(' to ')} ${unit} (blue to red).`}</p>
            <p>{result.qualityRule} {result.limitation || 'Backscatter change alone cannot establish flooding or wetland extent.'}</p>
            {Object.entries(result.additionalMedians || {}).map(([label, value]) => <p key={label}>{label}: {value} median</p>)}
            <button type="button" className="evidence-secondary" onClick={() => downloadJson(result, `earth-signal-${product.toLowerCase()}.json`)}>
              <Download size={15}/> Export measurements
            </button>
            {result.pixelValues && <button type="button" className="evidence-secondary" onClick={() => exportPixelCsv(result)}>
              <Download size={15}/> Export georeferenced CSV
            </button>}
          </div>
        </>
      ) : children}
    </section>
  );
}
