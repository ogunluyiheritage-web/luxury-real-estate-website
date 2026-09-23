'use client';
import Image from 'next/image';import {useState} from 'react';import {fallbackFor} from '@/lib/photos';
export default function Pic({src,alt,priority,sizes='(max-width:768px) 100vw, 50vw',cls=''}:{src:string;alt:string;priority?:boolean;sizes?:string;cls?:string}){
 const [cur,setCur]=useState({from:src,src});if(cur.from!==src)setCur({from:src,src});
 return <div className={'pic '+cls}><Image src={cur.src} alt={alt} fill sizes={sizes} priority={priority} quality={90} unoptimized={cur.src.startsWith('data:')} onError={()=>{const f=fallbackFor(cur.src);if(f)setCur({from:src,src:f})}}/></div>}
