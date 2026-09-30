import credits from '../../../public/images/personalities/rajendra-prasad/credits.json' with {type:'json'};
export {rajendraPrasad} from './rajendraPrasad.js';
export {personalitySources,personalitySourceById} from './sources.js';
// Only reviewed selections; rejected discoveries are never used as fallback images.
const selected=['portrait','champaran','assembly','broadcast','presidency','flag-day','sadaqat','champaran-book'];
export const personalityMedia=credits.filter(x=>selected.includes(x.id)).map(x=>({...x,credit:x.credit==='Unknown authorUnknown author'?'Unknown photographer (archival photograph)':x.credit}));
export const personalityMediaById=Object.fromEntries(personalityMedia.map(x=>[x.id,x]));
export function personalitySchema(x,origin){
 const url=origin+x.canonical,person={'@type':'Person','@id':url+'#person',name:x.nameHindi,alternateName:[x.nameEnglish,...x.aliases],birthDate:x.birthDate,deathDate:x.deathDate,birthPlace:{'@type':'Place',name:'Ziradei, present-day Siwan, Bihar, India'},description:x.subtitle,image:origin+personalityMediaById.portrait.src,url,award:'Bharat Ratna (1962)',sameAs:['https://www.presidentofindia.gov.in/dr-rajendra-prasad-served-profile']};
 return {'@type':'Article',headline:x.seo.title,description:x.seo.description,url,mainEntityOfPage:url,inLanguage:'hi',dateModified:x.reviewedOn,about:person,mainEntity:person,image:origin+personalityMediaById.portrait.src,author:{'@type':'Organization',name:'सम्पूर्ण बिहार संपादकीय',url:origin+'/editorial-policy'},citation:['https://www.presidentofindia.gov.in/dr-rajendra-prasad-served-profile','https://www.padmaawards.gov.in/Document/pdf/Notifications/BharatRatna/1962BR.pdf']};
}
