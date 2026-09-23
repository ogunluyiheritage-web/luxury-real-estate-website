// Original procedural architectural artwork: every image is unique per seed/kind, never broken.
export type Kind='exterior'|'living'|'kitchen'|'bedroom'|'bath'|'pool'|'garden'|'terrace'|'portrait';
export function art(seed:number,kind:Kind):string{
 const h=(seed*47)%360,k=['exterior','living','kitchen','bedroom','bath','pool','garden','terrace','portrait'].indexOf(kind);
 const r=(n:number)=>((seed*9301+k*49297+n*233280)%1000)/1000;
 const sky=`hsl(${(h+200)%360} 35% 72%)`,sky2=`hsl(${(h+20)%360} 55% 82%)`,st=`hsl(${h} 12% ${88-r(1)*20}%)`,dk=`hsl(${h} 10% 18%)`;
 let b='';
 if(kind==='portrait'){b=`<rect width="1600" height="1000" fill="${st}"/><circle cx="800" cy="380" r="170" fill="hsl(${25+r(2)*10} 40% ${50+r(3)*20}%)"/><path d="M380 1000C420 640 1180 640 1220 1000Z" fill="${dk}"/><path d="M620 330C640 150 960 150 980 330 900 250 700 250 620 330Z" fill="hsl(${h} 30% ${15+r(4)*40}%)"/>`}
 else if(kind==='exterior'||kind==='terrace'||kind==='garden'||kind==='pool'){
  const w=500+r(5)*400,x=800-w/2,hh=180+r(6)*120;
  b=`<defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop stop-color="${sky}"/><stop offset="1" stop-color="${sky2}"/></linearGradient></defs><rect width="1600" height="1000" fill="url(#s)"/><rect y="700" width="1600" height="300" fill="hsl(${100+r(7)*30} 22% ${30+r(8)*12}%)"/>`;
  if(kind!=='garden')b+=`<rect x="${x}" y="${640-hh}" width="${w}" height="${hh}" fill="${st}"/><rect x="${x-60}" y="${640-hh-60}" width="${w*0.7}" height="60" fill="#fff" opacity=".9"/><rect x="${x+30}" y="${640-hh*0.7}" width="${w-60}" height="${hh*0.55}" fill="hsl(38 90% 62%)" opacity=".85"/>`+[1,2,3,4].map(i=>`<rect x="${x+30+i*(w-60)/5}" y="${640-hh*0.7}" width="8" height="${hh*0.55}" fill="${dk}"/>`).join('')+`<rect x="${x-20}" y="640" width="${w+40}" height="14" fill="${dk}"/>`;
  if(kind==='pool'||kind==='terrace')b+=`<rect x="200" y="740" width="1200" height="200" rx="6" fill="hsl(190 60% ${60+r(9)*15}%)"/><rect x="200" y="740" width="1200" height="200" fill="none" stroke="#fff" stroke-width="10"/>`;
  for(let i=0;i<(kind==='garden'?14:6);i++)b+=`<rect x="${(i*263+r(i)*90)%1500}" y="${560+r(i+3)*60}" width="10" height="120" fill="${dk}"/><circle cx="${(i*263+r(i)*90)%1500+5}" cy="${540+r(i+3)*60}" r="${50+r(i)*40}" fill="hsl(${110+r(i)*30} 30% ${24+r(i+5)*14}%)"/>`}
 else{ // interiors
  b=`<rect width="1600" height="1000" fill="${st}"/><rect x="0" y="760" width="1600" height="240" fill="hsl(${h} 14% 38%)"/><rect x="180" y="110" width="700" height="560" fill="hsl(${(h+200)%360} 45% 80%)"/><rect x="180" y="110" width="700" height="560" fill="none" stroke="${dk}" stroke-width="14"/><line x1="530" y1="110" x2="530" y2="670" stroke="${dk}" stroke-width="10"/>`;
  b+= kind==='living'?`<rect x="720" y="600" width="640" height="150" rx="20" fill="${dk}"/><rect x="1040" y="140" width="440" height="460" fill="hsl(${h} 8% 60%)"/>`
   : kind==='kitchen'?`<rect x="420" y="640" width="820" height="160" fill="#f5f2ec"/><rect x="420" y="800" width="820" height="90" fill="hsl(${h} 18% 25%)"/><rect x="1050" y="150" width="420" height="380" fill="hsl(${h} 18% 25%)"/>`
   : kind==='bedroom'?`<rect x="760" y="560" width="620" height="220" rx="14" fill="#f5f2ec"/><rect x="740" y="470" width="40" height="330" fill="${dk}"/>`
   : `<rect x="720" y="620" width="560" height="140" rx="70" fill="#fff"/><rect x="1120" y="140" width="300" height="420" fill="hsl(${h} 6% 70%)"/>`}
 const glow=`<filter id="n"><feTurbulence baseFrequency=".9" numOctaves="2"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .07 0"/></filter><linearGradient id="gl" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff" stop-opacity=".35"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></linearGradient><circle cx="${300+r(11)*1000}" cy="${180+r(12)*120}" r="90" fill="#fff" opacity=".5"/><path d="M0 640Q${300+r(13)*300} ${480+r(14)*80} 800 620T1600 600V700H0Z" fill="hsl(${(h+210)%360} 18% 55%)" opacity=".7"/><rect width="1600" height="1000" fill="url(#gl)"/><rect width="1600" height="1000" filter="url(#n)"/>`+`<radialGradient id="g"><stop stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient><rect width="1600" height="1000" fill="url(#g)"/>`;
 return 'data:image/svg+xml;utf8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">${b}${glow}</svg>`);
}
