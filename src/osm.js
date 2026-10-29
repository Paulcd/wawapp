// Descarga edificios y calles de OpenStreetMap (Overpass). bbox = [sur, oeste, norte, este]
const ENDPOINTS=['https://overpass-api.de/api/interpreter','https://overpass.kumi.systems/api/interpreter'];
export async function loadOSM(bbox){
  const key='osm:'+bbox.map(n=>n.toFixed(4)).join(',');
  try{const c=localStorage.getItem(key);if(c)return JSON.parse(c)}catch{}
  const q=`[out:json][timeout:25];(way["building"](${bbox.join(',')});way["highway"](${bbox.join(',')}););out geom;`;
  let err;
  for(const url of ENDPOINTS){
    try{const r=await fetch(url,{method:'POST',body:'data='+encodeURIComponent(q)});
      if(!r.ok)throw new Error('Overpass '+r.status);
      const d=await r.json();try{localStorage.setItem(key,JSON.stringify(d))}catch{}return d}
    catch(e){err=e}
  }
  throw err;
}
// Respaldo sin internet: archivo generado con `npm run osm`
export async function loadFallback(){return (await fetch('/data/sjl.json')).json()}
