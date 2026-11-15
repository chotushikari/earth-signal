import { parseCoordinatePair } from './coordinates.js';
export const curatedPlaces=[{name:'Vembanad Lake, Kerala',region:'Kerala, India',latitude:9.62,longitude:76.34},{name:'Sundarbans Delta',region:'India / Bangladesh',latitude:21.95,longitude:88.77},{name:'Pine Island Glacier',region:'Antarctica',latitude:-75.1,longitude:-100.1},{name:'North Dakota Farmlands',region:'United States',latitude:47.4,longitude:-100.5}];
export function resolveLocation(value){
 const place=curatedPlaces.find(p=>p.name.toLowerCase()===value.trim().toLowerCase());if(place)return {valid:true,...place};
 const parts=value.split(',');if(parts.length!==2)return {valid:false,error:'Choose a suggested place or enter latitude, longitude.'};
 const point=parseCoordinatePair(...parts);return point.valid?{...point,name:'Selected coordinates',region:'Custom location'}:point;
}
export function rectangleArea(values){
 if(values.length!==4||values.some(x=>String(x).trim()===''))return {valid:false,error:'Enter west, south, east and north bounds.'};
 const [west,south,east,north]=values.map(Number);
 if(![west,south,east,north].every(Number.isFinite)||Math.abs(west)>180||Math.abs(east)>180||Math.abs(south)>90||Math.abs(north)>90)return {valid:false,error:'Use valid longitude and latitude bounds.'};
 if(east<=west||north<=south)return {valid:false,error:'East must exceed west, and north must exceed south.'};
 if(east-west>5||north-south>5)return {valid:false,error:'Keep this discovery area within 5° per side.'};
 return {valid:true,bounds:[west,south,east,north],wkt:`POLYGON((${west} ${south},${east} ${south},${east} ${north},${west} ${north},${west} ${south}))`,latitude:(south+north)/2,longitude:(west+east)/2,name:'Selected area',region:'Custom geographic rectangle'};
}
