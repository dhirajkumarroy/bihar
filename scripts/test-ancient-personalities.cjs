const fs=require('node:fs'),path=require('node:path');
const {withBrowser}=require('./browser-audit.cjs');
const {loadDataModule}=require('./load-data-module.cjs');
const profiles=['ashoka','chanakya','aryabhata'].map(slug=>loadDataModule(path.join(__dirname,'../src/data/personalities/'+slug+'.js'))[slug]);
const {ancientDiscovery}=loadDataModule(path.join(__dirname,'../src/data/personalities/directory.js'));
const origin=process.env.TEST_ORIGIN||'http://127.0.0.1:5184';
const widths=[1440,1280,1024,768,500,430,390,360,320],q=JSON.stringify;
let checks=0;const failures=[],screenshots=[];
const check=(ok,label)=>{checks++;if(!ok)failures.push(label);};
(async()=>{
 for(const x of profiles){const response=await fetch(origin+x.canonical),html=await response.text();check(response.ok&&html.includes('ap-title'),x.slug+' HTTP prerender');for(const e of x.timeline)check(html.includes(e.text),x.slug+' full HTTP timeline '+e.id);}
 await withBrowser(origin,async b=>{
  await b.call('Page.addScriptToEvaluateOnNewDocument',{source:"localStorage.setItem('sampoorn-bihar-cookie-preference','declined')"});
  const interactive=async()=>{await b.waitFor('!!document.querySelector(".ap-page .p1-filters")','interactive ancient profile');await b.delay(200);};
  for(const x of profiles){
   await b.go('/personalities');await b.delay(200);
   check(await b.evaluate(`document.querySelector('#main-content').textContent.includes(${q(x.nameHindi)})`),x.slug+' directory title');
   check(await b.evaluate(`document.querySelector('#main-content').textContent.includes(${q(ancientDiscovery.find(p=>p.slug===x.slug).summary)})`),x.slug+' directory summary is visible');
   await b.click('#main-content a[href="'+x.canonical+'"]');await interactive();check(await b.evaluate('location.pathname')===x.canonical,x.slug+' directory card opens profile');
   await b.evaluate('history.back()');await b.waitFor('location.pathname==="/personalities" && !document.querySelector(".ap-page")','back to directory');check(true,x.slug+' browser back');
   await b.go(x.canonical);await interactive();
   for(const width of widths){
    await b.resize(width);await b.waitFor('document.querySelector(".p1-portrait img").complete && document.querySelector(".p1-portrait img").naturalWidth>0','hero image');
    const state=await b.evaluate(`(()=>{const hero=document.querySelector('.p1-portrait').getBoundingClientRect(),copy=document.querySelector('.p1-hero-copy').getBoundingClientRect(),toc=document.querySelector('.p1-toc nav'),ids=[...document.querySelectorAll('.ap-page [id]')].map(e=>e.id);return {overflow:document.documentElement.scrollWidth>innerWidth+1,h1:document.querySelectorAll('#main-content h1').length,name:document.querySelector('h1').textContent,main:document.querySelectorAll('main,[role=main]').length,title:document.title,stacked:hero.bottom<=copy.top+2,side:hero.left>copy.left,ids:new Set(ids).size===ids.length,toc:getComputedStyle(toc).display==='block'&&toc.scrollWidth<=toc.clientWidth+1,facts:getComputedStyle(document.querySelector('.p1-facts dl')).gridTemplateColumns.split(' ').length,controls:[...document.querySelectorAll('.ap-page button,.ap-page a')].every(e=>e.textContent.trim()||e.getAttribute('aria-label'))};})()`);
    const label=x.slug+' '+width;
    check(!state.overflow,label+' no horizontal overflow');check(state.h1===1&&state.name===x.nameHindi,label+' one correct H1');check(state.main===1,label+' main landmark');check(state.title===x.seo.title,label+' title');check(width<768?state.stacked:state.side,label+' hero layout');check(state.ids,label+' unique IDs');check(state.toc,label+' readable contents');check(state.controls,label+' named controls');if(width<768)check(state.facts===1,label+' stacked facts');
    await b.click('.ap-page [data-period="all"]');
    const [first,second]=x.timeline;
    await b.click('#ap-event-'+first.id);check(await b.evaluate(`document.querySelector('#ap-event-${first.id}').getAttribute('aria-expanded')==='true'`),label+' expand first');
    await b.click('#ap-event-'+second.id);check(await b.evaluate(`document.querySelectorAll('.p1-events [aria-expanded=true]').length===1 && document.querySelector('#ap-panel-${first.id}').hidden`),label+' previous closes');
    await b.key('Enter','Enter',13);check(await b.evaluate('document.querySelectorAll(".p1-events [aria-expanded=true]").length===0'),label+' Enter collapses');
    await b.key(' ','Space',32);check(await b.evaluate(`document.querySelector('#ap-event-${second.id}').getAttribute('aria-expanded')==='true'`),label+' Space opens');
    check(await b.evaluate('getComputedStyle(document.activeElement).outlineStyle!=="none"'),label+' visible keyboard focus');
    await b.click('.ap-page [data-period="legacy"]');check(await b.evaluate(`document.querySelectorAll('.p1-filters [aria-pressed=true]').length===1 && document.querySelectorAll('.p1-events>li').length===${x.timeline.filter(e=>e.period==='legacy').length} && document.querySelectorAll('.p1-events [aria-expanded=true]').length===0`),label+' exclusive filter and reset');
    await b.click('.ap-page [data-period="all"]');check(await b.evaluate(`document.querySelectorAll('.p1-events>li').length===${x.timeline.length}`),label+' reset all');
    if([1440,390,320].includes(width)){await b.evaluate('scrollTo({top:0,behavior:"instant"})');screenshots.push(await b.screenshot(x.slug+'-'+width));}
   }
   await b.resize(1280);
   const concept=x.slug==='chanakya'?'saptanga':x.slug==='aryabhata'?'pi':'dhamma';
   await b.evaluate('document.getElementById('+q(concept)+').scrollIntoView({block:"start",behavior:"instant"})');screenshots.push(await b.screenshot(x.slug+'-reading-1280'));
   await b.resize(320);await b.evaluate('document.getElementById('+q(concept)+').scrollIntoView({block:"start",behavior:"instant"})');screenshots.push(await b.screenshot(x.slug+'-reading-320'));await b.resize(1280);
   for(const id of ['life-context','life-timeline','sources']){await b.click('.ap-page a[href="#'+id+'"]');check(await b.evaluate('location.hash==='+q('#'+id)),x.slug+' anchor '+id);check(await b.evaluate('document.getElementById('+q(id)+').getBoundingClientRect().top>=70'),x.slug+' anchor clears header '+id);}
   check(await b.evaluate(`[...document.querySelectorAll('.ap-page a[href^="#"]')].every(a=>!!document.getElementById(a.getAttribute('href').slice(1)))`),x.slug+' all local anchors resolve');
   await b.click('.ap-evidence-key>summary');check(await b.evaluate('document.querySelector(".ap-evidence-key").open'),x.slug+' evidence disclosure');
   await b.click('.p1-portrait summary');check(await b.evaluate('document.querySelector(".p1-portrait details").open'),x.slug+' image rights disclosure');
   const schema=await b.evaluate('JSON.parse(document.getElementById("page-schema").textContent)');check(schema['@type']==='Article'&&schema.about?.name===x.nameHindi&&!schema.about.birthDate&&!schema.about.birthPlace,x.slug+' live precise schema');
   check(await b.evaluate(`document.querySelector('link[rel="canonical"]').href.endsWith(${q(x.canonical)}) && document.querySelector('meta[property="og:title"]').content===${q(x.seo.title)} && document.querySelector('meta[name="twitter:card"]').content==='summary_large_image'`),x.slug+' live social metadata');
   for(const alias of x.aliases){await b.go('/search?q='+encodeURIComponent(alias));await b.waitFor('document.querySelector(".search-page input")?.value==='+q(alias),'search query');check(await b.evaluate(`!!document.querySelector(${q('.search-results a[href="'+x.canonical+'"]')})`),x.slug+' search '+alias);}
   await b.go('/history/'+x.slug);await b.delay(250);await b.click('#main-content a[href="'+x.canonical+'"]');await interactive();check(true,x.slug+' history backlink opens profile');
   await b.call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});check(await b.evaluate('getComputedStyle(document.querySelector(".p1-filters button")).transitionDuration==="0s"'),x.slug+' reduced motion');
  }
  const links=[...new Set(profiles.flatMap(x=>[...x.sections.flatMap(s=>(s.links||[]).map(([,to])=>to)),...x.related.map(p=>p.to)]))];
  for(const to of links){await b.go(to);await b.delay(200);await b.waitFor('!!document.querySelector("#main-content h1")','settled route');check(await b.evaluate('!!document.querySelector("#main-content h1") && !document.querySelector("#main-content .empty-state")'), 'internal route '+to);}
  for(const [route,selector]of [['/personalities/rajendra-prasad','.p1-page'],['/personalities/kunwar-singh','.ks-page'],['/personalities/jayaprakash-narayan','#main-content h1']]){await b.go(route);await b.waitFor('!!document.querySelector("#main-content[role=main] h1")','interactive existing route '+route);check(await b.evaluate('!!document.querySelector('+q(selector)+')'),'existing route '+route);}
  await b.call('Emulation.setScriptExecutionDisabled',{value:true});
  for(const x of profiles){await b.resize(390);await b.go(x.canonical);check(await b.evaluate('document.querySelectorAll("#life-timeline .p1-milestones>li").length')===x.timeline.length,x.slug+' no-JS complete timeline');check(await b.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),x.slug+' no-JS mobile');check(await b.evaluate('getComputedStyle(document.querySelector(".ap-evidence")).display==="inline-block"'),x.slug+' no-JS scoped CSS');screenshots.push(await b.screenshot(x.slug+'-no-js'));}
  await b.call('Emulation.setScriptExecutionDisabled',{value:false});
  check(b.errors.length===0,'no runtime exceptions');check(b.consoleErrors.length===0,'no console errors');if(b.errors.length)failures.push(JSON.stringify(b.errors));if(b.consoleErrors.length)failures.push(...b.consoleErrors);
 },'ancient-personalities');
 const report={checks,failures,widths,screenshots,date:'2026-10-03'};fs.mkdirSync(path.join(__dirname,'../.g9-browser-audit/ancient-personalities'),{recursive:true});fs.writeFileSync(path.join(__dirname,'../.g9-browser-audit/ancient-personalities/results.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));if(failures.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
