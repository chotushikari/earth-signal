import { ArrowLeft, ArrowRight, BookOpen, CircleAlert, Layers3, MapPinned, Search } from 'lucide-react';
import { findTopic } from '../../data/topics';
import { Button, StatusBadge } from '../../components/ui';
import './topic-workspace.css';

export default function TopicPage({ topicId, navigate }) {
  const topic = findTopic(topicId);
  return <div className="topic-workspace">
    <aside className="topic-rail"><button type="button" onClick={() => navigate('/')}><ArrowLeft size={16} /> Discover</button><h1>{topic.title}</h1><p>{topic.description}</p><nav aria-label="Topic sections"><a className="is-active" href="#overview"><Layers3 size={17} /> Overview</a><a href="#readiness"><MapPinned size={17} /> Data readiness</a><a href="#limits"><CircleAlert size={17} /> Limits</a><a href="#method"><BookOpen size={17} /> Method</a></nav></aside>
    <main className="topic-main">
      <header className="topic-title" id="overview"><div><span>Topic workspace</span><h2>{topic.title}</h2><p>{topic.description}</p></div><StatusBadge status={topic.readiness} /></header>
      <section className="topic-question"><div><h3>Begin with a location-specific question.</h3><p>Earth Signal checks observations, coverage, compatibility, and quality against the area and time window you define. It does not infer a real-world event from a product name.</p><Button onClick={() => navigate(`/explore?topic=${topic.id}`)}>Open Explore Map</Button></div><dl><div><dt>Relevant product</dt><dd>{topic.product}</dd></div><div><dt>Current state</dt><dd><StatusBadge status={topic.readiness} /></dd></div><div id="limits"><dt>Scientific boundary</dt><dd>{topic.limitation}</dd></div></dl></section>
      <section className="topic-readiness" id="readiness"><div className="section-heading"><div><h3>Readiness depends on the place</h3><p>These are the exact checks the workspace will make after coordinates are supplied.</p></div><span>Not assessed yet</span></div><ol><li><strong>Observation overlap</strong><p>Does the requested area intersect valid catalog footprints?</p></li><li><strong>Product compatibility</strong><p>Can the available product and geometry answer this topic’s question?</p></li><li><strong>Quality and limits</strong><p>Are the required variables, layers, and processing conditions present?</p></li></ol></section>
      <section className="topic-method" id="method"><BookOpen size={19} /><div><h3>Methodology stays attached to the evidence.</h3><p>When an investigation is available, its catalog source, processing choices, and limitations remain visible in the report.</p></div><button type="button" onClick={() => navigate('/methodology')}>Read methodology <ArrowRight size={16} /></button></section>
    </main>
  </div>;
}
