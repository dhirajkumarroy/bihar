import {defineConfig} from 'vite';
import {readFileSync} from 'node:fs';

// Preview uses the same exact festival rewrites as Vercel. Without this,
// Vite's SPA fallback hides the prerendered HTML at clean (no-slash) URLs.
export default defineConfig({build:{manifest:true},plugins:[{
 name:'festival-prerender-preview',
 configurePreviewServer(server){
  const {rewrites}=JSON.parse(readFileSync(new URL('./vercel.json',import.meta.url),'utf8'));
  const exact=new Map(rewrites.filter(rule=>rule.source.startsWith('/festivals')||rule.source.startsWith('/religion')||rule.source.startsWith('/personalities/')).map(rule=>[rule.source,rule.destination]));
  server.middlewares.use((request,_response,next)=>{
   const url=new URL(request.url,'http://localhost');
   const target=exact.get(url.pathname.replace(/\/$/,''));
   if(target)request.url=target+url.search;
   next();
  });
 }
}]});
