const fs=require('fs');
const path=require('path');
const {spawnSync}=require('child_process');
const root=path.join(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const errors=[];
const warnings=[];
const info=[];
const assert=(condition,message)=>{if(!condition)errors.push(message);};

const validators=['validate-personalities.cjs','validate-religion.cjs','validate-history-links.cjs','validate-districts.cjs','validate-tourism.cjs','validate-culture-all.cjs','validate-geography.cjs','validate-water-systems.cjs','validate-ecology.cjs','validate-agriculture.cjs','validate-economy.cjs','validate-society.cjs','validate-governance.cjs','validate-current-data.cjs','validate-politics.cjs','validate-seo-policy.cjs','validate-search-index.cjs'];
for(const validator of validators){
  const result=spawnSync(process.execPath,[path.join(root,'scripts',validator)],{encoding:'utf8'});
  const output=`${result.stdout||''}\n${result.stderr||''}`.trim();
  if(result.status!==0){errors.push(`${validator} failed${output?`: ${output.split(/\r?\n/).slice(-1)[0]}`:''}`);continue;}
  output.split(/\r?\n/).filter(line=>/\bwarning:/i.test(line)).forEach(line=>warnings.push(`${validator}: ${line.trim()}`));
  info.push(`${validator}: passed`);
}

const app=read('src/App.jsx');
const search=read('src/pages/SearchPage.jsx');
const portal=read('src/components/Portal.jsx');
const governance=read('src/components/governance/GovernanceModule.jsx');
const sitemap=read('public/sitemap.xml');
const robots=read('public/robots.txt');
assert(app.includes('PortalErrorBoundary'),'Route error boundary is not mounted');
assert(app.includes('Route path="/districts/:slug" element={<DistrictLegacyRedirect/>}'),'District alias redirect is missing');
assert(app.includes('Route path="/rivers/:slug" element={<RiverLegacyRedirect/>}'),'River legacy redirect is missing');
assert(app.includes('Route path="/institutions" element={<Navigate replace to="/governance#institutions"/>}'),'Institutions compatibility redirect is missing');
assert(governance.includes('id="institutions"'),'Institutions redirect target is missing');
assert(app.includes('Route path="*" element={<NotFoundPage/>}'),'Useful 404 route is missing');
assert(search.includes('canonicalPath="/search" noIndex'),'Search canonical/noindex boundary is missing');
assert(portal.includes('siteConfig.url'),'Central site URL is not used by SEO utilities');
assert(robots.includes('User-agent: *')&&robots.includes('Sitemap:'),'robots.txt lacks crawler or sitemap directives');
assert(!/<loc>[^<]*\/search(?:[<?]|<)/.test(sitemap),'Search route must not be in sitemap');
assert(!/<loc>[^<]*\/districts\//.test(sitemap),'Legacy district aliases must not be in sitemap');
assert(!locsRootOnly(sitemap,'/institutions'),'Redirect-only institutions path must not be in sitemap');
function locsRootOnly(xml,route){return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].some(match=>new URL(match[1]).pathname===route);}
const locs=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match=>match[1]);
assert(new Set(locs).size===locs.length,'Sitemap contains duplicate canonical URLs');
assert(locs.length>150,`Sitemap unexpectedly small (${locs.length} URLs)`);
const hero=path.join(root,'public','assets','bihar-hero.png');
if(fs.existsSync(hero)&&fs.statSync(hero).size>2*1024*1024)warnings.push('media: bihar-hero.png exceeds 2 MB; keep a compression task queued before a performance-budget release');
if((read('src/styles.css').match(/!important/g)||[]).length>12)warnings.push('styles: legacy !important usage remains above the preferred portal-wide threshold');

console.log('INFO');
info.forEach(message=>console.log(`- ${message}`));
console.log(`- sitemap: ${locs.length} canonical public URLs`);
console.log('WARNINGS');
(warnings.length?warnings:['- none']).forEach(message=>console.log(`- ${message}`));
console.log('ERRORS');
(errors.length?errors:['- none']).forEach(message=>console.log(`- ${message}`));
if(errors.length)process.exitCode=1;
