import ContactForm from '@/components/ContactForm';
export const metadata={title:'Private consultation',description:'Request a private consultation with an Aurelia advisor.',alternates:{canonical:'/contact'}};
export default function C({searchParams}:{searchParams:{property?:string}}){return <div className="page narrow"><h1>Private consultation</h1><p className="lead">Tell us what you are looking for.</p><ContactForm interest={searchParams.property||''}/></div>}
