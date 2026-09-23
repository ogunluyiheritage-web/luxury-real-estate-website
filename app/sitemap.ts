import {properties} from '@/lib/data';
const b=process.env.NEXT_PUBLIC_SITE_URL||'https://aurelia-estates.vercel.app';
export default function s(){return [...['','/properties','/about','/contact'].map(u=>({url:b+u})),...properties.map(p=>({url:`${b}/properties/${p.slug}`}))]}
