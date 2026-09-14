const fs=require('fs'),path=require('path'),root=path.join(__dirname,'..'),errors=[];
const file=fs.readFileSync(path.join(root,'src/data/languages/index.js'),'utf8');
const data=new Function(`${file.replace(/export const /g,'const ')}\nreturn {languageTopics,scriptTopics,allLanguageTopics};`)();
const {languageTopics,scriptTopics,allLanguageTopics}=data,slugs=new Set(),ids=new Set(),aliasMap=new Map();
const validPeople=new Set(['bhikhari-thakur','ramdhari-dinkar','phanishwar-renu']);
for(const x of allLanguageTopics){
 for(const k of ['id','slug','nameHi','nameEn','category','summary','sources','seo'])if(!x[k]||(Array.isArray(x[k])&&!x[k].length))errors.push(`${x.slug||'unknown'} missing ${k}`);
 if(ids.has(x.id))errors.push(`duplicate id ${x.id}`);ids.add(x.id);if(slugs.has(x.slug))errors.push(`duplicate slug ${x.slug}`);slugs.add(x.slug);
 if(x.seo.canonical!==`/languages/${x.slug}`)errors.push(`${x.slug} bad canonical`);
 for(const a of x.aliases||[]){const n=a.toLowerCase().replace(/[^a-z0-9\u0900-\u097f]+/g,'-').replace(/^-|-$/g,'');if(aliasMap.has(n)&&aliasMap.get(n)!==x.slug)errors.push(`duplicate alias ${a}`);aliasMap.set(n,x.slug)}
 for(const s of x.sources){try{const u=new URL(s.url);if(!/^https?:$/.test(u.protocol)||u.hostname==='example.com')throw 0}catch{errors.push(`${x.slug} invalid source`)}if(!s.type)errors.push(`${x.slug} source missing type`)}
 const links=JSON.stringify(x).match(/"to":"\/languages\/[^"]+"/g)||[];for(const raw of links){const to=JSON.parse(`{${raw}}`).to.slice(11);if(!allLanguageTopics.some(y=>y.slug===to))errors.push(`${x.slug} broken language ref ${to}`)}
 for(const p of x.notablePeople||[])if(p.to?.startsWith('/personalities/')&&!validPeople.has(p.to.slice(15)))errors.push(`${x.slug} broken person ref ${p.to}`);
}
for(const s of ['maithili','bhojpuri','magahi','angika','bajjika','surjapuri','urdu-bihar','hindi-literature-bihar'])if(!languageTopics.some(x=>x.slug===s))errors.push(`missing language ${s}`);for(const s of ['tirhuta-script','kaithi-script'])if(!scriptTopics.some(x=>x.slug===s))errors.push(`missing script ${s}`);
for(const x of languageTopics)for(const k of ['languageFamily','subgroup','culturalRegions','districtNames','geographicDistribution','linguisticContext','oralTraditions','literaryTraditions','majorGenres','statusNotes','constitutionalStatus'])if(!x[k]||(Array.isArray(x[k])&&!x[k].length))errors.push(`${x.slug} missing language field ${k}`);
for(const x of scriptTopics)for(const k of ['associatedLanguages','historicalPeriod','historicalUse','writingDirection','characterType','manuscriptContext','declineOrTransition','modernUse','relatedRegions'])if(!x[k]||(Array.isArray(x[k])&&!x[k].length))errors.push(`${x.slug} missing script field ${k}`);
const corpus=JSON.stringify(allLanguageTopics);if(/Buddha spoke modern Magahi|Urdu belongs only|Hindi belongs only/i.test(corpus))errors.push('unsafe classification/religion claim');
if(!languageTopics.find(x=>x.slug==='maithili').scripts.some(x=>x.to==='/languages/tirhuta-script'))errors.push('Maithili → Tirhuta missing');if(!scriptTopics.find(x=>x.slug==='tirhuta-script').associatedLanguages.some(x=>x.to==='/languages/maithili'))errors.push('Tirhuta → Maithili missing');
const app=fs.readFileSync(path.join(root,'src/App.jsx'),'utf8');for(const route of ['/languages','/languages/:slug'])if(!app.includes(`path="${route}"`))errors.push(`missing route ${route}`);
const ui=fs.readFileSync(path.join(root,'src/components/languages/LanguageModule.jsx'),'utf8');for(const name of ['LanguageProfile','LanguageClassificationNote','ScriptProfile','LiteraryTradition','WriterCard','OralLiteratureSection','RelatedCulture'])if(!ui.includes(`function ${name}`))errors.push(`missing component ${name}`);
if(errors.length){console.error([...new Set(errors)].join('\n'));process.exit(1)}
console.log('Language validation passed');console.log(`Deep languages/literary profiles: ${languageTopics.filter(x=>x.contentStatus==='complete').length}`);console.log(`Basic profiles: ${languageTopics.filter(x=>x.contentStatus==='basic').length}`);console.log(`Script profiles: ${scriptTopics.length}`);console.log('Duplicate IDs/slugs/aliases: 0');console.log('Broken language/script/person refs: 0');console.log('Missing sources/SEO: 0');console.log('Classification and religion warnings: 0');
