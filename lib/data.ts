import {Kind} from './art';import {img} from './photos';
export type Property={id:number;slug:string;name:string;location:string;city:string;price:number;bedrooms:number;bathrooms:number;sqft:number;type:string;description:string;heroImage:string;gallery:{label:string;src:string}[];interiorImages:string[];exteriorImages:string[];poolImages:string[];amenities:string[];coordinates:[number,number]};
const rows:[string,string,string,string,number,number,number,number,[number,number]][]=[
['Aurelia Estate','Los Angeles, CA','Los Angeles','Modern Glass Villa',8400000,4,5,6800,[34.05,-118.44]],
['Casa Solana','Malibu, CA','Malibu','Coastal Residence',12900000,5,6,7400,[34.03,-118.78]],
['Villa Orsini','Santa Barbara, CA','Santa Barbara','Mediterranean Estate',9750000,6,7,9100,[34.42,-119.7]],
['Ridgeline House','Aspen, CO','Aspen','Mountain Retreat',11200000,5,6,7800,[39.19,-106.82]],
['The Monolith','Palm Springs, CA','Palm Springs','Desert Architectural Home',4650000,3,4,4200,[33.83,-116.55]],
['Halden Villa','Miami, FL','Miami','Waterfront Compound',15800000,7,9,11200,[25.76,-80.19]],
['Maison Levant','Beverly Hills, CA','Beverly Hills','European-Inspired Residence',18500000,7,8,10400,[34.07,-118.4]],
['Palma Verde','Kauai, HI','Kauai','Tropical Luxury Estate',7200000,4,5,5900,[22.09,-159.5]],
['Concrete Lantern','Austin, TX','Austin','Minimalist Concrete Villa',3900000,3,3,3800,[30.27,-97.74]],
['Stonebridge Manor','Napa, CA','Napa','Contemporary Mansion',10600000,6,7,8800,[38.3,-122.29]],
['Tidewater','Nantucket, MA','Nantucket','Coastal Residence',6800000,5,5,5600,[41.28,-70.1]],
['Sable Ridge','Scottsdale, AZ','Scottsdale','Desert Architectural Home',5400000,4,5,5200,[33.49,-111.93]],
['Glasshouse Nine','Seattle, WA','Seattle','Modern Glass Villa',6100000,4,4,4900,[47.61,-122.33]],
['Villa Marea','Key Biscayne, FL','Miami','Waterfront Compound',13400000,6,8,9600,[25.69,-80.16]],
['Alpenglow','Park City, UT','Park City','Mountain Retreat',8900000,6,6,7200,[40.65,-111.5]],
['Casa Olivar','Carmel, CA','Carmel','Mediterranean Estate',7700000,5,6,6400,[36.55,-121.92]],
['Nocturne House','Hollywood Hills, CA','Los Angeles','Contemporary Mansion',9300000,4,5,6100,[34.13,-118.35]],
['Bamboo Court','Maui, HI','Kauai','Tropical Luxury Estate',8100000,5,6,6700,[20.8,-156.3]],
['Kestrel Point','Big Sur, CA','Malibu','Minimalist Concrete Villa',5900000,3,4,3600,[36.27,-121.8]],
['Belvedere 1912','Montecito, CA','Santa Barbara','European-Inspired Residence',14200000,6,8,9800,[34.44,-119.63]]];
const slug=(s:string)=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
const kinds:[string,Kind][]=[['Exterior','exterior'],['Living room','living'],['Kitchen','kitchen'],['Master bedroom','bedroom'],['Bathroom','bath'],['Pool','pool'],['Terrace','terrace'],['Garden','garden']];
const am=['Infinity pool','Spa','Private cinema','Gym','Smart home','Private garden','Outdoor kitchen','Six-car garage','Wine cellar','Guest house'];
export const properties:Property[]=rows.map((r,i)=>{const s=i+1,g=kinds.map(([label,k])=>({label,src:img(slug(r[0]),k,k,s*7)}));return{id:s,slug:slug(r[0]),name:r[0],location:r[1],city:r[2],type:r[3],price:r[4],bedrooms:r[5],bathrooms:r[6],sqft:r[7],
description:`${r[0]} is a ${r[3].toLowerCase()} in ${r[1]}: ${r[7].toLocaleString()} sq ft of light, stone and quiet craftsmanship, composed around ${r[5]} bedrooms and uninterrupted views.`,
heroImage:g[0].src,gallery:g,exteriorImages:[g[0].src,g[6].src],interiorImages:[g[1].src,g[2].src,g[3].src,g[4].src],poolImages:[g[5].src],amenities:am.filter((_,j)=>(j+s)%3!==0||j<4),coordinates:r[8]}});
export const getProperty=(s:string)=>properties.find(p=>p.slug===s);
export const cities=[...new Set(properties.map(p=>p.city))].sort();
export const types=[...new Set(properties.map(p=>p.type))].sort();
export const usd=(n:number)=>'$'+n.toLocaleString('en-US');
export const testimonials=[
{name:'Olivia Carter',role:'Private Client',text:'Every detail feels intentional. It doesn’t feel like a property website. It feels like stepping into the residence itself.'},
{name:'Daniel Reyes',role:'Founder, Reyes Capital',text:'We walked the house before we ever flew out. The film was accurate down to the light at five o’clock.'},
{name:'Amara Okafor',role:'Architect',text:'Rare to see a brokerage that understands proportion, material and restraint. They sell architecture properly.'}];
