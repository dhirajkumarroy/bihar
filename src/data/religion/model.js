export const reviewedOn='2026-09-30';
export const b=(hi,en)=>({hi,en});
export const claimKinds=['TRADITION','BELIEF','HISTORICAL RECORD','ARCHAEOLOGICAL EVIDENCE','TEXTUAL EVIDENCE','SCHOLARLY INTERPRETATION','LIVING CULTURAL PRACTICE'];
export const claimLabels={TRADITION:b('परंपरा','Tradition'),BELIEF:b('आस्था','Belief'),'HISTORICAL RECORD':b('ऐतिहासिक अभिलेख','Historical record'),'ARCHAEOLOGICAL EVIDENCE':b('पुरातात्त्विक साक्ष्य','Archaeological evidence'),'TEXTUAL EVIDENCE':b('पाठ-साक्ष्य','Textual evidence'),'SCHOLARLY INTERPRETATION':b('शोधपरक व्याख्या','Scholarly interpretation'),'LIVING CULTURAL PRACTICE':b('जीवित सांस्कृतिक अभ्यास','Living cultural practice')};
export const traditions={hindu:b('हिंदू','Hindu'),buddhist:b('बौद्ध','Buddhist'),jain:b('जैन','Jain'),sikh:b('सिख','Sikh'),islamic:b('इस्लामी','Islamic'),christian:b('ईसाई','Christian'),folk:b('लोक / स्थानीय','Folk / local'),multi:b('बहु-परंपरा','Multi-tradition')};
export const contentTypes={place:b('पवित्र स्थल','Sacred place'),tradition:b('परंपरा','Tradition'),pilgrimage:b('तीर्थ-समूह','Pilgrimage'),architecture:b('स्थापत्य','Architecture'),history:b('इतिहास','History'),river:b('नदी','River'),institution:b('संस्था','Institution')};
export const regions={magadh:b('मगध','Magadh'),mithila:b('मिथिला','Mithila'),bhojpur:b('भोजपुर सांस्कृतिक क्षेत्र','Bhojpur cultural region'),ang:b('अंग','Ang'),seemanchal:b('सीमांचल','Seemanchal'),tirhut:b('तिरहुत / वैशाली','Tirhut / Vaishali'),saran:b('सारण / हरिहर क्षेत्र','Saran / Harihar region'),patna:b('पटना का नगरीय क्षेत्र','Patna urban setting'),kaimur:b('कैमूर पहाड़ी क्षेत्र','Kaimur hill setting')};
export const limited=b('प्रलेखन सीमित है। यह विवरण किसी सार्वभौम धार्मिक प्रथा या निश्चित प्राचीन तिथि का दावा नहीं करता।','Documentation is limited. This account does not claim a universal religious practice or a definitive ancient date.');
export const c=(kind,hi,en,...sources)=>({classification:kind,text:b(hi,en),sources});
// References are stable IDs, never copied festival/travel descriptions. No dependency on those modules.
export function record(x){
 const claims=(x.claims||[]).map((item,i)=>({...item,id:`${x.slug}-claim-${i+1}`}));
 const sources=[...new Set([...(x.sources||[]),...claims.flatMap(item=>item.sources)])];
 return {id:x.slug,type:'tradition',aliases:[],tradition:[],regions:[],religiousRegion:b('स्थल-विशिष्ट संदर्भ','Site-specific setting'),administrativeDistrict:[],location:b('बिहार','Bihar'),historicalPeriod:b('विभिन्न कालखंड','Multiple periods'),claims,relatedPlaces:[],relatedRecords:[],festivals:[],tourism:[],history:[],rivers:[],relatedPeople:[],relatedEvents:[],images:[],limitations:[],...x,claims,sources,lastVerified:reviewedOn,seo:{title:b(`${x.nameHindi} — बिहार की धार्मिक विरासत`,`${x.nameEnglish} — Bihar sacred heritage`),description:x.summary,canonical:`/religion/${x.slug}`}};
}
export function place(x){
 const result=record({type:'place',...x});
 return {...result,district:result.administrativeDistrict,region:result.regions,religiousCategory:x.religiousCategory||'sacred-site',historicalBackground:result.claims.filter(y=>y.classification==='HISTORICAL RECORD'),religiousSignificance:result.claims.filter(y=>['BELIEF','TRADITION'].includes(y.classification)),traditionalBeliefs:result.claims.filter(y=>y.classification==='TRADITION'),archaeologicalEvidence:result.claims.filter(y=>y.classification==='ARCHAEOLOGICAL EVIDENCE'),architecture:x.architecture||[],pilgrimageImportance:x.pilgrimageImportance||result.summary,culturalImportance:x.culturalImportance||result.summary,officialWebsite:x.officialWebsite||null};
}
