import Listings from '@/components/Listings';
export const metadata={title:'The Collection',description:'20 exceptional luxury residences. Filter by location, type, bedrooms, bathrooms and price.',alternates:{canonical:'/properties'}};
export default function P(){return <div className="page"><h1>The Collection</h1><p className="lead">20 exceptional residences.</p><Listings/></div>}
