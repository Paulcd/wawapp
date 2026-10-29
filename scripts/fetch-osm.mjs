// Uso: npm run osm -- <sur> <oeste> <norte> <este>   (por defecto, zona de ejemplo de SJL)
import {writeFileSync} from 'node:fs';
const b=process.argv.slice(2).map(Number);const bbox=b.length==4?b:[-11.9935,-77.0105,-11.9880,-77.0040];
const q=`[out:json][timeout:25];(way["building"](${bbox});way["highway"](${bbox}););out geom;`;
const r=await fetch('https://overpass-api.de/api/interpreter',{method:'POST',body:'data='+encodeURIComponent(q)});
if(!r.ok)throw new Error('Overpass respondió '+r.status);
const d=await r.json();writeFileSync('public/data/sjl.json',JSON.stringify(d));
console.log('Guardado public/data/sjl.json con',d.elements.length,'elementos. © OpenStreetMap contributors (ODbL)');
