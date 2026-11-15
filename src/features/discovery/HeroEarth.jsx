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
  const [ready, setReady] = useState(false);
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
      const material=new THREE.MeshPhongMaterial({color:0x082a28,shininess:2});
      const earth=new THREE.Mesh(geometry,material);earth.rotation.z=23.44*Math.PI/180;earth.rotation.y=3.1;scene.add(earth);
      const atmosphereMaterial=new THREE.ShaderMaterial({transparent:true,side:THREE.BackSide,blending:THREE.AdditiveBlending,depthWrite:false,vertexShader:'varying vec3 n; varying vec3 v; void main(){vec4 p=modelViewMatrix*vec4(position,1.0); n=normalize(normalMatrix*normal); v=normalize(-p.xyz); gl_Position=projectionMatrix*p;}',fragmentShader:'varying vec3 n; varying vec3 v; void main(){float rim=pow(1.0-abs(dot(n,v)),3.0); gl_FragColor=vec4(0.14,0.61,0.89,rim*0.65);}'});
      const atmosphereGeometry=new THREE.SphereGeometry(1.035,64,40);scene.add(new THREE.Mesh(atmosphereGeometry,atmosphereMaterial));
      const orbitGroup=new THREE.Group();const orbitResources=[];
      for(let i=0;i<2;i++){
        const points=[];for(let step=0;step<=128;step++){const angle=step/128*Math.PI*2;points.push(new THREE.Vector3(Math.cos(angle)*1.16,Math.sin(angle)*1.16,0));}
        const orbitGeometry=new THREE.BufferGeometry().setFromPoints(points);const orbitMaterial=new THREE.LineBasicMaterial({color:0x55b7d8,transparent:true,opacity:i===0?.48:.24});const ring=new THREE.Line(orbitGeometry,orbitMaterial);ring.rotation.x=i===0?.55:1.05;ring.rotation.y=i===0?.35:-.6;orbitGroup.add(ring);orbitResources.push(orbitGeometry,orbitMaterial);
        for(let j=0;j<4;j++){const angle=(j/4+i*.12)*Math.PI*2;const dotGeometry=new THREE.SphereGeometry(.012,10,8);const dotMaterial=new THREE.MeshBasicMaterial({color:0xb8efff});const dot=new THREE.Mesh(dotGeometry,dotMaterial);dot.position.copy(new THREE.Vector3(Math.cos(angle)*1.16,Math.sin(angle)*1.16,0).applyEuler(ring.rotation));orbitGroup.add(dot);orbitResources.push(dotGeometry,dotMaterial);}
      }scene.add(orbitGroup);
      scene.add(new THREE.AmbientLight(0xffffff,1.4));
      const sun=new THREE.DirectionalLight(0xffffff,1.8);sun.position.set(-3,2,4);scene.add(sun);
      const texture=new THREE.TextureLoader().load(textureUrl,t=>{if(!disposed){t.colorSpace=THREE.SRGBColorSpace;material.color.set(0xffffff);material.map=t;material.needsUpdate=true;renderer.render(scene,camera);setReady(true);}},undefined,()=>{if(!disposed)setFailed(true);});
      const resize=()=>{const w=element.clientWidth,h=element.clientHeight;if(!w||!h)return;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();renderer.render(scene,camera);};
      const observer=new ResizeObserver(resize);observer.observe(element);resize();
      const preference=matchMedia('(prefers-reduced-motion: reduce)');let visible=true,previous=0,frame;
      const intersection=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;});intersection.observe(element);
      const animate=time=>{frame=requestAnimationFrame(animate);if(!visible||document.hidden||preference.matches||pauseRef.current){previous=time;return;}if(time-previous<33)return;const delta=Math.min((time-previous)/1000,.05);previous=time;earth.rotation.y+=delta*.035;orbitGroup.rotation.z+=delta*.012;renderer.render(scene,camera);};
      frame=requestAnimationFrame(animate);
      cleanup=()=>{cancelAnimationFrame(frame);observer.disconnect();intersection.disconnect();texture.dispose();material.dispose();geometry.dispose();atmosphereMaterial.dispose();atmosphereGeometry.dispose();orbitResources.forEach(resource=>resource.dispose());renderer.dispose();renderer.domElement.remove();};
    }).catch(()=>setFailed(true));
    return ()=>{disposed=true;cleanup();};
  },[]);
  return <div className="hero-earth" data-earth-ready={ready}><div ref={host} className="hero-earth-canvas" role="img" aria-label="Slowly rotating Earth with contextual surface imagery"/>{failed && <div className="earth-fallback"/>}<button className="earth-pause" aria-pressed={paused} onClick={()=>{setPaused(!paused);window.dispatchEvent(new CustomEvent('earth-signal-motion',{detail:!paused}));}}>{paused?'Resume animations':'Pause animations'}</button><span className="earth-credit">Earth texture: NASA / Three.js</span></div>;
}
