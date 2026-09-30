import {festivalSources} from './profiles.js';

export const seasonLabels={winter:'शीत',spring:'वसंत',summer:'ग्रीष्म',monsoon:'मानसून',autumn:'शरद',moving:'चलता चंद्र कैलेंडर',intercalary:'अधिकमास',scheduled:'घोषणा-आधारित'};
export const monthLabels=['जनवरी','फ़रवरी','मार्च','अप्रैल','मई','जून','जुलाई','अगस्त','सितंबर','अक्टूबर','नवंबर','दिसंबर'];
const card=(title,text)=>({title,text});
const descriptions={
 remembrance:'शांत सामुदायिक आँगन का कल्पित दृश्य — किसी विशेष दरगाह या अनुष्ठान का चित्रण नहीं',
 saraswati:'पुस्तकों और वाद्यों के साथ सरस्वती पूजा का कल्पित दृश्य',
 sankranti:'दही-चूड़ा, गुड़ और तिल की मिठाई का सांकेतिक खाद्य-चित्रण',
 chhath:'नदी-घाट पर उगते सूर्य को अर्घ्य का कल्पित दृश्य',
 'chhath-arghya':'संध्या अर्घ्य का कल्पित नदी-घाट दृश्य',
 'chhath-thekua':'ठेकुआ, फल और बाँस के सूप का सांकेतिक संयोजन',
 holi:'आँगन में रंग और लोकसंगीत के साथ होली का कल्पित दृश्य',
 'sama-chakeva':'मिथिला में मिट्टी के पक्षी बनाती महिलाओं का कल्पित दृश्य',
 sonepur:'ग्रामीण मेला, शिल्प और मंच का कल्पित सांस्कृतिक दृश्य',
 durga:'दुर्गा पूजा के कल्पित पंडाल और मिट्टी की प्रतिमा का दृश्य',
 diwali:'दीपों से सजे घरेलू आँगन का कल्पित दृश्य',
 jitiya:'घरेलू कथा-सभा और पारिवारिक संबंधों का कल्पित दृश्य',
 rajgir:'पहाड़ियों के पास सांस्कृतिक मंच का कल्पित दृश्य',
 islamic:'ईद की मेहमाननवाज़ी से प्रेरित कल्पित भोजन-सज्जा',
 sikh:'सिख सेवा और लंगर से प्रेरित कल्पित सामुदायिक दृश्य',
 christmas:'क्रिसमस कैरल-सभा के लिए सजे कल्पित सामुदायिक कक्ष का दृश्य',
 'buddhist-jain':'वृक्ष, पुष्प और दीप वाला शांत कल्पित आँगन — किसी अनुष्ठान का चित्रण नहीं'
};
export function festivalImage(key){
 const special=key.startsWith('chhath-'),folder=special?'chhath':key,name=special?key:`${key}-hero`;
 return {src:`/images/festivals/${folder}/${name}.webp`,thumbnail:`/images/festivals/${folder}/${name}-small.webp`,alt:`AI चित्रण: ${descriptions[key]}`,caption:descriptions[key],credit:'सम्पूर्ण बिहार · OpenAI image generation',source:'docs/C8-IMAGE-PROMPTS.json',type:'ai-generated',width:1440,height:key==='chhath'?810:960,disclosure:'AI-निर्मित सांकेतिक चित्र; वास्तविक व्यक्ति, स्थल या आयोजन की फ़ोटो नहीं।'};
}
const legacy={
 chhath:{publicSlug:'chhath-puja',imageKey:'chhath',faith:'हिंदू',seasonGroup:'autumn',months:[3,4,10,11],aliases:['छठ','Chhath','छठ पूजा'],relatedFestival:['sama-chakeva','makar-sankranti','sonepur-mela']},
 fagua:{publicSlug:'holi',imageKey:'holi',faith:'हिंदू',seasonGroup:'spring',months:[2,3],aliases:['होली','Holi','Phagua'],relatedFestival:['saraswati-puja','makar-sankranti','bihar-diwas']},
 'sonepur-mela':{imageKey:'sonepur',faith:'हिंदू',collection:'fairs',seasonGroup:'autumn',months:[11,12],aliases:['सोनपुर मेला'],relatedFestival:['chhath','mandar-mela','rajgir-mahotsav']},
 'pitru-paksha':{publicSlug:'pitrapaksha-mela',imageKey:'buddhist-jain',faith:'हिंदू',collection:'fairs',seasonGroup:'autumn',months:[9,10],aliases:['Pitrapaksha Mela','Pitripaksha Mela','पितृपक्ष मेला'],relatedFestival:['chhath','bodh-mahotsav']},
 'sama-chakeva':{imageKey:'sama-chakeva',faith:'हिंदू / लोक',seasonGroup:'autumn',months:[10,11],relatedFestival:['chhath','madhushravani','jitiya']},
 jitiya:{imageKey:'jitiya',faith:'हिंदू / लोक',seasonGroup:'autumn',months:[9,10],aliases:['जितिया','Jitiya'],relatedFestival:['teej','madhushravani','sama-chakeva']},
 madhushravani:{imageKey:'jitiya',faith:'हिंदू / लोक',seasonGroup:'monsoon',months:[7,8],relatedFestival:['teej','sama-chakeva','bihula-bishahari']},
 'bihula-bishahari':{publicSlug:'bihula-bishari',imageKey:'sama-chakeva',faith:'हिंदू / लोक',seasonGroup:'monsoon',months:[7,8,9],aliases:['Bihula Bishari','बिहुला बिषहरी'],relatedFestival:['mandar-mela','madhushravani','sama-chakeva']},
 'makar-sankranti':{imageKey:'chhath-thekua',faith:'हिंदू',seasonGroup:'winter',months:[1],relatedFestival:['mandar-mela','malmas-mela','fagua']}
};

export function enrichFestival(original){
 const addition=legacy[original.slug]||{},x={...original,...addition};
 const imageOverrides={'saraswati-puja':'saraswati',muharram:'remembrance','kako-urs':'remembrance','makar-sankranti':'sankranti','bihula-bishahari':'jitiya'};
 x.imageKey=imageOverrides[x.slug]||x.imageKey;
 const publicSlug=x.publicSlug||x.slug,hero=festivalImage(x.imageKey);
 const oldRoutes={'pitru-paksha':['pitrapaksha','pitripaksha'],'shravani-mela':['shravani']};
 const aliases=[...new Set([x.nameHi,x.nameEn,x.slug,publicSlug,...(original.aliases||[]),...(addition.aliases||[]),...(oldRoutes[x.slug]||[])])];
 const faith=x.faith||(x.religion?.startsWith('हिंदू')?'हिंदू':x.religion?.startsWith('इस्ला')?'इस्लाम':x.religion?.startsWith('जैन')?'जैन':x.religion?.startsWith('बौद्ध')?'बौद्ध':x.religion?.startsWith('सिख')?'सिख':x.religion?.startsWith('ईसाई')?'ईसाई':'सांस्कृतिक / नागरिक');
 const collection=x.collection||(['fair','cultural-fair'].includes(x.festivalType)&&x.slug!=='bihar-diwas'?'fairs':'festivals');
 const result={
  ...x,aliases,publicSlug,faith,collection,hero,
  gallery:[hero],nameHindi:x.nameHi,nameEnglish:x.nameEn,religion:x.religion||x.religions.join(' · '),region:x.culturalRegions,
  description:x.summary,history:x.historicalContext,mythology:x.religiousContext,
  dress:x.dress||'पहनावा परिवार, क्षेत्र और अवसर के अनुसार बदलता है। किसी एक पोशाक को पूरे बिहार का अनिवार्य रूप न मानें।',
  places:x.majorLocations?.length?x.majorLocations:[card(x.culturalRegions.join(' / '),'यह सांस्कृतिक क्षेत्र है, किसी एक आयोजन-स्थल या वर्तमान कार्यक्रम की पुष्टि नहीं।')],
  tourism:x.tourism||['यात्रा से पहले जिला प्रशासन और आयोजक की वर्तमान सूचना देखें। घरेलू अनुष्ठानों, घाटों और पूजा-स्थलों पर तस्वीर तथा रिकॉर्डिंग से पहले अनुमति लें।'],
  dateNotice:x.dateNotice||'यह स्थायी सांस्कृतिक परिचय है। वर्तमान वर्ष की तारीख, प्रवेश, यातायात और कार्यक्रम आयोजक की घोषणा से जाँचें।',
  currentDataKey:x.currentDataKey||x.slug,
  rituals:x.rituals?.length?x.rituals:x.traditions||[],
  crafts:x.crafts?.length?x.crafts:[card('वस्तुएँ और स्थानीय काम','सजावट और घरेलू वस्तुएँ स्थानीय परंपरा के अनुसार बदलती हैं; कोई एक शिल्प इस पूरे अवसर का अनिवार्य प्रतीक नहीं है।')],
  foods:x.foods?.length?x.foods:[card('भोजन का स्थानीय संदर्भ','परिवार, समुदाय और स्थान के अनुसार भोजन बदलता है। उपलब्ध स्रोतों के आधार पर कोई एक सार्वभौमिक उत्सवी व्यंजन निर्धारित नहीं किया गया है।')],
  songs:x.songs?.length?x.songs:[card('गीत और मौखिक परंपरा','स्थानीय पाठ, गीत या कथा का रूप अलग हो सकता है; सभी समुदायों के लिए एक अनिवार्य संगीत-परंपरा का दावा नहीं किया गया है।')],
  contentLanguage:legacy[x.slug]?'hi':'en',
  seo:{...x.seo,canonical:`/festivals/${publicSlug}`}
 };
 if(x.slug==='chhath'){
  result.nameHindi=result.nameHi='छठ पूजा / छठ महापर्व';
  result.gallery=[hero,festivalImage('chhath-arghya'),festivalImage('chhath-thekua')];
  result.history=[...x.historicalContext,'सूर्य-उपासना के प्राचीन साहित्यिक संदर्भ आधुनिक चार-दिवसीय छठ की पूरी विधि का स्वतः प्रमाण नहीं हैं। महाभारत, कर्ण या राम–सीता से जोड़े जाने वाले आख्यान श्रद्धा और लोक-स्मृति हैं; इस पृष्ठ पर कोई अप्रमाणित आरंभ-वर्ष या अविच्छिन्न वैदिक विधि घोषित नहीं की गई है।'];
  result.mythology='छठ में सूर्य को अर्घ्य और छठी मैया के प्रति श्रद्धा साथ दिखाई देते हैं। छठी मैया की पहचान, संतान-कल्याण और संरक्षण से जुड़ी व्याख्याएँ परिवार तथा क्षेत्र के अनुसार भिन्न हैं। धार्मिक विश्वास को ऐतिहासिक तिथि या चिकित्सा-प्रमाण न समझें।';
  result.festivalStages=[
   card('नहाय-खाय · Nahay Khay','स्नान, घर और रसोई की तैयारी तथा व्रती के भोजन से आरंभ। परिवार जल, सामग्री और स्वच्छता की तैयारी में सहयोग करता है; भोजन का विवरण घर के अनुसार बदलता है।'),
   card('खरना · Kharna','दूसरे दिन के उपवास के बाद संध्या में खीर और अन्य प्रसाद का घरेलू संदर्भ मिलता है। परिवार और पड़ोसी प्रसाद साझा करते हैं। यह उपवास करने की स्वास्थ्य-सलाह नहीं है।'),
   card('संध्या अर्घ्य · Sandhya Arghya','तीसरे दिन प्रसाद और सूप लेकर घाट पर पहुँचना, अस्त होते सूर्य को अर्घ्य और सामूहिक गीत प्रमुख दृश्य हैं। घाट से लौटने के बाद कुछ परिवारों में कोसी भरने की परंपरा होती है।'),
   card('उषा अर्घ्य · Usha Arghya','चौथे दिन उगते सूर्य को अर्घ्य के बाद व्रत का समापन और प्रसाद-वितरण होता है। सूर्योदय का समय, घाट और सार्वजनिक व्यवस्था स्थान तथा तारीख पर निर्भर हैं।')
  ];
  result.rituals=[...result.rituals,card('कोसी भरना','कुछ घरों में गन्नों की छतरी के नीचे दीपयुक्त मिट्टी की वस्तुएँ और प्रसाद सजाए जाते हैं। यह पारिवारिक संकल्प से जुड़ा रूप हो सकता है; सभी परिवारों का अनिवार्य चरण नहीं।')];
  result.crafts=[card('बाँस का सूप और दउरा','प्रसाद रखने के सूप, दउरा और टोकरियाँ बाँस-शिल्पियों के काम को उत्सव से जोड़ती हैं। हाथ का श्रम और स्थानीय आपूर्ति इसकी भौतिक संस्कृति का हिस्सा हैं।'),card('मिट्टी के दीप और कोसी','कुम्हारों की मिट्टी की वस्तुएँ और परिवार की सजावट मिलकर घरेलू अनुष्ठान का स्थान बनाते हैं। चित्र में दिखी सजावट को सार्वभौमिक विधि न मानें।')];
  result.songs=[card('लोकगीत और मौखिक स्मृति','घाट, घर, प्रसाद की तैयारी और यात्रा में गीत अनुभव को जोड़ते हैं। गीतों में सूर्य, छठी मैया, बाँस के सूप और परिवार जैसे बिंब मिलते हैं; अलग भाषाओं और गायकों में शब्द व धुन बदलती है।'),card('जीवित गायन और रिकॉर्डिंग','परिवारों में सिखाए गए गीत और आधुनिक रिकॉर्डिंग साथ चलती हैं। यह पृष्ठ copyrighted गीतों के पूरे बोल या अनधिकृत ऑडियो नहीं देता; मौखिक परंपरा का अर्थ हर रिकॉर्डिंग का public-domain होना नहीं है।')];
  result.socialMeaning+=' साझा घाट और सहयोग से व्यापक भागीदारी दिख सकती है, पर इससे सामाजिक या जातिगत असमानताओं के पूरी तरह समाप्त होने का दावा नहीं निकलता।';
  result.tourism=[...result.tourism,'गंगा-घाट के अलावा स्थानीय पोखर, नहर और सामुदायिक जलस्थल भी महत्त्वपूर्ण हैं। स्वच्छता की परंपरा जल की वैज्ञानिक गुणवत्ता या सुरक्षित गहराई की गारंटी नहीं है; स्थानीय प्रतिबंधों का पालन करें।','प्रवासी परिवार नए शहरों में सामुदायिक स्थानों के साथ परंपरा निभाते हैं। वहाँ की तस्वीर को बिहार के किसी वास्तविक घाट की तस्वीर बताना गलत होगा।'];
  result.sources=[...x.sources,festivalSources.chhath].filter((s,i,a)=>a.findIndex(v=>v.url===s.url)===i);
 }
 if(x.slug==='fagua'){
  result.nameHindi=result.nameHi='होली और फगुआ';
  result.mythology='प्रह्लाद और होलिका की कथा होलिका-दहन का धार्मिक संदर्भ है। कृष्ण-संबंधित रंग-परंपराएँ भी मिलती हैं। कथाओं को स्थापित ऐतिहासिक घटनाएँ या सभी गाँवों की एक जैसी व्याख्या न मानें।';
  result.rituals=[card('होलिका दहन','पूर्णिमा के आसपास सामुदायिक अग्नि का धार्मिक संदर्भ मिलता है। स्थान, समय और अग्नि-सुरक्षा की व्यवस्था स्थानीय होती है।'),card('रंग और आपसी सहमति','रंग खेलना, मिलने जाना और समूह-गायन अनेक रूपों में मिलता है। किसी व्यक्ति की सहमति के बिना रंग लगाना उत्सव का अधिकार नहीं है।')];
  result.foods=[card('मालपुआ','मीठे तले पकवान का उत्सवी संदर्भ; सामग्री और परोसने के ढंग अलग हैं।'),card('गुझिया','भरावन वाली मिठाई कई घरों में बनती है; यह केवल बिहार का व्यंजन नहीं।'),card('दही और दही-बड़ा','दही-आधारित व्यंजन घरेलू मेनू का हिस्सा हो सकते हैं।'),card('ठंडाई','मसालेदार दूध का सांस्कृतिक संदर्भ; नशीले पदार्थों को आवश्यक या प्रोत्साहित तत्व नहीं माना गया है।')];
  result.songs=[card('भोजपुरी फगुआ','गाँवों की बैठकी और समूह-गायन में ढोलक, ताल और जवाबी गायन के रूप मिलते हैं। व्यंग्य तथा मौसमी उल्लास को commercial music से अलग समझें।'),card('मैथिली होली','मिथिला में भाषा, धार्मिक बिंब और स्थानीय गायकी रंग-उत्सव को अपना रूप देते हैं। इसे भोजपुरी फगुआ की केवल दूसरी वर्तनी न मानें।'),card('मगही और बदलता ध्वनि-परिदृश्य','मगही क्षेत्र तथा प्रवासी बस्तियों के रूप भी महत्त्वपूर्ण हैं। मंच, रिकॉर्डिंग और घरेलू गायन अलग संदर्भ हैं।')];
  result.sources=[...x.sources,festivalSources.holi];
 }
 if(x.slug==='sama-chakeva')result.culturalContext=[...x.culturalContext,'प्रवासी पक्षियों के आगमन से जुड़ी मौसमी कल्पना मिट्टी के पक्षियों में अभिव्यक्त होती है; यह किसी पक्षी-प्रजाति के वैज्ञानिक प्रवास-आँकड़े का स्रोत नहीं। परंपरा समझने के लिए जीवित पक्षियों को पकड़ना या घोंसलों को छेड़ना आवश्यक नहीं है।'];
 if(x.slug==='bihula-bishahari')result.mythology+=' लोककथा में बिहुला, लखिन्दर, चाँद सौदागर और मनसा के संबंध अलग कथन-परंपराओं में बदलते हैं। साँप-छवियाँ लोककला के बिंब हैं, विष से सुरक्षा या साँप के काटने के उपचार का प्रमाण नहीं।';
 const linkFixes={'/tourism/deo-sun-temple':'/district/aurangabad','/history/magadha':'/history/magadh'};
 for(const key of ['relatedTourism','relatedHistory','majorLocations','places'])result[key]=(result[key]||[]).map(item=>item.to&&linkFixes[item.to]?{...item,to:linkFixes[item.to]}:item);
 result.images={hero:result.hero,gallery:result.gallery};
 return result;
}
