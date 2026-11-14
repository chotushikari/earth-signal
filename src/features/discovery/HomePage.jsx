import { ArrowRight, Compass, Map, Move, Snowflake, Sprout, Trees, Waves } from 'lucide-react';
import { useMemo, useState } from 'react';
import { topics } from '../../data/topics';
import { Button, DemoNotice, SearchBox, StatusBadge } from '../../components/ui';

const icons = { water: Waves, 'ground-movement': Move, forests: Trees, farms: Sprout, ice: Snowflake, explore: Map };

export default function HomePage({ navigate }) {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState('farms');
  const selected = useMemo(() => topics.find((topic) => topic.id === selectedId) || topics[0], [selectedId]);
  const SelectedIcon = icons[selected.id];
  const goExplore = (event) => { event.preventDefault(); navigate(`/explore${query.trim() ? `?place=${encodeURIComponent(query.trim())}` : ''}`); };

  return <>
    <section className="signal-intro">
      <div className="intro-statement">
        <h1>Start with a place.<br />Follow the <i>evidence.</i></h1>
        <p className="intro-copy">A working surface for understanding what an Earth observation can—and cannot—tell you about change.</p>
        <div className="intro-actions"><Button onClick={() => navigate('/explore')}>Choose an area</Button><button className="plain-action" onClick={() => document.getElementById('method')?.scrollIntoView({ behavior: 'smooth' })}>Read the method <ArrowRight size={15} /></button></div>
      </div>
      <div className="observation-instrument" aria-label="Illustrative evidence trace; no live observations">
        <div className="instrument-meta"><span>Observation path</span><span>Illustrative</span></div>
        <div className="trace-map"><svg viewBox="0 0 560 310" preserveAspectRatio="none" aria-hidden="true"><path className="trace-base" d="M34 221 L123 166 L204 190 L283 91 L373 131 L446 61 L527 98" /><path className="trace-active" d="M34 221 L123 166 L204 190 L283 91 L373 131 L446 61 L527 98" /></svg>{topics.map((topic, index) => <button type="button" key={topic.id} onClick={() => setSelectedId(topic.id)} className={`trace-stop trace-stop-${index} ${selectedId === topic.id ? 'selected' : ''}`} aria-label={`Select ${topic.title}`} aria-pressed={selectedId === topic.id}><span /></button>)}</div>
        <div className="instrument-reading"><div><span className="reading-label">Selected path</span><strong><SelectedIcon size={16} /> {selected.title}</strong></div><StatusBadge status={selected.readiness} /></div>
        <p>{selected.limitation}</p>
      </div>
    </section>

    <section className="place-callout">
      <div><h2>What place are you trying to understand?</h2><p>Use coordinates now. Place search and drawn areas arrive only with an approved map and geocoding workflow.</p></div>
      <SearchBox value={query} onChange={setQuery} onSubmit={goExplore} />
    </section>

    <section className="topic-ledger" id="topics">
      <header><div><h2>Choose the question before the product.</h2></div><p>Each path states its current evidence boundary. A quiet status is more useful than an optimistic promise.</p></header>
      <div className="ledger-list">{topics.map((topic) => { const Icon = icons[topic.id]; return <article key={topic.id} className={selectedId === topic.id ? 'selected' : ''}><button onClick={() => { setSelectedId(topic.id); navigate(topic.id === 'explore' ? '/explore' : `/topics/${topic.id}`); }}><span className="ledger-topic"><Icon size={19} /><strong>{topic.title}</strong></span><span className="ledger-product">{topic.product}</span><StatusBadge status={topic.readiness} /><ArrowRight className="ledger-arrow" size={17} /></button></article>; })}</div>
    </section>

    <section className="method-section" id="method">
      <div className="method-title"><h2>Evidence is a route,<br />not a result.</h2></div>
      <ol><li><span>1</span><div><h3>Frame the place</h3><p>Set a question, area, and time window that can be evaluated against a specific observation product.</p></div></li><li><span>2</span><div><h3>Inspect readiness</h3><p>See whether the product, coverage, geometry, and quality requirements could support the intended method.</p></div></li><li><span>3</span><div><h3>Keep the limits</h3><p>Every future report preserves source, method, processing choices, and what the evidence cannot establish.</p></div></li></ol>
      <DemoNotice />
    </section>

    <section className="closing-entry"><div><h2>Build an investigation<br />from the ground up.</h2></div><div><p>There are no pre-written stories or fabricated map events here. Open the map shell to record an area and inspect the exact conditions required for a real analysis.</p><Button onClick={() => navigate('/explore')} icon={Compass}>Open the map workspace</Button></div></section>
  </>;
}
