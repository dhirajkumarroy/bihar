import {concepts} from './concepts';
import {legislature} from './legislature';
import {localGovernment} from './localGovernment';
import {parties} from './parties';
import {institutions} from './institutions';
import {elections} from './elections';
import {governments,chiefMinisters} from './governments';
import {politicalHistory,historicalEvents,partyHistory} from './history';
import {alliances} from './alliances';
import {politicalFigures} from './politicalFigures';
import {constituencies} from './constituencies';
import {civicKnowledge,departmentDirectory,serviceTopics} from './governance';
import {makePage,recordSEO} from './model';

const directories=[
 ['institutions','राजनीतिक और सार्वजनिक संस्थाएँ','Political institutions','संवैधानिक, वैधानिक और प्रशासनिक संस्थाओं की भूमिका; पदाधिकारी अलग सत्यापन परत में।',['constitution','bihar']],
 ['parties','बिहार से संबंधित राजनीतिक दल','Political parties in Bihar','राष्ट्रीय, राज्य, RUPP और ऐतिहासिक दलों का चयनित स्रोत-आधारित संग्रह; यह सभी पंजीकृत दलों का पूर्ण रजिस्टर नहीं।',['party2023','rupp']],
 ['parties/compare','दल: तथ्यात्मक तुलना','Factual party comparison','चयनित दलों के दस्तावेज, ऐतिहासिक मान्यता और चुनाव-वर्ष की सीटें साथ पढ़ें; कोई अंक या समग्र विजेता नहीं।',['party2023','result2025']],
 ['party-history','राजनीतिक दलों का इतिहास','Political party history','गठन, विलय और मान्यता की दिनांकित घटनाएँ; दल-प्रकाशित इतिहास और ECI आदेश का अंतर स्पष्ट।',['party2023','jduHistory','rjdHistory']],
 ['history','बिहार का राजनीतिक इतिहास','Political history of Bihar','औपनिवेशिक संस्थाओं से राज्य पुनर्गठन तक, मौजूदा इतिहास संग्रह और दिनांकित अभिलेखों से जुड़ी अध्ययन-राह।',['history','jpStudy','reorganisation']],
 ['chief-ministers','बिहार के मुख्यमंत्री: ऐतिहासिक कार्यकाल','Chief Ministers of Bihar','आधिकारिक विधान सभा सूची से बंद हो चुके कार्यकाल; वर्तमान नाम, दल और कैबिनेट अवधि अलग प्रश्न हैं।',['cmArchive']],
 ['governments','सरकारों और कार्यकालों का अभिलेख','Historical governments and tenures','1952–2026 के बंद मुख्यमंत्री कार्यकालों का स्रोत-आधारित अनुक्रम; हर कैबिनेट या राष्ट्रपति शासन की पूर्ण सूची नहीं।',['cmArchive']],
 ['elections/history','निर्वाचन इतिहास और परिणाम','Election history and results','वर्ष और चुनाव-प्रकार से अभिलेख खोजें; 2025 विधानसभा की सीट-सारणी और अन्य चुनावों के आधिकारिक संग्रह।',['statistics','pastElections','result2025']],
 ['constituencies','निर्वाचन क्षेत्र निर्देशिका','Constituency directory','243 विधानसभा तथा 40 लोकसभा क्षेत्रों का आधिकारिक अभिलेखीय मानचित्रण; 2019 snapshot, वर्तमान प्रतिनिधि नहीं।',['constituencyDistricts','electoralPlan']],
 ['assembly/constituencies','विधानसभा निर्वाचन क्षेत्र','Assembly constituencies','जिला, प्रमंडल, क्रमांक और आरक्षण से 243 विधानसभा क्षेत्रों का 2019-संदर्भ वाला मानचित्रण खोजें।',['constituencyDistricts','electoralPlan']],
 ['alliances','गठबंधन: दिनांकित संदर्भ','Historical political alliances','2025 चुनाव के स्रोत-रिपोर्टेड गठबंधन संदर्भ; पूरी ऐतिहासिक सीट-बँटवारा श्रृंखला अभी संकलित नहीं।',['alliance2025']],
 ['movements','आंदोलन और लोकतांत्रिक परिवर्तन','Political and social movements','चंपारण, छात्र आंदोलन, भूमि-संबंध और राज्य पुनर्गठन को उनके मूल ऐतिहासिक संदर्भ में पढ़ें।',['history','jpStudy','landReform']],
 ['people','राजनीतिक व्यक्तित्व: अभिलेख','Political figures directory','मुख्यमंत्री कार्यकालों और मौजूदा ऐतिहासिक व्यक्तित्व-संग्रह की संदर्भ निर्देशिका; वर्तमान सभी पदाधिकारियों की सूची नहीं।',['cmArchive','history']]
].map(args=>makePage(...args));
export const politicsPages=[...concepts,...legislature,localGovernment,...directories];
export const governanceExpansionPages=[civicKnowledge,
 makePage('departments','बिहार सरकार के विभाग','Bihar government departments','मौजूदा शासन संग्रह के विभाग, उनकी विषयगत भूमिका और दिनांकित आधिकारिक लिंक; संपूर्ण वर्तमान विभाग-सूची नहीं।',['bihar'],[],{route:'/governance/departments'})
];
export const politicsRecords=[...politicsPages,...parties,...institutions,...elections,...governments,...politicalHistory,...historicalEvents,...partyHistory,...alliances,...politicalFigures,...constituencies,...governanceExpansionPages,...departmentDirectory,...serviceTopics];
export const politicsRoutes=[...new Set(politicsRecords.map(record=>record.route.split('#')[0]).filter(route=>route.startsWith('/politics')||route==='/governance/departments'||route==='/governance/civic-knowledge'))];
export const politicsRecordForPath=path=>politicsRecords.find(record=>record.route===path)||null;
export const politicsSearchRecords=politicsRecords.map(record=>({...record,name:record.type==='constituency'?`${record.nameHi} — ${record.chamber==='assembly'?'विधानसभा':'लोकसभा'} क्षेत्र ${record.number}`:record.nameHi,to:record.route,seo:recordSEO(record),category:'राजनीति',aliases:[record.nameHi,...record.aliases,...(record.type==='constituency'?[`${record.nameEn} ${record.chamber==='assembly'?'Vidhan Sabha':'Parliament'}`]:[])]}));
export const politicsNavigation=politicsPages.filter(page=>!['parties/compare','assembly/constituencies','parliament/lok-sabha','parliament/rajya-sabha'].includes(page.slug));
export {parties,institutions,elections,governments,chiefMinisters,politicalHistory,historicalEvents,partyHistory,alliances,politicalFigures,constituencies,departmentDirectory,serviceTopics,civicKnowledge};
