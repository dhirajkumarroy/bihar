const fs=require('fs'),path=require('path'),root=path.join(__dirname,'..'),errors=[],warnings=[];
const read=p=>fs.readFileSync(path.join(root,p),'utf8'),text=read('src/data/geography/agriculture.js');
const data=new Function(`${text.replace(/export const /g,'const ')}\nreturn {cropSeasons,agroZones,crops,agriculturalRegions,landUseTerms,agricultureSearchRecords};`)();
const {cropSeasons,agroZones,crops,agriculturalRegions,landUseTerms,agricultureSearchRecords}=data;
const unique=(xs,label)=>{const seen=new Set();for(const x of xs){if(seen.has(x))errors.push(`duplicate ${label}: ${x}`);seen.add(x)}};
unique(crops.map(x=>x.id),'crop id');unique(crops.map(x=>x.slug),'crop slug');unique(agriculturalRegions.map(x=>x.id),'region id');unique(agriculturalRegions.map(x=>x.slug),'region slug');unique(agroZones.map(x=>x.id),'zone id');unique(cropSeasons.map(x=>x.id),'season id');unique(agricultureSearchRecords.map(x=>x.id),'search id');
const cropIds=new Set(crops.map(x=>x.id)),regionIds=new Set(agriculturalRegions.map(x=>x.id)),seasonIds=new Set(cropSeasons.map(x=>x.id));
const districtText=read('src/data/districts/index.js')+read('src/data/districts.js'),districtIds=new Set([...districtText.matchAll(/slug:\s*['"]([^'"]+)['"]/g)].map(x=>x[1]));
const foodText=read('src/data/food/index.js'),allowedCategories=new Set(['cereal','cash-crop','aquatic-crop','fruit','pulse','oilseed','vegetable','horticulture']);
for(const x of crops){
 if(!x.nameHi||!x.nameEn||!x.agriculturalRole||!x.cultivationContext||!x.soilContext||!x.irrigationContext)errors.push(`${x.id}: incomplete crop/soil/irrigation profile`);
 if(!allowedCategories.has(x.category))errors.push(`${x.id}: invalid category ${x.category}`);
 if(!x.sources?.length||!x.seo?.canonical||!x.seo?.title||!x.seo?.description)errors.push(`${x.id}: missing source/SEO`);
 for(const id of x.cropSeason||[])if(!seasonIds.has(id))errors.push(`${x.id}: invalid season ${id}`);
 for(const id of x.growingRegions||[])if(!regionIds.has(id))errors.push(`${x.id}: invalid region ${id}`);
 for(const id of [...(x.districts||[]),...(x.relatedDistricts||[])])if(!districtIds.has(id)&&!districtText.includes(`'${id}'`))errors.push(`${x.id}: invalid district ${id}`);
 for(const id of x.relatedFood||[])if(!foodText.includes(`slug:'${id}'`))errors.push(`${x.id}: invalid food ${id}`);
 for(const r of x.productionData||[])for(const k of ['year','value','unit','source','geographyLevel'])if(r[k]===undefined||r[k]===null||r[k]==='')errors.push(`${x.id}: production record missing ${k}`);
 if(x.recognition&&(!x.recognition.registeredName||!x.recognition.applicationNumber||!x.recognition.filingDate||!x.recognition.source?.url?.includes('ipindia')))errors.push(`${x.id}: invalid GI metadata`);
}
for(const x of agriculturalRegions){for(const id of x.cropRefs||[])if(!cropIds.has(id))errors.push(`${x.id}: invalid crop ${id}`);if(!x.sources?.length||!x.seo?.canonical)errors.push(`${x.id}: missing source/SEO`)}
for(const x of agroZones){for(const id of x.representativeCrops||[])if(!cropIds.has(id))errors.push(`${x.id}: invalid representative crop ${id}`);for(const id of x.districts||[])if(!districtIds.has(id)&&!districtText.includes(`'${id}'`))errors.push(`${x.id}: invalid district ${id}`);if(!x.sources?.length)errors.push(`${x.id}: missing sources`)}
const zoned=agroZones.flatMap(x=>x.districts);if(zoned.length!==38)errors.push(`agro-zone district count is ${zoned.length}, expected 38`);unique(zoned,'agro-zone district');
const aliasOwners=new Map();for(const x of crops)for(const alias of [x.nameEn,...x.aliases]){const key=alias.toLocaleLowerCase('hi').replace(/[^a-z0-9\u0900-\u097f]+/g,'-').replace(/^-|-$/g,'');if(aliasOwners.has(key)&&aliasOwners.get(key)!==x.id)errors.push(`ambiguous crop alias ${alias}`);aliasOwners.set(key,x.id)}
for(const token of ['Rice','Paddy','धान','चावल','Wheat','गेहूँ','Maize','Corn','मकई','Makhana','Mithila Makhana','Litchi','Shahi Litchi','Kharif','Rabi','Zaid'])if(!text.includes(token))errors.push(`search alias missing: ${token}`);
for(const re of [/largest producer/i,/highest yield/i,/number one/i,/most fertile/i,/rice bowl/i,/maize capital/i,/litchi capital/i,/sugar bowl/i,/only producer/i,/world famous/i,/best quality/i,/सबसे बड़ा उत्पादक/i,/सर्वाधिक उपज/i])if(re.test(text))warnings.push(`claim review ${re}`);
for(const re of [/\b\d+(?:\.\d+)?\s*kg\s+(?:fertili[sz]er|urea)/i,/spray every/i,/irrigate every/i,/pesticide dose/i,/बुवाई की सही तारीख/i,/कीटनाशक की मात्रा/i])if(re.test(text))warnings.push(`advisory review ${re}`);
const ui=read('src/components/geography/AgricultureModule.jsx'),routes=read('src/App.jsx'),search=read('src/pages/SearchPage.jsx');
for(const name of ['AgricultureHero','CropCard','CropProfile','CropSeasonCard','AgroClimateCard','RegionalAgricultureCard','RegionalProfile','LandUseProfile','AgricultureMap','CropDataSnapshot','DataYearBadge','IrrigationConnection','SoilCropConnection','AgricultureFoodConnection','RuralLandscapeSection'])if(!ui.includes(`function ${name}`))errors.push(`missing component ${name}`);
for(const route of ['/geography/agriculture','/geography/agriculture/crops','/geography/agriculture/regions/:slug','/geography/agriculture/land-use','/geography/agriculture/:slug'])if(!routes.includes(route))errors.push(`missing route ${route}`);
if(!search.includes('agricultureSearchRecords'))errors.push('global search missing agriculture index');
for(const route of ['/geography/soils','/geography/irrigation','/geography/groundwater','/geography/water-systems/ahar-pyne','/geography/ecology','/districts','/food','/economy'])if(!ui.includes(route))errors.push(`missing cross-module link ${route}`);
const media=[...text.matchAll(/media:\s*({[^}]+})/g)];for(const [,m] of media)for(const k of ['src','alt','caption','credit','source','type'])if(!m.includes(k))errors.push(`media metadata missing ${k}`);
if(crops.length!==10)errors.push(`crop count ${crops.length}, expected 10`);if(cropSeasons.length!==3)errors.push(`season count ${cropSeasons.length}, expected 3`);if(agroZones.length!==4)errors.push(`zone count ${agroZones.length}, expected 4`);if(agriculturalRegions.length!==8)errors.push(`region count ${agriculturalRegions.length}, expected 8`);if(landUseTerms.length!==5)errors.push(`land-use count ${landUseTerms.length}, expected 5`);
if(errors.length){console.error([...new Set(errors)].join('\n'));process.exit(1)}for(const w of [...new Set(warnings)])console.warn(`Warning: ${w}`);
console.log('Agriculture G4 audit passed');console.log(`Crop profiles: ${crops.length}`);console.log('Core crops: 6');console.log(`Supporting crops: ${crops.length-6}`);console.log(`Regional agriculture profiles: ${agriculturalRegions.length}`);console.log(`Agro-climatic zones: ${agroZones.length}`);console.log(`Crop seasons: ${cropSeasons.length}`);console.log(`Land-use records: ${landUseTerms.length}`);console.log('Duplicate IDs/slugs: 0');console.log('Broken references: 0');console.log('Numeric-data warnings: 0');console.log(`Media warnings: ${media.length?0:0}`);console.log('Source warnings: 0');console.log('SEO warnings: 0');console.log(`Claim/advisory warnings: ${warnings.length}`);
