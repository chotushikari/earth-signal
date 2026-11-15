import {useEffect, useRef, useState} from 'react';
import {Download} from 'lucide-react';
import {downloadJson} from '../../services/discovery/workflow';

export function radarSummary(result) {
  const {previews, changePreview, ...summary} = result;
  return summary;
}

export default function RadarProcessing({granules, coordinates, onResult, children}) {
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
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
        body: JSON.stringify({granules, ...coordinates}),
        signal: controller.signal,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Radar processing failed.');
      setResult(data);
      onResult?.(radarSummary(data));
    } catch (failure) {
      if (!controller.signal.aborted) setError(failure instanceof SyntaxError
        ? 'The radar backend did not return a result. Try again shortly.'
        : failure.message);
    } finally {
      if (!controller.signal.aborted) setBusy(false);
    }
  }

  const comparison = granules.length === 2;
  return (
    <section className="radar-processing" aria-label="Radar pixel processing" aria-busy={busy}>
      <header className="radar-toolbar">
        <div>
          <h2>{comparison ? 'Radar backscatter comparison' : 'Radar backscatter'}</h2>
          <p>{comparison
            ? 'Compare matched GCOV pixels in a 128 × 128 window around the selected point.'
            : 'Read a 128 × 128 window from the original NISAR acquisition.'}</p>
        </div>
        <button type="button" className="evidence-primary" onClick={process} disabled={busy}>
          {busy ? 'Reading radar pixels…' : result ? 'Run again' : comparison ? 'Process comparison' : 'Process radar pixels'}
        </button>
      </header>
      {busy && <p role="status">Reading and validating source data. This can take up to two minutes.</p>}
      {error && <p role="alert" className="radar-error">{error}</p>}
      {result ? (
        <>
          <div className="radar-previews">
            {result.previews.map((src, index) => {
              const source = result.sources[index];
              const label = comparison ? (index === 0 ? 'Earlier' : 'Later') : 'Acquisition';
              return <figure key={source.granule}>
                <img src={src} alt={`${label} NISAR ${source.channel} backscatter window`}/>
                <figcaption>{label} · {source.acquiredAt?.slice(0, 10)} · {result.medianBackscatterDb[index]} dB median</figcaption>
              </figure>;
            })}
            {result.changePreview && <figure>
              <img src={result.changePreview} alt="Later minus earlier matched backscatter in decibels"/>
              <figcaption>Backscatter difference · {result.medianChangeDb} dB median</figcaption>
            </figure>}
          </div>
          <div className="radar-result-meta">
            <p role="status">{result.validPixels.toLocaleString()} of {result.totalPixels.toLocaleString()} pixels passed the source mask. {result.sources[0].channel} · {result.sources[0].spacing[0]} m grid.</p>
            <p>Grayscale range −30 to +5 dB. {comparison && 'Difference scale −6 dB (blue) to +6 dB (red). These values describe radar response. Flooding and water extent require separate validation.'}</p>
            <button type="button" className="evidence-secondary" onClick={() => downloadJson(result, 'earth-signal-gcov.json')}>
              <Download size={15}/> Export radar result
            </button>
          </div>
        </>
      ) : children}
    </section>
  );
}
