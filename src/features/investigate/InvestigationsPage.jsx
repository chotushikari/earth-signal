import { ClipboardList, Plus, ShieldCheck } from 'lucide-react';
import { Button, EmptyState, PageHeading } from '../../components/ui';

export default function InvestigationsPage({ navigate }) {
  return <div className="page-wrap">
    <PageHeading title="Investigations" copy="A reproducible investigation begins with a defined area, question, and evidence-readiness check." action={<Button icon={Plus} onClick={() => navigate('/investigate/new')}>New investigation</Button>} />
    <div className="my-earth-grid">
      <section><div className="section-mini-title"><ClipboardList size={18} /><h2>Active investigations</h2></div><EmptyState title="No active investigations" copy="Start from an area and topic. Earth Signal will not create a result until the required observations and checks are available." /></section>
      <section><div className="section-mini-title"><ShieldCheck size={18} /><h2>Completed evidence</h2></div><EmptyState title="No verified results" copy="Completed investigations will appear only after their input granules, method, quality checks, and limitations are recorded." /></section>
      <section><div className="section-mini-title"><ClipboardList size={18} /><h2>Drafts</h2></div><EmptyState title="No saved drafts" copy="Secure persistence is not configured, so no investigation is saved in this browser or a remote service yet." /></section>
    </div>
  </div>;
}
