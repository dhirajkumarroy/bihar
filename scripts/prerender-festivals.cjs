// Build-time HTML for crawlers, social previews and readers without JavaScript.
// React replaces this same-content fallback on startup; annual schedules are not embedded.
const fs=require('node:fs'),path=require('node:path');
const {loadDataModule}=require('./load-data-module.cjs');
const root=path.resolve(__dirname,'..'),dist=path.join(root,'dist');
const {festivalTopics,festivalRoutes,festivalBySlug}=loadDataModule(path.join(root,'src/data/festivals/index.js'));
const {religionRecords}=loadDataModule(path.join(root,'src/data/religion/index.js'));
const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const json=value=>JSON.stringify(value).replace(/</g,'\\u003c');
const paragraphs=items=>(items||[]).map(text=>`<p>${esc(text)}</p>`).join('');
const cards=items=>(items||[]).map(item=>`<section><h3>${esc(item.title)}</h3><p>${esc(item.text)}</p>${item.to?`<a href="${esc(item.to)}">संबंधित पृष्ठ</a>`:''}</section>`).join('');
const photo=media=>`<figure><img src="${esc(media.src)}" width="${media.width}" height="${media.height}" alt="${esc(media.alt)}" style="max-width:100%;height:auto"><figcaption>${esc(media.caption)} — ${esc(media.disclosure)}</figcaption></figure>`;
const section=(id,title,body)=>`<section id="${id}"><h2>${title}</h2>${body}</section>`;
const details=x=>[
 photo(x.hero),paragraphs([x.summary]),
 `<dl>${[['संदर्भ',x.religion],['ऋतु',x.season],['कैलेंडर',x.traditionalCalendar],['क्षेत्र',x.culturalRegions.join(' · ')],['अवधि',x.durationContext]].map(([label,value])=>`<dt>${label}</dt><dd>${esc(value)}</dd>`).join('')}</dl>`,
 section('overview','परिचय',paragraphs([x.intro,...x.culturalContext,x.socialMeaning,x.communityContext])),
 section('history','इतिहास और प्रमाण',paragraphs(x.history)),section('mythology','धार्मिक कथा और स्मृति',paragraphs([x.mythology])),
 section('calendar','ऋतु और कैलेंडर',paragraphs([x.approximateGregorianPeriod,x.dateNotice,'वर्तमान आयोजन-सूचना के लिए आधिकारिक स्रोत देखें।'])),
 section('rituals','अनुष्ठान और परंपराएँ',cards([...(x.festivalStages||[]),...x.rituals,...x.traditions])),
 section('foods','भोजन',cards(x.foods)),section('music','गीत और मौखिक परंपरा',cards([...x.songs,...x.dances])),section('crafts','शिल्प और पहनावा',cards(x.crafts)+paragraphs([x.dress])),
 section('tourism','स्थान और यात्रा',cards(x.places)+paragraphs(x.tourism)),section('today','बदलती परंपराएँ',paragraphs(x.modernChanges)),
 section('gallery','चित्र-दीर्घा',x.gallery.map(photo).join('')),
 section('related','संबंधित पर्व',`<ul>${x.relatedFestival.map(festivalBySlug).filter(Boolean).map(item=>`<li><a href="${item.seo.canonical}">${esc(item.nameHi)}</a></li>`).join('')}</ul>`),
 section('religion','धार्मिक अर्थ और पवित्र स्थल',`<ul>${religionRecords.filter(item=>item.festivals.includes(x.slug)).map(item=>`<li><a href="${item.seo.canonical}">${esc(item.nameHindi)}</a></li>`).join('')}</ul>`),
 section('sources','स्रोत',`<ul>${x.sources.map(source=>`<li><a href="${esc(source.url)}">${esc(source.title)}</a></li>`).join('')}</ul>`)
].join('');
async function main(){
 const {loadEnv}=await import('vite');
 const origin=(process.env.VITE_SITE_URL||loadEnv('production',root,'VITE_SITE_URL').VITE_SITE_URL||'https://bihar-eight.vercel.app').replace(/\/+$/,'');
 const shell=fs.readFileSync(path.join(dist,'index.html'),'utf8');
 const collectionTitles={'/festivals':'बिहार के पर्व, मेले और परंपराएँ','/festivals/religious':'धार्मिक परंपराएँ','/festivals/fairs':'मेले व महोत्सव','/festivals/seasonal':'ऋतु-कैलेंडर'};
 for(const route of festivalRoutes){
  const x=festivalTopics.find(item=>item.seo.canonical===route),title=x?.seo.title||collectionTitles[route],heading=x?.nameHi||title;
  const description=x?.seo.description||'बिहार के पर्व, मेले, धार्मिक परंपराएँ, ऋतु-कैलेंडर, लोकगीत, भोजन और सांस्कृतिक यात्राओं का स्रोत-आधारित परिचय।';
  const hero=x?.hero||festivalBySlug('chhath').hero,url=origin+route,fullTitle=title+' | सम्पूर्ण बिहार';
  const records=festivalTopics.filter(item=>route==='/festivals/fairs'?item.collection==='fairs':route==='/festivals/religious'?item.faith!=='सांस्कृतिक / नागरिक':true);
  const content=x?details(x):photo(hero)+paragraphs([description,'यह सांस्कृतिक परिचय है, वर्तमान आयोजन-सूची नहीं।'])+`<ul>${records.map(item=>`<li><a href="${item.seo.canonical}">${esc(item.nameHi)} — ${esc(item.nameEn)}</a><p>${esc(item.summary)}</p></li>`).join('')}</ul>`;
  const schema={'@context':'https://schema.org','@type':x?'Article':'CollectionPage',name:fullTitle,headline:x?.nameHi,description,url,image:origin+hero.src,inLanguage:['hi','en'],citation:x?.sources.map(source=>source.url),publisher:{'@type':'Organization',name:'सम्पूर्ण बिहार',url:origin}};
  const breadcrumbs={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{name:'मुखपृष्ठ',item:origin+'/'},...(route==='/festivals'?[]:[{name:'पर्व और मेले',item:origin+'/festivals'}]),{name:heading,item:url}].map((item,i)=>({'@type':'ListItem',position:i+1,...item}))};
  let html=shell.replace(/<title>[^<]*<\/title>/,`<title>${esc(fullTitle)}</title>`).replace(/<link rel="canonical"[^>]*>/,`<link rel="canonical" href="${esc(url)}">`);
  const metadata={'description':description,'og:title':fullTitle,'og:description':description,'og:type':x?'article':'website','og:url':url,'og:image':origin+hero.src,'og:image:alt':hero.alt,'twitter:title':fullTitle,'twitter:description':description,'twitter:image':origin+hero.src};
  for(const [name,value] of Object.entries(metadata))html=html.replace(new RegExp('<meta (?:name|property)="'+name+'"[^>]*>'),`<meta ${name.startsWith('og:')?'property':'name'}="${name}" content="${esc(value)}">`);
  html=html.replace(/<link rel="preload" as="image"[^>]*>/,'');
  html=html.replace('</head>',`<script id="page-schema" type="application/ld+json">${json(schema)}</script><script id="breadcrumb-schema" type="application/ld+json">${json(breadcrumbs)}</script></head>`);
  html=html.replace('<div id="root"></div>',`<div id="root"><main class="c8-page"><nav aria-label="ब्रेडक्रंब"><a href="/">मुखपृष्ठ</a> / <a href="/festivals">पर्व और मेले</a></nav><h1>${esc(heading)}</h1>${content}<p><a href="/editorial-policy">संपादकीय नीति</a></p></main></div>`);
  const target=path.resolve(dist,'.'+route,'index.html');if(!target.startsWith(dist+path.sep))throw Error('Unsafe route '+route);
  fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,html);
 }
 console.log('Prerendered '+festivalRoutes.length+' festival HTML pages with canonical, social and structured metadata.');
}
main().catch(error=>{console.error(error);process.exitCode=1;});
