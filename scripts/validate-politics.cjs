const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {loadDataModule}=require('./load-data-module.cjs');
const root=path.resolve(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const load=file=>loadDataModule(path.join(root,'src/data',file));
const data=load('politics/index.js');
const {politicsSources}=load('politics/sources.js');
const {categoryForParty}=load('politics/parties.js');
const {districts}=load('districts.js');
const {currentDataRegistry,politicsCurrentRecords}=Object.assign({},load('current/index.js'),load('current/politics.js'));
const {parseCurrentDate,getFreshnessState,isCurrent}=load('current/utils.js');
const errors=[],warnings=[],checks=[];
const check=(condition,message)=>{checks.push(message);if(!condition)errors.push(message);};
const validDate=value=>Boolean(parseCurrentDate(value));
const unique=(items,label)=>check(new Set(items).size===items.length,`${label}: unique`);
const bySlug=items=>new Set(items.map(item=>item.slug));
const partyIds=bySlug(data.parties),peopleIds=bySlug(data.politicalFigures),institutionIds=bySlug(data.institutions),constituencyIds=bySlug(data.constituencies),electionIds=bySlug(data.elections),districtIds=bySlug(districts),currentIds=new Set(currentDataRegistry.map(item=>item.id));
const counts=items=>items.reduce((out,key)=>(out[key]=(out[key]||0)+1,out),{});
const app=read('src/App.jsx');
const routePatterns=[...app.matchAll(/<Route path="([^"]+)"/g)].map(match=>match[1]).filter(route=>route!=='*').map(route=>new RegExp(`^${route.replace(/:[^/]+/g,'[^/]+')}$`));
const routeExists=route=>routePatterns.some(pattern=>pattern.test(route.split(/[?#]/)[0]));

unique(data.politicsRecords.map(item=>item.id),'political IDs');
for(const type of new Set(data.politicsRecords.map(item=>item.type)))unique(data.politicsRecords.filter(item=>item.type===type).map(item=>item.slug),`${type} slugs`);
for(const record of data.politicsRecords){
 const owner=record.id;
 check(Boolean(record.nameHi&&record.nameEn&&record.summary),`${owner}: bilingual names and content`);
 check(record.sourceIds.length>0&&record.sourceIds.every(id=>politicsSources[id]),`${owner}: valid sources`);
 check(Boolean(record.route&&routeExists(record.route)),`${owner}: valid route`);
 const search=data.politicsSearchRecords.find(item=>item.id===record.id);
 check(Boolean(search?.seo?.title&&search?.seo?.description&&search?.seo?.canonical===record.route),`${owner}: SEO/search metadata`);
 unique(record.aliases.map(alias=>alias.toLowerCase()),`${owner} aliases`);
 for(const field of ['date','start','end','birthDate','deathDate'])if(record[field])check(validDate(record[field]),`${owner}: valid ${field}`);
 if(record.year)check(Number.isInteger(record.year)&&record.year>=(record.type==='election'?1950:1700)&&record.year<=new Date().getUTCFullYear(),`${owner}: plausible year`);
 if(record.currentDataRef)check(currentIds.has(record.currentDataRef),`${owner}: current reference`);
 for(const [key,allowed] of [['relatedPeople',peopleIds],['relatedElections',electionIds],['relatedConstituencies',constituencyIds],['relatedInstitutions',institutionIds],['partyIds',partyIds],['districtIds',districtIds]])for(const id of record[key]||[])check(allowed.has(id),`${owner}: ${key}/${id}`);
 check(!('currentOfficeholder' in record)&&!('currentMembers' in record)&&!('currentRecognition' in record),`${owner}: no embedded live value`);
}
for(const source of Object.values(politicsSources)){
 check(Boolean(source.title&&source.publisher&&source.scope&&source.type),`${source.id}: source metadata`);
 try{check(new URL(source.url).protocol==='https:',`${source.id}: source HTTPS`);}catch{check(false,`${source.id}: invalid URL`);}
}
for(const party of data.parties){
 const recognition=party.recognitionHistory;
 if(recognition)check(validDate(recognition.asOf)&&['national','state','rupp'].includes(recognition.category)&&recognition.sourceIds.every(id=>politicsSources[id]),`${party.id}: dated ECI/CEO classification`);
 check(!party.principles||party.principles.sourceIds.every(id=>politicsSources[id]?.type==='party'),`${party.id}: attributed principles`);
}
for(const election of data.elections){
 if(!election.results){warnings.push(`${election.slug}: archive reference; result table not compiled`);continue;}
 unique(election.results.map(row=>row.party),`${election.slug} party rows`);
 check(election.results.reduce((sum,row)=>sum+row.seats,0)===election.totalConstituencies,`${election.slug}: seat total`);
 for(const row of election.results)check(partyIds.has(row.party)&&Number.isInteger(row.seats)&&row.seats>=0&&row.year===election.year&&row.sourceIds.every(id=>politicsSources[id]),`${election.slug}/${row.party}: result year and provenance`);
}
const assembly=data.constituencies.filter(item=>item.chamber==='assembly'),parliament=data.constituencies.filter(item=>item.chamber==='lokSabha');
assert.equal(assembly.length,243);assert.equal(parliament.length,40);
unique(assembly.map(item=>item.number),'AC numbers');unique(parliament.map(item=>item.number),'PC numbers');
for(let number=1;number<=243;number++)check(assembly.some(item=>item.number===number),`AC ${number}: present`);
check(new Set(assembly.flatMap(item=>item.districtIds)).size===38,'38 canonical districts covered');
check(assembly.filter(item=>item.reservation==='SC').length===38&&assembly.filter(item=>item.reservation==='ST').length===2,'Assembly snapshot reserved seats');
check(parliament.filter(item=>item.reservation==='SC').length===6,'Lok Sabha snapshot reserved seats');
const allSegments=parliament.flatMap(item=>item.assemblyIds);check(allSegments.length===243&&new Set(allSegments).size===243,'Each AC maps to exactly one PC');
for(const area of data.constituencies){
 check(area.boundary.dataYear===2019&&area.boundary.status==='historical-snapshot'&&'effectiveFrom' in area.boundary&&'effectiveTo' in area.boundary,`${area.slug}: explicitly dated boundary`);
 for(const id of area.assemblyIds||[])check(assembly.find(item=>item.slug===id)?.parliamentaryId===area.slug,`${area.slug}: bidirectional ${id}`);
 if(area.chamber==='assembly')check(parliament.find(item=>item.slug===area.parliamentaryId)?.assemblyIds.includes(area.slug),`${area.slug}: parliamentary parent`);
}
for(const government of data.governments){check(peopleIds.has(government.personId)&&government.start<=government.end,`${government.id}: closed tenure and person`);}
for(const person of data.chiefMinisters)check(person.tenureIds.length>0&&person.tenureIds.every(id=>data.governments.some(item=>item.id===id&&item.personId===person.slug)),`${person.id}: tenures`);
for(const record of politicsCurrentRecords){
 check(record.status==='unverified'?record.value===null&&record.lastVerified===null:true,`${record.id}: no fabricated unverified value/date`);
 check(record.status!=='current'||isCurrent(record),`${record.id}: active current record must be fresh`);
 check(Boolean(record.source?.url&&record.freshnessPolicy&&record.confidence),`${record.id}: provenance and freshness`);
}
const fixture={status:'current',value:{personName:'SYNTHETIC'},lastVerified:'2026-09-01',freshnessPolicy:'political-status-14'};
for(const [patch,date,expected] of [[{},'2026-09-05','verified'],[{},'2026-09-13','due-soon'],[{},'2026-09-16','stale'],[{effectiveTo:'2026-09-04'},'2026-09-05','expired'],[{effectiveFrom:'2026-10-01'},'2026-09-05','scheduled'],[{status:'archived'},'2026-09-05','archived'],[{status:'unverified'},'2026-09-05','unverified'],[{verificationStatus:'conflict'},'2026-09-05','unverified'],[{lastVerified:'2026-10-01'},'2026-09-05','unverified']]){
 check(getFreshnessState({...fixture,...patch},date)===expected,`freshness: ${expected}`);
 check(isCurrent({...fixture,...patch},date)===['verified','due-soon'].includes(expected),`current eligibility: ${expected}`);
}
for(const bad of ['2026-99-40','2026-02-30','not a date'])check(parseCurrentDate(bad)===null,`invalid date safely rejected: ${bad}`);
const loaded=/\b(best|worst|strongest|weakest|successful party|failed party|corrupt party|popular party|unpopular party|good government|bad government|greatest leader|worst leader|vote for|should vote|anti-national|traitor|incompetent|genius|foolish)\b|सर्वश्रेष्ठ दल|सबसे खराब|देशद्रोही/iu;
for(const record of data.politicsRecords){const prose=[record.nameHi,record.nameEn,record.summary,...(record.sections||[]).flatMap(section=>[section.title,...section.paragraphs])].join(' ');check(!loaded.test(prose),`${record.id}: neutrality language scan`);}
for(const route of data.politicsRoutes)check(routeExists(route),`published route ${route}`);
check(!app.includes('path="/politics/council/members"'),'No fabricated Council roster page');
check(read('src/components/current/CurrentData.jsx').includes('withheld?'),'Stale fallback values withheld by shared UI');
check(read('src/data/searchIndex.js').includes('politicsSearchRecords'),'Global search integration');
check(read('scripts/generate-sitemap.cjs').includes('politicsRoutes'),'Sitemap integration');
check(!read('src/politics.css').includes(':root{'),'Global palette unchanged');
const report={politicalRecords:data.politicsRecords.length,parties:counts(data.parties.map(categoryForParty)),partyAliases:data.parties.reduce((sum,item)=>sum+item.aliases.length,0),elections:counts(data.elections.map(item=>item.electionType)),institutions:counts(data.institutions.map(item=>item.status)),people:{historical:data.politicalFigures.length,newCurrentPeople:0},governments:data.governments.length,historicalEvents:data.historicalEvents.length,partyEvents:data.partyHistory.length,allianceEvents:data.alliances.length,historyReferences:data.politicalHistory.length,constituencies:{assembly:assembly.length,lokSabha:parliament.length},governance:{departments:data.departmentDirectory.length,serviceTopics:data.serviceTopics.length},currentData:{total:currentDataRegistry.length,newPolitics:politicsCurrentRecords.length},sources:counts(Object.values(politicsSources).map(source=>source.type)),routes:data.politicsRoutes.length};
console.log(JSON.stringify(report,null,2));
for(const warning of warnings)console.warn(`Warning: ${warning}`);
console.warn('Warning: party registry, pre-1952 tenures, cabinet/coalition chronology, vote shares and live rosters remain coverage gaps; see docs/G7-POLITICS-AUDIT.md');
if(errors.length){console.error(`Politics validation failed: ${errors.length}/${checks.length}`);errors.forEach(error=>console.error(error));process.exitCode=1;}else console.log(`Politics validation passed: ${checks.length} integrity, source, date, reference, neutrality and freshness checks`);
