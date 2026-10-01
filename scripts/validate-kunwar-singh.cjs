// Incremental deep-profile checks. No deep-schema requirement for legacy biographies.
const fs=require('node:fs'),path=require('node:path');
const {loadDataModule}=require('./load-data-module.cjs');
const root=path.resolve(__dirname,'..'),load=file=>loadDataModule(path.join(root,'src/data',file));
const {kunwarSingh:x,kunwarMedia:media,kunwarSchema}=load('personalities/kunwarSingh.js');
const {kunwarSources:sources,evidenceTypes}=load('personalities/kunwarSources.js');
const {personalityDiscovery}=load('personalities/directory.js');
const {searchPortal,searchIndex}=load('searchIndex.js');
const {personalities}=load('catalog.js'),{h7Pages}=load('history/index.js');
const {destinations,tourismBySlug}=load('tourism/index.js');
const {deepDistricts}=load('districts/index.js');
let checks=0;const errors=[];const check=(ok,label)=>{checks++;if(!ok)errors.push(label);};
const unique=(items,label)=>check(new Set(items).size===items.length,label+' unique');
const validDate=value=>/^\d{4}(?:-\d{2}-\d{2})?$/.test(value)&&(!value.includes('-')||new Date(value).toISOString().slice(0,10)===value);
const sourceIds=new Set(sources.map(s=>s.id)),mediaIds=new Set(media.map(m=>m.id));
const sectionIds=['early-life','jagdishpur-context','bihar-before-1857','rebellion','arrah','campaigns','azamgarh','mobile-warfare','amar-singh','final-jagdishpur','death','ganga-tradition','significance','cultural-memory','jagdishpur-fort','museum','university'];
const anchors=new Set(['ks-title','life-timeline','places','related-people','bihar-1857','sources',...sectionIds,...x.places.map(p=>p.id)]);
const routes=new Set(['/personalities','/history','/culture','/tourism','/food','/editorial-policy',...personalities.map(p=>'/personalities/'+p.slug),...h7Pages.map(p=>'/history/'+p.slug),...deepDistricts.map(p=>'/district/'+p.slug),...destinations.map(p=>'/tourism/'+p.slug)]);
const sitemap=fs.readFileSync(path.join(root,'public/sitemap.xml'),'utf8');
const indexed=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>new URL(m[1]).pathname);
function internal(to,label){const [route,anchor]=to.split('#');check(routes.has(route),label+' actual destination '+to);check(indexed.includes(route),label+' indexed '+route);if(route===x.canonical&&anchor)check(anchors.has(anchor),label+' fragment '+anchor);}
function refs(r,label){check(r.sources?.length>0,label+' citations');for(const id of r.sources||[])check(sourceIds.has(id),label+' source '+id);}
function evidence(r,label){check(Object.hasOwn(evidenceTypes,r.evidence),label+' evidence classification');refs(r,label);}
const biography=x.sections.flatMap(s=>s.paragraphs),claims=[...biography,...x.evidenceNotes,...x.tradition];
unique(personalityDiscovery.map(p=>p.id),'deep IDs');unique(personalityDiscovery.map(p=>p.slug),'deep slugs');unique(personalities.map(p=>p.slug),'catalog');check(personalities.length===9,'all nine catalog records');
check(x.nameHindi==='वीर कुँवर सिंह'&&x.nameEnglish==='Veer Kunwar Singh','Hindi / English identity');check(x.canonical==='/personalities/kunwar-singh','canonical');
check(x.birth.year===1777&&x.birth.precision==='year'&&!x.birthDate,'no invented precise birth date');check(x.deathDate==='1858-04-26','qualified death date');check(x.birth.year<Number(x.deathDate.slice(0,4)),'life chronology');
unique(claims.map(c=>c.id),'claim IDs');unique(x.sections.map(s=>s.id),'sections');check(x.sections.map(s=>s.id).join('|')===sectionIds.join('|'),'required ordered biography sections');
for(const s of x.sections){check(Boolean(s.title&&s.paragraphs.length),s.id+' nonempty');if(s.image)check(mediaIds.has(s.image),s.id+' visual');if(s.note)check(x.evidenceNotes.some(n=>n.id===s.note),s.id+' note exists');for(const [,to]of s.links||[])internal(to,s.id);for(const [,id]of s.externalLinks||[])check(sourceIds.has(id),s.id+' external source');}
for(const c of claims){check(c.text.length>=65,c.id+' substantive claim');evidence(c,c.id);}
for(const f of x.facts){check(Boolean(f.label&&f.value),'fact nonempty');evidence(f,f.label);}check(x.facts.length===9,'quick facts coverage');
unique(x.campaigns.map(e=>e.id),'campaign IDs');check(x.campaigns.length===8,'eight campaign nodes');for(const e of x.campaigns){check(Boolean(e.dateLabel&&e.place&&e.text&&e.significance),'campaign content '+e.id);evidence(e,'campaign '+e.id);check(!e.lat&&!e.lng,'no invented battlefield coordinates');}
unique(x.timeline.map(e=>e.id),'timeline IDs');let previous=-Infinity;for(const e of x.timeline){check(Number.isFinite(e.sortKey)&&e.sortKey>=previous,'timeline order '+e.id);previous=e.sortKey;check(Boolean(e.title&&e.label&&e.text),'event fields '+e.id);check(e.date===null||validDate(e.date),'precision-aware date '+e.id);evidence(e,'timeline '+e.id);}
check(x.timeline.find(e=>e.id==='birth').date==='1777','year-only birth event');check(x.timeline.find(e=>e.id==='estate').date===null,'before 1857 has no invented date');check(x.timeline.find(e=>e.id==='victory').date==='1858-04-23','victory date');check(x.timeline.find(e=>e.id==='death').date===x.deathDate,'death consistency');
check(x.timeline.find(e=>e.id==='museum').date==='1972'&&x.timeline.find(e=>e.id==='university').date==='1992','legacy dates');
for(const type of Object.keys(evidenceTypes))check(claims.some(c=>c.evidence===type),'visible evidence type '+type);
check(x.tradition.length===4&&x.tradition.find(c=>c.id==='ganga-legend')?.evidence==='POPULAR TRADITION','legend not fact');check(x.tradition.find(c=>c.id==='ganga-status')?.evidence==='UNCERTAIN','independent proof limitation');
check(claims.find(c=>c.id==='date-conflict')?.text.includes('24 अप्रैल')&&claims.find(c=>c.id==='date-conflict')?.sources.includes('tourism'),'conflicting commemoration date disclosed');check(claims.find(c=>c.id==='age-conflict')?.text.includes('75')&&claims.find(c=>c.id==='age-conflict')?.text.includes('80'),'age disagreement disclosed');
unique(sources.map(s=>s.id),'sources');for(const s of sources){check(new URL(s.url).protocol==='https:','HTTPS source '+s.id);check(Boolean(s.title&&s.publisher&&s.scope&&s.reviewedOn),'source metadata '+s.id);check(['government','secondary','tradition'].includes(s.group),'source grouping '+s.id);}
for(const group of ['government','secondary','tradition'])check(sources.some(s=>s.group===group),'source group populated '+group);
unique(x.places.map(p=>p.id),'place IDs');for(const p of x.places){check(Boolean(p.title&&p.text&&p.location),'place identity '+p.id);refs(p,p.id);if(p.to)internal(p.to,p.id);else check(sourceIds.has(p.sourceId)||mediaIds.has(p.mediaId),'place source '+p.id);}
unique(x.relatedPeople.map(p=>p.id),'related people');for(const p of x.relatedPeople){check(Boolean(p.name&&p.relationship&&p.text),'relation '+p.id);refs(p,p.id);if(p.to)internal(p.to,p.id);else check(sourceIds.has(p.sourceId),'published relationship source '+p.id);}
check(!JSON.stringify(x).includes('/personalities/amar-singh'),'no missing Amar profile route');
unique(x.aliases.map(a=>a.normalize('NFKC').toLowerCase()),'aliases');check(x.aliases.length===12,'twelve requested aliases');
for(const alias of x.aliases){const result=searchPortal(alias);check(result.some(r=>r.to===x.canonical),'search profile '+alias);unique(result.map(r=>r.to),'search result '+alias);}
unique(searchIndex.map(r=>r.to),'global search canonical routes');for(const type of ['व्यक्तित्व','इतिहास','जिला','पर्यटन','संग्रहालय','स्थल'])check(searchPortal('Kunwar Singh').some(r=>r.type===type),'search discovery type '+type);
check(x.seo.title==='वीर कुँवर सिंह | 1857 के विद्रोह और बिहार का इतिहास | Bihar Portal','unique SEO title');check(x.seo.description.length>100,'SEO description');internal(x.canonical,'profile');
const schema=kunwarSchema('https://example.org');check(schema['@type']==='Article'&&schema.about['@type']==='Person','Article + Person');for(const k of ['birthDate','birthPlace','deathPlace','occupation','award'])check(!Object.hasOwn(schema.about,k),'no unsupported schema '+k);check(schema.about.deathDate===x.deathDate,'schema death date');
unique(media.map(m=>m.id),'media IDs');check(media.length===3,'three reviewed visuals');for(const m of media){check(Boolean(m.alt&&m.caption&&m.source&&m.credit&&m.license&&m.licenseUrl&&m.changes),'rights '+m.id);check(m.width>100&&m.height>100&&m.smallWidth<=480,'dimensions '+m.id);for(const src of [m.src,m.thumbnail]){const file=path.join(root,'public',src);check(fs.existsSync(file),'image exists '+src);if(fs.existsSync(file)){const data=fs.readFileSync(file);check(data.toString('ascii',8,12)==='WEBP'&&data.length<450*1024&&data.length>1200,'bounded WebP '+src);}}}
check(media.find(m=>m.id==='kunwar-engraving').caption.includes('Illustrative artistic representation'),'artwork not photograph');check(media.find(m=>m.id==='kunwar-memorial').caption.includes('देवघर, झारखंड'),'correct memorial location');
const fort=tourismBySlug('jagdishpur-fort');check(fort?.districtSlug==='bhojpur'&&fort.related.some(r=>r.to===x.canonical),'fort and biography bidirectional');check(!fort.hero&&!fort.map,'no false photo / coordinates');for(const r of fort.related)internal(r.to,'fort related');for(const s of fort.sources)check(new URL(s.url).protocol==='https:','fort source');
const app=fs.readFileSync(path.join(root,'src/App.jsx'),'utf8');check(app.includes('path="'+x.canonical+'"')&&app.includes("lazy(()=>import('./pages/KunwarSinghProfilePage'))"),'lazy route exists');check(app.includes('path="/history/1857" element={<Navigate replace to="/history/1857-bihar"/>}'),'history legacy alias');
check(!indexed.includes('/history/1857')&&!indexed.includes('/districts/bhojpur'),'aliases excluded from sitemap');
check(JSON.parse(fs.readFileSync(path.join(root,'vercel.json'),'utf8')).rewrites.some(r=>r.source===x.canonical&&r.destination===x.canonical+'/index.html'),'production clean URL rewrite');
if(process.argv.includes('--html')){
 const file=path.join(root,'dist',x.canonical,'index.html');check(fs.existsSync(file),'prerendered HTML');if(fs.existsSync(file)){const html=fs.readFileSync(file,'utf8');check(html.includes('<title>'+x.seo.title+'</title>'),'static title');check((html.match(/<h1\b/g)||[]).length===1,'one static H1');for(const id of anchors)check(html.includes('id="'+id+'"'),'static anchor '+id);for(const c of [...claims,...x.timeline])check(html.includes(c.text),'static full content '+c.id);for(const s of sources)check(html.includes('id="source-'+s.id+'"'),'static citation target '+s.id);for(const m of media)check(html.includes(m.src)&&html.includes(m.source),'static image attribution '+m.id);check(!html.includes('ks-event-birth'),'no inert timeline buttons without JS');for(const tag of ['og:title','og:description','og:image','og:locale','twitter:card','twitter:image'])check(html.includes('="'+tag+'"'),'static '+tag);const schemas=[...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));check(schemas.some(s=>s['@type']==='Article'&&s.about?.['@type']==='Person'&&!s.about.birthDate),'static Person precision');check(schemas.some(s=>s['@type']==='BreadcrumbList'),'static breadcrumbs');for(const [,css]of html.matchAll(/<link rel="stylesheet" href="([^"]+)"/g))check(fs.existsSync(path.join(root,'dist',css)),'static CSS '+css);}
}
console.log(`Kunwar Singh: ${checks} checks, ${errors.length} errors; ${x.sections.length} biography sections, ${x.timeline.length} events, ${sources.length} sources, ${media.length} visuals.`);
console.log('WARNING: Birth precision, age/victory-date differences, original archive transcripts, Ganga tradition and local fort/museum media gaps remain explicitly qualified.');
if(errors.length){errors.forEach(e=>console.error('ERROR:',e));process.exitCode=1;}
