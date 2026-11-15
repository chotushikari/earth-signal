import { ArrowRight, Crosshair, Globe2, Layers3, Mountain, Orbit, RadioTower, Search, Snowflake, Sprout, Trees, Waves } from 'lucide-react';
import { useState } from 'react';
import HeroEarth from './HeroEarth';
import { parseCoordinatePair } from '../../services/discovery/coordinates';
import './home-design.css';

const topics=[
 ['water','Water & Wetlands','Track water extent, floods and wetland change',Waves],
 ['ground-movement','Ground Movement','Explore land deformation and surface displacement',Layers3],
 ['forests','Forests & Vegetation','Monitor forest cover and surface disturbance',Trees],
 ['farms','Farms & Soil','Explore soil moisture and agricultural dynamics',Sprout],
 ['ice','Ice & Glaciers','Track glacier and ice surface movement',Snowflake],
 ['explore','Explore Any Location','Discover observations and changes anywhere',Globe2],
];
const mission=[['NISAR (SAR)','NASA–ISRO Mission',RadioTower],['All-weather','Radar observation',Crosshair],['Repeat observations','Acquisition timelines',Orbit],['Explore Earth','Find available coverage',Globe2]];
export default function HomePage({navigate}){
 const [location,setLocation]=useState(''),[error,setError]=useState('');
 const explore=event=>{event.preventDefault();const [lat,lon]=location.split(',');const point=parseCoordinatePair(lat,lon);if(!point.valid){setError(point.error);return;}navigate(`/explore?lat=${point.latitude}&lon=${point.longitude}`);};
 return <div className="home-design"><section className="home-design-hero" aria-labelledby="home-heading"><div className="home-design-copy"><span className="mission-kicker">NASA–ISRO Earth observation</span><h1 id="home-heading">Discover what’s<br/>changing on Earth.</h1><p>Explore Earth’s surface, track environmental change,<br className="home-copy-break"/> and understand the evidence with NISAR observations.</p><form className="home-location" onSubmit={explore}><Search size={18} aria-hidden="true"/><label className="sr-only" htmlFor="discover-location">Latitude, longitude</label><input id="discover-location" placeholder="Enter coordinates, e.g. 21.95, 88.77" value={location} onChange={event=>{setLocation(event.target.value);setError('');}} aria-invalid={!!error} aria-describedby={error?'home-location-error':undefined}/><button aria-label="Explore these coordinates" type="submit"><Crosshair size={19}/></button></form>{error&&<p className="home-location-error" role="alert" id="home-location-error">{error}</p>}<a className="home-topic-link" href="#home-topics">Or explore by topic <ArrowRight size={16}/></a></div><div className="home-planet"><HeroEarth/></div><aside className="home-mission" aria-label="About the mission">{mission.map(([title,copy,Icon])=><a href="/sources" key={title} onClick={event=>{event.preventDefault();navigate('/sources');}}><span><Icon size={23} strokeWidth={1.5}/></span><div><strong>{title}</strong><small>{copy}</small></div></a>)}</aside></section><section className="home-topic-grid" id="home-topics" aria-label="Explore by topic">{topics.map(([id,title,copy,Icon])=><button className={`home-topic home-topic-${id}`} key={id} onClick={()=>navigate(id==='explore'?'/explore':`/topics/${id}`)}><span className="home-topic-art" aria-hidden="true"/><span className="home-topic-copy"><Icon size={22} strokeWidth={1.7}/><strong>{title}</strong><span>{copy}</span><ArrowRight className="home-topic-arrow" size={17}/></span></button>)}</section><div className="home-design-caption"><span>AI-generated topic illustrations · not observation data.</span><a href="/sources" onClick={event=>{event.preventDefault();navigate('/sources');}}>Science data &amp; sources <ArrowRight size={12}/></a></div></div>;
}
