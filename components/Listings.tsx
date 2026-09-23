'use client';
import Link from 'next/link';import {useMemo,useState} from 'react';import Pic from './Pic';import {properties,cities,types,usd} from '@/lib/data';
export default function Listings(){const [f,sf]=useState({city:'',type:'',bed:'',bath:'',min:'',max:''}),[open,so]=useState(false);
 const set=(k:string)=>(e:React.ChangeEvent<HTMLSelectElement|HTMLInputElement>)=>sf({...f,[k]:e.target.value});
 const res=useMemo(()=>properties.filter(p=>(!f.city||p.city===f.city)&&(!f.type||p.type===f.type)&&(!f.bed||p.bedrooms>=+f.bed)&&(!f.bath||p.bathrooms>=+f.bath)&&(!f.min||p.price>=+f.min)&&(!f.max||p.price<=+f.max)),[f]);
 const n=[1,2,3,4,5,6,7];
 return <><button className="pill dark filt-btn" onClick={()=>so(!open)} aria-expanded={open}>Filters</button>
 <form className={'filters '+(open?'open':'')} onSubmit={e=>e.preventDefault()} aria-label="Filter properties">
 <label>Location<select value={f.city} onChange={set('city')}><option value="">All</option>{cities.map(c=><option key={c}>{c}</option>)}</select></label>
 <label>Type<select value={f.type} onChange={set('type')}><option value="">All</option>{types.map(c=><option key={c}>{c}</option>)}</select></label>
 <label>Bedrooms<select value={f.bed} onChange={set('bed')}><option value="">Any</option>{n.map(x=><option key={x} value={x}>{x}+</option>)}</select></label>
 <label>Bathrooms<select value={f.bath} onChange={set('bath')}><option value="">Any</option>{n.map(x=><option key={x} value={x}>{x}+</option>)}</select></label>
 <label>Min price<select value={f.min} onChange={set('min')}><option value="">None</option>{[3e6,5e6,8e6,12e6].map(x=><option key={x} value={x}>{usd(x)}</option>)}</select></label>
 <label>Max price<select value={f.max} onChange={set('max')}><option value="">None</option>{[5e6,8e6,12e6,20e6].map(x=><option key={x} value={x}>{usd(x)}</option>)}</select></label>
 <button type="button" className="pill" onClick={()=>sf({city:'',type:'',bed:'',bath:'',min:'',max:''})}>Reset</button><button type="button" className="pill dark sheet-close" onClick={()=>so(false)}>Show {res.length} residences</button></form>
 <p aria-live="polite" className="count">{res.length} of 20 residences</p>
 {res.length?<ul className="grid3">{res.map(p=><li key={p.id}><Link href={`/properties/${p.slug}`} className="pc"><div className="ph"><Pic src={p.heroImage} alt={`${p.name}, ${p.type}`}/><Pic src={p.gallery[5].src} alt="" cls="second"/></div><div className="meta"><h3>{p.name}</h3><p>{p.location}</p><p><b>{usd(p.price)}</b></p><p>{p.bedrooms} bed · {p.bathrooms} bath · {p.sqft.toLocaleString()} sq ft</p><span className="more">View residence</span></div></Link></li>)}</ul>:<p className="empty">No residence matches these filters. Reset a filter to widen the search.</p>}</>}
