import { ArrowRight, MapPin, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import nisarOrbitConcept from '../../assets/images/nisar-orbit-concept.jpg';
import earthObservatoryAgriculture from '../../assets/images/nasa-earth-observatory-agriculture.jpg';
import { topics } from '../../data/topics';
import { parseCoordinatePair } from '../../services/discovery/coordinates';
import { getBundledDiscoverySummary } from '../../services/discovery/summary';
import './home.css';
import './home-media.css';
import './home-reference-overrides.css';
import { DiscoverySections } from '../studio/Studio';
import HeroEarth, { AnimatedHeadline } from './HeroEarth';
import './discover-motion.css';

const visibleTopics = [...topics.filter((topic) => topic.id !== 'explore'), topics.find((topic) => topic.id === 'explore')];
const topicMedia = { water: nisarOrbitConcept, 'ground-movement': nisarOrbitConcept, forests: earthObservatoryAgriculture, farms: earthObservatoryAgriculture, ice: nisarOrbitConcept, explore: nisarOrbitConcept };

export default function HomePage({ navigate }) {
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    const input = document.getElementById('discover-location');
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const hints = ['Try Sundarbans: 21.95, 88.77', 'Try Kerala: 9.60, 76.40', 'Try Antarctica: -75.10, -100.10', 'Enter latitude, longitude'];
    let index = 0;
    const rotate = () => {
      if (!input || input.value || document.activeElement === input || preference.matches || document.hidden) return;
      input.placeholder = hints[index];
      index = (index + 1) % hints.length;
      input.classList.remove('hint-changing');
      void input.offsetWidth;
      input.classList.add('hint-changing');
    };
    const timer = window.setInterval(rotate, 3800);
    const sections = document.querySelectorAll('.discover-home .reference-section, .discover-home .discover-evidence');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('discover-arrived'); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    sections.forEach(section => observer.observe(section));
    return () => { window.clearInterval(timer); observer.disconnect(); };
  }, []);
  const summary = getBundledDiscoverySummary();
  const explore = (event) => { event.preventDefault(); const [latitude, longitude] = location.split(','); const parsed = parseCoordinatePair(latitude, longitude); if (!parsed.valid) { setError(parsed.error); return; } navigate(`/explore?lat=${parsed.latitude}&lon=${parsed.longitude}`); };
  return <div className="discover-home">
    <section className="discover-hero globe-hero">
      <HeroEarth />
      <div className="discover-hero-copy"><span>Earth observation for real-world insights</span><AnimatedHeadline /><p>Explore NASA–ISRO NISAR catalog records with clear evidence boundaries, from water and forests to farms, ice, and ground movement.</p><form onSubmit={explore}><Search size={23} aria-hidden="true" /><label className="sr-only" htmlFor="discover-location">Enter decimal coordinates</label><input id="discover-location" value={location} onChange={(event) => { setLocation(event.target.value); setError(''); }} placeholder="Enter coordinates, e.g. 22.15, 89.65" aria-invalid={!!error} aria-describedby={error?'discovery-error':undefined} /><button type="submit">Explore</button></form>{error && <p id="discovery-error" className="discover-error" role="alert">{error}</p>}</div>
    </section>
    <section className="discover-cards" aria-label="Discovery topics">{visibleTopics.map((topic) => <button type="button" key={topic.id} onClick={() => navigate(topic.id === 'explore' ? '/explore' : `/topics/${topic.id}`)}><div className={`topic-media topic-${topic.id}`}><img src={topicMedia[topic.id]} alt="" /><span>{topic.product}</span></div><div><h2>{topic.title}</h2><p>{topic.description}</p><ArrowRight size={18} /></div></button>)}</section>
    <p className="imagery-note">Topic imagery is contextual NASA/JPL and NASA Earth Observatory material, not a displayed NISAR measurement.</p>
    <DiscoverySections navigate={navigate} />
    <section className="discover-evidence"><div><h2>Explore the observation catalog</h2><p>{summary.observationCount} catalog records in the bundled ASF reference snapshot. Open the map to inspect footprints and acquisition metadata.</p></div><button type="button" onClick={() => navigate('/explore')}>Open Explore Map <ArrowRight size={17} /></button></section>
  </div>;
}
