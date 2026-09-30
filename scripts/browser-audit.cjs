const {spawn}=require('node:child_process');
const {existsSync,mkdtempSync,mkdirSync,writeFileSync}=require('node:fs');
const {tmpdir}=require('node:os');
const {join}=require('node:path');
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));

async function withBrowser(origin,run,namespace='g7'){
 await fetch(origin);
 const executable=[process.env.BROWSER_PATH,'C:/Program Files/Google/Chrome/Application/chrome.exe','C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe','/usr/bin/chromium'].find(file=>file&&existsSync(file));
 if(!executable)throw Error('Set BROWSER_PATH to Chrome or Edge');
 const profile=mkdtempSync(join(tmpdir(),'bihar-politics-'));
 const browser=spawn(executable,['--headless=new','--remote-debugging-port=0',`--user-data-dir=${profile}`,'--no-first-run','--no-default-browser-check','about:blank'],{windowsHide:true,stdio:['ignore','ignore','pipe']});
 const pending=new Map(),errors=[],consoleErrors=[];let socket,call,id=0;
 try{
  const endpoint=await new Promise((resolve,reject)=>{
   let output='';const timer=setTimeout(()=>reject(Error('Browser startup timed out')),15000);
   browser.once('error',error=>{clearTimeout(timer);reject(error);});
   browser.stderr.on('data',chunk=>{output+=chunk;const match=output.match(/DevTools listening on (ws:\/\/[^\s]+)/);if(match){clearTimeout(timer);resolve(match[1]);}});
  });
  const address=endpoint.replace(/^ws:/,'http:').split('/devtools/')[0];
  const targets=await (await fetch(`${address}/json/list`)).json();
  socket=new WebSocket(targets.find(target=>target.type==='page').webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{socket.onopen=resolve;socket.onerror=reject;});
  socket.onmessage=event=>{const message=JSON.parse(event.data);if(message.id&&pending.has(message.id)){const task=pending.get(message.id);clearTimeout(task.timer);pending.delete(message.id);message.error?task.reject(Error(JSON.stringify(message.error))):task.resolve(message.result);}if(message.method==='Runtime.exceptionThrown')errors.push(message.params.exceptionDetails);if(message.method==='Runtime.consoleAPICalled'&&message.params.type==='error')consoleErrors.push(message.params.args.map(arg=>arg.value||arg.description).join(' '));};
  call=(method,params={})=>new Promise((resolve,reject)=>{const key=++id,timer=setTimeout(()=>{pending.delete(key);reject(Error(`Timeout: ${method}`));},15000);pending.set(key,{resolve,reject,timer});socket.send(JSON.stringify({id:key,method,params}));});
  const evaluate=async expression=>{const result=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(result.exceptionDetails)throw Error(JSON.stringify(result.exceptionDetails));return result.result.value;};
  const waitFor=async(expression,label)=>{for(let i=0;i<150;i++){if(await evaluate(expression))return;await delay(100);}throw Error(`Timeout: ${label}`);};
  const click=async selector=>{const point=await evaluate(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});if(!e)throw Error('Missing ${selector}');e.scrollIntoView({block:'center',behavior:'instant'});const r=e.getBoundingClientRect();const x=r.x+r.width/2,y=r.y+r.height/2;if(!r.width||!r.height||!e.contains(document.elementFromPoint(x,y)))throw Error('Covered control: '+e.outerHTML.slice(0,200));return {x,y};})()`);await call('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...point});await call('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...point});await delay(80);};
  const key=async(key,code,windowsVirtualKeyCode,modifiers=0)=>{const text=key==='Enter'?'\r':key===' '?' ':undefined;await call('Input.dispatchKeyEvent',{type:text?'keyDown':'rawKeyDown',key,code,windowsVirtualKeyCode,modifiers,text,unmodifiedText:text});await call('Input.dispatchKeyEvent',{type:'keyUp',key,code,windowsVirtualKeyCode,modifiers});};
  const resize=async width=>{await call('Emulation.setDeviceMetricsOverride',{width,height:950,deviceScaleFactor:1,mobile:false});await delay(60);};
  const go=async route=>{const pathname=route.split(/[?#]/)[0];await call('Page.navigate',{url:origin+route});await waitFor(`location.pathname===${JSON.stringify(pathname)} && document.querySelector('#main-content h1') && !document.querySelector('#main-content .loading') && document.querySelector('link[rel="canonical"]')?.href.includes(${JSON.stringify(pathname)})`,'route '+route);await evaluate('document.fonts.ready.then(()=>true)');};
  const screenshot=async name=>{const output=join(__dirname,'../.g9-browser-audit',namespace);mkdirSync(output,{recursive:true});const result=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});const filename=join(output,name+'.png');writeFileSync(filename,Buffer.from(result.data,'base64'));return filename;};
  await call('Runtime.enable');await call('Page.enable');
  await run({call,evaluate,waitFor,click,key,resize,go,screenshot,errors,consoleErrors,delay});
 }finally{if(call)await call('Browser.close').catch(()=>{});for(const task of pending.values())clearTimeout(task.timer);socket?.close();browser.kill();}
}
module.exports={withBrowser};
