import {b,contentTypes,traditions,regions,reviewedOn} from './model.js';
import {sacredPlaces} from './places.js';
import {traditionRecords,institutions} from './traditions.js';
import {pilgrimageCircuits,architectureRecords,sacredRivers,religiousHistory} from './systems.js';
export * from './model.js';
export * from './sources.js';
export * from './media.js';
export * from './places.js';
export * from './traditions.js';
export * from './systems.js';
export const religionRecords=[...sacredPlaces,...traditionRecords,...institutions,...pilgrimageCircuits,...architectureRecords,...sacredRivers,...religiousHistory];
export const religionById=Object.fromEntries(religionRecords.map(x=>[x.id,x]));
export const getClaims=x=>[...x.claims,...(x.contextRecords||[]).flatMap(id=>religionById[id].claims)];
export const getSourceIds=x=>[...new Set([...x.sources,...getClaims(x).flatMap(c=>c.sources)])];
export const faithIds=['hindu-traditions','buddhism','jainism','sikhism','islam','christianity','folk-traditions'];
const directory=(slug,hi,en,description,type)=>({slug,nameHindi:hi,nameEnglish:en,summary:description,type:'directory',filterType:type,lastVerified:reviewedOn,seo:{canonical:slug?`/religion/${slug}`:'/religion',title:b(hi,en),description}});
export const religionDirectories=[
 directory('','बिहार की धार्मिक और आध्यात्मिक विरासत','Bihar’s religious and spiritual heritage',b('हिंदू, बौद्ध, जैन, सिख, इस्लामी, ईसाई और विविध लोक-परंपराएँ—आस्था, इतिहास और प्रमाण के स्पष्ट भेद के साथ।','Hindu, Buddhist, Jain, Sikh, Islamic, Christian and diverse folk traditions, with clear distinctions between faith, history and evidence.')),
 directory('explore','धार्मिक विरासत में खोजें','Explore religious heritage',b('स्थल, परंपरा, तीर्थ-समूह, स्थापत्य, इतिहास, नदी और संस्था—एक साथ खोजें और फ़िल्टर करें।','Search and filter places, traditions, pilgrimage groups, architecture, history, rivers and institutions together.')),
 directory('traditions','धार्मिक परंपराएँ और समुदाय','Religious traditions and communities',b('स्थल, समुदाय और प्रमाण के साथ बिहार की धार्मिक परंपराएँ खोजें।','Explore Bihar’s religious traditions through places, communities and evidence.'),'tradition'),
 directory('sacred-places','बिहार का पवित्र भूगोल','Bihar’s sacred geography',b('धार्मिक क्षेत्र, सांस्कृतिक क्षेत्र और प्रशासनिक जिले अलग हैं। स्थान और परंपरा से खोजें।','Religious regions, cultural regions and administrative districts are distinct. Search by place and tradition.'),'place'),
 directory('pilgrimage','तीर्थ-स्मृतियाँ और अध्ययन-परिपथ','Pilgrimage memories and reading circuits',b('छह स्रोत-संकेतित अध्ययन-क्रम; ये निर्धारित धार्मिक यात्रा या वर्तमान यात्रा-समय का दावा नहीं हैं।','Six source-guided reading sequences, not prescribed ritual journeys or live travel itineraries.'),'pilgrimage'),
 directory('sacred-rivers','नदियों का धार्मिक और सांस्कृतिक अर्थ','Religious and cultural meanings of rivers',b('स्थानीय जल-आस्था और प्रलेखन की सीमाएँ; नदी का विज्ञान भूगोल में पढ़ें।','Local water traditions and documentation limits; read river science in Geography.'),'river'),
 directory('architecture','धार्मिक स्थापत्य के संदर्भ','Contexts of religious architecture',b('मंदिर से चर्च और गुफा तक: स्थल-विशिष्ट प्रमाण और सावधान स्थापत्य-पठन।','From temples to churches and caves: site-specific evidence and careful architectural readings.'),'architecture'),
 directory('history','धार्मिक इतिहास की समानांतर परंपराएँ','Overlapping histories of religion',b('परंपराएँ एक-दूसरे को सरल क्रम में प्रतिस्थापित नहीं करतीं। समर्थित तिथियों और काल-संदर्भों से पढ़ें।','Traditions do not replace each other in a simple sequence. Read supported dates and period contexts.'),'history')
];
export const religionPageByPath=path=>religionDirectories.find(x=>x.seo.canonical===path)||religionRecords.find(x=>x.seo.canonical===path);
export const religionRoutes=[...religionDirectories,...religionRecords].map(x=>x.seo.canonical);
export const normalizeReligion=value=>String(value||'').normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{M}\p{N}]+/gu,' ').trim();
export function filterReligion({query='',tradition='',type='',region=''}={}){const terms=normalizeReligion(query).split(' ').filter(Boolean);return religionRecords.filter(x=>(!tradition||x.tradition.includes(tradition))&&(!type||x.type===type)&&(!region||x.regions.includes(region))&&terms.every(term=>normalizeReligion([x.nameHindi,x.nameEnglish,...x.aliases,x.summary.hi,x.summary.en].join(' ')).includes(term)));}
export const religionSearchRecords=religionRecords.map(x=>({id:`religion:${x.id}`,name:x.nameHindi,nameEn:x.nameEnglish,to:x.seo.canonical,aliases:x.aliases,summary:x.summary.hi,tags:[contentTypes[x.type].hi,...x.tradition.map(id=>traditions[id].hi)],region:x.regions.map(id=>regions[id].hi)}));
