const assert=require('node:assert/strict');
const {withBrowser}=require('./browser-audit.cjs');
const origin=process.argv[2]||'http://127.0.0.1:5178';
const widths=[1440,1280,1024,768,500,430,390,360,320];
const routes=['/politics','/politics/government','/politics/institutions','/politics/institutions/state-election-commission','/politics/parties','/politics/parties/bjp','/politics/parties/compare','/politics/party-history','/politics/history','/politics/chief-ministers','/politics/governments','/politics/assembly','/politics/assembly/constituencies','/politics/council','/politics/parliament','/politics/parliament/lok-sabha','/politics/parliament/rajya-sabha','/politics/elections','/politics/elections/history','/politics/constituencies','/politics/constituencies/ac-181','/politics/constituencies/pc-30','/politics/electoral-geography','/politics/local-government','/politics/alliances','/politics/movements','/politics/people','/politics/people/nitish-kumar','/politics/current','/governance','/governance/state','/governance/district','/governance/block','/governance/departments','/governance/civic-knowledge','/governance/public-services','/search?q=RJD'];

withBrowser(origin,async browser=>{
 const {call,evaluate,waitFor,click,key,resize,go,screenshot,errors,consoleErrors,delay}=browser;
 let layouts=0;
 for(const route of routes){
  await resize(1440);await go(route);
  assert.equal(await evaluate("document.querySelectorAll('#main-content h1').length"),1,`${route}: exactly one h1`);
  assert(!await evaluate("document.querySelector('#main-content').innerText.includes('Something went wrong')"),route);
  if(route.startsWith('/politics')){
   assert.equal(await evaluate("document.querySelector('[data-politics-route]')?.dataset.politicsRoute"),route,`Politics page: ${route}`);
   assert.equal(await evaluate("JSON.parse(document.querySelector('#page-schema').textContent).url.endsWith(location.pathname)"),true,`${route}: schema URL`);
   assert(await evaluate("!!document.querySelector('#breadcrumb-schema')"),`${route}: breadcrumbs`);
  }
  for(const width of widths){await resize(width);const overflow=await evaluate('document.documentElement.scrollWidth > innerWidth + 1');assert(!overflow,`${route}: page overflow at ${width}px`);layouts++;}
 }
 console.log(`PASS: ${routes.length} routes, ${layouts} responsive layouts at ${widths.join(', ')}px; headings, deep loads and politics SEO`);
 await resize(1440);await go('/politics');console.log('Screenshot:',await screenshot('landing-1440'));
 await go('/politics/parties');
 await click('.politics-filters input[type=search]');await call('Input.insertText',{text:'RJD'});
 await waitFor("document.querySelector('.politics-result-count')?.textContent.startsWith('1 परिणाम')",'English party alias');
 assert(await evaluate("!!document.querySelector('.politics-grid a[href=\"/politics/parties/rjd\"]')"),'RJD result');
 await call('Input.dispatchKeyEvent',{type:'rawKeyDown',key:'a',code:'KeyA',windowsVirtualKeyCode:65,modifiers:2});await call('Input.dispatchKeyEvent',{type:'keyUp',key:'a',code:'KeyA',windowsVirtualKeyCode:65,modifiers:2});await call('Input.insertText',{text:'राजद'});
 await waitFor("document.querySelector('.politics-result-count')?.textContent.startsWith('1 परिणाम')",'Hindi party alias');
 await click('.politics-grid a');await waitFor("location.pathname==='/politics/parties/rjd' && !!document.querySelector('.politics-profile-mark')",'party link');
 await call('Page.reload');await waitFor("!!document.querySelector('.politics-profile-mark')",'party deep refresh');
 await evaluate('history.back()');await waitFor("location.pathname==='/politics/parties' && document.querySelector('.politics-filters input')?.value==='राजद'",'back preserves search');
 await go('/politics/parties?q=nonexistent-xyz');await waitFor("!!document.querySelector('.ui-empty')",'empty search');await click('.politics-filters button');await waitFor("document.querySelector('.politics-result-count')?.textContent.startsWith('21 परिणाम')",'clear filters');
 console.log('PASS: Hindi/English party search, empty state, reset, real link click, back and deep refresh');
 await go('/politics/parties/compare');
 assert.equal(await evaluate("document.querySelectorAll('.politics-compare-picker input:checked').length"),4);
 assert.equal(await evaluate("document.querySelectorAll('.politics-table thead th').length"),5);
 await click('.politics-compare-picker input:checked');assert.equal(await evaluate("document.querySelectorAll('.politics-table thead th').length"),4);
 await evaluate("document.querySelector('.politics-filters select').value='2020'; document.querySelector('.politics-filters select').dispatchEvent(new Event('change',{bubbles:true}))");
 await waitFor("document.querySelector('.politics-table').textContent.includes('विधानसभा 2020')",'comparison election year');
 assert(!await evaluate("[...document.querySelectorAll('.politics-table tbody tr')].find(row=>row.textContent.includes('जीती सीटें')).textContent.includes('89')"),'Old 2025 results not used for 2020');
 await go('/politics/parties/compare?parties=missing');assert(await evaluate("!!document.querySelector('.ui-empty')"),'Invalid comparison ID handled');
 await go('/politics/parties/compare?parties=bjp,rjd');await resize(320);assert(await evaluate("const t=document.querySelector('.politics-table');t.scrollWidth>t.clientWidth"),'Comparison scrolls locally on mobile');
 console.log('Screenshot:',await screenshot('comparison-320'));
 console.log('PASS: comparison add/remove limit, dated election selection, invalid selection and horizontal table');
 await resize(1440);await go('/politics/constituencies?district=patna&chamber=assembly');assert(await evaluate("document.querySelector('.politics-result-count').textContent.startsWith('14 परिणाम')"),'Patna 14 ACs');
 await go('/politics/constituencies?number=181&chamber=assembly');await waitFor("document.querySelector('.politics-result-count')?.textContent.startsWith('1 परिणाम')",'exact constituency number');
 await click('.politics-grid a');await waitFor("location.pathname==='/politics/constituencies/ac-181'",'constituency detail link');
 assert(await evaluate("!!document.querySelector('a[href=\"/politics/constituencies/pc-30\"]')"),'Digha maps to Patna Sahib PC');
 await go('/politics/constituencies?chamber=assembly&reservation=ST');assert(await evaluate("document.querySelector('.politics-result-count').textContent.startsWith('2 परिणाम')"),'ST filter');
 await go('/politics/constituencies');await click('.politics-pagination button:last-child');await waitFor("location.search.includes('page=2')",'pagination changes URL');
 await go('/politics/government');await evaluate("document.querySelectorAll('.politics-branch-buttons button')[2].focus()");await key('Enter','Enter',13);await waitFor("document.querySelector('#politics-branch-panel h3').textContent==='न्यायपालिका'",'keyboard structure control');
 assert(await evaluate("document.querySelectorAll('.politics-branch-buttons button[aria-pressed=true]').length===1"),'Only one diagram branch selected');
 console.log('PASS: district/chamber/number/reservation filters, AC-PC mapping, pagination and keyboard diagram');
 for(const route of ['/politics/parties/missing','/politics/people/missing','/politics/constituencies/ac-999','/politics/institutions/missing','/politics/council/members']){await call('Page.navigate',{url:origin+route});await waitFor("document.querySelector('meta[name=robots]')?.content.includes('noindex')",'invalid route noindex');assert(!await evaluate("!!document.querySelector('[data-politics-route]')"),'Invalid detail not rendered');}
 await go('/politics/current');assert(await evaluate("document.querySelectorAll('.current-state-unverified .current-value').length===0"),'No unverified current values');
 await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await go('/politics/parties');assert(await evaluate("matchMedia('(prefers-reduced-motion: reduce)').matches"),'Reduced motion enabled');assert.equal(await evaluate("getComputedStyle(document.querySelector('.politics-card')).animationName"),'none');
 await go('/search?q=राजद');assert(await evaluate("!!document.querySelector('.search-page a[href=\"/politics/parties/rjd\"]')"),'Hindi global party search');
 await go('/search?q=Purnia');assert(await evaluate("[...document.querySelectorAll('.search-page a')].filter(a=>a.pathname.startsWith('/politics/constituencies/')).length>=2"),'Same-name AC/PC not deduplicated away');
 await go('/governance/departments?q=finance');assert(await evaluate("document.querySelector('.politics-result-count').textContent.startsWith('1 परिणाम')"),'Department search');
 await resize(390);console.log('Screenshot:',await screenshot('department-390'));
 assert.deepEqual(errors,[],'No uncaught browser exceptions');assert.deepEqual(consoleErrors,[],'No React/console errors');
 console.log('PASS: invalid-route noindex, unverified-value safety, reduced motion, global search, department search, zero runtime/console errors');
}).catch(error=>{console.error(error);process.exitCode=1;});
