const fs=require('node:fs'),path=require('node:path'),root=path.join(__dirname,'..');
const {loadDataModule}=require('./load-data-module.cjs');
const load=file=>loadDataModule(path.join(root,'src/data',file));
const {festivalTopics:topics,festivalBySlug,festivalRoutes,normalizeFestivalTerm}=load('festivals');
const {searchPortal,searchIndex}=load('searchIndex.js');
const errors=[];let checks=0;
const check=(condition,message)=>{checks++;if(!condition)errors.push(message);};
const ids=new Set(),slugs=new Set(),aliases=new Map(),images=new Set();
const districts=new Set(load('districts.js').districts.map(x=>x.slug));
const culture=load('culture/index.js'),tourism=load('tourism/index.js'),food=load('food/index.js'),languages=load('languages/index.js'),blogs=load('blogs.js');
const validLink=to=>{
 if(typeof to!=='string'||!to.startsWith('/')||to.startsWith('//'))return false;
 const clean=to.split(/[?#]/)[0],parts=clean.split('/').filter(Boolean),slug=parts.at(-1);
 if(parts[0]==='festivals')return festivalRoutes.includes(clean)||Boolean(festivalBySlug(slug));
 if(parts[0]==='culture'&&parts[1]==='festivals')return parts.length===2||Boolean(festivalBySlug(slug));
 if(parts[0]==='culture')return parts.length===1||Boolean(culture.cultureBySlug(slug))||load('catalog.js').cultureItems.some(x=>x.slug===slug);
 if(parts[0]==='district')return districts.has(slug);
 if(parts[0]==='tourism')return Boolean(tourism.tourismBySlug(slug));
 if(parts[0]==='food')return Boolean(food.foodBySlug(slug));
 if(parts[0]==='languages')return Boolean(languages.languageBySlug(slug));
 if(parts[0]==='blog')return blogs.posts.some(x=>x.slug===slug);
 return searchIndex.some(x=>x.to===clean)||fs.readFileSync(path.join(root,'src/App.jsx'),'utf8').includes('path="'+clean+'"');
};
for(const x of topics){
 for(const key of ['id','slug','publicSlug','nameHindi','nameEnglish','category','religion','region','season','description','history','mythology','rituals','foods','songs','dress','places','tourism','images','seo','relatedFestival','sources','faith','seasonGroup']){
  check(Boolean(x[key])&&(!Array.isArray(x[key])||x[key].length>0),x.slug+': missing '+key);
 }
 check(Array.isArray(x.months)&&x.months.every(n=>Number.isInteger(n)&&n>=1&&n<=12),x.slug+': months');
 if(['moving','intercalary','scheduled'].includes(x.seasonGroup))check(x.months.length===0,x.slug+': speculative fixed month');
 check(!ids.has(x.id),'duplicate id '+x.id);ids.add(x.id);
 check(!slugs.has(x.publicSlug),'duplicate public slug '+x.publicSlug);slugs.add(x.publicSlug);
 check(x.seo.canonical==='/festivals/'+x.publicSlug,x.slug+': canonical');
 check(x.seo.title.length>12&&x.seo.description.length>45,x.slug+': missing/thin SEO');
 for(const alias of x.aliases){const key=normalizeFestivalTerm(alias);check(!aliases.has(key)||aliases.get(key)===x.slug,'ambiguous alias '+alias);aliases.set(key,x.slug);check(festivalBySlug(alias)?.slug===x.slug,'alias lookup '+alias);}
 for(const district of x.districts)check(districts.has(district),x.slug+': invalid district '+district);
 for(const source of x.sources){try{const u=new URL(source.url);check(u.protocol==='https:'&&!/example\.|localhost/.test(u.hostname),x.slug+': invalid source');}catch{check(false,x.slug+': malformed source');}check(Boolean(source.title&&source.type),x.slug+': source metadata');}
 check(x.gallery.length>0,x.slug+': gallery');
 for(const media of [x.hero,...x.gallery]){
  for(const key of ['src','thumbnail','alt','caption','credit','source','type','disclosure','width','height'])check(Boolean(media[key]),x.slug+': missing image '+key);
  check(media.type==='ai-generated'&&media.disclosure.includes('AI'),x.slug+': missing AI disclosure');
  check(fs.existsSync(path.join(root,media.source)),x.slug+': missing prompt provenance');
  for(const file of [media.src,media.thumbnail]){
   const full=path.join(root,'public',file);check(fs.existsSync(full),x.slug+': missing '+file);
   if(fs.existsSync(full)){const data=fs.readFileSync(full);check(data.toString('ascii',0,4)==='RIFF'&&data.toString('ascii',8,12)==='WEBP',file+': not WebP');check(data.length<350000,file+': media budget');images.add(file);}
  }
 }
 for(const field of ['relatedCulture','relatedTourism','relatedDistricts','relatedHistory','relatedFood','relatedLanguages','relatedBlogs','foods','songs','crafts','places'])for(const link of x[field]||[])if(link.to)check(validLink(link.to),x.slug+': broken '+link.to);
 for(const slug of x.relatedFestival)check(Boolean(festivalBySlug(slug)),x.slug+': missing related festival '+slug);
 check(searchIndex.filter(item=>item.to===x.seo.canonical).length===1,x.slug+': search canonical missing/duplicate');
}
const required=['chhath-puja','holi','durga-puja','diwali','sama-chakeva','jitiya','makar-sankranti','saraswati-puja','mahashivratri','ram-navami','teej','bihula-bishari','buddha-purnima','mahavir-jayanti','guru-gobind-singh-jayanti','eid-ul-fitr','eid-ul-adha','muharram','christmas','sonepur-mela','rajgir-mahotsav','shravani-mela','vaishali-mahotsav','bodh-mahotsav','pitrapaksha-mela','malmas-mela','mandar-mela','kako-urs'];
for(const slug of required)check(slugs.has(slug),'missing requested profile '+slug);
for(const slug of ['chhath','sonepur-mela','pitru-paksha','sama-chakeva','jitiya','fagua','madhushravani','bihula-bishahari','makar-sankranti'])check(Boolean(festivalBySlug(slug)),'legacy regression '+slug);
check(topics.filter(x=>x.collection==='fairs').length===9,'expected nine requested fair profiles');
const chhath=festivalBySlug('chhath');
check(chhath.festivalStages.length===4&&chhath.gallery.length===3,'Chhath depth');
for(const [query,slug] of [['छठ','chhath'],['Chhath','chhath'],['छठ पूजा','chhath'],['सामा चकेवा','sama-chakeva'],['होली','fagua'],['जितिया','jitiya'],['सोनपुर मेला','sonepur-mela']])check(searchPortal(query).some(x=>x.to===festivalBySlug(slug).seo.canonical),'global search alias '+query);
const app=fs.readFileSync(path.join(root,'src/App.jsx'),'utf8');
for(const route of ['/festivals','/festivals/religious','/festivals/fairs','/festivals/seasonal','/festivals/:slug','/culture/festivals','/culture/festivals/:slug'])check(app.includes('path="'+route+'"'),'missing route '+route);
const ui=fs.readFileSync(path.join(root,'src/components/festivals/FestivalModule.jsx'),'utf8');
for(const name of ['TraditionNote','CurrentFestivalNotice','SeasonalCalendar','FestivalDirectory','FestivalDetailPage'])check(ui.includes('function '+name),'missing component '+name);
check(ui.includes('CurrentEventOccurrence')&&ui.includes('aria-expanded')&&ui.includes('noIndex'),'current boundary / interaction / unknown route');
if(errors.length){console.error([...new Set(errors)].join('\n'));process.exitCode=1;}else console.log(JSON.stringify({status:'passed',checks,profiles:topics.length,fairs:9,canonicalRoutes:festivalRoutes.length,webpFiles:images.size,duplicateIds:0,missingImages:0,brokenReferences:0,searchAliases:'passed'},null,2));
