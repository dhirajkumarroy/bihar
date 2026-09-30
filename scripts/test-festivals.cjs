// Local Chromium/Edge, isolated temporary profile, no external service writes.
const assert=require('node:assert/strict'),path=require('node:path');
const {withBrowser}=require('./browser-audit.cjs');
const {loadDataModule}=require('./load-data-module.cjs');
const {festivalTopics,festivalRoutes,festivalBySlug}=loadDataModule(path.resolve(__dirname,'../src/data/festivals/index.js'));
const origin=process.argv[2]||'http://127.0.0.1:5178';
let checks=0;const check=(ok,message)=>{checks++;assert(ok,message);};
withBrowser(origin,async b=>{
 await b.call('Page.addScriptToEvaluateOnNewDocument',{source:"localStorage.setItem('sampoorn-bihar-cookie-preference','declined')"});
 await b.resize(1440);
 for(const route of festivalRoutes){
  if(process.argv.includes('--production')){
   const response=await fetch(origin+route),html=await response.text();
   check(response.ok&&html.includes('id="page-schema"')&&html.includes('id="breadcrumb-schema"'),route+' crawler-visible schema');
   check(html.includes('<h1>')&&html.includes('href="https://bihar-eight.vercel.app'+route+'"'),route+' static content and canonical');
  }
  await b.go(route);
  const result=await b.evaluate(`(()=>({h1:document.querySelectorAll('#main-content h1').length,title:document.title,description:document.querySelector('meta[name="description"]')?.content,canonical:document.querySelector('link[rel="canonical"]')?.href,og:document.querySelector('meta[property="og:image"]')?.content,twitter:document.querySelector('meta[name="twitter:image"]')?.content,schema:JSON.parse(document.querySelector('#page-schema').textContent),breadcrumb:JSON.parse(document.querySelector('#breadcrumb-schema').textContent),gallery:document.querySelectorAll('.c8-gallery figure').length,overflow:document.documentElement.scrollWidth>innerWidth+1}))()`);
  check(result.h1===1,route+' h1');check(result.description?.length>40,route+' description');check(result.canonical.endsWith(route),route+' canonical');check(result.og===result.twitter&&result.og.includes('/images/festivals/'),route+' social image');check(result.breadcrumb['@type']==='BreadcrumbList',route+' breadcrumb');check(!result.overflow,route+' overflow');
  const record=festivalTopics.find(x=>x.seo.canonical===route);if(record){check(result.schema['@type']==='Article',route+' schema');check(result.gallery===record.gallery.length,route+' gallery');}
  await b.waitFor("document.querySelector('.c8-hero img')?.complete && document.querySelector('.c8-hero img').naturalWidth>0",'hero '+route);
 }
 console.log('All '+festivalRoutes.length+' canonical routes, metadata and hero images passed');
 for(const [query,expected] of [['छठ','chhath'],['Chhath','chhath'],['छठ पूजा','chhath'],['सामा चकेवा','sama-chakeva'],['होली','fagua'],['जितिया','jitiya'],['सोनपुर मेला','sonepur-mela']]){
  await b.go('/festivals?q='+encodeURIComponent(query));
  const links=await b.evaluate("[...document.querySelectorAll('.c8-card>a')].map(x=>x.getAttribute('href'))");
  check(links.includes(festivalBySlug(expected).seo.canonical),'directory alias '+query);
  check(await b.evaluate("document.querySelector('meta[name=robots]').content.startsWith('noindex')"),'filtered noindex');
 }
 await b.go('/festivals?faith='+encodeURIComponent('इस्लाम')+'&season=moving');check(await b.evaluate("document.querySelectorAll('.c8-card').length===3"),'combined filters');
 await b.go('/festivals?month=1');check(await b.evaluate("[...document.querySelectorAll('.c8-card')].every(x=>!x.textContent.includes('Eid'))"),'no invented fixed Eid month');
 await b.go('/festivals?q=zzzz-nothing');check(await b.evaluate("document.querySelectorAll('.c8-card').length===0"),'empty search');await b.click('.c8-results button');await b.waitFor("document.querySelectorAll('.c8-card').length===30",'clear filters');
 await b.click('.c8-tabs a[href="/festivals/fairs"]');await b.waitFor("document.querySelectorAll('.c8-card').length===9",'fair category');
 await b.evaluate('history.back()');await b.waitFor("location.pathname==='/festivals'",'back button');
 await b.go('/festivals');await b.click('input[name=q]');await b.call('Input.insertText',{text:'Holi'});await b.waitFor("document.querySelectorAll('.c8-card').length===1",'typed query');check(await b.evaluate("location.search==='?q=Holi'"),'URL query');
 for(const alias of ['chhath','fagua','pitru-paksha','pitrapaksha','shravani','bihula-bishahari']){
  const target=festivalBySlug(alias).seo.canonical;
  await b.call('Page.navigate',{url:origin+'/culture/festivals/'+alias+'#history'});await b.waitFor('location.pathname==='+JSON.stringify(target),'legacy '+alias);check(await b.evaluate("location.hash==='#history'"),'preserve hash '+alias);
 }
 await b.go('/festivals/not-a-festival');check(await b.evaluate("document.querySelector('meta[name=robots]').content.startsWith('noindex')"),'unknown noindex');
 await b.go('/festivals/chhath-puja');await b.click('.c8-timeline li:nth-child(2) button');check(await b.evaluate("document.querySelectorAll('.c8-timeline button[aria-expanded=true]').length===1 && document.querySelector('.c8-timeline li:nth-child(2) button').getAttribute('aria-expanded')==='true'"),'exclusive timeline');
 await b.key('Enter','Enter',13);check(await b.evaluate("document.querySelectorAll('.c8-timeline button[aria-expanded=true]').length===0"),'keyboard timeline collapse');
 await b.click('.c8-timeline li:nth-child(4) button');await b.click('#sources summary');check(await b.evaluate("document.querySelector('#sources details').open"),'source disclosure');
 for(const width of [1440,1280,1024,768,500,430,390,360,320]){
  await b.resize(width);
  for(const route of ['/festivals','/festivals/chhath-puja','/festivals/guru-gobind-singh-jayanti']){
   await b.go(route);check(await b.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),route+' width '+width);
   if((width===1440||width===390)&&route!=='/festivals/guru-gobind-singh-jayanti')console.log('Screenshot',await b.screenshot((route==='/festivals'?'directory':'chhath')+'-'+width));
  }
 }
 await b.resize(390);await b.go('/festivals');await b.click('input[name=q]');await b.call('Input.insertText',{text:'छठ'});await b.waitFor("document.querySelectorAll('.c8-card').length===1",'mobile filter');await b.click('.c8-card>a');await b.waitFor("location.pathname==='/festivals/chhath-puja'",'mobile card');
 await b.call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await b.click('.c8-timeline li:nth-child(3) button');check(await b.evaluate("document.querySelectorAll('.c8-timeline button[aria-expanded=true]').length===1"),'reduced motion interaction');
 check(b.errors.length===0,'runtime exceptions: '+JSON.stringify(b.errors));check(b.consoleErrors.length===0,'console errors: '+b.consoleErrors.join('\n'));
 console.log(JSON.stringify({status:'passed',checks,canonicalRoutes:festivalRoutes.length,widths:[1440,1280,1024,768,500,430,390,360,320],runtimeErrors:b.errors.length},null,2));
},'c8').catch(error=>{console.error(error);process.exitCode=1;});
