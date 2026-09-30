// Render the SAME page/component/data as the client. No second biography to drift.
const fs=require('node:fs'),path=require('node:path');
const {loadDataModule}=require('./load-data-module.cjs');
const root=path.resolve(__dirname,'..'),dist=path.join(root,'dist');
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const json=x=>JSON.stringify(x).replace(/</g,'\\u003c');
(async()=>{
 const {createServer,loadEnv}=await import('vite');
 const origin=(process.env.VITE_SITE_URL||loadEnv('production',root,'VITE_SITE_URL').VITE_SITE_URL||'https://bihar-eight.vercel.app').replace(/\/+$/,'');
 const {rajendraPrasad:x,personalityMediaById:media,personalitySchema}=loadDataModule(path.join(root,'src/data/personalities/index.js'));
 const server=await createServer({root,mode:'production',server:{middlewareMode:true,hmr:false},appType:'custom'});
 try{
  const {default:Page}=await server.ssrLoadModule('/src/pages/PersonalityProfilePage.jsx');
  const React=require('react'),{renderToStaticMarkup}=require('react-dom/server'),{StaticRouter}=require('react-router-dom');
  const body=renderToStaticMarkup(React.createElement(StaticRouter,{location:x.canonical},React.createElement('main',{id:'main-content'},React.createElement(Page))));
  const url=origin+x.canonical,image=origin+media.portrait.src;
  let html=fs.readFileSync(path.join(dist,'index.html'),'utf8').replace(/<title>[^<]*<\/title>/,`<title>${esc(x.seo.title)}</title>`).replace(/<link rel="canonical"[^>]*>/,`<link rel="canonical" href="${esc(url)}">`).replace(/<link rel="preload" as="image"[^>]*>/,'');
  const metadata={description:x.seo.description,'og:title':x.seo.title,'og:description':x.seo.description,'og:type':'article','og:url':url,'og:image':image,'og:image:alt':media.portrait.alt,'og:locale':'hi_IN','twitter:card':'summary_large_image','twitter:title':x.seo.title,'twitter:description':x.seo.description,'twitter:image':image};
  for(const [name,value]of Object.entries(metadata)){const re=new RegExp('<meta (?:name|property)="'+name+'"[^>]*>'),tag=`<meta ${name.startsWith('og:')?'property':'name'}="${name}" content="${esc(value)}">`;html=re.test(html)?html.replace(re,tag):html.replace('</head>',tag+'</head>');}
  const breadcrumb={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[['मुखपृष्ठ','/'],['व्यक्तित्व','/personalities'],[x.nameHindi,x.canonical]].map(([name,to],i)=>({'@type':'ListItem',position:i+1,name,item:origin+to}))};
  const css=fs.readdirSync(path.join(dist,'assets')).filter(file=>/^PersonalityProfilePage-.*\.css$/.test(file));if(css.length!==1)throw Error('Expected one biography stylesheet');
  html=html.replace('</head>',`<link rel="stylesheet" href="/assets/${css[0]}"><script id="page-schema" type="application/ld+json">${json({'@context':'https://schema.org',...personalitySchema(x,origin)})}</script><script id="breadcrumb-schema" type="application/ld+json">${json(breadcrumb)}</script></head>`).replace('<div id="root"></div>',`<div id="root">${body}</div>`);
  const target=path.join(dist,'personalities','rajendra-prasad','index.html');fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,html);
  console.log('Prerendered Rajendra Prasad: shared component, full biography, all timeline events, image rights, Person + Article + BreadcrumbList.');
 }finally{await server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
