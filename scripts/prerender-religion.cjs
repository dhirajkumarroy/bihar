// Same record source as the interactive pages. Outputs useful HTML without JavaScript.
const fs=require('node:fs'),path=require('node:path');
const {loadDataModule}=require('./load-data-module.cjs');
const root=path.resolve(__dirname,'..'),dist=path.join(root,'dist');
const data=loadDataModule(path.join(root,'src/data/religion/index.js'));
const {festivalBySlug}=loadDataModule(path.join(root,'src/data/festivals/index.js'));
const {religionRecords,religionDirectories,religionById,religionRoutes,getClaims,getSourceIds,sourceById,mediaById,claimLabels,regions,traditions,geographyContexts,riverCoverageGaps}=data;
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const json=x=>JSON.stringify(x).replace(/</g,'\\u003c');
const paragraph=x=>`<p>${esc(x?.hi||x)}</p>`;
const link=(url,label)=>`<a href="${esc(url)}">${esc(label)}</a>`;
const section=(title,body)=>`<section><h2>${esc(title)}</h2>${body}</section>`;
const list=items=>`<ul>${items.map(x=>`<li>${x}</li>`).join('')}</ul>`;
const cards=items=>list(items.map(x=>link(x.seo.canonical,x.nameHindi)+' '+paragraph(x.summary)));
const photo=id=>{const m=mediaById[id];return `<figure><img src="${esc(m.src)}" width="${m.width}" height="${m.height}" alt="${esc(m.alt)}" loading="lazy" style="max-width:100%;height:auto"><figcaption>${esc(m.caption)}<br>${link(m.source,m.credit)} · ${link(m.licenseUrl,m.license)}${paragraph(m.changes)}</figcaption></figure>`;};
const methodology=()=>section('स्रोत और पद्धति',paragraph('यह सांस्कृतिक परिचय है, धार्मिक निर्देश नहीं। आस्था, परंपरा, इतिहास, पाठ, पुरातत्त्व और शोध अलग प्रमाण-श्रेणियाँ हैं। सरकारी पर्यटन-विवरण चमत्कार का प्रमाण नहीं है। स्रोत-समीक्षा वर्तमान यात्रा-स्थितियों की गारंटी नहीं है।')+link('/editorial-policy','संपादकीय नीति'));
function detail(x){const related=[...new Set([...x.relatedPlaces,...x.relatedRecords,...(x.architecture||[])])].map(id=>religionById[id]);return [
 paragraph(x.summary),paragraph(x.religiousRegion),paragraph(x.regions.map(id=>regions[id].hi).join(' · ')),x.communityContext?paragraph(x.communityContext):'',
 x.period?paragraph(x.period):'',x.places?section('सांकेतिक अध्ययन-क्रम',paragraph(x.sequenceNotice)+`<ol>${x.places.map(id=>`<li>${link(religionById[id].seo.canonical,religionById[id].nameHindi)}</li>`).join('')}</ol>`):'',
 section('अर्थ, इतिहास और साक्ष्य',getClaims(x).map(c=>`<article><h3>${esc(claimLabels[c.classification].hi)}</h3>${paragraph(c.text)}${list(c.sources.map(id=>link(sourceById[id].url,sourceById[id].title)))}</article>`).join('')),
 x.type==='place'&&!x.archaeologicalEvidence.length?paragraph('प्रलेखन सीमित है। इस परिचय में स्वतंत्र पुरातात्त्विक दावा प्रकाशित नहीं है।'): '',
 x.limitations.length?section('सीमाएँ और अलग विवरण',x.limitations.map(paragraph).join('')):'',
 x.images.length?section('स्थल-तस्वीरें',x.images.map(photo).join('')):paragraph('इस संस्करण में स्थल-सत्यापित उपयोग-अधिकार वाली तस्वीर उपलब्ध नहीं है।'),
 related.length?section('संबंधित स्थल और अर्थ',cards(related)):'',
 section('पर्व-संदर्भ · C8',list(x.festivals.map(festivalBySlug).map(f=>link(f.seo.canonical,f.nameHi)))),
 section('यात्रा और आगंतुक जानकारी · पर्यटन',list(x.tourism.map(id=>link('/tourism/'+id,id)))),
 section('प्रशासनिक जिले',list(x.administrativeDistrict.map(id=>link('/district/'+id,id)))),
 section('इतिहास और भौतिक भूगोल',list([...x.history.map(url=>link(url,url.split('/').at(-1))),...x.rivers.map(id=>link('/geography/rivers/'+id,id))])),
 section('स्रोत',list(getSourceIds(x).map(id=>link(sourceById[id].url,sourceById[id].title)))),paragraph('स्रोत-समीक्षा: '+x.lastVerified),methodology()
 ].join('');}
const geography=()=>section('पवित्र भूगोल',paragraph('धार्मिक क्षेत्र, सांस्कृतिक क्षेत्र और प्रशासनिक जिले अलग हैं। सीमित प्रलेखन का अर्थ धार्मिक जीवन का अभाव नहीं।')+geographyContexts.map(x=>`<h3>${esc(x.name.hi)}</h3>${paragraph(x.note)}${cards(x.places.map(id=>religionById[id]))}`).join(''));
function directory(x){let output=paragraph(x.summary);if(!x.slug)output+=geography()+section('प्रमुख तीर्थ-केंद्र',cards(data.sacredPlaces.slice(0,5)))+data.faithIds.map(id=>section(religionById[id].nameHindi,paragraph(religionById[id].summary)+link('/religion/'+id,'परिचय और स्रोत'))).join('')+religionDirectories.filter(d=>d.slug&&!['traditions','sacred-places'].includes(d.slug)).map(d=>section(d.nameHindi,paragraph(d.summary)+link(d.seo.canonical,'संग्रह देखें'))).join('')+section('धार्मिक पर्व',link('/festivals/religious','C8 पर्व-संग्रह'));
 else output+=(x.slug==='sacred-places'?geography():'')+cards(religionRecords.filter(r=>!x.filterType||r.type===x.filterType));
 if(x.slug==='sacred-rivers')output+=section('आगे प्रलेखन आवश्यक',riverCoverageGaps.map(r=>`<h3>${esc(r.name.hi)}</h3>${paragraph(r.note)}${link('/geography/rivers/'+r.slug,'भूगोल पढ़ें')}`).join(''));
 return output+methodology();}
async function main(){const {loadEnv}=await import('vite');const origin=(process.env.VITE_SITE_URL||loadEnv('production',root,'VITE_SITE_URL').VITE_SITE_URL||'https://bihar-eight.vercel.app').replace(/\/+$/,'');const shell=fs.readFileSync(path.join(dist,'index.html'),'utf8');
 for(const route of religionRoutes){const x=data.religionPageByPath(route),isDirectory=x.type==='directory',title=x.seo.title.hi+' | सम्पूर्ण बिहार',description=x.seo.description.hi,url=origin+route,hero=mediaById[x.images?.[0]||(route==='/religion'?'vaishali-pillar':'')],image=origin+(hero?.src||'/assets/bihar-districts-heritage.svg');
 const schema={'@context':'https://schema.org','@type':isDirectory?'CollectionPage':'Article',name:x.nameHindi,headline:isDirectory?undefined:x.nameHindi,description,url,image,inLanguage:'hi',dateModified:x.lastVerified,citation:isDirectory?undefined:getSourceIds(x).map(id=>sourceById[id].url)};
 const breadcrumbs={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{name:'मुखपृष्ठ',item:origin+'/'},...(route==='/religion'?[]:[{name:'धार्मिक विरासत',item:origin+'/religion'}]),{name:x.nameHindi,item:url}].map((item,i)=>({'@type':'ListItem',position:i+1,...item}))};
 let html=shell.replace(/<title>[^<]*<\/title>/,`<title>${esc(title)}</title>`).replace(/<link rel="canonical"[^>]*>/,`<link rel="canonical" href="${esc(url)}">`).replace(/<link rel="preload" as="image"[^>]*>/,'');
 const metadata={description,'og:title':title,'og:description':description,'og:type':isDirectory?'website':'article','og:url':url,'og:image':image,'og:image:alt':hero?.alt||'Bihar portal map','og:locale':'hi_IN','twitter:card':'summary_large_image','twitter:title':title,'twitter:description':description,'twitter:image':image};
 for(const [name,value]of Object.entries(metadata)){const pattern=new RegExp('<meta (?:name|property)="'+name+'"[^>]*>'),tag=`<meta ${name.startsWith('og:')?'property':'name'}="${name}" content="${esc(value)}">`;html=pattern.test(html)?html.replace(pattern,tag):html.replace('</head>',tag+'</head>');}
 html=html.replace('</head>',`<script id="page-schema" type="application/ld+json">${json(schema)}</script><script id="breadcrumb-schema" type="application/ld+json">${json(breadcrumbs)}</script></head>`);
 const body=`<main class="c9-page" lang="hi"><nav aria-label="ब्रेडक्रंब">${link('/','मुखपृष्ठ')} / ${link('/religion','धार्मिक विरासत')}</nav><h1>${esc(x.nameHindi)}</h1><p lang="en">${esc(x.nameEnglish)}</p>${isDirectory?directory(x):detail(x)}</main>`;
 html=html.replace('<div id="root"></div>',`<div id="root">${body}</div>`);
 const target=path.resolve(dist,'.'+route,'index.html');if(!target.startsWith(dist+path.sep))throw Error('Unsafe route '+route);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,html);
 }
 console.log(`Prerendered ${religionRoutes.length} religion pages with sourced content, canonical/social metadata and JSON-LD.`);
}
main().catch(error=>{console.error(error);process.exitCode=1;});
