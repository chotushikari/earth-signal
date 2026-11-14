import { Bookmark, BellRing, MapPinned, Plus } from 'lucide-react';
import { Button, EmptyState, PageHeading } from '../../components/ui';

export default function MyEarthPage({ navigate }) {
  return <div className="page-wrap my-earth"><PageHeading eyebrow="My Earth" title="Places and investigations you follow." copy="Saved locations remain local to this browser until a secure, approved account and storage layer is configured." action={<Button icon={Plus} onClick={() => navigate('/explore')}>Save a place</Button>} />
    <div className="my-earth-grid"><section><div className="section-mini-title"><MapPinned size={18} /><h2>Saved places</h2></div><EmptyState title="No saved places" copy="Save an area after defining it in Explore Map. Local-only storage is not enabled yet." /></section><section><div className="section-mini-title"><Bookmark size={18} /><h2>Saved investigations</h2></div><EmptyState title="No saved investigations" copy="Evidence-backed investigations can be saved after an analysis is available." /></section><section><div className="section-mini-title"><BellRing size={18} /><h2>New observations</h2></div><EmptyState title="Nothing to check yet" copy="Earth Signal will show verified new observation availability, not unverified environmental events." /></section></div></div>;
}
