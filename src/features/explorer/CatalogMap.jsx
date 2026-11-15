import {useEffect,useRef,useState} from 'react';
import * as C from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';

// One camera owner, one geographic coordinate system. This map never injects
// bundled SAR examples or derives physical values from a browse image.
export default function CatalogMap({features=[],selectedId,onSelect,focusCoordinates,onControlsReady,mapMode='3d',drawingArea=false,onAreaSelected,areaBounds}){
 const host=useRef(null),viewerRef=useRef(null),callbacks=useRef({onSelect,onAreaSelected,drawingArea});
 callbacks.current={onSelect,onAreaSelected,drawingArea};
 const [ready,setReady]=useState(false),[cameraReady,setCameraReady]=useState(false),[error,setError]=useState(''),[basemap,setBasemap]=useState('Loading basemap');
 const focusRef=useRef(focusCoordinates);focusRef.current=focusCoordinates;
 const viewRef=useRef(mapMode);viewRef.current=mapMode;
 const focus=(latitude,longitude)=>{
  const v=viewerRef.current;if(!v||v.isDestroyed()||!Number.isFinite(latitude)||!Number.isFinite(longitude))return;
  v.camera.cancelFlight();v.camera.setView({destination:C.Cartesian3.fromDegrees(longitude,latitude,viewRef.current==='2d'?600000:12000000),orientation:{heading:0,pitch:-Math.PI/2,roll:0}});v.scene.requestRender();
 };
 useEffect(()=>{
  let v,cancelled=false;try{
   C.Ion.defaultAccessToken=(import.meta.env.VITE_CESIUM_ION_TOKEN||'').trim();
   v=new C.Viewer(host.current,{animation:false,baseLayer:false,baseLayerPicker:false,geocoder:false,homeButton:false,infoBox:false,navigationHelpButton:false,sceneModePicker:false,selectionIndicator:false,timeline:false,fullscreenButton:false,requestRenderMode:true,maximumRenderTimeChange:Infinity,terrainProvider:new C.EllipsoidTerrainProvider()});viewerRef.current=v;
   v.scene.globe.baseColor=C.Color.fromCssColorString('#143b39');v.scene.backgroundColor=C.Color.fromCssColorString('#031613');v.scene.globe.enableLighting=false;v.scene.verticalExaggeration=1;v.scene.sun.show=false;v.scene.moon.show=false;
   v.scene.screenSpaceCameraController.minimumZoomDistance=3000;v.scene.screenSpaceCameraController.maximumZoomDistance=35000000;
   let satelliteActive=false;
   const add=(provider,index)=>{if(cancelled||v.isDestroyed())return;const layer=v.imageryLayers.addImageryProvider(provider,index);v.scene.requestRender();return layer;};
   C.TileMapServiceImageryProvider.fromUrl(C.buildModuleUrl('Assets/Textures/NaturalEarthII')).then(p=>{add(p,0);if(!cancelled&&!satelliteActive)setBasemap('Natural Earth · geographic context');}).catch(()=>{});
   const satellite=C.Ion.defaultAccessToken?C.createWorldImageryAsync({style:C.IonWorldImageryStyle.AERIAL}):Promise.reject();
   const fallback=()=>{if(cancelled)return;satelliteActive=true;add(new C.UrlTemplateImageryProvider({url:'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',maximumLevel:15,credit:'Esri, Maxar, Earthstar Geographics'}));setBasemap('Esri World Imagery · geographic context');};
   satellite.then(p=>{const layer=add(p);if(cancelled)return;satelliteActive=true;setBasemap('Cesium World Imagery · geographic context');let failed=false;p.errorEvent.addEventListener(()=>{if(failed||cancelled)return;failed=true;v.imageryLayers.remove(layer,true);fallback();});}).catch(fallback);
   const pick=new C.ScreenSpaceEventHandler(v.scene.canvas);const corners=[];
   pick.setInputAction(event=>{if(callbacks.current.drawingArea){const point=v.camera.pickEllipsoid(event.position,v.scene.globe.ellipsoid);if(!point)return;const p=C.Cartographic.fromCartesian(point);corners.push([C.Math.toDegrees(p.longitude),C.Math.toDegrees(p.latitude)]);if(corners.length===2){const [a,b]=corners.splice(0);callbacks.current.onAreaSelected?.([Math.min(a[0],b[0]),Math.min(a[1],b[1]),Math.max(a[0],b[0]),Math.max(a[1],b[1])]);}}else{corners.length=0;const id=v.scene.pick(event.position)?.id?.properties?.catalogId?.getValue();callbacks.current.onSelect?.(id||null);}},C.ScreenSpaceEventType.LEFT_CLICK);
   v.__pick=pick;setReady(true);
  }catch(e){setError(`Map unavailable: ${e.message}. Use the observation records below.`);}
  return()=>{cancelled=true;if(v&&!v.isDestroyed()){v.__pick?.destroy();v.destroy();}viewerRef.current=null;};
 },[]);
 useEffect(()=>{const v=viewerRef.current;if(!ready||!v)return;onControlsReady?.({zoomIn:()=>{v.camera.zoomIn(Math.max(1000,v.camera.positionCartographic.height*.35));v.scene.requestRender();},zoomOut:()=>{v.camera.zoomOut(Math.max(1000,v.camera.positionCartographic.height*.5));v.scene.requestRender();},recenter:focus});return()=>onControlsReady?.(null);},[ready,onControlsReady]);
 useEffect(()=>{const v=viewerRef.current;if(!ready||!v)return;setCameraReady(false);const locate=()=>{const [lat,lon]=String(focusCoordinates||'20,80').split(',').map(Number);focus(lat,lon);setCameraReady(true);};const target=mapMode==='2d'?C.SceneMode.SCENE2D:C.SceneMode.SCENE3D;
  if(v.scene.mode===target){locate();return;}const remove=v.scene.morphComplete.addEventListener(locate);v.scene.completeMorph();if(mapMode==='2d')v.scene.morphTo2D(0);else v.scene.morphTo3D(0);return remove;
 },[ready,mapMode,focusCoordinates]);
 useEffect(()=>{const v=viewerRef.current;if(!ready||!v)return;const entities=[];
  for(const f of features){const polygons=f.geometry.type==='Polygon'?[f.geometry.coordinates]:f.geometry.type==='MultiPolygon'?f.geometry.coordinates:[];for(const polygon of polygons){const positions=C.Cartesian3.fromDegreesArray(polygon[0].flat());const chosen=f.id===selectedId;entities.push(v.entities.add({properties:{catalogId:f.id},polygon:{hierarchy:new C.PolygonHierarchy(positions,polygon.slice(1).map(r=>new C.PolygonHierarchy(C.Cartesian3.fromDegreesArray(r.flat())))),material:C.Color.fromCssColorString(chosen?'#d1f5df':'#a69de2').withAlpha(chosen?.22:.025)},polyline:{positions,width:chosen?3:1,material:C.Color.fromCssColorString(chosen?'#d1f5df':'#aca2e6').withAlpha(.8),clampToGround:true}}));}}
  if(areaBounds)entities.push(v.entities.add({rectangle:{coordinates:C.Rectangle.fromDegrees(...areaBounds),material:C.Color.fromCssColorString('#6ee7ad').withAlpha(.12),outline:true,outlineColor:C.Color.fromCssColorString('#b7f5d0')}}));
  if(focusCoordinates){const [lat,lon]=focusCoordinates.split(',').map(Number);entities.push(v.entities.add({position:C.Cartesian3.fromDegrees(lon,lat),point:{pixelSize:9,color:C.Color.WHITE,outlineColor:C.Color.fromCssColorString('#075c34'),outlineWidth:3,disableDepthTestDistance:Infinity}}));}
  v.scene.requestRender();return()=>{if(!v.isDestroyed())entities.forEach(e=>v.entities.remove(e));};
 },[ready,features,selectedId,areaBounds,focusCoordinates]);
 return <section className="x-globe-card catalog-map" data-map-ready={ready} data-camera-ready={cameraReady} data-scene-mode={mapMode} aria-label={mapMode==='3d'?'3D Earth observation globe':'2D observation map'}><div ref={host} className="x-globe-host" style={{height:'100%',cursor:drawingArea?'crosshair':undefined}} aria-label={`${features.length} catalog acquisition footprints`}/><span className="catalog-basemap">{basemap}</span>{error&&<p role="alert" className="catalog-map-error">{error}</p>}</section>;
}
