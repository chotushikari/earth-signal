import { ArrowRight, Search } from 'lucide-react';
import { findTopic } from '../../data/topics';
import { Button, EmptyState, PageHeading, StatusBadge } from '../../components/ui';

export default function TopicPage({ topicId, navigate }) {
  const topic = findTopic(topicId);
  return <div className="page-wrap topic-page"><PageHeading eyebrow="Topic discovery" title={topic.title} copy={topic.description} action={<StatusBadge status={topic.readiness} />} />
    <section className="topic-overview"><div><span className="eyebrow">What you can investigate</span><h2>Ask a location-specific question.</h2><p>Earth Signal will first assess available observations, coverage, maturity, compatibility, and quality information for your exact area and dates.</p><Button onClick={() => navigate(`/explore?topic=${topic.id}`)}>Choose a location</Button></div><dl><div><dt>Relevant NISAR product</dt><dd>{topic.product}</dd></div><div><dt>Current availability</dt><dd><StatusBadge status={topic.readiness} /></dd></div><div><dt>Scientific limitation</dt><dd>{topic.limitation}</dd></div></dl></section>
    <section className="topic-explorer"><div className="topic-search"><span className="eyebrow">Data availability explorer</span><h2>Ready when the evidence is.</h2><p>Search by coordinate or use the Explore Map to define an area.</p><button onClick={() => navigate(`/explore?topic=${topic.id}`)}><Search size={17} /> Explore locations <ArrowRight size={16} /></button></div><EmptyState title="No verified curated regions yet" copy="Curated regions will appear only when their product, observations, and processing evidence are validated." /></section>
  </div>;
}
