const fs=require('node:fs'),path=require('node:path');
const {withBrowser}=require('./browser-audit.cjs');
const {loadDataModule}=require('./load-data-module.cjs');
const {rajendraPrasad:x,personalityMedia}=loadDataModule(path.join(__dirname,'../src/data/personalities/index.js'));
const {personalities}=loadDataModule(path.join(__dirname,'../src/data/catalog.js'));
const {searchPortal}=loadDataModule(path.join(__dirname,'../src/data/searchIndex.js'));
const origin=process.env.TEST_ORIGIN||'http://127.0.0.1:5182';
let checks=0;const failures=[],screenshots=[];const check=(ok,msg)=>{checks++;if(!ok)failures.push(msg);};
const widths=[1440,1280,1024,768,500,430,390,360,320];
(async()=>{
 const response=await fetch(origin+x.canonical),html=await response.text();check(response.ok&&html.includes('p1-title'),'clean URL returns rendered profile');for(const s of x.sections)check(html.includes(`id="${s.id}"`),'HTTP section '+s.id);
 for(const alias of x.aliases)check(searchPortal(alias).some(r=>r.to===x.canonical),'search data '+alias);
 for(const type of ['व्यक्तित्व','इतिहास','जिला','स्थल'])check(searchPortal('Rajendra Prasad').some(r=>r.type===type),'related search type '+type);
 await withBrowser(origin,async b=>{
  await b.call('Page.addScriptToEvaluateOnNewDocument',{source:"localStorage.setItem('sampoorn-bihar-cookie-preference','declined')"});
  for(const width of widths){
   await b.resize(width);await b.go(x.canonical);await b.waitFor('!!document.querySelector("#event-button-birth")','interactive profile');
   await b.waitFor('document.querySelector(".p1-portrait img").complete && document.querySelector(".p1-portrait img").naturalWidth>0','portrait');
   const info=await b.evaluate(`(()=>{const hero=document.querySelector('.p1-portrait').getBoundingClientRect(),copy=document.querySelector('.p1-hero-copy').getBoundingClientRect();return {overflow:document.documentElement.scrollWidth>innerWidth+1,h1:document.querySelectorAll('#main-content h1').length,landmarks:document.querySelectorAll('main,[role=main]').length,title:document.title,mobile:hero.bottom<=copy.top+2,desktop:hero.left>copy.left,missingAlt:[...document.querySelectorAll('.p1-page img')].some(i=>!i.alt),emptyControls:[...document.querySelectorAll('.p1-page button,.p1-page a')].some(e=>!e.textContent.trim()&&!e.getAttribute('aria-label')),duplicateIds:[...document.querySelectorAll('.p1-page [id]')].map(e=>e.id).filter((id,i,a)=>a.indexOf(id)!==i),lang:document.documentElement.lang};})()`);
   check(!info.overflow,width+' no page overflow');check(info.h1===1,width+' one H1');check(info.landmarks===1,width+' single main landmark');check(info.title===x.seo.title,width+' exact title');check(width<768?info.mobile:info.desktop,width+' portrait order');check(!info.missingAlt,width+' alt text');check(!info.emptyControls,width+' named controls');check(info.duplicateIds.length===0,width+' unique IDs');check(info.lang==='hi',width+' Hindi language');
   await b.click('.p1-filters button:nth-child(3)');check(await b.evaluate('document.querySelectorAll(".p1-filters [aria-pressed=true]").length===1 && document.querySelectorAll(".p1-events>li").length===5'),width+' movement filter');
   await b.click('#event-button-congress');check(await b.evaluate('document.querySelector("#event-button-congress").getAttribute("aria-expanded")==="true"'),width+' event opens');
   await b.click('#event-button-champaran');check(await b.evaluate('document.querySelectorAll(".p1-events [aria-expanded=true]").length===1 && document.querySelector("#event-panel-congress").hidden'),width+' previous event closes');
   await b.key('Enter','Enter',13);check(await b.evaluate('document.querySelectorAll(".p1-events [aria-expanded=true]").length===0'),width+' Enter collapses');
   await b.key(' ','Space',32);check(await b.evaluate('document.querySelector("#event-button-champaran").getAttribute("aria-expanded")==="true"'),width+' Space expands');
   const focus=await b.evaluate('getComputedStyle(document.activeElement).outlineStyle');check(focus!=='none',width+' keyboard focus visible');
   await b.click('.p1-filters button:first-child');check(await b.evaluate('document.querySelectorAll(".p1-events>li").length===18 && document.querySelectorAll(".p1-events [aria-expanded=true]").length===0'),width+' filter resets open panel');
   if([1440,768,390,320].includes(width)){await b.evaluate('scrollTo({top:0,behavior:"instant"})');screenshots.push(await b.screenshot('profile-'+width));}
  }
  await b.resize(1280);await b.go(x.canonical);await b.delay(300);await b.waitFor('!!document.querySelector("#event-button-birth")','interactive reload');
  const internal=await b.evaluate(`[...new Set([...document.querySelectorAll('.p1-page a[href^="/"]')].map(a=>a.getAttribute('href')))]`);
  for(const id of ['education','champaran','assembly','terms','writing','sadaqat','places','sources']){await b.click('.p1-page a[href="#'+id+'"]');check(await b.evaluate('location.hash==='+JSON.stringify('#'+id)),id+' anchor navigation');check(await b.evaluate('document.getElementById('+JSON.stringify(id)+').getBoundingClientRect().top>=70'),id+' visible below header');}
  for(const m of personalityMedia){const selector='.p1-page img[src="'+m.src+'"]';await b.evaluate(`document.querySelector(${JSON.stringify(selector)}).scrollIntoView({block:'center',behavior:'instant'})`);await b.waitFor(`document.querySelector(${JSON.stringify(selector)}).complete && document.querySelector(${JSON.stringify(selector)}).naturalWidth>0`,'image '+m.id);check(true,'image loads '+m.id);}
  const mediaChecks=await b.evaluate('({lazy:[...document.querySelectorAll(".p1-page img")].filter(i=>!i.closest(".p1-portrait")).every(i=>i.loading==="lazy"),responsive:[...document.querySelectorAll(".p1-page img")].every(i=>i.srcset&&i.width&&i.height)})');check(mediaChecks.lazy,'below-fold lazy loading');check(mediaChecks.responsive,'responsive image dimensions');
  await b.click('.p1-portrait summary');check(await b.evaluate('document.querySelector(".p1-portrait details").open'),'credit disclosure opens');await b.click('.p1-portrait summary');check(await b.evaluate('!document.querySelector(".p1-portrait details").open'),'credit disclosure closes');
  const schema=await b.evaluate('JSON.parse(document.getElementById("page-schema").textContent)');check(schema['@type']==='Article'&&schema.about?.birthDate===x.birthDate&&schema.about?.['@type']==='Person','live Article / Person schema');check(await b.evaluate('JSON.parse(document.getElementById("breadcrumb-schema").textContent)["@type"]==="BreadcrumbList"'),'live breadcrumbs');check(await b.evaluate(`document.querySelector('meta[property="og:type"]').content==='article'`),'live OG article');
  await b.call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});check(await b.evaluate('matchMedia("(prefers-reduced-motion: reduce)").matches && getComputedStyle(document.querySelector(".p1-filters button")).transitionDuration==="0s"'),'reduced motion');
  for(const alias of x.aliases){await b.go('/search?q='+encodeURIComponent(alias));await b.waitFor('document.querySelector(".search-page input")?.value==='+JSON.stringify(alias),'search query '+alias);check(await b.evaluate(`!!document.querySelector(${JSON.stringify('.search-results a[href="'+x.canonical+'"]')})`),'browser search '+alias);}
  for(const to of internal){await b.go(to);check(await b.evaluate('!!document.querySelector("#main-content h1") && !document.querySelector("#main-content .empty-state")'),'cross-module '+to);}
  for(const p of personalities.filter(p=>p.slug!==x.slug)){await b.go('/personalities/'+p.slug);check(await b.evaluate('document.querySelector("#main-content h1").textContent')===p.name,'existing personality '+p.slug);}
  for(const to of ['/','/religion','/festivals','/politics','/geography','/tourism','/culture']){await b.go(to);check(await b.evaluate('!!document.querySelector("#main-content h1")'),'portal smoke '+to);}
  await b.call('Emulation.setScriptExecutionDisabled',{value:true});await b.resize(390);await b.go(x.canonical);check(await b.evaluate('document.querySelectorAll(".p1-page .p1-section").length>=26'),'no-JavaScript biography');check(await b.evaluate('document.querySelectorAll("#life-timeline .p1-milestones>li").length===18'),'no-JavaScript complete timeline');check(await b.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no-JavaScript mobile overflow');screenshots.push(await b.screenshot('no-js-390'));await b.call('Emulation.setScriptExecutionDisabled',{value:false});
  check(b.errors.length===0,'no runtime exceptions');check(b.consoleErrors.length===0,'no console errors');if(b.errors.length)failures.push(JSON.stringify(b.errors));if(b.consoleErrors.length)failures.push(...b.consoleErrors);
 },'p1');
 const report={checks,failures,widths,screenshots,date:'2026-09-30'};fs.mkdirSync(path.join(__dirname,'../.g9-browser-audit/p1'),{recursive:true});fs.writeFileSync(path.join(__dirname,'../.g9-browser-audit/p1/results.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));if(failures.length)process.exitCode=1;
})().catch(error=>{console.error(error);process.exitCode=1;});
