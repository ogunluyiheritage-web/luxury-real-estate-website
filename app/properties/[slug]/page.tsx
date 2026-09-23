import {notFound} from 'next/navigation';import type {Metadata} from 'next';import Link from 'next/link';import Pic from '@/components/Pic';import Gallery from '@/components/Gallery';import {properties,getProperty,usd} from '@/lib/data';
export const generateStaticParams=()=>properties.map(p=>({slug:p.slug}));
export function generateMetadata({params}:{params:{slug:string}}):Metadata{const p=getProperty(params.slug);if(!p)return{};return{title:p.name,description:p.description,alternates:{canonical:`/properties/${p.slug}`},openGraph:{title:p.name,description:p.description},twitter:{card:'summary_large_image'}}}
export default function D({params}:{params:{slug:string}}){const p=getProperty(params.slug);if(!p)notFound();
 const ld={'@context':'https://schema.org','@type':'RealEstateListing',name:p.name,description:p.description,offers:{'@type':'Offer',price:p.price,priceCurrency:'USD'},address:p.location};
 const g=(l:string)=>p.gallery.find(x=>x.label===l)!;
 return <article><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(ld)}}/>
 <header className="phero"><Pic src={p.heroImage} alt={`${p.name} exterior`} priority sizes="100vw"/><div><h1>{p.name}</h1><p>{p.location} · {usd(p.price)}</p></div></header>
 <div className="pgrid"><div>
 <section className="sec"><h2>Overview</h2><p className="lead">{p.description}</p><p>{p.type}. Composed for privacy, light and long views.</p></section>
 <section className="sec"><h2>Exterior</h2><Gallery name={p.name} items={[g('Exterior'),g('Terrace')]}/></section>
 <section className="sec"><h2>Living spaces & kitchen</h2><Gallery name={p.name} items={[g('Living room'),g('Kitchen')]}/></section>
 <section className="sec"><h2>Bedrooms & bathrooms</h2><Gallery name={p.name} items={[g('Master bedroom'),g('Bathroom')]}/></section>
 <section className="sec"><h2>Pool & garden</h2><Gallery name={p.name} items={[g('Pool'),g('Garden')]}/></section>
 <section className="sec"><h2>Amenities</h2><ul className="tags">{p.amenities.map(a=><li key={a}>{a}</li>)}</ul></section>
 <section className="sec"><h2>Architecture & plan</h2><svg viewBox="0 0 400 240" role="img" aria-label={`Schematic floor plan of ${p.name}`} className="plan"><rect x="10" y="10" width="380" height="220" fill="none" stroke="currentColor" strokeWidth="3"/><path d="M140 10v130M140 140h250M260 140v90M10 120h130" stroke="currentColor" fill="none"/><text x="60" y="70" fontSize="12">Living</text><text x="300" y="80" fontSize="12">Kitchen</text><text x="60" y="180" fontSize="12">Suite</text><text x="310" y="190" fontSize="12">Terrace</text></svg></section>
 <section className="sec"><h2>Location</h2><p>{p.location} · {p.coordinates[0]}°, {p.coordinates[1]}°</p></section></div>
 <aside className="sticky"><h2>Details</h2><dl><dt>Price</dt><dd>{usd(p.price)}</dd><dt>Bedrooms</dt><dd>{p.bedrooms}</dd><dt>Bathrooms</dt><dd>{p.bathrooms}</dd><dt>Area</dt><dd>{p.sqft.toLocaleString()} sq ft</dd><dt>Type</dt><dd>{p.type}</dd></dl><Link className="pill dark" href={`/contact?property=${encodeURIComponent(p.name)}`}>Contact your advisor</Link></aside></div></article>}
