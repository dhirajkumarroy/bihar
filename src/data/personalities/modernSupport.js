import credits from '../../../public/images/personalities/modern/credits.json' with {type:'json'};
import {modernDiscovery} from './modernDirectory.js';
export {paragraph,event} from './ancientSupport.js';
const media=Object.fromEntries(credits.map(m=>[m.id,{...m,credit:m.credit==='Unknown authorUnknown author'?'अज्ञात फोटोग्राफर · Wikimedia Commons अभिलेख':m.credit}]));
export function modernProfile(slug,imageId,data){
 return {...modernDiscovery.find(p=>p.slug===slug),reviewedOn:'2026-10-03',hero:media[imageId],eyebrow:'व्यक्तित्व · आधुनिक बिहार · साहित्य और समाज',timelineNote:'जीवन, कार्य और बाद की स्मृति को अलग देखें। वर्ष-मात्र वाली प्रविष्टि का अर्थ उस वर्ष का कोई निश्चित दिन नहीं है।',...data};
}
