// Incremental: only expanded records must meet the deep-profile schema.
const fs=require('node:fs'),path=require('node:path');
const {loadDataModule}=require('./load-data-module.cjs');
const root=path.resolve(__dirname,'..'),load=file=>loadDataModule(path.join(root,'src/data',file));
const {rajendraPrasad:x,personalitySources:sources,personalityMedia:media,personalitySchema}=load('personalities/index.js');
const {personalities}=load('catalog.js'),{personalitySearchRecords}=load('personalities/directory.js');
let checks=0;const errors=[];const check=(condition,label)=>{checks++;if(!condition)errors.push(label);};
const unique=(items,label)=>check(new Set(items).size===items.length,label+' duplicates');
const sourceIds=new Set(sources.map(s=>s.id)),mediaIds=new Set(media.map(m=>m.id));
const date=value=>/^\d{4}-\d{2}-\d{2}$/.test(value)&&!Number.isNaN(Date.parse(value))&&new Date(value).toISOString().slice(0,10)===value;
const canonical=new Set([...fs.readFileSync(path.join(root,'public/sitemap.xml'),'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>new URL(m[1]).pathname));
const ids=new Set(['p1-title','life-timeline','places','related-people','sources',...x.sections.map(s=>s.id),...x.places.map(p=>p.id)]);
function refs(record,label){check(Array.isArray(record.sources)&&record.sources.length>0,label+' sources');for(const id of record.sources||[])check(sourceIds.has(id),label+' source '+id);}
function internal(to,label){check(typeof to==='string'&&to.startsWith('/'),label+' internal URL');const [pathname,anchor]=to.split('#');check(canonical.has(pathname),label+' canonical destination '+pathname);if(pathname===x.canonical&&anchor)check(ids.has(anchor),label+' anchor '+anchor);}
unique(personalities.map(p=>p.slug),'catalog slugs');unique([x.id],'expanded IDs');unique([x.slug],'expanded slugs');unique(sources.map(s=>s.id),'sources');unique(media.map(m=>m.id),'media');
check(personalities.some(p=>p.slug===x.slug),'expanded profile listed');check(personalities.length===9,'nine existing personality records preserved');
check(/[\u0900-\u097f]/.test(x.nameHindi),'Hindi name');check(x.nameEnglish==='Dr. Rajendra Prasad','English name');
for(const key of ['birthDate','deathDate','officeStart','officeEnd','reviewedOn'])check(date(x[key]),'valid '+key);
check(x.birthDate==='1884-12-03'&&x.deathDate==='1963-02-28','identity dates');check(x.officeStart==='1950-01-26'&&x.officeEnd==='1962-05-13','presidential dates');
check(x.birthDate<x.officeStart&&x.officeEnd<x.deathDate,'chronology');check(x.sections.length>=22,'deep section coverage');
unique(x.sections.map(s=>s.id),'sections');for(const s of x.sections){check(s.title&&s.paragraphs.length>0,s.id+' content');for(const p of s.paragraphs){check(p.text.length>60,s.id+' substantive paragraph');refs(p,s.id);}if(s.image)check(mediaIds.has(s.image),s.id+' image');for(const [,to]of s.links||[])internal(to,s.id);for(const [,id]of s.externalLinks||[])check(sourceIds.has(id),s.id+' external context');}
for(const s of sources){check(/^https:\/\//.test(s.url),'HTTPS '+s.id);check(Boolean(s.title&&s.publisher&&s.scope&&s.type),'source metadata '+s.id);check(date(s.reviewedOn),'source date '+s.id);}
for(const items of [x.facts,x.education,x.books,x.places,x.relatedPeople,x.terms])for(const item of items)refs(item,item.id||item.label||item.title);
for(const key of ['timeline','constitutionTimeline']){unique(x[key].map(e=>e.id),key);let previous='';for(const e of x[key]){check(date(e.date)||/^\d{4}$/.test(e.date),key+' date '+e.id);check(e.date>=previous,key+' chronological '+e.id);previous=e.date;check(Boolean(e.title&&e.text&&e.label),key+' content '+e.id);refs(e,key+' '+e.id);if(e.image)check(mediaIds.has(e.image),key+' photo');}}
check(x.timeline.length>=18,'life timeline coverage');check(x.constitutionTimeline.find(e=>e.id==='chair')?.date==='1946-12-11','Assembly election not after independence');check(x.constitutionTimeline.find(e=>e.id==='initial-election')?.date==='1950-01-24','election versus assumption');check(x.terms.length===3&&x.terms.filter(t=>t.title.includes('निर्वाचित')).length===2,'two elected terms plus transition');
check(x.facts.some(f=>f.label==='भारत रत्न'&&f.value==='1962 — जीवनकाल में'&&f.sources.includes('award')),'non-posthumous award');
check(x.books.find(b=>b.id==='atmakatha')?.yearLabel.includes('संस्करण'),'Atmakatha date qualified');check(x.limitations.some(s=>s.includes('1946')&&s.includes('1947')),'publication conflict disclosed');
unique(x.books.map(b=>b.id),'books');for(const b of x.books){check(Number.isInteger(b.year)&&b.year<1964,'book year '+b.id);check(Boolean(b.language&&b.subject&&b.text&&b.yearLabel),'book metadata '+b.id);}
unique(x.places.map(p=>p.id),'places');for(const p of x.places){internal(p.to,p.id);if(p.image)check(mediaIds.has(p.image),p.id+' image');}
unique(x.relatedPeople.map(p=>p.id),'related people');for(const p of x.relatedPeople){check(Boolean(p.name&&p.relation),'related context '+p.id);if(p.to)internal(p.to,p.id);else check(sourceIds.has(p.sourceId),'real institutional link '+p.id);}
for(const t of x.terms){check(date(t.start)&&date(t.end)&&t.start<t.end,'term endpoints');}
unique(x.aliases.map(a=>a.normalize('NFKC').toLowerCase()),'aliases');for(const alias of ['राजेंद्र प्रसाद','डॉ राजेंद्र प्रसाद','राजेन्द्र प्रसाद','Rajendra Prasad','Dr Rajendra Prasad','President Rajendra Prasad','First President of India','जीरादेई','Ziradei'])check(x.aliases.includes(alias),'required alias '+alias);
for(const r of personalitySearchRecords)internal(r.to,r.id);
check(media.length===8,'eight selected source visuals');for(const m of media){check(Boolean(m.alt&&m.caption&&m.credit&&m.source&&m.license&&m.licenseUrl&&m.changes),'attribution '+m.id);check(/^https:\/\//.test(m.source)&&/^https:\/\//.test(m.licenseUrl),'rights links '+m.id);check(m.width>100&&m.height>100&&m.smallWidth<=480,'dimensions '+m.id);for(const src of [m.src,m.thumbnail]){const file=path.join(root,'public',src);check(fs.existsSync(file),'file '+src);if(fs.existsSync(file)){const buffer=fs.readFileSync(file);check(buffer.toString('ascii',8,12)==='WEBP','WebP '+src);check(buffer.length<450*1024&&buffer.length>1200,'nonblank bounded asset '+src);}}}
check(media.find(m=>m.id==='champaran')?.caption.includes('आधुनिक'),'modern Champaran caption');check(media.find(m=>m.id==='champaran-book')?.page===9,'reviewed document page');
check(x.seo.title==='डॉ. राजेंद्र प्रसाद — जीवन, स्वतंत्रता आंदोलन और भारत के प्रथम राष्ट्रपति | बिहार','exact SEO title');check(x.seo.description.length>90,'SEO description');internal(x.canonical,'profile');
const schema=personalitySchema(x,'https://example.org');check(schema['@type']==='Article'&&schema.about['@type']==='Person','Article and Person schema');check(schema.about.birthDate===x.birthDate&&schema.about.deathDate===x.deathDate,'structured life dates');
const content=JSON.stringify(x);check(!/उन्होंने अकेले संविधान लिखा|विश्व के सबसे महान|1962 में मरणोपरांत भारत रत्न मिला/.test(content),'known unsupported-claim regressions');check(content.includes('42वें संशोधन')&&content.includes('44वें संशोधन'),'historical Article 74 caveat');
if(process.argv.includes('--html')){
 const file=path.join(root,'dist/personalities/rajendra-prasad/index.html');check(fs.existsSync(file),'prerender exists');if(fs.existsSync(file)){const html=fs.readFileSync(file,'utf8');check(html.includes(`<title>${x.seo.title}</title>`),'static title');check((html.match(/<h1\b/g)||[]).length===1,'one static H1');for(const s of x.sections)check(html.includes(`id="${s.id}"`),'static section '+s.id);for(const e of x.timeline)check(html.includes(e.text),'all static timeline content '+e.id);for(const m of media)check(html.includes(m.src)&&html.includes(m.source),'static media and credit '+m.id);for(const tag of ['og:title','og:description','og:image','twitter:card','twitter:image'])check(html.includes(`="${tag}"`),'static '+tag);const blocks=[...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));check(blocks.some(s=>s['@type']==='Article'&&s.about?.['@type']==='Person'),'static Person/Article');check(blocks.some(s=>s['@type']==='BreadcrumbList'),'static breadcrumbs');check(!html.includes('event-button-'),'no inert JavaScript-only timeline controls in static HTML');}
}
console.log(`Personalities P1: ${checks} checks, ${errors.length} errors; Rajendra Prasad regression checks; all nine catalog records preserved.`);
console.log(`Coverage: ${x.sections.length} sections, ${x.timeline.length} life events, ${x.constitutionTimeline.length} constitutional events, ${media.length} visuals, ${sources.length} sources.`);
console.log('WARNING: Student-era/birthplace photos still unverified; Atmakatha first-publication discrepancy is disclosed. Automated checks validate references and known regressions, not historical truth.');
if(errors.length){errors.forEach(e=>console.error('ERROR:',e));process.exitCode=1;}
// Keep P1 checks unchanged; validate the second expanded profile independently.
const kunwarResult=require('node:child_process').spawnSync(process.execPath,[path.join(__dirname,'validate-kunwar-singh.cjs'),...process.argv.slice(2)],{stdio:'inherit'});
if(kunwarResult.status!==0)process.exitCode=1;
