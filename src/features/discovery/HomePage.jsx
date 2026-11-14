import { ArrowUpRight } from 'lucide-react';
import { getBundledDiscoverySummary } from '../../services/discovery/summary';
import nisarOrbitConcept from '../../assets/images/nisar-orbit-concept.jpg';
import CoordinateForm from './CoordinateForm';
import SourceStatus from './SourceStatus';
import TopicReadinessList from './TopicReadinessList';
import './home.css';
import './home-media.css';
import './home-interactions.css';

export default function HomePage({ navigate }) {
  const summary = getBundledDiscoverySummary();
  const openExplore = ({ latitude, longitude }) => navigate(`/explore?lat=${encodeURIComponent(latitude)}&lon=${encodeURIComponent(longitude)}`);

  return <div className="discovery-home">
    <section className="discovery-lead">
      <div className="discovery-lead-copy"><h1>Discover what’s changing on Earth.</h1><p>Start with a location, then inspect what the record can support.</p></div>
      <figure className="discovery-context"><img src={nisarOrbitConcept} alt="Artist's concept of the NISAR satellite above Earth" /><figcaption><strong>Discovery workspace</strong><span>Coordinate-led review for NISAR catalog records and future investigation setup.</span><a href="https://www.jpl.nasa.gov/press-kits/nisar/gallery/" target="_blank" rel="noreferrer">NASA/JPL image credit</a></figcaption></figure>
    </section>
    <section className="discovery-workbench" aria-labelledby="workbench-title">
      <div className="workbench-copy"><h2 id="workbench-title">Assess a location</h2><p>Enter decimal-degree coordinates to carry a precise location into the map workspace. Availability is assessed there against the source, time window, and product requirements.</p><CoordinateForm onSubmit={openExplore} /></div>
      <SourceStatus summary={summary} />
    </section>
    <section className="catalog-strip" aria-labelledby="catalog-title"><div><h2 id="catalog-title">Product families in this reference</h2></div><div className="product-list" aria-label="Product families">{summary.productFamilies.map((product) => <span key={product}>{product}</span>)}</div></section>
    <TopicReadinessList availability={summary.topicAvailability} onSelect={(topicId) => navigate(`/topics/${topicId}`)} />
    <section className="discovery-notes"><p>This route reflects a local catalog snapshot. It is useful for understanding the available product vocabulary, but it is not a coverage guarantee, a live search, or an analysis result.</p><button type="button" className="method-link" onClick={() => navigate('/methodology')}>Read the methodology <ArrowUpRight size={16} aria-hidden="true" /></button></section>
  </div>;
}
