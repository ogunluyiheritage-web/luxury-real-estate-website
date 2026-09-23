'use client';
import {useState} from 'react';import {properties} from '@/lib/data';
// Connect a real backend by replacing submit() body with fetch('/api/consult',{method:'POST',body:JSON.stringify(v)})
async function submit(_v:Record<string,string>){await new Promise(r=>setTimeout(r,500))}
export default function ContactForm({interest=''}:{interest?:string}){const [e,se]=useState<Record<string,string>>({}),[ok,so]=useState(false),[b,sb]=useState(false);
 if(ok)return <div className="ok" role="status"><h3>Thank you.</h3><p>Your request is received. An advisor will contact you within one business day.</p></div>;
 return <form noValidate className="form" onSubmit={async ev=>{ev.preventDefault();const v=Object.fromEntries(new FormData(ev.currentTarget)) as Record<string,string>,er:Record<string,string>={};
  if(!v.name?.trim())er.name='Enter your name.';if(!/^\S+@\S+\.\S+$/.test(v.email||''))er.email='Enter a valid email address.';if(v.phone&&!/^[+\d\s()-]{7,}$/.test(v.phone))er.phone='Enter a valid phone number.';if((v.message||'').trim().length<10)er.message='Tell us a little more (10+ characters).';
  se(er);if(Object.keys(er).length)return;sb(true);await submit(v);sb(false);so(true)}}>
 {[['name','Name','text'],['email','Email','email'],['phone','Phone','tel']].map(([n,l,t])=><label key={n}>{l}<input name={n} type={t} aria-invalid={!!e[n]} aria-describedby={e[n]?n+'e':undefined}/>{e[n]&&<em id={n+'e'} role="alert">{e[n]}</em>}</label>)}
 <label>Property interest<select name="interest" defaultValue={interest}><option value="">General enquiry</option>{properties.map(p=><option key={p.id} value={p.name}>{p.name}</option>)}</select></label>
 <label>Message<textarea name="message" rows={5} aria-invalid={!!e.message}/>{e.message&&<em role="alert">{e.message}</em>}</label>
 <button className="pill dark" disabled={b}>{b?'Sending…':'Request a private consultation'}</button></form>}
