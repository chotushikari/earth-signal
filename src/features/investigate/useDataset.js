import { useEffect,useState } from 'react';
import { contextFromSearch, fetchDataset, loadDataset } from '../../services/discovery/workflow';
export default function useDataset(){
 const [revision,setRevision]=useState(0),[state,setState]=useState({loading:true,dataset:null,error:''});
 useEffect(()=>{const controller=new AbortController();const p=new URLSearchParams(location.search);const cached=loadDataset(p.get('dataset'));if(cached&&!revision){setState({loading:false,dataset:cached,error:''});return()=>controller.abort();}
 if(!p.has('lat')&&!p.has('bounds')){setState({loading:false,dataset:null,error:'Start with a location in Explore to create an observation search.'});return()=>controller.abort();}
 setState({loading:true,dataset:null,error:''});fetchDataset(contextFromSearch(location.search),controller.signal).then(dataset=>{if(!controller.signal.aborted)setState({loading:false,dataset,error:''});}).catch(e=>{if(!controller.signal.aborted)setState({loading:false,dataset:null,error:e.message});});return()=>controller.abort();},[revision]);
 return {...state,retry:()=>setRevision(x=>x+1)};
}
