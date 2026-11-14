import { ArrowRight, Compass, Map, Sprout, Trees, Waves, Move, Snowflake } from 'lucide-react';
import { useState } from 'react';
import { topics } from '../../data/topics';
import { Button, DemoNotice, SearchBox, StatusBadge } from '../../components/ui';

const icons = { water: Waves, 'ground-movement': Move, forests: Trees, farms: Sprout, ice: Snowflake, explore: Map };

export default function HomePage({ navigate }) {
  const [query, setQuery] = useState('');
  const goExplore = (event) => { event.preventDefault(); navigate(`/explore${query.trim() ? `?place=${encodeURIComponent(query.trim())}` : ''}`); };
  return <>
    <section className="discovery-hero">
      <div className="hero-copy"><span className="eyebrow">Earth observation, made understandable</span><h1>Discover what’s changing on <em>Earth.</em></h1><p>Explore NASA–ISRO NISAR observations, investigate the evidence, and follow places that matter.</p><div className="hero-actions"><Button onClick={() => navigate('/explore')}>Start exploring</Button><Button kind="secondary" icon={Compass} onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>How it works</Button></div></div>
      <div className="earth-canvas" aria-label="Illustrative Earth observation map, no live data"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="earth-disc"><span /><span /><span /></div><div className="map-grid" /><div className="earth-label"><i /> Evidence begins with a place</div></div>
    </section>
    <section className="location-section"><div><span className="eyebrow">Start anywhere</span><h2>Where on Earth do you want to look?</h2><p>Enter coordinates now. Place-name search and map drawing will be added with an approved provider and map workflow.</p></div><SearchBox value={query} onChange={setQuery} onSubmit={goExplore} /></section>
    <section className="section-wrap" id="topics"><div className="section-title"><div><span className="eyebrow">Discover by topic</span><h2>One workflow, six ways in.</h2></div><p>Topic cards show what is possible today, not what we hope to support later.</p></div><div className="topic-grid">{topics.map((topic) => { const Icon = icons[topic.id]; return <article className={`topic-card topic-${topic.id}`} key={topic.id}><div className="topic-top"><span className="topic-icon"><Icon size={20} /></span><StatusBadge status={topic.readiness} /></div><h3>{topic.title}</h3><p>{topic.description}</p><small>{topic.product}</small><button onClick={() => navigate(topic.id === 'explore' ? '/explore' : `/topics/${topic.id}`)}>Explore topic <ArrowRight size={15} /></button></article>; })}</div></section>
    <section className="map-entry"><div><span className="eyebrow">Explore Earth</span><h2>A place for evidence, not imagined events.</h2><p>View available observation paths, define an area, and inspect the reasons an investigation is or is not ready.</p><Button onClick={() => navigate('/explore')}>Open Explore Map</Button></div><div className="map-entry-visual"><div className="map-entry-grid" /><div className="map-empty"><Map size={25} /><strong>No verified regions loaded</strong><span>Curated regions appear only after their source products and evidence records are validated.</span></div></div></section>
    <section className="section-wrap signals"><div className="section-title"><div><span className="eyebrow">Signals worth exploring</span><h2>Verified stories belong here.</h2></div><DemoNotice /></div><div className="signal-empty"><p>No curated investigations are published yet.</p><span>When available, each story will show location, observation period, product, data state, and source evidence.</span></div></section>
    <section className="how-section" id="how-it-works"><div><span className="eyebrow">How Earth Signal works</span><h2>From a question to evidence.</h2></div><ol>{[['01','Discover an area','Choose a topic, place, or coordinates.'],['02','Check real observations','See what can support a scientifically compatible investigation.'],['03','Understand and follow','Inspect evidence, limits, and future observation availability.']].map(([num,title,copy]) => <li key={num}><span>{num}</span><h3>{title}</h3><p>{copy}</p></li>)}</ol></section>
  </>;
}
