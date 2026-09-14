const fs=require('fs');
const path=require('path');

const root=path.resolve(__dirname,'..');
const read=relative=>fs.readFileSync(path.join(root,relative),'utf8');
const failures=[];
const checks=[];
const check=(condition,message)=>{checks.push(message);if(!condition)failures.push(message)};
const duplicates=values=>[...new Set(values.filter((value,index)=>values.indexOf(value)!==index))];

function loadDistricts(){
 const code=read('src/data/districts.js').replace(/export const /g,'const ');
 return new Function(`${code}; return {districts,divisions};`)();
}

function loadGovernance(districts){
 let code=read('src/data/governance/index.js');
 code=code.replace(/^import[^\n]+\n/,'').replace(/export \{[^\n]+\n/g,'').replace(/export const /g,'const ');
 const names=['governanceSources','administrativeLevels','divisions','offices','legislatureRecords','executiveRecords','judiciaryRecords','ruralLocalGovernment','urbanLocalGovernment','departments','publicInstitutions','publicServices','governanceComparisons','governanceGlossary','governanceSections','governanceSearchRecords'];
 return new Function('districts',`${code}; return {${names.join(',')}};`)(districts);
}

const districtData=loadDistricts();
const data=loadGovernance(districtData.districts);
const routable=[...data.administrativeLevels,...data.offices,...data.ruralLocalGovernment,...data.urbanLocalGovernment,...data.publicInstitutions,...data.judiciaryRecords];
const allIdentified=[...routable,...data.divisions,...data.legislatureRecords,...data.executiveRecords,...data.departments,...data.publicServices,...data.governanceComparisons];

check(duplicates(allIdentified.map(x=>x.id)).length===0,'All governance record IDs are globally unique');
check(duplicates(routable.map(x=>x.slug)).length===0,'All generic governance route slugs are unique');
check(routable.every(x=>x.slug&&x.nameHi&&x.nameEn),'Every routable governance entity has slug and bilingual name');
check(routable.every(x=>x.seo?.canonical&&x.seo?.title&&x.seo?.description),'Every routable governance entity has complete SEO metadata');

check(data.divisions.length===9,'Exactly 9 administrative divisions are represented');
check(districtData.districts.length===38,'Canonical district registry contains exactly 38 districts');
const mapped=data.divisions.flatMap(x=>x.districtIds);
check(mapped.length===38&&new Set(mapped).size===38,'Every district is mapped to exactly one division');
check(mapped.every(slug=>districtData.districts.some(x=>x.slug===slug)),'Every division district reference resolves to canonical district data');
check(data.divisions.every(div=>div.districtIds.every(slug=>districtData.districts.find(x=>x.slug===slug)?.division===div.nameHi.replace(' प्रमंडल',''))),'Every district retains its canonical division assignment');
check(data.divisions.every(x=>x.headquarters&&x.dataYear&&x.sources?.length),'Every division has headquarters, verification context and a source');

const requiredLevels=['state','division','district','subdivision','block','revenue-circle','rural-local-body','settlement','urban-local-body','urban-ward'];
check(requiredLevels.every(level=>data.administrativeLevels.some(x=>x.levelType===level)),'Administrative hierarchy covers state, field, rural, revenue and urban levels');
check(data.administrativeLevels.every(x=>Array.isArray(x.childTypes)&&x.parentType&&x.principalAdministrativeRole&&x.legalContext),'Administrative records contain hierarchy, role and legal context');
check(data.ruralLocalGovernment.length===4&&data.ruralLocalGovernment.every(x=>x.localBodyType.startsWith('rural')),'Rural local-government model contains Gram Sabha and three Panchayati Raj tiers');
check(data.urbanLocalGovernment.length===4&&data.urbanLocalGovernment.every(x=>x.localBodyType.startsWith('urban')),'Urban local-government model contains three ULB types and ward');
check(!data.ruralLocalGovernment.some(x=>x.localBodyType.startsWith('urban'))&&!data.urbanLocalGovernment.some(x=>x.localBodyType.startsWith('rural')),'Rural and urban local-government branches do not cross-contaminate');

check(data.offices.every(x=>x.currentDataRef===null&&!('personName' in x)),'Permanent office definitions contain no officeholder names');
check(!read('src/data/governance/index.js').includes('currentData/governance'),'Governance uses the centralized current-data registry');
check(data.publicInstitutions.every(x=>x.currentDataRef===null&&!('personName' in x)),'Public institutions remain separate from current officeholders');

check(data.legislatureRecords.length===3&&data.legislatureRecords.some(x=>x.id==='legislative-assembly')&&data.legislatureRecords.some(x=>x.id==='legislative-council'),'Bicameral Legislature has Assembly and Council records');
check(data.legislatureRecords.filter(x=>'stableSeatCount' in x).every(x=>x.countAsOf&&x.source?.url),'Every legislative count has as-of context and an official source');
check(data.judiciaryRecords.length>=3&&data.judiciaryRecords.every(x=>x.branch==='judiciary'&&x.sources?.length),'Judiciary records are explicitly independent-branch entities with sources');
check(data.executiveRecords.some(x=>x.id==='political-executive')&&data.executiveRecords.some(x=>x.id==='permanent-executive'),'Political and permanent Executive are represented separately');

const comparisonIds=new Set(data.governanceComparisons.map(x=>x.id));
const requiredComparisons=['division-subdivision','district-headquarters','block-circle','village-panchayat','gram-sabha-panchayat','gp-np','district-zp','mp-mla','constituency-district','assembly-council','court-department','region-division'];
check(requiredComparisons.every(id=>comparisonIds.has(id)),'All required governance disambiguations are present');
check(data.governanceGlossary.length>=15,'Governance glossary contains at least 15 canonical terms');

check(data.departments.length>=12&&data.departments.every(x=>x.officialUrl.startsWith('https://')&&x.lastVerified&&x.status),'Department directory is dated and links only to official HTTPS pages');
check(data.publicInstitutions.length>=5&&data.publicInstitutions.every(x=>x.sources?.some(s=>s.url.startsWith('https://'))),'Curated public institutions have official source links');
check(data.publicServices.length>=4&&data.publicServices.every(x=>x.officialUrl.startsWith('https://')&&x.lastVerified&&x.source),'Citizen-service links are official, sourced and dated');
check(Object.values(data.governanceSources).every(x=>x.id&&x.title&&x.publisher&&x.url.startsWith('https://')&&x.type&&x.versionContext&&x.lastVerified),'Every governance source has provenance, version context and verification date');

const ui=read('src/components/governance/GovernanceModule.jsx');
const app=read('src/App.jsx');
const search=read('src/pages/SearchPage.jsx');
const districtUi=read('src/components/district/DistrictDetailPage.jsx');
const requiredRoutes=['/governance','/governance/administration','/governance/state-government','/governance/legislature','/governance/executive','/governance/judiciary','/governance/local-government','/governance/panchayati-raj','/governance/urban-local-bodies','/governance/public-services','/governance/district-administration','/governance/:slug'];
check(requiredRoutes.every(route=>app.includes(`path="${route}"`)),'All required G8 routes are registered');
check(search.includes('governanceSearchRecords')&&search.includes("['शासन',governanceSearch]"),'Global search includes governance aliases and disambiguation records');
check(districtUi.includes('/governance/district-administration'),'District profiles link to canonical governance explanation');
check(ui.includes('/society/urbanization')&&ui.includes('/economy/development')&&ui.includes('/history/modern-bihar'),'Governance pages cross-link society, economy and history modules');
check(ui.includes('कानूनी सलाह नहीं')&&ui.includes('forms, fees, eligibility'),'Legal-advice and live-service boundaries are visible in the UI');

const politicalPatterns=[/\b(BJP|RJD|JD\(U\)|Congress|NDA|INDIA alliance)\b/i,/current chief minister/i,/current governor/i];
const governanceText=read('src/data/governance/index.js')+ui;
check(!politicalPatterns.some(pattern=>pattern.test(governanceText)),'Stable governance content contains no party/current-politician claims');
check(!/([0-9]+)\s*(gram panchayats?|नगर निकाय|ULBs?)/i.test(governanceText),'No volatile Panchayat or ULB total is presented as timeless data');

if(failures.length){
 console.error(`Governance validation failed: ${failures.length}/${checks.length} checks`);
 failures.forEach(item=>console.error(`  ✗ ${item}`));
 process.exit(1);
}
console.log(`Governance validation passed: ${checks.length} checks`);
console.log(`Records: ${data.divisions.length} divisions · ${mapped.length} district mappings · ${data.offices.length} offices · ${data.departments.length} departments · ${data.publicInstitutions.length} institutions · ${data.publicServices.length} services`);
console.log(`Local government: ${data.ruralLocalGovernment.length} rural concepts · ${data.urbanLocalGovernment.length} urban concepts · current officeholders in central G9 registry`);
