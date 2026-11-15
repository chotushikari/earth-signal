import { CalendarDays, Check, CircleHelp, Filter, Layers3, MapPinned, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import rawCatalog from '../../../resources/asf-results-2026-10-08_23-06-00.json' with { type: 'json' };
import { topics } from '../../data/topics';
import GlobeViewer from '../explorer/GlobeViewer';
import { normalizeCatalog } from '../explorer/catalog';
import { getBundledDiscoverySummary } from '../../services/discovery/summary';
import './explore-workspace.css';
import './explore-workspace-overrides.css';
import { parseCoordinatePair } from '../../services/discovery/coordinates';

function formatDate(value) { return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(value)); }

export default function ExplorePage({ navigate }) {
  const query = new URLSearchParams(window.location.search);
  const initialCoordinates = query.has('lat') && query.has('lon') ? `${query.get('lat')}, ${query.get('lon')}` : '';
  const [coordinates, setCoordinates] = useState(initialCoordinates);
  const [selectedTopic, setSelectedTopic] = useState('water');
  const [selectedId, setSelectedId] = useState(null);
  const [showFootprints, setShowFootprints] = useState(true);
  const [showTimeline, setShowTimeline] = useState(true);
  const [readinessFilter, setReadinessFilter] = useState('all');
  const [mode, setMode] = useState('live');
  const [liveRecords, setLiveRecords] = useState([]);
  const [requestState, setRequestState] = useState('loading');
  const [requestError, setRequestError] = useState('');
  const [fetchedAt, setFetchedAt] = useState('');
  const [revision, setRevision] = useState(0);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [product, setProduct] = useState('GCOV');
  const [focusCoordinates,setFocusCoordinates]=useState(initialCoordinates||null);
  useEffect(() => {
    if (mode !== 'live') return;
    const controller = new AbortController();
    const load = async () => {
      setRequestState('loading'); setRequestError(''); setSelectedId(null);
      const params = new URLSearchParams({maxResults:'80'});
      if (coordinates.trim()) {
        const [lat, lon] = coordinates.split(','); const parsed = parseCoordinatePair(lat,lon);
        if (!parsed.valid) { setRequestError(parsed.error);setRequestState('error');return; }
        params.set('lat',parsed.latitude); params.set('lon',parsed.longitude);
        setFocusCoordinates(`${parsed.latitude},${parsed.longitude}`);
      }
      if(start) params.set('start',start); if(end) params.set('end',end); if(product) params.set('processingLevel',product);
      try {
        const response = await fetch(`/api/asf-search?${params}`,{signal:controller.signal});
        const data = await response.json();
        if(!response.ok) throw new Error(data.error || 'Catalog request failed.');
        if(!Array.isArray(data.records)) throw new Error('Unexpected catalog response.');
        setLiveRecords(data.records);setFetchedAt(data.fetchedAt);setRequestState('success');
      } catch(error) {if(!controller.signal.aborted){setRequestState('error');setRequestError(error.message);setLiveRecords([]);}}
    };
    load(); return () => controller.abort();
    // Search is explicitly submitted to avoid one provider request per keystroke.
  }, [mode, revision]);
  const snapshotSummary = getBundledDiscoverySummary();
  const catalog = useMemo(() => normalizeCatalog(mode === 'snapshot' ? rawCatalog : liveRecords), [mode,liveRecords]);
  const geometryNote = mode === 'live' && requestState === 'success' ? `${liveRecords.length} records returned; ${catalog.errors.length} without usable footprints.` : '';
  const dates = catalog.features.map(x=>x.properties.acquisitionDate).filter(Boolean).sort();
  const summary = mode === 'snapshot' ? snapshotSummary : {observationCount:catalog.features.length,sourceLabel:'ASF Search · live request',dateRange:dates.length?{start:dates[0],end:dates.at(-1)}:null,productFamilies:[...new Set(catalog.features.map(x=>x.properties.productType).filter(Boolean))]};
  const visibleFeatures = showFootprints ? catalog.features : [];
  const selected = catalog.features.find((feature) => feature.id === selectedId);
  const topic = topics.find((item) => item.id === selectedTopic) || topics[0];
  const showSnapshot = mode === 'snapshot' && readinessFilter !== 'location';
  const showLocationRequirement = readinessFilter !== 'snapshot';

  return <div className="explore-workspace">
    <div className="explore-tools" aria-hidden="true">
      <div className="tool-tabs" aria-hidden="true"><span className="is-active"><MapPinned size={19} /></span><span><Layers3 size={19} /></span><span><Filter size={19} /></span></div>
    </div>
    <section className="explore-left">
      <header><h1>Explore the catalog</h1><p>Start with coordinates, then inspect exact observation footprints.</p></header>
      <label className="location-input"><Search size={17} /><input value={coordinates} onChange={(event) => setCoordinates(event.target.value)} placeholder="Latitude, longitude" /><button type="button" onClick={() => setCoordinates('')} aria-label="Clear coordinates">×</button></label>
      <section className="location-state"><MapPinned size={18} /><div><strong>{coordinates || 'No location selected'}</strong><span>{coordinates ? 'Coordinates carried from Discover' : 'Enter coordinates on Discover to assess a location.'}</span></div></section>
      <section className="filter-panel"><h2>Observation search</h2><label>Source<select value={mode} onChange={e=>setMode(e.target.value)}><option value="live">Live ASF catalog</option><option value="snapshot">Bundled reference snapshot</option></select></label><label>Science product<select value={product} onChange={e=>setProduct(e.target.value)}><option value="">All NISAR products</option>{['GCOV','SME2','GUNW','GOFF'].map(x=><option key={x}>{x}</option>)}</select></label><label>From<input type="date" value={start} onChange={e=>setStart(e.target.value)}/></label><label>To<input type="date" value={end} onChange={e=>setEnd(e.target.value)}/></label><button type="button" disabled={mode==='snapshot'||requestState==='loading'} onClick={()=>setRevision(x=>x+1)}>{requestState==='loading' && mode==='live'?'Searching…':'Search observations'}</button>{mode==='live' && <p role="status">{requestState==='error'?requestError:requestState==='loading'?'Requesting ASF metadata…':`${catalog.features.length} footprints returned${liveRecords.length===80?' · result limit reached':''}.`}</p>}{mode==='live' && fetchedAt && requestState==='success' && <small>Fetched {new Date(fetchedAt).toLocaleString()}</small>}</section>
      <section className="topic-filter"><h2>Explore by topic</h2>{topics.filter((item) => item.id !== 'explore').map((item) => <button key={item.id} type="button" aria-pressed={selectedTopic === item.id} className={selectedTopic === item.id ? 'is-active' : ''} onClick={() => setSelectedTopic(item.id)}><span>{item.title}</span>{selectedTopic === item.id && <Check size={16} />}</button>)}</section>
      <section className="filter-panel"><div><h2>Filters</h2><button type="button" onClick={() => { setShowFootprints(true); setShowTimeline(true); }}>Reset</button></div><label><input type="checkbox" checked={showFootprints} onChange={(event) => setShowFootprints(event.target.checked)} /> Acquisition footprints</label><label><input type="checkbox" checked={showTimeline} onChange={(event) => setShowTimeline(event.target.checked)} /> Acquisition timeline</label></section>
    </section>
    <main className="explore-map-stage">
      <GlobeViewer catalogOnly focusCoordinates={focusCoordinates} features={visibleFeatures} selectedId={selectedId} onSelect={setSelectedId} />
      <div className="map-layer-panel"><div><Layers3 size={16} /><strong>Visible layers</strong></div><label><input type="checkbox" checked={showFootprints} onChange={(event) => setShowFootprints(event.target.checked)} /> Catalog footprints</label><label><input type="checkbox" disabled /> Change analysis</label></div>
      {showTimeline && <section className="acquisition-timeline"><div><span><CalendarDays size={15} /> Returned acquisition range</span><small>{summary.observationCount} {mode==='live'?'live':'snapshot'} records</small></div><div className="timeline-rule">{summary.dateRange && <><i /><time>{formatDate(summary.dateRange.start)}</time><time>{formatDate(summary.dateRange.end)}</time></>}</div></section>}
    </main>
    <aside className="readiness-rail">
      <button type="button" className="studio-primary" onClick={()=>{const [lat,lon]=coordinates.split(',');const point=parseCoordinatePair(lat,lon);navigate(`/readiness${point.valid?`?lat=${point.latitude}&lon=${point.longitude}`:''}`);}}>Check data readiness</button>
      {selected && <button type="button" className="studio-secondary" onClick={()=>navigate(`/observations?granule=${encodeURIComponent(selected.id)}`)}>Inspect real observation evidence</button>}
      {geometryNote && <p role="status">{geometryNote}</p>}
      <header><Layers3 size={24} /><div><h2>Data readiness</h2><p>{coordinates ? `Location: ${coordinates}` : 'Select a location to evaluate coverage.'}</p></div><CircleHelp size={19} /></header>
      <div className="readiness-notice"><strong>{mode==='live'?'Live discovery':'Reference snapshot'} · science assessment pending</strong><p>{mode==='live'?`${catalog.features.length} valid footprints from ASF. `:''}Metadata discovery does not verify calibration, compatible observation pairs or valid science pixels.</p></div>
      <div className="readiness-tabs"><button type="button" aria-pressed={readinessFilter === 'all'} className={readinessFilter === 'all' ? 'is-active' : ''} onClick={() => setReadinessFilter('all')}>All</button><button type="button" aria-pressed={readinessFilter === 'snapshot'} className={readinessFilter === 'snapshot' ? 'is-active' : ''} onClick={() => setReadinessFilter('snapshot')}>Snapshot</button><button type="button" aria-pressed={readinessFilter === 'location'} className={readinessFilter === 'location' ? 'is-active' : ''} onClick={() => setReadinessFilter('location')}>Needs location</button></div>
      {showSnapshot && <article className="readiness-card"><div><strong>Snapshot coverage</strong><span>Catalog scope only</span></div><em>Snapshot</em><p>This catalog reference shows product families and dates, not location coverage or analysis readiness.</p><dl><div><dt>Catalog source</dt><dd>{summary.sourceLabel}</dd></div><div><dt>Coverage</dt><dd>{summary.dateRange ? `${formatDate(summary.dateRange.start)} – ${formatDate(summary.dateRange.end)}` : 'Unavailable'}</dd></div><div><dt>Products</dt><dd>{summary.productFamilies.join(', ')}</dd></div></dl></article>}
      {showLocationRequirement && <article className="readiness-card"><div><strong>{topic.title}</strong><span>{topic.product}</span></div><em>Needs location</em><p>{topic.limitation}</p><dl><div><dt>Requirement</dt><dd>Exact coordinates and a time window</dd></div><div><dt>Topic</dt><dd>{topic.title}</dd></div></dl></article>}
      <article className="selected-record"><h3>Selected observation</h3>{selected ? <><strong>{selected.properties.granuleName || selected.id}</strong><p>{selected.properties.acquisitionDate || 'Acquisition date unavailable'} · {selected.properties.processingLevel || 'Product unavailable'}</p></> : <p>Select a footprint on the globe to inspect its catalog record. This is not an analysis result.</p>}</article>
    </aside>
  </div>;
}
