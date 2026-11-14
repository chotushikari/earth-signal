import { CalendarDays, Check, CircleHelp, Filter, Layers3, MapPinned, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import rawCatalog from '../../../resources/asf-results-2026-10-08_23-06-00.json' with { type: 'json' };
import { topics } from '../../data/topics';
import GlobeViewer from '../explorer/GlobeViewer';
import { normalizeCatalog } from '../explorer/catalog';
import { getBundledDiscoverySummary } from '../../services/discovery/summary';
import './explore-workspace.css';
import './explore-workspace-overrides.css';

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
  const summary = getBundledDiscoverySummary();
  const catalog = useMemo(() => normalizeCatalog(rawCatalog), []);
  const visibleFeatures = showFootprints ? catalog.features : [];
  const selected = catalog.features.find((feature) => feature.id === selectedId);
  const topic = topics.find((item) => item.id === selectedTopic) || topics[0];
  const showSnapshot = readinessFilter !== 'location';
  const showLocationRequirement = readinessFilter !== 'snapshot';

  return <div className="explore-workspace">
    <div className="explore-tools" aria-hidden="true">
      <div className="tool-tabs" aria-hidden="true"><span className="is-active"><MapPinned size={19} /></span><span><Layers3 size={19} /></span><span><Filter size={19} /></span></div>
    </div>
    <section className="explore-left">
      <header><h1>Explore the catalog</h1><p>Start with coordinates, then inspect exact observation footprints.</p></header>
      <label className="location-input"><Search size={17} /><input value={coordinates} onChange={(event) => setCoordinates(event.target.value)} placeholder="Latitude, longitude" /><button type="button" onClick={() => setCoordinates('')} aria-label="Clear coordinates">×</button></label>
      <section className="location-state"><MapPinned size={18} /><div><strong>{coordinates || 'No location selected'}</strong><span>{coordinates ? 'Coordinates carried from Discover' : 'Enter coordinates on Discover to assess a location.'}</span></div></section>
      <section className="topic-filter"><h2>Explore by topic</h2>{topics.filter((item) => item.id !== 'explore').map((item) => <button key={item.id} type="button" aria-pressed={selectedTopic === item.id} className={selectedTopic === item.id ? 'is-active' : ''} onClick={() => setSelectedTopic(item.id)}><span>{item.title}</span>{selectedTopic === item.id && <Check size={16} />}</button>)}</section>
      <section className="filter-panel"><div><h2>Filters</h2><button type="button" onClick={() => { setShowFootprints(true); setShowTimeline(true); }}>Reset</button></div><label><input type="checkbox" checked={showFootprints} onChange={(event) => setShowFootprints(event.target.checked)} /> Acquisition footprints</label><label><input type="checkbox" checked={showTimeline} onChange={(event) => setShowTimeline(event.target.checked)} /> Acquisition timeline</label></section>
    </section>
    <main className="explore-map-stage">
      <GlobeViewer catalogOnly features={visibleFeatures} selectedId={selectedId} onSelect={setSelectedId} />
      <div className="map-layer-panel"><div><Layers3 size={16} /><strong>Visible layers</strong></div><label><input type="checkbox" checked={showFootprints} onChange={(event) => setShowFootprints(event.target.checked)} /> Catalog footprints</label><label><input type="checkbox" disabled /> Change analysis</label></div>
      {showTimeline && <section className="acquisition-timeline"><div><span><CalendarDays size={15} /> Acquisition timeline</span><small>{summary.observationCount} snapshot records</small></div><div className="timeline-rule">{summary.dateRange && <><i /><time>{formatDate(summary.dateRange.start)}</time><time>{formatDate(summary.dateRange.end)}</time></>}</div></section>}
    </main>
    <aside className="readiness-rail">
      <header><Layers3 size={24} /><div><h2>Data readiness</h2><p>{coordinates ? `Location: ${coordinates}` : 'Select a location to evaluate coverage.'}</p></div><CircleHelp size={19} /></header>
      <div className="readiness-notice"><strong>Location assessment pending</strong><p>Catalog records are visible, but product compatibility must be checked against an exact location and time window.</p></div>
      <div className="readiness-tabs"><button type="button" aria-pressed={readinessFilter === 'all'} className={readinessFilter === 'all' ? 'is-active' : ''} onClick={() => setReadinessFilter('all')}>All</button><button type="button" aria-pressed={readinessFilter === 'snapshot'} className={readinessFilter === 'snapshot' ? 'is-active' : ''} onClick={() => setReadinessFilter('snapshot')}>Snapshot</button><button type="button" aria-pressed={readinessFilter === 'location'} className={readinessFilter === 'location' ? 'is-active' : ''} onClick={() => setReadinessFilter('location')}>Needs location</button></div>
      {showSnapshot && <article className="readiness-card"><div><strong>Snapshot coverage</strong><span>Catalog scope only</span></div><em>Snapshot</em><p>This catalog reference shows product families and dates, not location coverage or analysis readiness.</p><dl><div><dt>Catalog source</dt><dd>{summary.sourceLabel}</dd></div><div><dt>Coverage</dt><dd>{summary.dateRange ? `${formatDate(summary.dateRange.start)} – ${formatDate(summary.dateRange.end)}` : 'Unavailable'}</dd></div><div><dt>Products</dt><dd>{summary.productFamilies.join(', ')}</dd></div></dl></article>}
      {showLocationRequirement && <article className="readiness-card"><div><strong>{topic.title}</strong><span>{topic.product}</span></div><em>Needs location</em><p>{topic.limitation}</p><dl><div><dt>Requirement</dt><dd>Exact coordinates and a time window</dd></div><div><dt>Topic</dt><dd>{topic.title}</dd></div></dl></article>}
      <article className="selected-record"><h3>Selected observation</h3>{selected ? <><strong>{selected.properties.granuleName || selected.id}</strong><p>{selected.properties.acquisitionDate || 'Acquisition date unavailable'} · {selected.properties.processingLevel || 'Product unavailable'}</p></> : <p>Select a footprint on the globe to inspect its catalog record. This is not an analysis result.</p>}</article>
    </aside>
  </div>;
}
