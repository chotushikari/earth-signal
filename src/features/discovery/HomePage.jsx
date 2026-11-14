import { ArrowRight, MapPin, Search } from 'lucide-react';
import { useState } from 'react';
import nisarOrbitConcept from '../../assets/images/nisar-orbit-concept.jpg';
import earthObservatoryAgriculture from '../../assets/images/nasa-earth-observatory-agriculture.jpg';
import { topics } from '../../data/topics';
import { parseCoordinatePair } from '../../services/discovery/coordinates';
import { getBundledDiscoverySummary } from '../../services/discovery/summary';
import './home.css';
import './home-media.css';
import './home-reference-overrides.css';

const visibleTopics = [...topics.filter((topic) => topic.id !== 'explore'), topics.find((topic) => topic.id === 'explore')];
const topicMedia = { water: nisarOrbitConcept, 'ground-movement': nisarOrbitConcept, forests: earthObservatoryAgriculture, farms: earthObservatoryAgriculture, ice: nisarOrbitConcept, explore: nisarOrbitConcept };

export default function HomePage({ navigate }) {
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const summary = getBundledDiscoverySummary();
  const explore = (event) => { event.preventDefault(); const [latitude, longitude] = location.split(','); const parsed = parseCoordinatePair(latitude, longitude); if (!parsed.valid) { setError(parsed.error); return; } navigate(`/explore?lat=${parsed.latitude}&lon=${parsed.longitude}`); };
  return <div className="discover-home">
    <section className="discover-hero" style={{ backgroundImage: `url(${nisarOrbitConcept})` }}>
      <div className="discover-hero-copy"><span>Earth observation for real-world insights</span><h1>Discover what’s changing on Earth.</h1><p>Explore NASA–ISRO NISAR catalog records with clear evidence boundaries, from water and forests to farms, ice, and ground movement.</p><form onSubmit={explore}><Search size={23} aria-hidden="true" /><label className="sr-only" htmlFor="discover-location">Enter decimal coordinates</label><input id="discover-location" value={location} onChange={(event) => { setLocation(event.target.value); setError(''); }} placeholder="Enter coordinates, e.g. 22.15, 89.65" /><button type="submit">Explore</button></form>{error && <p className="discover-error" role="alert">{error}</p>}</div>
      <div className="hero-source"><MapPin size={17} /><span>Mission context image<br /><strong>NASA/JPL NISAR gallery</strong></span></div>
    </section>
    <section className="discover-cards" aria-label="Discovery topics">{visibleTopics.map((topic) => <button type="button" key={topic.id} onClick={() => navigate(topic.id === 'explore' ? '/explore' : `/topics/${topic.id}`)}><div className={`topic-media topic-${topic.id}`}><img src={topicMedia[topic.id]} alt="" /><span>{topic.product}</span></div><div><h2>{topic.title}</h2><p>{topic.description}</p><ArrowRight size={18} /></div></button>)}</section>
    <p className="imagery-note">Topic imagery is contextual NASA/JPL and NASA Earth Observatory material, not a displayed NISAR measurement.</p>
    <section className="discover-evidence"><div><h2>Start with the data that exists.</h2><p>The current discovery reference is a bundled ASF catalog snapshot: {summary.observationCount} records from {summary.dateRange ? '18 Jun to 04 Oct 2026' : 'an unavailable period'}. It is not a live coverage guarantee.</p></div><button type="button" onClick={() => navigate('/explore')}>Open Explore Map <ArrowRight size={17} /></button></section>
  </div>;
}
