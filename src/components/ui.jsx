import { ArrowRight, Globe2, Info, MapPinned, Search, X } from 'lucide-react';
import {useEffect,useRef} from 'react';
import { readinessCopy } from '../data/topics';

export function Brand({ tagline = false }) {
  return <span className="brand"><span className="brand-globe" aria-hidden="true"><Globe2 size={27} strokeWidth={1.8} /></span><span className="brand-copy"><strong>Earth Signal</strong>{tagline && <small>Discover. Understand. Monitor.</small>}</span></span>;
}

export function StatusBadge({ status }) {
  return <span className={`status status-${status}`}>{readinessCopy[status] || status}</span>;
}

export function Button({ children, kind = 'primary', icon = ArrowRight, ...props }) {
  const Icon = icon;
  return <button className={`button button-${kind}`} {...props}>{children}{Icon && <Icon size={16} />}</button>;
}

export function PageHeading({ eyebrow, title, copy, action }) {
  return <header className="page-heading" aria-label={eyebrow}><div><h1>{title}</h1><p>{copy}</p></div>{action}</header>;
}

export function SearchBox({ value, onChange, onSubmit, compact = false, placeholder = 'Enter coordinates, e.g. 22.15, 89.65', error = '' }) {
  return <form className={`search-box ${compact ? 'search-compact' : ''}`} onSubmit={onSubmit}>
    <Search size={18} aria-hidden="true" />
    <label className="sr-only" htmlFor="global-search">Enter coordinates</label>
    <input id="global-search" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} aria-invalid={error ? 'true' : undefined} aria-describedby={error ? 'global-search-error' : undefined} />
    <button type="submit" aria-label="Explore these coordinates"><ArrowRight size={17} /></button>
    {error && <span id="global-search-error" className="search-error" role="alert">{error}</span>}
  </form>;
}

export function EmptyState({ title, copy, action, icon = MapPinned }) {
  const Icon = icon;
  return <section className="empty-state"><span className="empty-icon"><Icon size={23} /></span><div><h2>{title}</h2><p>{copy}</p>{action}</div></section>;
}

export function DemoNotice() {
  return <p className="demo-notice"><Info size={15} /> Demonstration interface only. No live NASA result is shown.</p>;
}

export function Drawer({ open, onClose, children }) {
  const dialog=useRef(null);
  useEffect(()=>{if(!open||!dialog.current)return;const previous=document.activeElement;const element=dialog.current;element.showModal();return()=>{if(element.open)element.close();previous?.focus();};},[open]);
  if (!open) return null;
  return <dialog ref={dialog} className="drawer" aria-label="Site navigation" onCancel={event=>{event.preventDefault();onClose();}}><div className="drawer-backdrop" onClick={onClose} /><aside><button className="icon-button" onClick={onClose} aria-label="Close navigation"><X size={18} /></button>{children}</aside></dialog>;
}
