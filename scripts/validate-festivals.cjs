const fs=require('fs'),path=require('path'),root=path.join(__dirname,'..'),errors=[];
const text=fs.readFileSync(path.join(root,'src/data/festivals/index.js'),'utf8');
const topics=new Function(`${text.replace(/export const /g,'const ')}\nreturn festivalTopics;`)();
const types=new Set(['religious-festival','seasonal-festival','folk-festival','life-cycle-tradition','pilgrimage','fair','cultural-fair','harvest-season','river-festival','regional-tradition']);
const districts=new Set(['patna','aurangabad','saran','gaya','darbhanga','madhubani','sitamarhi','bhagalpur','banka','nalanda','bhojpur']);
const cultureRoutes=new Set(['sohar','samdaun','chaita','mithila-painting','manjusha-art']);
const tourismRoutes=new Set(['deo-sun-temple','sonepur','gaya','vishnupad-temple','rajgir']);
const foodRoutes=new Set(['thekua','tilkut','chura-dahi','khichdi-traditions']);
const ids=new Set(),slugs=new Set(),names=new Set(),aliases=new Map();
for(const x of topics){
 for(const key of ['id','slug','nameHi','nameEn','category','festivalType','tags','culturalRegions','districts','summary','intro','culturalContext','historicalContext','religiousContext','season','traditionalCalendar','approximateGregorianPeriod','durationContext','socialMeaning','communityContext','modernChanges','sources','seo'])if(!x[key]||(Array.isArray(x[key])&&!x[key].length))errors.push(`${x.slug||'unknown'} missing ${key}`);
 if(ids.has(x.id))errors.push(`Duplicate festival ID ${x.id}`);ids.add(x.id);if(slugs.has(x.slug))errors.push(`Duplicate festival slug ${x.slug}`);slugs.add(x.slug);if(names.has(x.nameHi))errors.push(`Duplicate festival name ${x.nameHi}`);names.add(x.nameHi);
 if(x.category!=='festival'||!types.has(x.festivalType))errors.push(`${x.slug}: invalid festival classification`);if(x.seo.canonical!==`/culture/festivals/${x.slug}`)errors.push(`${x.slug}: invalid canonical`);
 for(const d of x.districts)if(!districts.has(d))errors.push(`${x.slug}: invalid district ${d}`);
 for(const a of x.aliases){const key=a.toLowerCase().replace(/[^a-z0-9\u0900-\u097f]+/g,'-').replace(/^-|-$/g,'');if(aliases.has(key)&&aliases.get(key)!==x.slug)errors.push(`Shared festival alias ${a}`);aliases.set(key,x.slug)}
 for(const s of x.sources){try{const u=new URL(s.url);if(!['http:','https:'].includes(u.protocol)||u.hostname==='example.com')errors.push(`${x.slug}: invalid source`)}catch{errors.push(`${x.slug}: malformed source ${s.url}`)}if(!s.type)errors.push(`${x.slug}: source type missing`)}
 for(const r of x.relatedCulture)if(r.to.startsWith('/culture/')&&!cultureRoutes.has(r.to.slice(9)))errors.push(`${x.slug}: broken culture ref ${r.to}`);
 for(const r of x.relatedTourism)if(!tourismRoutes.has(r.to.slice(9)))errors.push(`${x.slug}: broken tourism ref ${r.to}`);
 for(const r of [...x.relatedFood,...x.foods.filter(v=>v.to)])if(r.to?.startsWith('/food/')&&!foodRoutes.has(r.to.slice(6)))errors.push(`${x.slug}: broken food ref ${r.to}`);
 for(const media of x.gallery)if(!media.src||!media.credit||!media.source||!media.type)errors.push(`${x.slug}: invalid/sourceless media`);
 if(/\b2026\s*(date|schedule|तिथि)/i.test(JSON.stringify(x)))errors.push(`${x.slug}: current-year schedule leaked into permanent content`);
}
for(const slug of ['chhath','sonepur-mela','pitru-paksha','sama-chakeva','jitiya','fagua','madhushravani','bihula-bishahari','makar-sankranti'])if(!slugs.has(slug))errors.push(`Missing core C5 topic ${slug}`);
const current=fs.readFileSync(path.join(root,'src/data/current/events.js'),'utf8'),currentRegistry=fs.readFileSync(path.join(root,'src/data/current/index.js'),'utf8');if(!current.includes('event-chhath-2026-state-calendar')||!current.includes("freshnessPolicy:'event-explicit'")||!currentRegistry.includes('eventCurrentRecords'))errors.push('Central current festival event boundary missing');
const app=fs.readFileSync(path.join(root,'src/App.jsx'),'utf8');for(const route of ['/culture/festivals','/culture/festivals/:slug'])if(!app.includes(`path="${route}"`))errors.push(`Missing route ${route}`);
const ui=fs.readFileSync(path.join(root,'src/components/festivals/FestivalModule.jsx'),'utf8');for(const name of ['TraditionNote','CurrentFestivalNotice','SeasonalCalendar','FestivalDirectory','FestivalDetailPage'])if(!ui.includes(`function ${name}`))errors.push(`Missing component ${name}`);if(!ui.includes('CurrentEventOccurrence'))errors.push('Festival UI does not use central current-event component');
if(errors.length){console.error([...new Set(errors)].join('\n'));process.exit(1)}
console.log('Festival validation passed');console.log(`Deep festival/fair topics: ${topics.length}`);console.log('Duplicate IDs/slugs/names/aliases: 0');console.log('Broken district/culture/tourism/food refs: 0');console.log('Missing SEO/sources: 0');console.log('Current dates in permanent content: 0');console.log('Invalid or sourceless media: 0');
