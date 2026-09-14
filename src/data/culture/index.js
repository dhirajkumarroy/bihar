import {mithilaPainting} from './mithilaPainting';
import {performanceTraditions} from './performanceTraditions';
import {movementExtensions,movementTraditions} from './movementTraditions';
export const cultureCategories={
 'visual-art':'दृश्य कला',craft:'शिल्प',music:'संगीत',theatre:'रंगमंच',dance:'नृत्य',festival:'त्योहार',language:'भाषा',literature:'साहित्य',food:'भोजन',clothing:'वस्त्र',ritual:'अनुष्ठान','folk-tradition':'लोक परंपरा',architecture:'वास्तुकला'
};
export const culturalRegions=[
 {id:'mithila',nameHi:'मिथिला',nameEn:'Mithila',summary:'मैथिली भाषा, painting, music, ritual और food traditions का ऐतिहासिक-सांस्कृतिक क्षेत्र।',districts:['madhubani','darbhanga','sitamarhi','supaul']},
 {id:'bhojpur',nameHi:'भोजपुर',nameEn:'Bhojpur',summary:'भोजपुरी भाषा, लोकगीत, theatre और migration narratives से जुड़ा cultural region।',districts:['bhojpur','buxar','saran']},
 {id:'magadh',nameHi:'मगध',nameEn:'Magadh',summary:'मगही language, folk practice और गया–राजगीर के layered cultural landscapes।',districts:['gaya','nalanda','nawada']},
 {id:'anga',nameHi:'अंग',nameEn:'Anga',summary:'अंगिका language और Bhagalpur–Munger region की नदी, textile और folk traditions।',districts:['bhagalpur','munger','banka']},
 {id:'champaran',nameHi:'चंपारण',nameEn:'Champaran',summary:'तराई, भोजपुरी-बज्जिका contact और regional craft/food memory।',districts:['east-champaran','west-champaran']},
 {id:'seemanchal',nameHi:'सीमांचल',nameEn:'Seemanchal',summary:'बहुभाषी borderland culture, fairs, food और community traditions।',districts:['purnia','katihar','araria','kishanganj']}
];
const expandedPerformanceTraditions=performanceTraditions.map(topic=>movementExtensions[topic.slug]?{...topic,...movementExtensions[topic.slug]}:topic);
export const cultureTopics=[mithilaPainting,...expandedPerformanceTraditions,...movementTraditions];
export const cultureBySlug=slug=>cultureTopics.find(x=>x.slug===slug||x.aliases.some(a=>a.toLowerCase().replaceAll(' ','-')===slug));
export const cultureDirectory=cultureTopics.map(({id,slug,nameHi,nameEn,category,subcategory,performanceType,movementType,language,regions,districts,summary,hero,aliases})=>({id,slug,nameHi,nameEn,category,subcategory,performanceType,movementType,language,regions,districts,summary,hero,aliases}));
