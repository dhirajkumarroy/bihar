const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..'),errors=[];
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const dataText=read('src/data/geography/index.js');
const data=new Function(`${dataText.replace(/export const /g,'const ')}\nreturn {naturalRegions,riverTopics,riverDirectory,geographySystems,geographyGlossary};`)();
const {naturalRegions,riverTopics,riverDirectory,geographySystems}=data;
const unique=(list,label)=>{const seen=new Set();for(const value of list){if(seen.has(value))errors.push(`duplicate ${label}: ${value}`);seen.add(value)}};
if(riverTopics.length!==16)errors.push(`expected 16 rivers, found ${riverTopics.length}`);
if(riverTopics.filter(x=>x.contentStatus==='complete').length!==10)errors.push('expected 10 complete river profiles');
if(riverTopics.filter(x=>x.contentStatus==='basic').length!==6)errors.push('expected 6 basic river profiles');
if(naturalRegions.length!==5)errors.push(`expected 5 natural regions, found ${naturalRegions.length}`);
unique(riverTopics.map(x=>x.slug),'river slug');unique(naturalRegions.map(x=>x.slug),'region slug');
for(const river of riverTopics){
  for(const field of ['id','slug','nameHi','nameEn','origin','courseSummary','exitsOrConfluence','floodplainContext','sedimentContext','environmentalContext'])if(!river[field])errors.push(`${river.slug}: missing ${field}`);
  if(!river.sources?.length)errors.push(`${river.slug}: missing sources`);
  if(!river.seo?.title||!river.seo?.description||river.seo.canonical!==`/geography/rivers/${river.slug}`)errors.push(`${river.slug}: invalid SEO/canonical`);
  if(river.map?.type!=='schematic'||!river.map?.source?.url)errors.push(`${river.slug}: map must be labelled schematic and sourced`);
}
for(const region of naturalRegions){if(!region.sources?.length)errors.push(`${region.slug}: missing region sources`);if(region.seo?.canonical!==`/geography/natural-regions/${region.slug}`)errors.push(`${region.slug}: invalid region canonical`)}
for(const slug of ['physical','climate','soils','wetlands','forests','natural-regions'])if(!geographySystems[slug])errors.push(`missing geography system ${slug}`);
const bySlug=Object.fromEntries(riverTopics.map(x=>[x.slug,x]));
for(const [slug,target] of [['kosi','गंगा'],['gandak','गंगा'],['son','गंगा'],['punpun','गंगा'],['falgu','पुनपुन']])if(!bySlug[slug]?.exitsOrConfluence.includes(target))errors.push(`${slug}: expected downstream ${target}`);
for(const slug of ['bagmati','kamla-balan'])if(!/कोसी|Kosi/i.test(bySlug[slug]?.exitsOrConfluence||''))errors.push(`${slug}: expected cautious Kosi-network relationship`);
if(/आधुनिक गंडक की शाखा/.test(bySlug['burhi-gandak']?.courseSummary||''))errors.push('Burhi Gandak incorrectly described as a modern Gandak branch');
if(/Sorrow of Bihar/i.test(dataText))errors.push('sensational Kosi label remains');
for(const field of ['currentDischarge','liveWaterLevel','currentFloodAlert'])if(dataText.includes(field))errors.push(`volatile field embedded: ${field}`);
const componentText=read('src/components/geography/GeographyModule.jsx'),routeText=read('src/App.jsx'),searchText=read('src/pages/SearchPage.jsx');
for(const name of ['GeographyHero','GeographyQuickFacts','PhysicalRegionCard','PhysicalRegionComparison','RiverCard','RiverProfile','RiverSystemDiagram','RiverTerminologyNote','BasinExplanation','ClimateProfile','SeasonCycle','SoilProfile','WetlandCard','ForestLandscapeCard','GeographyGlossary','MapSourceNote','RelatedDistricts','RelatedTourism'])if(!componentText.includes(`function ${name}`))errors.push(`missing component ${name}`);
for(const route of ['/geography/rivers/:slug','/geography/natural-regions/:slug','/geography/:slug'])if(!routeText.includes(route))errors.push(`missing route ${route}`);
for(const token of ['riverDirectory','naturalRegions','geographySystems'])if(!searchText.includes(token))errors.push(`global search missing ${token}`);
if(riverDirectory.length!==riverTopics.length)errors.push('river directory/profile count mismatch');
if(errors.length){console.error([...new Set(errors)].join('\n'));process.exit(1)}
console.log('Geography G1 audit passed');
console.log(`Rivers: ${riverTopics.length} (complete 10, basic 6)`);
console.log(`Natural regions: ${naturalRegions.length}`);
console.log(`System profiles: ${Object.keys(geographySystems).length}`);
console.log('Duplicate canonical slugs: 0');
console.log('Missing sources/SEO: 0');
console.log('River relationship checks: passed');
console.log('Search integration: passed');
