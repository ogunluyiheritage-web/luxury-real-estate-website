import dynamic from 'next/dynamic';import Sections from '@/components/Sections';
const Journey=dynamic(()=>import('@/components/Journey'),{ssr:false,loading:()=><div className="journey-load" aria-hidden><div className="bigname">AURELIA</div></div>});
export default function Home(){return <><Journey/><Sections/></>}
