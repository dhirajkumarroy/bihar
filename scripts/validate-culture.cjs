const fs=require('fs'),path=require('path'),root=path.join(__dirname,'..'),errors=[],warnings=[];
const evaluate=(file,exportName)=>{const text=fs.readFileSync(path.join(root,file),'utf8');return new Function(`${text.replace(`export const ${exportName}=`,`const ${exportName}=`)}\nreturn ${exportName};`)()};
const movementText=fs.readFileSync(path.join(root,'src/data/culture/movementTraditions.js'),'utf8').replace('export const movementTraditions=','const movementTraditions=').replace('export const movementExtensions=','const movementExtensions=');
const movementData=new Function(`${movementText}\nreturn {movementTraditions,movementExtensions};`)();
const basePerformance=evaluate('src/data/culture/performanceTraditions.js','performanceTraditions');
const topics=[evaluate('src/data/culture/mithilaPainting.js','mithilaPainting'),...basePerformance.map(topic=>movementData.movementExtensions[topic.slug]?{...topic,...movementData.movementExtensions[topic.slug]}:topic),...movementData.movementTraditions];
const validCategories=new Set(['visual-art','craft','music','theatre','dance','festival','language','literature','food','clothing','ritual','folk-tradition','architecture']);
const validRegions=new Set(['Mithila','Bhojpur','Magadh','Anga','Champaran','Seemanchal']);
const validDistricts=new Set(['madhubani','darbhanga','sitamarhi','supaul','bhojpur','buxar','saran','gaya','nalanda','nawada','bhagalpur','munger','banka','east-champaran','west-champaran','purnia','katihar','araria','kishanganj']);
const validTypes=new Set(['folk-theatre','narrative-performance','seasonal-song','ritual-song','dance-theatre','ritual-dance']);
const validMovementTypes=new Set(['folk-dance','ritual-dance','dance-theatre','martial-performance','wedding-dance','seasonal-performance','processional-performance']);
const validLanguageRoutes=new Set(['/languages/maithili','/languages/bhojpuri','/languages/magahi']);
const validFestivalRoutes=new Set(['/festivals/durga-puja','/festivals/holi','/festivals/sama-chakeva']);
const ids=new Set(),slugs=new Set(),aliasKeys=new Map();
for(const topic of topics){
 for(const key of ['id','slug','nameHi','nameEn','category','regions','districts','summary','intro','sources','seo'])if(!topic[key]||(Array.isArray(topic[key])&&!topic[key].length))errors.push(`${topic.slug||'unknown'} missing ${key}`);
 if(ids.has(topic.id))errors.push(`Duplicate ID ${topic.id}`);ids.add(topic.id);if(slugs.has(topic.slug))errors.push(`Duplicate slug ${topic.slug}`);slugs.add(topic.slug);
 if(topic.id!==topic.slug)errors.push(`${topic.slug}: ID and canonical slug differ`);if(!validCategories.has(topic.category))errors.push(`${topic.slug}: invalid category ${topic.category}`);
 for(const region of topic.regions)if(!validRegions.has(region))errors.push(`${topic.slug}: invalid cultural region ${region}`);for(const district of topic.districts)if(!validDistricts.has(district))errors.push(`${topic.slug}: invalid district ${district}`);
 for(const alias of topic.aliases||[]){const key=alias.toLowerCase().replace(/[^a-z0-9\u0900-\u097f]+/g,'-').replace(/^-|-$/g,'');if(aliasKeys.has(key)&&aliasKeys.get(key)!==topic.slug)warnings.push(`Shared alias ${alias}`);else aliasKeys.set(key,topic.slug)}
 for(const source of topic.sources){try{const u=new URL(source.url);if(!['http:','https:'].includes(u.protocol)||u.hostname==='example.com')errors.push(`${topic.slug}: invalid source URL`)}catch{errors.push(`${topic.slug}: malformed source ${source.url}`)}if(!source.type)errors.push(`${topic.slug}: source type missing`)}
 if(topic.seo.canonical!==`/culture/${topic.slug}`||!topic.seo.title||!topic.seo.description)errors.push(`${topic.slug}: invalid SEO`);
 if(topic.performanceType){
  for(const key of ['subcategory','performanceType','language','languages','culturalRegion','performanceContext','performanceProfile','themes','oralTransmission','socialContext','contemporaryPractice','audioExamples','videoExamples'])if(topic[key]===undefined||(Array.isArray(topic[key])&&!topic[key].length&& !['audioExamples','videoExamples'].includes(key)))errors.push(`${topic.slug}: missing performance field ${key}`);
  if(!validTypes.has(topic.performanceType))errors.push(`${topic.slug}: invalid performance type`);if(!topic.oralTransmission?.variationFactors?.length)errors.push(`${topic.slug}: oral variation factors missing`);
  for(const media of [...topic.audioExamples,...topic.videoExamples])if(!media.url||!media.source||!media.rights)errors.push(`${topic.slug}: invalid media metadata`);
 }
 if(topic.movementType){
  for(const key of ['movementType','movementStyle','spatialPattern','movementProfile','formation','regionalVariants'])if(!topic[key]||(Array.isArray(topic[key])&&!topic[key].length))errors.push(`${topic.slug}: missing movement field ${key}`);
  if(!validMovementTypes.has(topic.movementType))errors.push(`${topic.slug}: invalid movement type ${topic.movementType}`);
  for(const media of [...(topic.audioExamples||[]),...(topic.videoExamples||[])])if(!media.source||!media.rights)errors.push(`${topic.slug}: sourceless movement media`);
  if(topic.hero&&!topic.hero.credit)errors.push(`${topic.slug}: movement image missing credit`);
 }
}
for(const required of ['bidesia','birha','chaita','sohar','samdaun','jat-jatin','domkach','launda-naach'])if(!slugs.has(required))errors.push(`Missing C3 route ${required}`);
if(!slugs.has('jhijhiya'))errors.push('Missing C4 route jhijhiya');
for(const duplicate of ['jhijhiya-dance','domkach-dance','jat-jatin-dance'])if(slugs.has(duplicate))errors.push(`Duplicate movement route ${duplicate}`);
for(const topic of topics){for(const ref of topic.relatedCulture||[]){if(ref.to.startsWith('/culture/')&&!slugs.has(ref.to.slice(9)))errors.push(`${topic.slug}: broken related culture ref ${ref.to}`);if(ref.to.startsWith('/languages/')&&!validLanguageRoutes.has(ref.to))errors.push(`${topic.slug}: broken language ref ${ref.to}`)}for(const ref of topic.associatedFestival||[])if(!validFestivalRoutes.has(ref.to))errors.push(`${topic.slug}: broken festival ref ${ref.to}`)}
const pages=fs.readFileSync(path.join(root,'src/pages/CulturePages.jsx'),'utf8');if(!pages.includes("slug==='bhikhari-thakur'")||!pages.includes('/personalities/bhikhari-thakur'))errors.push('Bhikhari Thakur canonical redirect missing');
const component=fs.readFileSync(path.join(root,'src/components/culture/PerformanceCulture.jsx'),'utf8');for(const name of ['PerformanceProfile','SeasonalContext','OralTraditionContext','InstrumentsUsed','PerformanceCollections'])if(!component.includes(`function ${name}`))errors.push(`Missing component ${name}`);
const movementComponent=fs.readFileSync(path.join(root,'src/components/culture/MovementCulture.jsx'),'utf8');for(const name of ['MovementProfile','RitualContext','PerformanceObject','MovementCollections'])if(!movementComponent.includes(`function ${name}`))errors.push(`Missing component ${name}`);
const app=fs.readFileSync(path.join(root,'src/App.jsx'),'utf8');for(const route of ['/culture','/culture/:slug','/personalities/:slug'])if(!app.includes(`path="${route}"`))errors.push(`Missing route ${route}`);
for(const phrase of ['invented the entire','only women perform','unique to Bihar','oldest folk'])for(const topic of topics.filter(x=>x.performanceType))if(JSON.stringify(topic).toLowerCase().includes(phrase))warnings.push(`${topic.slug}: review risky phrase ${phrase}`);
if(errors.length){console.error([...new Set(errors)].join('\n'));process.exit(1)}for(const warning of [...new Set(warnings)])console.warn(`Warning: ${warning}`);
console.log('Culture validation passed');console.log(`Deep culture topics: ${topics.length} (performance: ${topics.filter(x=>x.performanceType).length}, movement: ${topics.filter(x=>x.movementType).length})`);console.log('Duplicate IDs/slugs: 0');console.log('Broken district/region/language/festival/culture refs: 0');console.log('Missing SEO/sources: 0');console.log('Invalid or sourceless media: 0');
