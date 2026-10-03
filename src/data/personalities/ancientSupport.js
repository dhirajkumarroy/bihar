// Shared shape and schema only; individual biographies remain in their lazy chunks.
export const evidenceTypes = {
 primary: {label:'मूल पाठ / अभिलेख',note:'उस समय का पाठ या अभिलेख; उसका दावा अपने-आप निष्पक्ष विवरण नहीं होता।'},
 research: {label:'अकादमिक अध्ययन',note:'आधुनिक शोध या शिक्षण-सामग्री पर आधारित व्याख्या।'},
 tradition: {label:'परंपरागत पहचान',note:'बाद की परंपरा में मिलता संबंध; समकालीन जीवन-वृत्त का विकल्प नहीं।'},
 uncertain: {label:'अनिश्चित / विवादित',note:'स्रोत निर्णायक नहीं हैं; यहाँ अनुमान को निश्चित तथ्य नहीं बनाया गया है।'},
 heritage: {label:'विरासत / संस्थागत स्रोत',note:'स्थल, संग्रह या आधुनिक स्मरण का संस्थागत विवरण।'},
 reading: {label:'साहित्यिक पाठ / व्याख्या',note:'रचना या उसके प्रकाशित परिचय पर आधारित पाठकीय व्याख्या; पात्र की बात को लेखक की जीवनी का तथ्य न समझें।'},
 teaching: {label:'समझने का आधुनिक उदाहरण',note:'संपादकीय शिक्षण-उदाहरण; ऐतिहासिक ग्रंथ का उद्धरण नहीं।'}
};
export const paragraph=(id,text,sources,evidence='research')=>({id,text,sources,evidence});
export const event=(id,sortYear,label,title,text,sources,period='work',evidence='research')=>({id,sortYear,label,title,text,sources,period,evidence});
export function ancientSchema(profile,origin){
 const url=origin.replace(/\/+$/,'')+profile.canonical;
 return {'@type':'Article','@id':url+'#article',headline:profile.seo.title,description:profile.seo.description,inLanguage:'hi',url,mainEntityOfPage:url,dateModified:profile.reviewedOn,image:origin.replace(/\/+$/,'')+profile.hero.src,
  author:{'@type':'Organization',name:'सम्पूर्ण बिहार संपादकीय टीम'},
  about:{'@type':'Person','@id':url+'#person',name:profile.nameHindi,alternateName:profile.aliases,description:profile.subtitle,url,...(profile.birthDate?{birthDate:profile.birthDate}:{}),...(profile.deathDate?{deathDate:profile.deathDate}:{})},
  citation:profile.sources.map(s=>s.url)};
}
// Generic name for the shared renderer; preserve the original export for existing consumers.
export const historicalSchema=ancientSchema;
