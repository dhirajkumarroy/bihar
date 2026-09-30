const fs=require('node:fs'),path=require('node:path');
const {loadDataModule:load}=require('./load-data-module.cjs');
const root=path.resolve(__dirname,'..'),data=load(path.join(root,'src/data/religion/index.js'));
const {religionRecords:records,religionDirectories:directories,religionById:byId,religionSources:sources,sourceById,claimKinds,contentTypes,traditions,regions,religionMedia:media,mediaById,getClaims,getSourceIds,religionRoutes,normalizeReligion}=data;
const festivals=load(path.join(root,'src/data/festivals/index.js')).festivalTopics;
const tourism=load(path.join(root,'src/data/tourism/index.js')).destinations;
const districts=load(path.join(root,'src/data/districts.js')).districts;
const geography=load(path.join(root,'src/data/geography/index.js')).riverDirectory;
const history=load(path.join(root,'src/data/history/index.js'));
const historyRoutes=new Set([...history.historyPeriods.map(x=>x.route),...['ancientPages','magadhaPages','mauryaPages','h5Pages','h6Pages','h7Pages','h8Pages'].flatMap(k=>history[k].map(x=>'/history/'+x.slug))]);
let checks=0;const errors=[],warnings=[];
const check=(ok,msg)=>{checks++;if(!ok)errors.push(msg);};
const unique=(array,label)=>check(new Set(array).size===array.length,'Duplicate '+label);
const date=value=>/^\d{4}-\d{2}-\d{2}$/.test(value)&&!isNaN(Date.parse(value))&&new Date(value).toISOString().slice(0,10)===value;
const bilingual=(value,label)=>check(value&&typeof value.hi==='string'&&!!value.hi.trim()&&typeof value.en==='string'&&!!value.en.trim(),'Missing bilingual '+label);
unique(records.map(x=>x.id),'record IDs');unique(records.map(x=>x.slug),'slugs');unique(religionRoutes,'routes');unique(sources.map(x=>x.id),'source IDs');unique(records.filter(x=>x.type==='place').map(x=>normalizeReligion(x.nameEnglish)),'sacred-place identities');unique(media.map(x=>x.id),'image IDs');
const terms=new Map();
for(const x of records){
 check(x.id===x.slug,'Unstable ID '+x.id);check(contentTypes[x.type],x.id+': invalid type');check(x.nameHindi&&x.nameEnglish,x.id+': missing names');bilingual(x.summary,x.id+' summary');bilingual(x.religiousRegion,x.id+' religious region');check(Array.isArray(x.administrativeDistrict),x.id+': separate administrative district missing');check(date(x.lastVerified),x.id+': invalid review date');
 check(x.tradition.length&&x.tradition.every(id=>traditions[id]),x.id+': invalid tradition');check(x.regions.every(id=>regions[id]),x.id+': invalid cultural region');
 unique(x.aliases.map(normalizeReligion),x.id+' aliases');for(const alias of [x.nameEnglish,x.nameHindi,...x.aliases]){const term=normalizeReligion(alias),other=terms.get(term);check(!other||other===x.id,`Duplicate alias/entity '${alias}': ${other} / ${x.id}`);terms.set(term,x.id);}
 for(const field of ['relatedPlaces','relatedRecords','festivals','tourism','history','rivers','images'])unique(x[field],x.id+' '+field);
 for(const id of [...x.relatedPlaces,...x.relatedRecords,...(x.contextRecords||[]),...(x.places||[])])check(byId[id]&&id!==x.id,x.id+': broken related ID '+id);
 for(const id of x.relatedPlaces)check(byId[id]?.type==='place',x.id+': related place has wrong type '+id);
 for(const id of x.festivals)check(festivals.some(f=>f.slug===id),x.id+': broken C8 link '+id);
 for(const id of x.tourism)check(tourism.some(d=>d.slug===id),x.id+': broken Tourism link '+id);
 for(const id of x.administrativeDistrict)check(districts.some(d=>d.slug===id),x.id+': broken district '+id);
 for(const route of x.history)check(historyRoutes.has(route),x.id+': broken History link '+route);
 for(const id of x.rivers)check(geography.some(r=>r.slug===id),x.id+': broken Geography river '+id);
 for(const id of x.images)check(mediaById[id],x.id+': missing image '+id);
 for(const id of x.architecture||[])check(byId[id]?.type==='architecture',x.id+': architecture reference '+id);
 const claims=getClaims(x);check(x.sources.length>0,x.id+': no sources');
 for(const id of getSourceIds(x))check(sourceById[id],x.id+': unknown source '+id);
 for(const item of claims){check(claimKinds.includes(item.classification),x.id+': missing claim classification');bilingual(item.text,item.id);check(item.sources.length>0,item.id+': unsupported claim');for(const id of item.sources)check(sourceById[id],item.id+': missing claim source '+id);}
 // Heuristic lint is only a review aid: it cannot determine whether an assertion is historically true.
 const prose=claims.map(c=>c.text.en).join(' ');if(/\b(oldest|greatest|most powerful|holiest|miracle proves)\b/i.test(prose))warnings.push(x.id+': review potential superlative');
 if(x.type==='place'){for(const key of ['location','district','region','historicalPeriod','historicalBackground','religiousSignificance','traditionalBeliefs','archaeologicalEvidence','architecture','pilgrimageImportance','culturalImportance','relatedPeople','relatedEvents','officialWebsite'])check(key in x,x.id+': missing model field '+key);if(!x.images.length)warnings.push(x.id+': verified site photograph not available');}
 if(x.tradition.includes('folk')&&x.type==='tradition')check(x.communityContext&&x.regions.length,x.id+': folk community / region scope missing');
}
unique(records.flatMap(x=>x.claims.map(c=>c.id)),'claim IDs');
for(const x of [...records,...directories]){bilingual(x.seo.title,x.slug+' SEO title');bilingual(x.seo.description,x.slug+' SEO description');check(x.seo.canonical.startsWith('/religion'),x.slug+': canonical');}
unique([...records,...directories].map(x=>x.seo.title.hi),'SEO titles');unique([...records,...directories].map(x=>x.seo.description.en),'SEO descriptions');
for(const s of sources){check(/^https:\/\//.test(s.url),s.id+': source URL');check(s.title&&s.type&&date(s.reviewedOn),s.id+': source metadata');}
for(const m of media){for(const key of ['alt','caption','credit','source','license','licenseUrl','usageStatus','type','changes'])check(!!m[key],m.id+': image '+key);check(m.type==='authentic-photograph',m.id+': image disclosure');for(const file of [m.src,m.thumbnail]){check(file.startsWith('/images/religion/'),m.id+': image scope');const target=path.join(root,'public',file);check(fs.existsSync(target),m.id+': broken local image');if(fs.existsSync(target))check(fs.statSync(target).size<500*1024,m.id+': exceeds 500KB');}check(m.width>0&&m.height>0&&date(m.verifiedOn),m.id+': image dimensions / date');}
check(!byId['hindu-pilgrimage'].places.includes('maner-sharif'),'Maner wrongly classified as Hindu');check(byId['sufi-pilgrimage'].places.includes('maner-sharif'),'Maner missing from Sufi circuit');
const search=load(path.join(root,'src/data/searchIndex.js')).searchPortal;
for(const [query,prefix] of [['Chhath','/festivals/'],['Holi','/festivals/'],['Bodh Gaya','/religion/'],['महाबोधि','/religion/'],['Pawapuri','/religion/'],['Rajgir','/religion/'],['Nalanda','/religion/'],['Vaishali','/religion/'],['Patna Sahib','/religion/'],['Maner Sharif','/religion/'],['Bihar Sharif','/religion/'],['Mundeshwari','/religion/'],['Gaya','/tourism/'],['Sonepur','/tourism/']])check(search(query).some(x=>x.to.startsWith(prefix)),`Search ${query} -> ${prefix}`);
check(!search('Vishwanath').some(x=>x.to.startsWith('/religion/')),'Unrelated Vishwanath entity added');
for(const query of ['Bodh Gaya','Pawapuri','Patna Sahib','Maner Sharif'])check(search(query).some(x=>x.to.startsWith('/tourism/'))&&search(query).some(x=>x.to.startsWith('/religion/')),'Search hides module-specific result '+query);
console.log(JSON.stringify({checks,records:records.length,routes:religionRoutes.length,counts:Object.fromEntries(Object.keys(contentTypes).map(k=>[k,records.filter(x=>x.type===k).length])),claims:records.flatMap(x=>x.claims).length,aliases:records.reduce((sum,x)=>sum+x.aliases.length,0),sources:sources.length,images:media.length,aiImages:media.filter(x=>x.type!=='authentic-photograph').length,errors,warnings},null,2));
console.log('Review limits: source citations/classifications are linted, not fact-certified. Four rivers and Seemanchal need further religious documentation; other stated uncertainties remain visible.');
if(errors.length)process.exitCode=1;
