'use client';
import Link from 'next/link';import {useEffect,useState} from 'react';
const L=[['/properties','Properties'],['/about','About'],['/#experience','Experience'],['/contact','Contact']];
export default function Nav(){const [o,so]=useState(false),[s,ss]=useState(false);
 useEffect(()=>{const f=()=>ss(scrollY>40);f();addEventListener('scroll',f,{passive:true});return()=>removeEventListener('scroll',f)},[]);
 useEffect(()=>{document.body.style.overflow=o?'hidden':''},[o]);
 return <header className={'nav '+(s?'stuck':'')}><Link href="/" className="logo" onClick={()=>so(false)}>Aurelia</Link>
 <nav aria-label="Primary" className="links">{L.map(([h,t])=><Link key={h} href={h}>{t}</Link>)}</nav>
 <Link href="/contact" className="pill dark hide-m">Private consultation</Link>
 <button className="burger" aria-expanded={o} aria-controls="menu" aria-label={o?'Close menu':'Open menu'} onClick={()=>so(!o)}><span/><span/></button>
 <div id="menu" className={'menu '+(o?'open':'')} hidden={!o}>{L.map(([h,t])=><Link key={h} href={h} onClick={()=>so(false)}>{t}</Link>)}<Link href="/contact" className="pill dark" onClick={()=>so(false)}>Private consultation</Link></div></header>}
