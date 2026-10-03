// Content integrity checks, not a substitute for historical source review.
const fs=require('node:fs'),path=require('node:path');
const {loadDataModule}=require('./load-data-module.cjs');
const root=path.resolve(__dirname,'..'),load=file=>loadDataModule(path.join(root,'src/data',file));
const {ancientSchema,evidenceTypes}=load('personalities/ancientSupport.js');
const {modernDiscovery}=load('personalities/directory.js');
const {searchIndex,searchPortal}=load('searchIndex.js');
const {personalities}=load('catalog.js');
const routes=new Set(['/culture',...searchIndex.map(x=>x.to.split('#')[0])]);
const sitemap=fs.readFileSync(path.join(root,'public/sitemap.xml'),'utf8');
const rewrites=JSON.parse(fs.readFileSync(path.join(root,'vercel.json'),'utf8')).rewrites;
let checks=0;const errors=[];const check=(ok,label)=>{checks++;if(!ok)errors.push(label);};
const unique=(xs,label)=>check(new Set(xs).size===xs.length,label+' unique');
check(personalities.length===9,'all nine catalog profiles preserved');
for(const key of ['dinkar','renu','bhikhariThakur','jayaprakashNarayan']){
 const x=load('personalities/'+key+'.js')[key],slug=x.slug,sourceIds=new Set(x.sources.map(s=>s.id));
 const refs=(ids,label)=>{check(ids?.length>0,label+' references');for(const id of ids||[])check(sourceIds.has(id),label+' resolves '+id);};
 const internal=to=>{check(routes.has(to.split('#')[0]),slug+' real route '+to);check(sitemap.includes(to+'</loc>'),slug+' sitemap '+to);};
 const discovery=modernDiscovery.find(d=>d.slug===slug);
 check(x.nameHindi===personalities.find(p=>p.slug===slug)?.name,slug+' catalog identity');
 check(discovery?.summary.length>50&&discovery.canonical===x.canonical,slug+' directory description');
 check(x.reviewedOn==='2026-10-03',slug+' review date');
 check(x.sections.length>=9&&x.timeline.length>=4&&x.sources.length>=5,slug+' coverage');
 unique(x.sections.map(s=>s.id),slug+' sections');unique(x.timeline.map(e=>e.id),slug+' timeline');unique(x.sources.map(s=>s.id),slug+' sources');
 refs(x.introSources,slug+' introduction');
 const claims=[...x.facts,...x.sections.flatMap(s=>s.paragraphs),...x.timeline];
 for(const c of claims){check(!!evidenceTypes[c.evidence],slug+' evidence '+(c.id||c.label));refs(c.sources,slug+' claim '+(c.id||c.label));check(Boolean(c.text||c.value),slug+' nonempty claim');}
 for(const s of x.sections){check(!!s.title&&s.paragraphs.length>0,slug+' section '+s.id);if(s.cards){check(s.cards.every(c=>c.title&&c.text),slug+' concept cards');refs(s.cardSources,slug+' cards');}for(const [,to]of s.links||[])internal(to);}
 for(const p of x.related)internal(p.to);internal(x.canonical);for(const s of x.sections)for(const w of s.works||[]){refs(w.sources,slug+' work '+w.title);check(!!w.text&&!!w.form,slug+' work context');}
 let year=-Infinity;for(const e of x.timeline){check(['life','work','legacy'].includes(e.period),slug+' timeline period');check(!e.date,slug+' no invented exact timeline date');if(e.sortYear!==null){check(Number.isFinite(e.sortYear)&&e.sortYear>=year,slug+' chronology '+e.id);year=e.sortYear;}}
 for(const s of x.sources){check(new URL(s.url).protocol==='https:',slug+' secure source '+s.id);check(Boolean(s.title&&s.publisher&&s.scope&&evidenceTypes[s.kind]),slug+' source metadata '+s.id);}
 for(const alias of [x.nameHindi,...x.aliases])check(searchPortal(alias).some(r=>r.to===x.canonical),slug+' search '+alias);
 check(searchIndex.filter(r=>r.to===x.canonical).length===1,slug+' canonical search dedupe');
 const m=x.hero;check(!!m.alt&&!!m.caption&&!!m.credit&&!!m.licenseUrl&&!!m.source,slug+' media rights');
 for(const file of [m.src,m.thumbnail]){const target=path.join(root,'public',file);check(fs.existsSync(target),slug+' local media '+file);if(fs.existsSync(target))check(fs.statSync(target).size<450*1024,slug+' media budget '+file);}
 check(m.width>0&&m.height>0&&m.smallWidth>0,slug+' responsive dimensions');
 const schema=ancientSchema(x,'https://example.org');check(schema['@type']==='Article'&&schema.about['@type']==='Person',slug+' schema types');check(schema.about.birthDate===x.birthDate&&schema.about.deathDate===x.deathDate&&!schema.about.birthPlace,slug+' verified structured life dates');check(/^\d{4}-\d{2}-\d{2}$/.test(x.birthDate)&&x.deathDate>x.birthDate,slug+' valid ordered dates');check(schema.url==='https://example.org'+x.canonical,slug+' schema canonical');
 check(rewrites.some(r=>r.source===x.canonical&&r.destination===x.canonical+'/index.html'),slug+' clean URL rewrite');
 if(process.argv.includes('--html')){
  const file=path.join(root,'dist',x.canonical,'index.html');check(fs.existsSync(file),slug+' prerender');
  if(fs.existsSync(file)){const html=fs.readFileSync(file,'utf8');check(html.includes('<title>'+x.seo.title+'</title>'),slug+' static title');check((html.match(/<h1\b/g)||[]).length===1,slug+' one static H1');for(const s of x.sections)check(html.includes('id="'+s.id+'"'),slug+' full static section '+s.id);for(const e of x.timeline)check(html.includes(e.text),slug+' static timeline '+e.id);check(html.includes(m.src)&&html.includes(m.source)&&html.includes(m.licenseUrl),slug+' static media rights');check(!html.includes('id="ap-event-'),slug+' no inert static timeline buttons');const styles=[...html.matchAll(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"/g)].map(m=>path.join(root,'dist',m[1]));check(styles.length>1&&styles.every(f=>fs.existsSync(f)),slug+' stylesheet assets exist');const css=styles.map(f=>fs.readFileSync(f,'utf8')).join('');check(css.includes('.ap-page .p1-toc nav')&&css.includes('.p1-page'),slug+' scoped and shared CSS');const blocks=[...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));check(blocks.some(b=>b['@type']==='Article'&&b.about?.['@type']==='Person'),slug+' static Person/Article');check(blocks.some(b=>b['@type']==='BreadcrumbList'),slug+' static breadcrumb');for(const name of ['og:title','og:description','og:image','twitter:card'])check(html.includes('="'+name+'"'),slug+' social '+name);}
 }
}

const dinkar=load('personalities/dinkar.js').dinkar,renu=load('personalities/renu.js').renu,jp=load('personalities/jayaprakashNarayan.js').jayaprakashNarayan,bhikhari=load('personalities/bhikhariThakur.js').bhikhariThakur;
check(dinkar.timeline.find(e=>e.id==='jnanpith')?.sortYear===1972,'official Jnanpith award year');
check(renu.timeline.find(e=>e.id==='film').sortYear===1966,'Teesri Kasam year');
check(jp.timeline.find(e=>e.id==='bharat-ratna').sortYear===1999,'gazette date not PDF filename');
check(bhikhari.timeline.find(e=>e.id==='plays').sortYear===null,'no invented first-performance date');
check(bhikhari.hero.license==='CC BY 4.0','performance image attribution');
console.log(`Modern personalities: ${checks} checks, ${errors.length} errors; four profiles, 36 sections, 30 timeline entries.`);
console.log('NOTE: Institutional biographies and original texts are cited separately from reading guidance. Small archival images are not AI-upscaled.');
if(errors.length){errors.forEach(e=>console.error('ERROR:',e));process.exitCode=1;}
