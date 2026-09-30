const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {loadDataModule}=require('./load-data-module.cjs');
const root=path.resolve(__dirname,'..');
const {festivalRoutes,festivalTopics}=loadDataModule(path.join(root,'src/data/festivals/index.js'));
const rewrites=JSON.parse(fs.readFileSync(path.join(root,'vercel.json'),'utf8')).rewrites;
for(const route of festivalRoutes){
 const html=fs.readFileSync(path.join(root,'dist',route,'index.html'),'utf8');
 const record=festivalTopics.find(x=>x.seo.canonical===route);
 assert(html.match(/<link rel="canonical"[^>]+>/)?.[0].includes(route+'"'),route+' canonical');
 assert(html.includes('id="page-schema"')&&html.includes('id="breadcrumb-schema"')&&html.includes('<h1>'),route+' static content');
 for(const name of ['og:title','og:description','og:image','twitter:title','twitter:description','twitter:image'])assert(html.includes('="'+name+'"'),route+' '+name);
 if(record){assert(html.includes(record.nameHi),route+' title');assert(html.includes(record.hero.src),route+' image');assert(html.includes('id="history"')&&html.includes('id="sources"'),route+' article');}
 assert(!html.includes('<link rel="preload" as="image" href="/assets/bihar-hero.png"'),route+' unrelated preload');
 assert(rewrites.some(rule=>rule.source===route&&rule.destination===route+'/index.html'),route+' hosting rewrite');
 const scripts=[...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
 assert(scripts.length>=3,route+' schema count');for(const match of scripts)JSON.parse(match[1]);
}
console.log('Festival production HTML validation passed: '+festivalRoutes.length+' pages, crawler-visible metadata, content, JSON-LD and Vercel rewrites.');
