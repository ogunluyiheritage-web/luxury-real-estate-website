import {art,Kind} from './art';
/** NEXT_PUBLIC_USE_PHOTOS=1 -> serve /public/photos/<folder>/<file>.jpg (Next Image optimises to WebP/AVIF).
 *  Otherwise the generated artwork is used. If a photo file is missing, <Pic> falls back to the artwork automatically. */
export const USE_PHOTOS=process.env.NEXT_PUBLIC_USE_PHOTOS==='1';
export function img(folder:string,file:string,kind:Kind,seed:number):string{
 return USE_PHOTOS?`/photos/${folder}/${file}.jpg?k=${kind}&s=${seed}`:art(seed,kind)}
/** homepage / about imagery: /public/photos/site/<kind>-<seed>.jpg */
export const site=(seed:number,kind:Kind)=>img('site',`${kind}-${seed}`,kind,seed);
export function fallbackFor(src:string):string|null{const q=src.split('?')[1];if(!q)return null;const p=new URLSearchParams(q),s=p.get('s'),k=p.get('k');return s&&k?art(+s,k as Kind):null}
