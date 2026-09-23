'use client';
import {Canvas,useFrame,useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {useEffect,useMemo,useRef,useState} from 'react';
import Link from 'next/link';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';
// Structured camera timeline: t = scroll progress
export const KEYS:{t:number;pos:[number,number,number];look:[number,number,number]}[]=[
{t:0,pos:[0,2.4,17],look:[0,3,0]},{t:.12,pos:[0,1.8,7],look:[0,1.8,0]},{t:.22,pos:[0,1.7,1.2],look:[0,1.7,-6]},
{t:.35,pos:[1,1.8,-6],look:[0,1.6,-14]},{t:.48,pos:[-2,1.8,-13],look:[0,1.4,-19]},{t:.62,pos:[0,1.6,-21],look:[0,1.2,-28]},
{t:.76,pos:[0,1.8,-28],look:[0,1,-38]},{t:.88,pos:[6,3,-38],look:[0,.5,-32]},{t:1,pos:[26,12,14],look:[0,2,-20]}];
export const SCENES=[
{a:0,b:.1,k:'Exterior',t:'Aurelia Estate',s:'Private residence · Los Angeles, California'},
{a:.1,b:.24,k:'Entrance',t:'The front door opens',s:'Hand-cut travertine, blackened steel, pivot oak.'},
{a:.24,b:.42,k:'Living room',t:'Double-height ceilings',s:'Natural stone · Panoramic views'},
{a:.42,b:.56,k:'The kitchen',t:'Crafted for gathering.',s:'Designed around natural light.'},
{a:.56,b:.7,k:'Private master suite',t:'4 bedrooms · 5 bathrooms · 6,800 sq ft',s:'Floor-to-ceiling glass to the garden.'},
{a:.7,b:.86,k:'Pool & terrace',t:'Golden hour, always',s:'Forty-foot infinity edge over the canyon.'},
{a:.86,b:.94,k:'Garden',t:'Landscape, composed',s:'Olive, cypress and native stone.'},
{a:.94,b:1.01,k:'The residence',t:'Aurelia Estate',s:'Los Angeles, California · $8,400,000 · 4 beds · 5 baths · 6,800 sq ft'}];
const cp=(i:0|1)=>new THREE.CatmullRomCurve3(KEYS.map(k=>new THREE.Vector3(...(i?k.look:k.pos))),false,'centripetal');
const ts=KEYS.map(k=>k.t);
const at=(c:THREE.CatmullRomCurve3,p:number)=>{let i=0;while(i<ts.length-2&&p>ts[i+1])i++;const f=(p-ts[i])/(ts[i+1]-ts[i]);return c.getPoint((i+Math.min(1,Math.max(0,f)))/(ts.length-1))};
const rng=(s:number)=>()=>((s=(s*16807)%2147483647)/2147483647);
function tex(w:number,h:number,draw:(c:CanvasRenderingContext2D,r:()=>number)=>void,rx=1,ry=1){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d')!,rng(7));const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rx,ry);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;return t}
function makeMats(){
 const oak=tex(512,512,(c,r)=>{c.fillStyle='#a67c52';c.fillRect(0,0,512,512);for(let i=0;i<160;i++){c.fillStyle=`rgba(${60+r()*40},${35+r()*25},15,${.05+r()*.12})`;c.fillRect(r()*512,0,1+r()*4,512)}for(let i=0;i<8;i++){c.fillStyle='rgba(30,15,5,.35)';c.fillRect(i*64,0,2,512)}},3,3);
 const marble=tex(512,512,(c,r)=>{c.fillStyle='#f3f0ea';c.fillRect(0,0,512,512);for(let i=0;i<14;i++){c.strokeStyle=`rgba(${120+r()*40},${115+r()*30},${110+r()*30},${.12+r()*.3})`;c.lineWidth=.6+r()*2.5;c.beginPath();c.moveTo(r()*512,0);c.bezierCurveTo(r()*512,150,r()*512,300,r()*512,512);c.stroke()}},1,1);
 const stone=tex(512,512,(c,r)=>{c.fillStyle='#9b9284';c.fillRect(0,0,512,512);for(let y=0;y<8;y++)for(let x=0;x<4;x++){const o=(y%2)*64;c.fillStyle=`hsl(38 ${8+r()*8}% ${44+r()*16}%)`;c.fillRect(x*128+o+2,y*64+2,124,60)}},3,2);
 const conc=tex(256,256,(c,r)=>{c.fillStyle='#b4b0a8';c.fillRect(0,0,256,256);for(let i=0;i<3000;i++){c.fillStyle=`rgba(${r()>.5?255:0},${r()>.5?255:0},0,.03)`;c.fillStyle=r()>.5?'rgba(255,255,255,.05)':'rgba(0,0,0,.06)';c.fillRect(r()*256,r()*256,2,2)}},4,4);
 const S=(o:THREE.MeshStandardMaterialParameters)=>new THREE.MeshStandardMaterial({envMapIntensity:.6,...o}),P=(o:THREE.MeshPhysicalMaterialParameters)=>new THREE.MeshPhysicalMaterial({envMapIntensity:.8,...o});
 return{oak:S({map:oak,roughness:.55}),marble:P({map:marble,roughness:.12,clearcoat:.7,clearcoatRoughness:.1}),stone:S({map:stone,roughness:.95}),conc:S({map:conc,roughness:.9}),
 plaster:S({color:'#efebe3',roughness:.92}),metal:S({color:'#1c1b19',metalness:.85,roughness:.35,envMapIntensity:1.2}),steel:S({color:'#b8bbbd',metalness:.9,roughness:.3,envMapIntensity:1.2}),
 glass:P({color:'#cfe4ea',transparent:true,opacity:.16,roughness:0,metalness:.1,side:THREE.DoubleSide,depthWrite:false,envMapIntensity:2}),
 water:P({color:'#3db6d2',roughness:.02,metalness:.25,emissive:'#14829c',emissiveIntensity:.7,transparent:true,opacity:.92,clearcoat:1,envMapIntensity:2}),
 warm:S({color:'#ffe2b0',emissive:'#ffc878',emissiveIntensity:2.4}),win:S({color:'#ffd9a0',emissive:'#ffb866',emissiveIntensity:1.1}),
 sofa:S({color:'#d9d1c3',roughness:1}),dark:S({color:'#34312d',roughness:.9}),cush:S({color:'#8d7a62',roughness:1}),linen:S({color:'#f4f1ea',roughness:1}),rug:S({color:'#c4b8a4',roughness:1}),
 leaf:S({color:'#3f6b3c',roughness:.9}),leaf2:S({color:'#5a8450',roughness:.9}),grass:S({color:'#6e7d58',roughness:1}),pot:S({color:'#8b6a52',roughness:.8}),bark:S({color:'#4a3b2b',roughness:1}),fire:S({color:'#ff9a3c',emissive:'#ff7a1a',emissiveIntensity:3})}}
type Ms=ReturnType<typeof makeMats>;type V3=[number,number,number];
const Bx=({p,s,m,r,sh=true}:{p:V3;s:V3;m:THREE.Material;r?:V3;sh?:boolean})=><mesh position={p} rotation={r} castShadow={sh} receiveShadow><boxGeometry args={s}/><primitive object={m} attach="material"/></mesh>;
const Cy=({p,r,h,m,sg=24}:{p:V3;r:number;h:number;m:THREE.Material;sg?:number})=><mesh position={p} castShadow receiveShadow><cylinderGeometry args={[r,r,h,sg]}/><primitive object={m} attach="material"/></mesh>;
const Tree=({p,s,m}:{p:V3;s:number;m:Ms})=><group position={p} scale={s}><Cy p={[0,1,0]} r={.18} h={2} m={m.bark} sg={8}/>{([[0,3,0,1.5],[.6,2.4,.3,1.1],[-.5,3.7,-.2,1.1]] as const).map(([x,y,z,r],i)=><mesh key={i} position={[x,y,z]} castShadow><icosahedronGeometry args={[r,1]}/><primitive object={i%2?m.leaf2:m.leaf} attach="material"/></mesh>)}</group>;
const Plant=({p,m,s=1}:{p:V3;m:Ms;s?:number})=><group position={p} scale={s}><Cy p={[0,.3,0]} r={.3} h={.6} m={m.pot}/>{[0,1,2,3,4].map(i=><mesh key={i} position={[Math.cos(i*1.3)*.25,.9+i*.14,Math.sin(i*1.3)*.25]} castShadow><icosahedronGeometry args={[.32,0]}/><primitive object={m.leaf} attach="material"/></mesh>)}</group>;
const Glass=({p,s,m}:{p:V3;s:V3;m:Ms})=><Bx p={p} s={s} m={m.glass} sh={false}/>;
function House({m,lite}:{m:Ms;lite:boolean}){return <>
 {/* land */}
 <mesh rotation-x={-Math.PI/2} position={[0,-.03,-20]} receiveShadow><planeGeometry args={[240,240]}/><primitive object={m.grass} attach="material"/></mesh>
 {[0,1,2].map(i=><mesh key={i} position={[(i-1)*70,9,-130]}><coneGeometry args={[46,24+i*6,5]}/><meshStandardMaterial color={['#8c9481','#7f8776','#939a89'][i]} roughness={1}/></mesh>)}
 {Array.from({length:8}).map((_,i)=><Bx key={i} p={[0,.03,14-i*1.7]} s={[3.2,.06,1.3]} m={m.stone}/>)}
 <Bx p={[0,.02,-42]} s={[30,.04,24]} m={m.stone}/>
 {/* plinth, oak/marble floors, roof slabs (cantilever + overhang) */}
 <Bx p={[0,-.15,-14]} s={[17,.4,29.4]} m={m.conc}/><Bx p={[0,.05,-6]} s={[15.4,.1,12]} m={m.oak}/><Bx p={[0,.05,-14.5]} s={[15.4,.11,7]} m={m.marble}/><Bx p={[0,.05,-24]} s={[15.4,.1,8]} m={m.oak}/>
 <Bx p={[0,5.35,-14]} s={[18.4,.5,31]} m={m.plaster}/><Bx p={[3,6.8,-3]} s={[14,2.2,16]} m={m.plaster}/><Bx p={[3,6.8,4.6]} s={[14.3,2.4,.3]} m={m.metal}/><Bx p={[3,5.9,5.2]} s={[14.6,.12,.2]} m={m.warm} sh={false}/>
 <Bx p={[-6,6.2,-20]} s={[6,1.1,10]} m={m.stone}/>
 {/* balcony w/ glass rail */}
 <Glass p={[-8.6,6.2,-8]} s={[.05,1.2,14]} m={m}/><Glass p={[-5.6,6.1,-8]} s={[6,1.2,.05]} m={m}/><Bx p={[-8.6,6.8,-8]} s={[.08,.06,14]} m={m.steel}/>
 {/* front facade: stone piers, glazing ribbons, mullions, entrance canopy + door frame */}
 <Bx p={[-5.4,2.5,0]} s={[5,5,.6]} m={m.stone}/><Bx p={[6.2,2.5,0]} s={[3.6,5,.6]} m={m.stone}/><Bx p={[0,4.5,0]} s={[3.6,1,.6]} m={m.plaster}/>
 <Bx p={[3.1,2.5,0]} s={[2.6,5,.3]} m={m.dark}/><Glass p={[3.1,2.4,0]} s={[2.6,4.6,.05]} m={m}/><Bx p={[3.1,2.4,-.5]} s={[2.4,4.4,.04]} m={m.win} sh={false}/>
 <Bx p={[-1.85,1.85,0]} s={[.2,3.7,.5]} m={m.metal}/><Bx p={[1.85,1.85,0]} s={[.2,3.7,.5]} m={m.metal}/><Bx p={[0,3.7,0]} s={[3.9,.2,.5]} m={m.metal}/>
 <Bx p={[0,4.05,1.6]} s={[5.4,.16,3.6]} m={m.metal}/><Bx p={[0,3.95,1.6]} s={[5,.04,3.2]} m={m.warm} sh={false}/>
 {[-2.4,2.4].map(x=><Cy key={x} p={[x,1.95,3]} r={.09} h={3.9} m={m.metal} sg={12}/>)}
 <Bx p={[0,.03,-.4]} s={[3.6,.06,1.6]} m={m.marble}/>
 {/* side walls: stone with window ribbons and metal frames */}
 {[-8,8].map(x=><group key={x}><Bx p={[x,2.5,-14]} s={[.5,5,28.4]} m={m.stone}/>{[-5,-14,-23].map(z=><group key={z}><Bx p={[x+(x<0?.28:-.28),2.6,z]} s={[.06,2.6,5]} m={m.win} sh={false}/><Glass p={[x+(x<0?-.28:.28),2.6,z]} s={[.05,2.6,5]} m={m}/><Bx p={[x+(x<0?-.3:.3),2.6,z]} s={[.08,.12,5.2]} m={m.metal}/></group>)}</group>)}
 {/* rear glass wall */}
 <Glass p={[0,2.5,-28]} s={[15.4,5,.05]} m={m}/><Bx p={[0,5,-28]} s={[16,.3,.3]} m={m.metal}/>{[-7.5,-5,-2.5,0,2.5,5,7.5].map(x=><Bx key={x} p={[x,2.5,-28]} s={[.12,5,.2]} m={m.metal}/>)}
 {/* partitions with thickness + cove light */}
 {[-10,-19].map(z=><group key={z}><Bx p={[-6.2,2.5,z]} s={[3.6,5,.45]} m={m.plaster}/><Bx p={[6.2,2.5,z]} s={[3.6,5,.45]} m={m.plaster}/><Bx p={[0,4.5,z]} s={[8.8,1,.45]} m={m.plaster}/><Bx p={[0,3.98,z+.05]} s={[8.6,.05,.2]} m={m.warm} sh={false}/></group>)}
 {[-6,-15,-24].map(z=>[-6.5,-2,2.5,6.5].map(x=><mesh key={x+'_'+z} position={[x,5,z]} rotation-x={Math.PI/2}><circleGeometry args={[.16,16]}/><primitive object={m.warm} attach="material"/></mesh>))}
 {/* LIVING */}
 <Bx p={[0,.13,-6]} s={[6,.04,4.6]} m={m.rug} sh={false}/>
 <group position={[-3.6,0,-5.6]}><Bx p={[0,.25,0]} s={[5,.5,1.5]} m={m.sofa}/><Bx p={[0,.75,-.6]} s={[5,.7,.35]} m={m.sofa}/><Bx p={[-2.6,.5,0]} s={[.3,.9,1.5]} m={m.sofa}/><Bx p={[2.6,.5,0]} s={[.3,.9,1.5]} m={m.sofa}/><Bx p={[-1.7,.95,-.3]} s={[.7,.6,.2]} m={m.cush} r={[.2,0,.1]}/><Bx p={[1.5,.95,-.3]} s={[.7,.6,.2]} m={m.cush} r={[.2,0,-.1]}/><Bx p={[3.6,.2,1.6]} s={[1.3,.5,1.3]} m={m.sofa}/></group>
 <Cy p={[-2.2,.3,-3.2]} r={.85} h={.08} m={m.marble}/><Cy p={[-2.2,.15,-3.2]} r={.2} h={.3} m={m.metal} sg={12}/>
 <Bx p={[7.7,2.5,-6]} s={[.5,5,8]} m={m.stone}/><Bx p={[7.4,1.3,-6]} s={[.1,.7,3.6]} m={m.dark}/><Bx p={[7.34,1.2,-6]} s={[.06,.35,3.2]} m={m.fire} sh={false}/><Bx p={[7.3,.3,-6]} s={[.6,.4,4]} m={m.oak}/>
 <Plant p={[-6.8,0,-1.6]} m={m} s={1.8}/><Plant p={[6.5,0,-8.8]} m={m} s={1.4}/><Bx p={[-7.6,2.4,-6]} s={[.06,1.6,2.4]} m={m.dark}/>
 <Cy p={[-6.6,1,-4.6]} r={.03} h={2} m={m.metal} sg={6}/><mesh position={[-6.6,2.1,-4.6]}><sphereGeometry args={[.22,16,12]}/><primitive object={m.warm} attach="material"/></mesh>
 {/* KITCHEN */}
 <Bx p={[0,.5,-14.5]} s={[5.4,1,1.5]} m={m.oak}/><Bx p={[0,1.05,-14.5]} s={[5.8,.1,1.8]} m={m.marble}/><Bx p={[3.05,.5,-14.5]} s={[.1,1,1.5]} m={m.marble}/>
 {[-1.8,0,1.8].map(x=><group key={x}><Cy p={[x,.38,-13.35]} r={.22} h={.05} m={m.dark}/><Cy p={[x,.7,-13.35]} r={.22} h={.1} m={m.cush}/><Cy p={[x,.2,-13.35]} r={.03} h={.4} m={m.metal} sg={8}/><Cy p={[x,.55,-13.35]} r={.03} h={.36} m={m.metal} sg={8}/><Cy p={[x,3.4,-14.5]} r={.012} h={1.9} m={m.metal} sg={4}/><mesh position={[x,2.4,-14.5]}><cylinderGeometry args={[.1,.32,.3,20]}/><primitive object={m.warm} attach="material"/></mesh></group>)}
 <Bx p={[7.4,1.55,-14.5]} s={[.7,3.1,9]} m={m.dark}/><Bx p={[7.03,1.2,-14.5]} s={[.05,.06,8.6]} m={m.warm} sh={false}/><Bx p={[7.05,1.9,-13]} s={[.05,.8,.8]} m={m.marble}/><Bx p={[7.02,1.5,-16]} s={[.08,1.2,1]} m={m.steel}/><Bx p={[7.02,.5,-14.4]} s={[.08,.7,.8]} m={m.steel}/><Bx p={[7.0,1.95,-17]} s={[.06,.8,1.4]} m={m.metal}/>
 {/* BEDROOM */}
 <Bx p={[0,.5,-23.6]} s={[3.8,.3,4.6]} m={m.oak}/><Bx p={[0,.9,-23.4]} s={[3.6,.5,4.3]} m={m.linen}/><Bx p={[0,1.4,-25.9]} s={[7,2.8,.25]} m={m.oak}/><Bx p={[-.9,1.25,-25.4]} s={[1.2,.3,.5]} m={m.linen}/><Bx p={[.9,1.25,-25.4]} s={[1.2,.3,.5]} m={m.linen}/><Bx p={[0,1.2,-22.4]} s={[3.6,.05,1.3]} m={m.cush} r={[.05,0,0]}/>
 {[-2.6,2.6].map(x=><group key={x}><Bx p={[x,.35,-25.4]} s={[.9,.7,.7]} m={m.dark}/><Cy p={[x,.95,-25.4]} r={.07} h={.5} m={m.metal} sg={8}/><mesh position={[x,1.3,-25.4]}><cylinderGeometry args={[.16,.22,.3,16]}/><primitive object={m.warm} attach="material"/></mesh></group>)}
 <Bx p={[0,.12,-23]} s={[7,.04,6]} m={m.rug} sh={false}/><Bx p={[-7,2.5,-23]} s={[.3,5,3]} m={m.linen}/><Plant p={[6.6,0,-26]} m={m} s={1.5}/>
 {/* TERRACE, POOL, LOUNGERS */}
 <Bx p={[0,.03,-33]} s={[17,.14,10]} m={m.stone}/>
 <Bx p={[0,-.02,-42]} s={[15,.14,16]} m={m.marble}/><mesh position={[0,.08,-42]} rotation-x={-Math.PI/2}><planeGeometry args={[11,13]}/><primitive object={m.water} attach="material"/></mesh>
 <Glass p={[-6.7,.6,-38]} s={[.05,1.1,8]} m={m}/><Glass p={[6.7,.6,-38]} s={[.05,1.1,8]} m={m}/>
 {[-7,-5.5,5.5,7].map((x,i)=><group key={x} position={[x,0,-38+((i*3)%4)]}><Bx p={[0,.32,0]} s={[1.1,.14,2.4]} m={m.linen}/><Bx p={[0,.14,0]} s={[1,.3,2.2]} m={m.metal}/><Bx p={[0,.6,-.9]} s={[1,.2,.7]} m={m.linen} r={[.6,0,0]}/></group>)}
 <Cy p={[-4,.3,-33]} r={.5} h={.6} m={m.metal}/><mesh position={[-4,.66,-33]}><cylinderGeometry args={[.4,.4,.1,16]}/><primitive object={m.fire} attach="material"/></mesh>
 <Bx p={[3,.4,-32.5]} s={[3.2,.7,1.1]} m={m.sofa}/><Bx p={[3,.85,-33]} s={[3.2,.6,.3]} m={m.sofa}/>

 {/* EXTRAS: ceiling slats, shelving, dining, pergola, sconces, planters, pool detail */}
 {Array.from({length:16}).map((_,i)=><Bx key={i} p={[-7+i*.93,5.02,-5]} s={[.16,.14,8]} m={m.oak} sh={false}/>)}
 <Bx p={[-7.6,1.6,-1.6]} s={[.35,3.2,2.6]} m={m.dark}/>{[.6,1.4,2.2,3].map(y=><Bx key={y} p={[-7.38,y,-1.6]} s={[.05,.05,2.4]} m={m.warm} sh={false}/>)}
 <group position={[-4,0,-16.6]}><Bx p={[0,.78,0]} s={[2.6,.08,1.1]} m={m.oak}/>{[-1.1,1.1].map(x=><Bx key={x} p={[x,.38,0]} s={[.08,.76,.9]} m={m.metal}/>)}{[-.8,0,.8].flatMap(x=>[-.85,.85].map(z=><Bx key={x+'_'+z} p={[x,.45,z]} s={[.5,.9,.5]} m={m.dark}/>))}</group>
 <Bx p={[0,2.4,-10.27]} s={[1.6,1.1,.06]} m={m.dark}/><Bx p={[0,2.4,-10.3]} s={[1.4,.9,.04]} m={m.stone} sh={false}/><Bx p={[-4,2.2,-18.75]} s={[2,1.2,.05]} m={m.marble}/>
 {[-2.6,2.6].map(x=><Bx key={x} p={[x,2.5,.36]} s={[.16,.5,.12]} m={m.warm} sh={false}/>)}
 {[-2,2].map(x=><group key={x}><Bx p={[x*1.6,.35,3.4]} s={[1,.7,1]} m={m.stone}/><Plant p={[x*1.6,.7,3.4]} m={m} s={1.3}/></group>)}
 {[[-7.5,-30],[-3,-30],[-7.5,-36],[-3,-36]].map(([x,z])=><Bx key={x+'_'+z} p={[x,1.6,z]} s={[.16,3.2,.16]} m={m.metal}/>)}{Array.from({length:12}).map((_,i)=><Bx key={i} p={[-5.25,3.25,-30.4-i*.5]} s={[5.4,.1,.12]} m={m.oak}/>)}
 <Bx p={[-5.25,.4,-33]} s={[2.4,.06,1]} m={m.oak}/>{[-1,1].map(s=><Bx key={s} p={[-5.25+s*.9,.2,-33]} s={[.08,.4,.9]} m={m.metal}/>)}
 <mesh position={[0,-.6,-42]} rotation-x={-Math.PI/2}><planeGeometry args={[11,13]}/><meshStandardMaterial color="#9fdcea" emissive="#2aa5c2" emissiveIntensity={.8} roughness={.4}/></mesh>
 {[-4,-1,2,5].map(z=><mesh key={z} position={[5.45,-.1,-42+z*.9]}><sphereGeometry args={[.14,8,8]}/><primitive object={m.warm} attach="material"/></mesh>)}
 {[[-5.5,-.2],[-5.5,-.9]].map(([x,y],i)=><Bx key={i} p={[x+i*.9,y,-36]} s={[3,.2,.7]} m={m.marble} sh={false}/>)}
 {/* GARDEN */}
 {Array.from({length:lite?12:30}).map((_,i)=>{const x=(i%2?1:-1)*(11+((i*7)%14)),z=6-((i*11)%64);return <Tree key={i} p={[x,0,z]} s={.9+((i*3)%5)*.18} m={m}/>})}
 {[-1,1].map(s=>Array.from({length:6}).map((_,i)=><Bx key={s+'_'+i} p={[s*5.8,.45,8-i*2.2]} s={[1.4,.9,1.8]} m={m.leaf}/>))}
 {Array.from({length:8}).map((_,i)=><group key={i}><Cy p={[(i%2?1:-1)*2.2,.25,12-i*1.6]} r={.06} h={.5} m={m.metal} sg={6}/><mesh position={[(i%2?1:-1)*2.2,.55,12-i*1.6]}><sphereGeometry args={[.08,8,8]}/><primitive object={m.warm} attach="material"/></mesh></group>)}
 {Array.from({length:8}).map((_,i)=><mesh key={i} position={[(i%2?1:-1)*(9+i),.35,-2-i*4]} scale={[1.4,.8,1]}><icosahedronGeometry args={[.7,0]}/><primitive object={m.stone} attach="material"/></mesh>)}</>}
function Scene({prog,lite}:{prog:React.MutableRefObject<number>;lite:boolean}){
 const door=useRef<THREE.Group>(null),pc=useMemo(()=>cp(0),[]),lc=useMemo(()=>cp(1),[]),cur=useRef(0),sun=useRef<THREE.DirectionalLight>(null),m=useMemo(makeMats,[]);
 const {camera,gl,scene}=useThree();
 useEffect(()=>{gl.toneMapping=THREE.ACESFilmicToneMapping;gl.toneMappingExposure=1.08;gl.shadowMap.type=THREE.PCFSoftShadowMap;const g=new THREE.PMREMGenerator(gl);const t=g.fromScene(new RoomEnvironment(),.04);scene.environment=t.texture;return()=>{t.dispose();g.dispose()}},[gl,scene]);
 useFrame((_,d)=>{cur.current+=(prog.current-cur.current)*Math.min(1,d*3.2);const p=cur.current;
  camera.position.copy(at(pc,p));camera.lookAt(at(lc,p));
  if(door.current)door.current.rotation.y=-Math.min(1,Math.max(0,(p-.1)/.11))*1.65;
  m.water.emissiveIntensity=.7+Math.sin(performance.now()/900)*.15;if(sun.current)sun.current.intensity=2.4-Math.min(1.1,p*1.3)});
 return <>
 <ambientLight intensity={.25}/><hemisphereLight args={['#cfd9f2','#7a6c58',.45]}/>
 <directionalLight ref={sun} color="#ffd2a0" position={[26,20,22]} castShadow={!lite} shadow-mapSize={[2048,2048]} shadow-bias={-.0004} shadow-camera-left={-40} shadow-camera-right={40} shadow-camera-top={40} shadow-camera-bottom={-60} shadow-camera-far={140}/>
 {[[0,4.4,-4,26],[-3,4.4,-9,22],[2,4.4,-15,30],[0,4.4,-21,26],[0,4.4,-25,22]].map(([x,y,z,i],k)=><pointLight key={k} position={[x,y,z]} color="#ffb56b" intensity={i} distance={16} decay={2}/>)}
 <pointLight position={[0,-.3,-42]} color="#4ad2f0" intensity={40} distance={16}/><pointLight position={[0,3,1]} color="#ffc98a" intensity={14} distance={9}/>
 <fog attach="fog" args={['#cbc9dc',45,150]}/>
 <House m={m} lite={lite}/>
 <group ref={door} position={[-1.65,0,.05]}><mesh position={[1.65,1.8,0]} castShadow><boxGeometry args={[3.3,3.6,.16]}/><primitive object={m.oak} attach="material"/></mesh><Bx p={[2.9,1.6,.14]} s={[.05,1.6,.05]} m={m.steel}/></group>
 </>}
export default function Journey(){
 const box=useRef<HTMLDivElement>(null),prog=useRef(0),[si,setSi]=useState(0),[lite,setLite]=useState(false),[pct,setPct]=useState(0),name=useRef<HTMLDivElement>(null),mouse=useRef<HTMLDivElement>(null);
 useEffect(()=>{setLite(matchMedia('(max-width:768px)').matches);
  const f=()=>{const e=box.current;if(!e)return;const r=e.getBoundingClientRect(),p=Math.min(1,Math.max(0,-r.top/(r.height-innerHeight)));prog.current=p;
   const i=SCENES.findIndex(s=>p>=s.a&&p<s.b);setSi(i<0?SCENES.length-1:i);setPct(Math.round(p*100));
   if(name.current){name.current.style.opacity=String(Math.max(0,1-p*9));name.current.style.transform=`translate(-50%,${p*-120}px) scale(${1+p*.6})`}};
  f();addEventListener('scroll',f,{passive:true});addEventListener('resize',f);return()=>{removeEventListener('scroll',f);removeEventListener('resize',f)}},[]);
 const sc=SCENES[si],last=si===SCENES.length-1;
 return <section ref={box} className="journey" aria-label="Cinematic tour of Aurelia Estate" style={{height:lite?'600vh':'900vh'}}>
  <div className="stage"><div className="sky"/><div ref={name} className="bigname" aria-hidden="true">AURELIA</div>
   <Canvas shadows={!lite} dpr={lite?[1,1.5]:[1,2]} camera={{fov:52,near:.1,far:200,position:[0,2.4,17]}} gl={{alpha:true,antialias:true,powerPreference:'high-performance'}} className="cv"><Scene prog={prog} lite={lite}/></Canvas>
   <div className="hud tl"><b>{sc.k}</b><span>{pct}%</span></div>
   <div className="hud caption" key={si}><h2>{sc.t}</h2><p>{sc.s}</p>{si===0&&<><p className="specs">4 bedrooms · 5 bathrooms · 6,800 sq ft</p><p className="price">$8,400,000</p><a className="pill" href="#intro">Scroll to explore residence</a></>}{last&&<Link className="pill" href="/properties/aurelia-estate">Explore residence</Link>}</div>
   <div className="rail" aria-hidden="true"><i style={{height:pct+'%'}}/></div></div></section>}
