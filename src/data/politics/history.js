import {h7Pages} from '../history/colonial';
import {h8Pages} from '../history/modern';
import {makeRecord} from './model';

const reference=(slug,period,year,sourceIds)=>{
 const page=[...h7Pages,...h8Pages].find(item=>item.slug===slug);
 return makeRecord('history',slug,page.shortTitle,page.englishTitle,page.description,sourceIds,{period,year,evidence:'historical',route:`/history/${slug}`,canonicalEntityRef:`history:${slug}`,sections:page.sections,sources:page.sources,aliases:page.aliases});
};
// Existing history records remain the editorial owners of these narratives.
export const politicalHistory=[
 reference('colonial-bihar','औपनिवेशिक संस्थाएँ',1764,['history']),
 reference('bihar-province-1912','1912 — प्रांतीय पुनर्गठन',1912,['history']),
 reference('champaran-satyagraha','1917 — चंपारण',1917,['history']),
 reference('quit-india-bihar','1942 — भारत छोड़ो',1942,['history']),
 reference('early-post-independence-bihar','1947 के बाद — राज्य निर्माण',1947,['constitution','landReform']),
 reference('land-reforms-bihar','1950 का दशक — भूमि सुधार',1950,['landReform']),
 reference('jp-movement','1974–1977 — छात्र राजनीति और आपातकाल',1974,['jpStudy']),
 reference('social-change-bihar','1980–1990 का दशक — सामाजिक प्रतिनिधित्व',1990,['jpStudy']),
 reference('jharkhand-formation','2000 — राज्य पुनर्गठन',2000,['reorganisation']),
 reference('modern-bihar','2000 के बाद — बदलते संस्थागत संदर्भ',2000,['reorganisation'])
];
export const historicalEvents=[
 makeRecord('event','constitution-1950','संविधान लागू','Constitution takes effect','26 जनवरी 1950 से नया संवैधानिक राज्य ढाँचा प्रभावी हुआ।',['constitution'],{date:'1950-01-26',year:1950,evidence:'historical',route:'/politics/history#constitution-1950'}),
 makeRecord('event','reorganisation-2000','बिहार का पुनर्गठन','Bihar reorganisation','झारखंड के गठन ने बिहार की प्रशासनिक और निर्वाचन भूगोल की सीमा बदली।',['reorganisation'],{date:'2000-11-15',year:2000,evidence:'historical',route:'/politics/history#reorganisation-2000'}),
 makeRecord('event','oath-2024','28 जनवरी 2024 का शपथग्रहण','Oath-taking on 28 January 2024','राजभवन का अभिलेख नीतीश कुमार और मंत्रियों के शपथग्रहण को दर्ज करता है। यह उस दिन की घटना है, वर्तमान सरकार की सूची नहीं।',['oath2024'],{date:'2024-01-28',year:2024,evidence:'historical',route:'/politics/history#oath-2024'}),
 makeRecord('event','assembly-result-2025','2025 विधानसभा परिणाम','Assembly result 2025','2025 के घोषित परिणाम में दलवार जीती सीटों की आधिकारिक सरकारी सारणी चुनाव इतिहास में दी गई है।',['result2025'],{date:'2025-11-14',year:2025,evidence:'historical',route:'/politics/elections/history#assembly-2025'})
];
export const partyHistory=[
 ['inc-formation',1885,null,'कांग्रेस का प्रारंभ','Congress formation',['inc'],'दल के अधिवेशन अभिलेख का आरंभ 1885 से है।',['congressHistory']],
 ['cpim-formation',1964,null,'CPI(M) का गठन','CPI(M) formation',['cpim'],'दल का कार्यक्रम 1964 में गठन का संदर्भ देता है।',['cpimProgramme']],
 ['rjd-formation',1997,'1997-07-05','राजद का गठन','RJD formation',['rjd'],'दल के अपने इतिहास में जनता दल से अलग होकर 5 जुलाई 1997 को गठन दर्ज है।',['rjdHistory']],
 ['jdu-merger',2003,'2003-10-30','जदयू का विलय-संदर्भ','JD(U) merger context',['jdu'],'दल का इतिहास 30 अक्टूबर 2003 को समता पार्टी के विलय का विवरण देता है। यह दल द्वारा प्रकाशित ऐतिहासिक विवरण है।',['jduHistory']],
 ['ljp-symbol',2021,'2021-10-02','LJP नाम और चिह्न का अंतरिम आदेश','LJP interim symbol order',['ljp'],'2023 की ECI अधिसूचना 2021 के नाम/चिह्न freeze आदेश का उल्लेख करती है। बाद की शाखाओं को मूल दल से अलग पहचानें।',['party2023']],
 ['recognition-2023',2023,'2023-05-15','ECI मान्यता अभिलेख','ECI recognition snapshot',['aap','bsp','bjp','cpim','inc','npp','jdu','rjd'],'राष्ट्रीय और राज्य मान्यता की दिनांकित सूची; इसे आज की मान्यता न मानें।',['party2023']]
].map(([slug,year,date,nameHi,nameEn,partyIds,summary,sourceIds])=>makeRecord('party-event',slug,nameHi,nameEn,summary,sourceIds,{year,date,partyIds,evidence:'historical',route:`/politics/party-history#${slug}`}));
