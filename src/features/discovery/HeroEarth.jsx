import { useEffect, useRef, useState } from 'react';
import textureUrl from '../../assets/images/earth-atmosphere.jpg';

export function AnimatedHeadline() {
  const words = ['changing', 'evolving', 'shifting'];
  const [index, setIndex] = useState(0);
  const [paused,setPaused] = useState(false);
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const stop = event => setPaused(event.detail);
    let stopped=false;
    const sync = event => {stopped=event.detail;stop(event);};
    window.addEventListener('earth-signal-motion',sync);
    const timer = setInterval(() => { if (!stopped && !preference.matches && !document.hidden) setIndex(i => (i+1)%words.length); },4200);
    return () => {clearInterval(timer);window.removeEventListener('earth-signal-motion',sync);};
  }, []);
  return <h1 aria-label="Discover what’s changing on Earth."><span aria-hidden="true">Discover what’s <span className="changing-slot"><span key={index} className="changing-word">{words[index]}</span></span> on Earth.</span></h1>;
}

export default function HeroEarth() {
  const host = useRef(null);
  const [failed, setFailed] = useState(false);
  const [paused, setPaused] = useState(false);
  const pauseRef = useRef(false);
  useEffect(() => {pauseRef.current = paused;},[paused]);
  useEffect(() => {
    let disposed=false, cleanup=()=>{};
    import('three').then(THREE => {
      if(disposed || !host.current) return;
      const element=host.current;
      let renderer;
      try {renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});} catch {setFailed(true);return;}
      renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;
      element.appendChild(renderer.domElement);
      const scene=new THREE.Scene();
      const camera=new THREE.PerspectiveCamera(32,1,.1,50);camera.position.z=4.2;
      const geometry=new THREE.SphereGeometry(1,64,40);
      const material=new THREE.MeshPhongMaterial({color:0xffffff,shininess:8});
      const earth=new THREE.Mesh(geometry,material);earth.rotation.z=.18;earth.rotation.y=2.4;scene.add(earth);
      scene.add(new THREE.AmbientLight(0xffffff,1.6));
      const sun=new THREE.DirectionalLight(0xfff5df,2.4);sun.position.set(-3,2,4);scene.add(sun);
      const texture=new THREE.TextureLoader().load(textureUrl,t=>{if(!disposed){t.colorSpace=THREE.SRGBColorSpace;material.map=t;material.needsUpdate=true;renderer.render(scene,camera);}},undefined,()=>setFailed(true));
      const resize=()=>{const w=element.clientWidth,h=element.clientHeight;if(!w||!h)return;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();renderer.render(scene,camera);};
      const observer=new ResizeObserver(resize);observer.observe(element);resize();
      const preference=matchMedia('(prefers-reduced-motion: reduce)');let visible=true,previous=0,frame;
      const intersection=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;});intersection.observe(element);
      const animate=time=>{frame=requestAnimationFrame(animate);if(!visible||document.hidden){previous=time;return;}if(time-previous<33)return;const delta=Math.min((time-previous)/1000,.05);previous=time;if(!preference.matches&&!pauseRef.current)earth.rotation.y+=delta*.055;renderer.render(scene,camera);};
      frame=requestAnimationFrame(animate);
      cleanup=()=>{cancelAnimationFrame(frame);observer.disconnect();intersection.disconnect();texture.dispose();material.dispose();geometry.dispose();renderer.dispose();renderer.domElement.remove();};
    }).catch(()=>setFailed(true));
    return ()=>{disposed=true;cleanup();};
  },[]);
  return <div className="hero-earth"><div ref={host} className="hero-earth-canvas" role="img" aria-label="Slowly rotating Earth with contextual surface imagery"/>{failed && <div className="earth-fallback"/>}<button className="earth-pause" aria-pressed={paused} onClick={()=>{setPaused(!paused);window.dispatchEvent(new CustomEvent('earth-signal-motion',{detail:!paused}));}}>{paused?'Resume animations':'Pause animations'}</button><span className="earth-credit">Earth texture · NASA / Three.js</span></div>;
}
