import {parties} from '../politics/parties';
import {politicsSources} from '../politics/sources';

// Null means not verified, never zero members or an unregistered party.
// lastChecked records research; lastVerified remains null until a value is confirmed.
const pending=(slug,name,entityType,entityId,dataType,sourceKey,notes)=>({
 id:`politics-${slug}`,name,entityType,entityId,dataType,value:null,effectiveFrom:null,effectiveTo:null,
 lastVerified:null,lastChecked:'2026-09-26',freshnessPolicy:'political-status-14',status:'unverified',
 verificationStatus:'pending',source:{...politicsSources[sourceKey],accessedAt:'2026-09-26'},
 notes,confidence:'withheld',module:'politics'
});
const note='वर्तमान सूची/स्थिति का पूरा, संगत सत्यापन उपलब्ध नहीं है। नाम या संख्या रोकी गई है; इसे रिक्ति, शून्य या अमान्यता न समझें।';
export const politicsCurrentRecords=[
 pending('council-of-ministers','मंत्रिपरिषद','politics','council-of-ministers','member-roster','assembly',note),
 pending('speaker','विधानसभा अध्यक्ष','office','speaker','officeholder','assembly',note),
 pending('deputy-speaker','विधानसभा उपाध्यक्ष','politics','deputy-speaker','officeholder','assembly',note),
 pending('opposition-leader','विपक्ष के नेता','politics','opposition-leader','officeholder','assembly',note),
 pending('assembly-members','विधानसभा सदस्य','politics','assembly-members','member-roster','assembly',note),
 pending('council-members','विधान परिषद सदस्य','politics','council-members','member-roster','council',note),
 pending('lok-sabha-members','लोकसभा सदस्य','politics','lok-sabha-members','member-roster','parliament',note),
 pending('rajya-sabha-members','राज्यसभा सदस्य','politics','rajya-sabha-members','member-roster','parliament',note),
 pending('party-representation','वर्तमान दलवार प्रतिनिधित्व','politics','party-representation','party-representation','assembly','2025 की जीती सीटें ऐतिहासिक परिणाम हैं, आज की सदन-संरचना नहीं। वर्तमान संख्या का पुनर्सत्यापन आवश्यक है।'),
 pending('government-formation','वर्तमान सरकार का गठन','politics','government-formation','government-formation','cm',note),
 pending('alliances','वर्तमान गठबंधन','politics','alliances','alliance-status','ceo','पुरानी गठबंधन-सूची वर्तमान सदस्यता या भविष्य के चुनाव का प्रमाण नहीं।'),
 pending('election-notices','चुनाव अधिसूचना और समय-सारणी','politics','election-notices','election-notice','ceo','इस संस्करण में वर्तमान प्रभावी मतदान-सूचना सत्यापित नहीं है। आधिकारिक नोटिस और उसकी तारीख देखें।'),
 pending('local-elections','स्थानीय निर्वाचन और परिसीमन','politics','local-elections','election-notice','secNotice','11 अप्रैल 2026 के प्रपत्र-1 प्रकाशन नोटिस को मतदान कार्यक्रम न समझें। वर्तमान स्थानीय कार्यक्रम/सीमा अलग से सत्यापित नहीं है।'),
 pending('delimitation','वर्तमान निर्वाचन सीमा','politics','delimitation','boundary-status','ceo','निर्देशिका 2019 का स्रोत-आधारित snapshot है। वर्तमान परिसीमन आदेश से समानता का दावा नहीं।'),
 pending('institution-updates','संस्थागत अधिसूचनाएँ','politics','institution-updates','other-current','bihar',note),
 ...parties.map(party=>pending(`party-${party.slug}`,`${party.nameHi} — वर्तमान मान्यता`,'party',party.slug,'party-recognition','partyNotifications','दल की ऐतिहासिक ECI प्रविष्टि नीचे दिनांक सहित दी गई है। वर्तमान पंजीकरण, मान्यता और चिह्न अलग आदेश से पुनर्सत्यापनाधीन हैं।'))
];
