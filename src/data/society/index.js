const censusUrl='https://censusindia.gov.in/nada/index.php/catalog/6191';
const biharStatsUrl='https://e-statistics.bihar.gov.in/';
const nfhsUrl='https://www.mohfw.gov.in/sites/default/files/NFHS-5_Phase-I.pdf';
const udiseUrl='https://dsel.education.gov.in/sites/default/files/statistics/report_in_PDF/udise_report_existing_23_24.pdf';
const source=(id,title,publisher,url,reportName,edition,referencePeriod,publicationYear)=>({id,title,publisher,url,reportName,edition,referencePeriod,publicationYear});

export const societySources={
 census:source('census-pca','Primary Census Abstract, India and States/UTs — 2011','Office of the Registrar General & Census Commissioner, India',censusUrl,'Primary Census Abstract','Census 2011','2011',2011),
 bihar:source('bihar-estats','Bihar e-Statistics — Demography and Literacy','Directorate of Economics and Statistics, Government of Bihar',biharStatsUrl,'Bihar e-Statistics','live portal; Census layer','Census 2011',2026),
 ruralUrban:source('rural-urban','Bihar at a Glance 2016 — Demography','Directorate of Economics and Statistics, Government of Bihar','https://dse.bihar.gov.in/New-Publications/Bihar%20At%20A%20Glance-2016.pdf','Bihar at a Glance','2016','Census 2011',2016),
 migration:source('census-d05','D-05: Migrants by place of last residence — Bihar','Office of the Registrar General & Census Commissioner, India','https://censusindia.gov.in/nada/index.php/catalog/11035','Census migration table D-05','Census 2011','2011',2021),
 udise:source('udise-2023-24','UDISE+ Report 2023–24 — Existing Structure','Department of School Education & Literacy, Ministry of Education',udiseUrl,'Unified District Information System for Education Plus','Final 2023–24','Academic year 2023–24',2024),
 aishe:source('aishe','All India Survey on Higher Education','Department of Higher Education, Ministry of Education','https://aishe.gov.in/','AISHE','official portal','Survey-specific academic year',2026),
 nfhs:source('nfhs-5-bihar','National Family Health Survey 5 — Bihar Fact Sheet','Ministry of Health & Family Welfare',nfhsUrl,'NFHS-5 State Fact Sheet: Bihar','Round 5','2019–20',2020),
 rhs:source('rhs','Rural Health Statistics 2020–21','Ministry of Health & Family Welfare','https://www.mohfw.gov.in/sites/default/files/rhs20-21_1.pdf','Rural Health Statistics','2020–21','As on 31 March 2021',2022),
 srs:source('srs','Sample Registration System statistical reports','Office of the Registrar General, India','https://censusindia.gov.in/census.website/data/SRSSTAT','Sample Registration System','report-specific','Annual / bulletin-specific',2026),
 niti:source('niti-sdg','SDG India Index','NITI Aayog','https://sdgindiaindex.niti.gov.in/','SDG India Index','dashboard','Edition-specific',2026)
};

const censusStat=(id,metric,value,unit,notes,sourceRef=societySources.census)=>({id,metric,value,unit,year:'2011',censusYear:2011,geographyLevel:'state',geographyId:'bihar',source:sourceRef.title,sourceUrl:sourceRef.url,status:'official-census',notes});

export const populationStatistics=[
 censusStat('population-total','कुल जनसंख्या',104099452,'व्यक्ति','Final Census 2011 count; इसे वर्तमान जनसंख्या न मानें।'),
 censusStat('population-density','जनसंख्या घनत्व',1106,'व्यक्ति प्रति वर्ग किमी','2011 की जनसंख्या और Census area basis पर।',societySources.bihar),
 censusStat('population-growth','दशकीय जनसंख्या वृद्धि',25.42,'प्रतिशत','2001 से 2011 के बीच प्रतिशत परिवर्तन।',societySources.bihar),
 censusStat('population-rural','ग्रामीण जनसंख्या',92341436,'व्यक्ति','Census 2011 rural classification।',societySources.ruralUrban),
 censusStat('population-urban','शहरी जनसंख्या',11758016,'व्यक्ति','Census 2011 urban classification।',societySources.ruralUrban),
 censusStat('rural-share','ग्रामीण आबादी का हिस्सा',88.7,'प्रतिशत','कुल Census 2011 population में rural share।',societySources.ruralUrban),
 censusStat('urban-share','शहरीकरण दर',11.3,'प्रतिशत','कुल Census 2011 population में urban share; 2026 rate नहीं।',societySources.ruralUrban),
 censusStat('sex-ratio','लिंग अनुपात',918,'महिलाएँ प्रति 1,000 पुरुष','कुल population का Census 2011 sex ratio।',societySources.bihar),
 censusStat('literacy-total','साक्षरता दर — कुल',61.8,'प्रतिशत','7 वर्ष और अधिक आयु की population; Census definition।',societySources.bihar),
 censusStat('literacy-male','साक्षरता दर — पुरुष',71.2,'प्रतिशत','7 वर्ष और अधिक आयु; Census 2011।',societySources.bihar),
 censusStat('literacy-female','साक्षरता दर — महिला',51.5,'प्रतिशत','7 वर्ष और अधिक आयु; Census 2011।',societySources.bihar)
];

export const demographicConcepts=[
 ['population','जनसंख्या','Population','किसी निश्चित reference date और boundary में गिने गए व्यक्तियों की संख्या।','Census count को projection या आज की live संख्या न मानें।'],
 ['density','जनसंख्या घनत्व','Population density','Population ÷ area; सामान्यतः व्यक्ति प्रति वर्ग किलोमीटर।','समान density से समान settlement pattern सिद्ध नहीं होता।'],
 ['growth','जनसंख्या वृद्धि','Population growth','दो census dates के बीच population का परिवर्तन।','Decadal growth annual growth rate नहीं है।'],
 ['sex-ratio','लिंग अनुपात','Sex ratio','प्रति 1,000 पुरुषों पर महिलाओं की संख्या।','यह gender equality का अकेला माप नहीं है।'],
 ['child-sex-ratio','बाल लिंग अनुपात','Child sex ratio','0–6 आयु वर्ग में प्रति 1,000 बालकों पर बालिकाएँ।','कुल sex ratio से अलग denominator और age group है।'],
 ['literacy','साक्षरता','Literacy','Census में 7+ आयु का व्यक्ति जो समझ के साथ पढ़ और लिख सकता है।','School enrolment या learning outcome के समान नहीं।'],
 ['urbanization','शहरीकरण','Urbanization','कुल population में urban-classified population का हिस्सा।','Municipal boundary expansion से classification बदल सकती है।'],
 ['household','परिवार/गृहस्थी','Household','एक सामान्य kitchen से भोजन लेने वाले लोगों की Census इकाई।','Household और dwelling/house एक ही वस्तु नहीं।']
].map(([id,nameHi,nameEn,definition,guardrail])=>({id,slug:id,nameHi,nameEn,aliases:[nameEn,nameHi],definition,guardrail,source:societySources.census,seo:{canonical:`/society/${id}`,title:`${nameHi} — बिहार समाज`,description:`${nameHi} की Census-aware व्याख्या और सीमाएँ।`}}));

export const settlementTypes=[
 ['village','गाँव','Village','Census rural settlement unit; administrative और revenue definitions संदर्भ के अनुसार बदल सकती हैं।'],
 ['census-town','जनगणना नगर','Census Town','Census criteria से urban classified settlement, भले statutory urban body न हो।'],
 ['statutory-town','वैधानिक नगर','Statutory Town','कानून के तहत नगरपालिका, नगर परिषद, नगर पंचायत या corporation वाला क्षेत्र।'],
 ['municipality','नगरपालिका','Municipality','राज्य municipal law के अधीन urban local body; category समय के साथ बदल सकती है।'],
 ['municipal-corporation','नगर निगम','Municipal Corporation','बड़े urban local body का statutory form; current status dated source से जाँचें।'],
 ['urban-agglomeration','शहरी समूह','Urban Agglomeration','Census continuity criteria से जुड़ा town और adjoining outgrowths का urban spread।']
].map(([id,nameHi,nameEn,definition])=>({id,nameHi,nameEn,definition,source:societySources.census}));

export const urbanProfileRefs=[
 ['patna','पटना','patna','राजधानी, प्रशासन, उच्च शिक्षा, स्वास्थ्य और services का प्रमुख node।'],
 ['gaya','गया','gaya','regional services, pilgrimage, education और transport का मिश्रित centre।'],
 ['muzaffarpur','मुजफ्फरपुर','muzaffarpur','उत्तर बिहार का trade, education, health और horticulture-linked centre।'],
 ['bhagalpur','भागलपुर','bhagalpur','पूर्वी बिहार का silk, trade, health और education node।'],
 ['darbhanga','दरभंगा','darbhanga','मिथिला का regional education, health, trade और connectivity centre।'],
 ['bihar-sharif','बिहार शरीफ','nalanda','Nalanda district का urban service और market centre।'],
 ['purnia','पूर्णिया','purnia','सीमांचल का regional trade, education और health centre।'],
 ['begusarai','बेगूसराय–बरौनी','begusarai','industry, energy और logistics से जुड़ा urban-industrial corridor।']
].map(([id,nameHi,district,summary])=>({id,nameHi,district,summary,canonicalEconomyRef:`/economy/urban#${id}`,districtRef:`/district/${district}`}));

export const migrationConcepts=[
 ['in-migration','अंतः-प्रवास','In-migration','किसी क्षेत्र में दूसरी जगह से निवास बदलकर आना।'],
 ['out-migration','बहिर्प्रवास','Out-migration','किसी क्षेत्र से दूसरी जगह निवास बदलकर जाना।'],
 ['seasonal-migration','मौसमी प्रवासन','Seasonal migration','मौसम या काम के चक्र से जुड़ी अस्थायी mobility।'],
 ['return-migration','वापसी प्रवासन','Return migration','पूर्व निवास/मूल क्षेत्र की ओर लौटना।'],
 ['circulation','परिचक्र प्रवासन','Circular migration','दो या अधिक स्थानों के बीच बार-बार की mobility, जो permanent move नहीं भी हो सकती।']
].map(([id,nameHi,nameEn,definition])=>({id,nameHi,nameEn,definition,source:societySources.migration}));

export const educationLevels=[
 {id:'school',nameHi:'विद्यालयी शिक्षा',nameEn:'School education',scope:'Pre-primary से higher secondary; UDISE+ academic-year records।'},
 {id:'higher',nameHi:'उच्च शिक्षा',nameEn:'Higher education',scope:'College, university और standalone institutions; AISHE reference year।'},
 {id:'technical',nameHi:'तकनीकी शिक्षा',nameEn:'Technical education',scope:'Engineering, polytechnic और professional education; regulator/source specific।'},
 {id:'vocational',nameHi:'व्यावसायिक शिक्षा',nameEn:'Vocational education',scope:'Skills और occupation-oriented programmes; programme definition आवश्यक।'}
];

const educationStat=(id,metric,value,level,definition)=>({id,metric,value,unit:'प्रतिशत',year:'2023–24',academicYear:'2023–24',level,definition,geographyLevel:'state',geographyId:'bihar',source:societySources.udise.title,sourceUrl:societySources.udise.url,status:'official-survey',notes:'UDISE+ school administrative returns; 2022–23 onward methodology change के कारण older series से strict comparability सीमित है।'});
export const educationIndicators=[
 educationStat('dropout-primary','Dropout rate — Primary',8.9,'Primary','एक academic year में identified grade cohort से बाहर हुए pupils का UDISE+ indicator।'),
 educationStat('dropout-upper-primary','Dropout rate — Upper Primary',25.9,'Upper Primary','Upper-primary level के लिए UDISE+ published dropout rate।'),
 educationStat('dropout-secondary','Dropout rate — Secondary',25.6,'Secondary','Secondary level के लिए UDISE+ published dropout rate।'),
 {id:'literacy-census',metric:'साक्षरता दर',value:61.8,unit:'प्रतिशत',year:'2011',academicYear:'लागू नहीं — Census reference year 2011',level:'Population age 7+',definition:'समझ के साथ पढ़ और लिख सकने वाली 7+ population का share।',geographyLevel:'state',geographyId:'bihar',source:societySources.bihar.title,sourceUrl:societySources.bihar.url,status:'official-census',censusYear:2011,notes:'Literacy education-system enrolment या learning outcome नहीं है।'}
];

export const educationIndicatorConcepts=[
 ['ger','सकल नामांकन अनुपात','Gross Enrolment Ratio','किसी level पर enrolled learners, आयु की परवाह किए बिना, उस level की official-age population के प्रतिशत के रूप में।'],
 ['ner','शुद्ध नामांकन अनुपात','Net Enrolment Ratio','किसी level की official age group में enrolled उसी age group का प्रतिशत।'],
 ['ptr','छात्र–शिक्षक अनुपात','Pupil Teacher Ratio','Enrolment को teachers की संख्या से भाग देकर बना system-level ratio।'],
 ['dropout','Dropout rate','Dropout Rate','निर्धारित cohort और methodology के अनुसार education cycle छोड़ने का अनुपात।']
].map(([id,nameHi,nameEn,definition])=>({id,nameHi,nameEn,definition,source:societySources.udise}));

export const healthSystemLevels=[
 ['sub-centre','Sub Centre','Community-facing primary care outpost।'],
 ['health-wellness-centre','Health & Wellness Centre','Comprehensive primary care transition; status programme/date specific।'],
 ['phc','Primary Health Centre','Primary medical and public-health facility level।'],
 ['chc','Community Health Centre','Referral and wider service facility above PHC level।'],
 ['sub-divisional-hospital','Sub-Divisional Hospital','Sub-division level hospital/referral facility।'],
 ['district-hospital','District Hospital','District-level secondary care and referral institution।'],
 ['medical-college','Medical College / Hospital','Teaching, tertiary care and specialist services institution।']
].map(([id,name,role])=>({id,name,role,source:societySources.rhs}));

const healthStat=(id,metric,value,definition)=>({id,metric,value,unit:'प्रतिशत',year:'2019–20',referencePeriod:'NFHS-5 Bihar fieldwork, 2019–20',definition,geographyLevel:'state',geographyId:'bihar',source:societySources.nfhs.title,sourceUrl:societySources.nfhs.url,status:'official-survey',notes:'Household survey estimate; denominator and footnote must accompany comparison।'});
export const healthIndicators=[
 healthStat('institutional-births','संस्थागत प्रसव',76.2,'Survey से पहले 5 वर्षों में हुए births में institution में हुए births का share।'),
 healthStat('full-vaccination','पूर्ण टीकाकरण',71.0,'12–23 माह के बच्चों में card या mother recall के आधार पर full vaccination का share।'),
 healthStat('child-stunting','5 वर्ष से कम बच्चों में stunting',42.9,'WHO standard के height-for-age में −2 SD से नीचे बच्चों का share।'),
 healthStat('child-underweight','5 वर्ष से कम बच्चों में underweight',41.0,'WHO standard के weight-for-age में −2 SD से नीचे बच्चों का share।')
];

export const mortalityConcepts=[
 {id:'imr',name:'Infant Mortality Rate (IMR)',unit:'प्रति 1,000 जीवित जन्म',referencePeriod:'आम तौर पर निर्दिष्ट calendar year',definition:'एक वर्ष से कम आयु में deaths, प्रति 1,000 live births।',source:societySources.srs},
 {id:'mmr',name:'Maternal Mortality Ratio (MMR)',unit:'प्रति 100,000 जीवित जन्म',referencePeriod:'SRS special bulletin में प्रायः तीन-वर्षीय period',definition:'Maternal deaths, प्रति 100,000 live births; इसे rate कहकर denominator न बदलें।',source:societySources.srs}
];

export const humanDevelopmentDimensions=[
 ['health','स्वास्थ्य','जीवन, nutrition, prevention, care access और outcomes।'],
 ['education','शिक्षा','Literacy, participation, attainment, learning और skills अलग माप हैं।'],
 ['income','आय और आजीविका','Average output, household resources और job quality अलग layers हैं।'],
 ['infrastructure','सामाजिक अवसंरचना','Schools, health facilities, water, sanitation और connectivity की उपलब्धता।'],
 ['gender','लैंगिक समानता','Access और outcomes में gender gaps; aggregate averages से भीतर का अंतर छिप सकता है।'],
 ['spatial','क्षेत्रीय असमानता','District, rural–urban और settlement differences; ranking से अधिक context जरूरी।']
].map(([id,name,description])=>({id,name,description,source:societySources.niti}));

export const districtDemographicRefs=[
 ['patna','पटना','राजधानी और बड़ा urban-service concentration; district record पर Census year देखें।'],
 ['west-champaran','पश्चिम चंपारण','विस्तृत rural और forest-edge landscape वाला border district।'],
 ['kishanganj','किशनगंज','सीमांचल और अंतरराज्यीय/अंतरराष्ट्रीय border context वाला district।'],
 ['darbhanga','दरभंगा','मिथिला का regional urban, education और health node।'],
 ['gaya','गया','rural hinterland और major urban/pilgrimage centre वाला mixed district।'],
 ['purnia','पूर्णिया','सीमांचल का regional service और migration-linked centre।']
].map(([slug,nameHi,context])=>({id:`district-society-${slug}`,slug,nameHi,context,to:`/district/${slug}`,dataRule:'Population figure district page पर जनगणना 2011 badge के साथ canonical है।'}));

export const societySections=[
 {id:'population',nameHi:'जनसंख्या',nameEn:'Population',to:'/society/population',summary:'Count, density, growth, sex ratio और literacy को सही denominator के साथ पढ़ें।'},
 {id:'urbanization',nameHi:'शहरीकरण',nameEn:'Urbanization',to:'/society/urbanization',summary:'Rural–urban share, settlement types और city systems।'},
 {id:'migration',nameHi:'प्रवासन',nameEn:'Migration',to:'/society/migration',summary:'In-, out-, seasonal, return और circular migration का neutral framework।'},
 {id:'education',nameHi:'शिक्षा',nameEn:'Education',to:'/society/education',summary:'Literacy, enrolment, school levels और higher education sources।'},
 {id:'health',nameHi:'स्वास्थ्य',nameEn:'Health',to:'/society/health',summary:'Health-system hierarchy, survey indicators और unit discipline।'},
 {id:'human-development',nameHi:'मानव विकास',nameEn:'Human Development',to:'/society/human-development',summary:'Health, education, income, infrastructure और inequality को साथ पढ़ें।'}
];

export const societySearchRecords=[
 ...societySections.map(x=>({id:`society-${x.id}`,name:x.nameHi,to:x.to,category:'समाज',aliases:[x.nameEn],summary:x.summary})),
 ...demographicConcepts.map(x=>({id:`demography-${x.id}`,name:x.nameHi,to:x.seo.canonical,category:'जनांकिकी अवधारणा',aliases:[x.nameEn,...x.aliases],summary:x.definition})),
 ...migrationConcepts.map(x=>({id:`migration-${x.id}`,name:x.nameHi,to:'/society/migration',category:'प्रवासन',aliases:[x.nameEn],summary:x.definition})),
 ...educationIndicatorConcepts.map(x=>({id:`education-${x.id}`,name:x.nameHi,to:'/society/education',category:'शिक्षा संकेतक',aliases:[x.nameEn,x.id.toUpperCase()],summary:x.definition})),
 ...mortalityConcepts.map(x=>({id:`health-${x.id}`,name:x.name,to:'/society/health',category:'स्वास्थ्य संकेतक',aliases:[x.id.toUpperCase()],summary:x.definition})),
 {id:'census-2011',name:'जनगणना 2011',to:'/society/population',category:'आधिकारिक डेटा',aliases:['Census 2011','Population Census'],summary:'Bihar population, density, literacy और rural–urban baseline।'},
 {id:'sex-ratio-search',name:'लिंग अनुपात',to:'/society/population',category:'जनांकिकी',aliases:['Sex ratio'],summary:'प्रति 1,000 पुरुष महिलाओं की संख्या।'}
];

export const demographicConceptBySlug=slug=>demographicConcepts.find(x=>x.slug===slug||x.aliases.some(a=>a.toLowerCase().replace(/[^a-z0-9\u0900-\u097f]+/g,'-').replace(/^-|-$/g,'')===slug));
