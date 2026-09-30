import {districts} from '../districts';
import {makeRecord} from './model';

// CEO Bihar AssemblyDistrictwise.PDF, cross-checked against SEMP 2019 pp. 7–12.
// Hindi display labels are editorial transliterations; English names follow the source.
// '*' = SC, '#' = ST; an unmarked entry is unreserved in this dated source.
const districtRows=[
 ['west-champaran',1,'Valmiki Nagar|वाल्मीकि नगर;Ramnagar|रामनगर*;Narkatiaganj|नरकटियागंज;Bagaha|बगहा;Lauriya|लौरिया;Nautan|नौतन;Chanpatia|चनपटिया;Bettiah|बेतिया;Sikta|सिकटा'],
 ['east-champaran',10,'Raxaul|रक्सौल;Sugauli|सुगौली;Narkatia|नरकटिया;Harsidhi|हरसिद्धि*;Govindganj|गोविंदगंज;Kesaria|केसरिया;Kalyanpur|कल्याणपुर;Pipra|पिपरा;Madhuban|मधुबन;Motihari|मोतिहारी;Chiraia|चिरैया;Dhaka|ढाका'],
 ['sheohar',22,'Sheohar|शिवहर'],
 ['sitamarhi',23,'Riga|रीगा;Bathnaha|बथनाहा*;Parihar|परिहार;Sursand|सुरसंड;Bajpatti|बाजपट्टी;Sitamarhi|सीतामढ़ी;Runnisaidpur|रुन्नीसैदपुर;Belsand|बेलसंड'],
 ['madhubani',31,'Harlakhi|हरलाखी;Benipatti|बेनीपट्टी;Khajauli|खजौली;Babubarhi|बाबूबरही;Bisfi|बिस्फी;Madhubani|मधुबनी;Rajnagar|राजनगर*;Jhanjharpur|झंझारपुर;Phulparas|फुलपरास;Laukaha|लौकहा'],
 ['supaul',41,'Nirmali|निर्मली;Pipra|पिपरा;Supaul|सुपौल;Triveniganj|त्रिवेणीगंज*;Chhatapur|छातापुर'],
 ['araria',46,'Narpatganj|नरपतगंज;Raniganj|रानीगंज*;Forbesganj|फारबिसगंज;Araria|अररिया;Jokihat|जोकीहाट;Sikti|सिकटी'],
 ['kishanganj',52,'Bahadurganj|बहादुरगंज;Thakurganj|ठाकुरगंज;Kishanganj|किशनगंज;Kochadhaman|कोचाधामन'],
 ['purnia',56,'Amour|अमौर;Baisi|बायसी;Kasba|कसबा;Banmankhi|बनमनखी*;Rupauli|रूपौली;Dhamdaha|धमदाहा;Purnia|पूर्णिया'],
 ['katihar',63,'Katihar|कटिहार;Kadwa|कदवा;Balrampur|बलरामपुर;Pranpur|प्राणपुर;Manihari|मनिहारी#;Barari|बरारी;Korha|कोढ़ा*'],
 ['madhepura',70,'Alamnagar|आलमनगर;Bihariganj|बिहारीगंज;Singheshwar|सिंहेश्वर*;Madhepura|मधेपुरा'],
 ['saharsa',74,'Sonbarsha|सोनबरसा*;Saharsa|सहरसा;Simri Bakhtiarpur|सिमरी बख्तियारपुर;Mahishi|महिषी'],
 ['darbhanga',78,'Kusheshwar Asthan|कुशेश्वरस्थान*;Gaura Bauram|गौड़ा बौराम;Benipur|बेनीपुर;Alinagar|अलीनगर;Darbhanga Rural|दरभंगा ग्रामीण;Darbhanga|दरभंगा;Hayaghat|हायाघाट;Bahadurpur|बहादुरपुर;Keoti|केवटी;Jale|जाले'],
 ['muzaffarpur',88,'Gaighat|गायघाट;Aurai|औराई;Minapur|मीनापुर;Bochaha|बोचहाँ*;Sakra|सकरा*;Kurhani|कुढ़नी;Muzaffarpur|मुजफ्फरपुर;Kanti|कांटी;Baruraj|बरुराज;Paroo|पारू;Sahebganj|साहेबगंज'],
 ['gopalganj',99,'Baikunthpur|बैकुंठपुर;Barauli|बरौली;Gopalganj|गोपालगंज;Kuchaikote|कुचायकोट;Bhorey|भोरे*;Hathua|हथुआ'],
 ['siwan',105,'Siwan|सीवान;Ziradei|जीरादेई;Darauli|दरौली*;Raghunathpur|रघुनाथपुर;Daraundha|दरौंदा;Barharia|बड़हरिया;Goriakothi|गोरेयाकोठी;Maharajganj|महाराजगंज'],
 ['saran',113,'Ekma|एकमा;Manjhi|मांझी;Baniapur|बनियापुर;Taraiya|तरैया;Marhaura|मढ़ौरा;Chapra|छपरा;Garkha|गरखा*;Amnour|अमनौर;Parsa|परसा;Sonepur|सोनपुर'],
 ['vaishali',123,'Hajipur|हाजीपुर;Lalganj|लालगंज;Vaishali|वैशाली;Mahua|महुआ;Raja Pakar|राजापाकर*;Raghopur|राघोपुर;Mahnar|महनार;Patepur|पातेपुर*'],
 ['samastipur',131,'Kalyanpur|कल्याणपुर*;Warisnagar|वारिसनगर;Samastipur|समस्तीपुर;Ujiarpur|उजियारपुर;Morwa|मोरवा;Sarairanjan|सरायरंजन;Mohiuddinnagar|मोहिउद्दीननगर;Bibhutipur|विभूतिपुर;Rosera|रोसड़ा*;Hasanpur|हसनपुर'],
 ['begusarai',141,'Cheria Bariarpur|चेरिया बरियारपुर;Bachhwara|बछवाड़ा;Teghra|तेघड़ा;Matihani|मटिहानी;Sahebpur Kamal|साहेबपुर कमाल;Begusarai|बेगूसराय;Bakhri|बखरी*'],
 ['khagaria',148,'Alauli|अलौली*;Khagaria|खगड़िया;Beldaur|बेलदौर;Parbatta|परबत्ता'],
 ['bhagalpur',152,'Bihpur|बिहपुर;Gopalpur|गोपालपुर;Pirpainti|पीरपैंती*;Kahalgaon|कहलगाँव;Bhagalpur|भागलपुर;Sultanganj|सुल्तानगंज;Nathnagar|नाथनगर'],
 ['banka',159,'Amarpur|अमरपुर;Dhauraiya|धोरैया*;Banka|बाँका;Katoria|कटोरिया#;Belhar|बेलहर'],
 ['munger',164,'Tarapur|तारापुर;Munger|मुंगेर;Jamalpur|जमालपुर'],
 ['lakhisarai',167,'Suryagarha|सूर्यगढ़ा;Lakhisarai|लखीसराय'],
 ['sheikhpura',169,'Sheikhpura|शेखपुरा;Barbigha|बरबीघा'],
 ['nalanda',171,'Asthawan|अस्थावाँ;Biharsharif|बिहारशरीफ;Rajgir|राजगीर*;Islampur|इस्लामपुर;Hilsa|हिलसा;Nalanda|नालंदा;Harnaut|हरनौत'],
 ['patna',178,'Mokama|मोकामा;Barh|बाढ़;Bakhtiarpur|बख्तियारपुर;Digha|दीघा;Bankipur|बाँकीपुर;Kumhrar|कुम्हरार;Patna Sahib|पटना साहिब;Fatuha|फतुहा;Danapur|दानापुर;Maner|मनेर;Phulwari|फुलवारी*;Masaurhi|मसौढ़ी*;Paliganj|पालीगंज;Bikram|बिक्रम'],
 ['bhojpur',192,'Sandesh|संदेश;Barhara|बड़हरा;Arrah|आरा;Agiaon|अगिआँव*;Tarari|तरारी;Jagdishpur|जगदीशपुर;Shahpur|शाहपुर'],
 ['buxar',199,'Brahampur|ब्रह्मपुर;Buxar|बक्सर;Dumraon|डुमराँव;Rajpur|राजपुर*'],
 ['kaimur',203,'Ramgarh|रामगढ़;Mohania|मोहनिया*;Bhabua|भभुआ;Chainpur|चैनपुर'],
 ['rohtas',207,'Chenari|चेनारी*;Sasaram|सासाराम;Kargahar|करगहर;Dinara|दिनारा;Nokha|नोखा;Dehri|डेहरी;Karakat|काराकाट'],
 ['arwal',214,'Arwal|अरवल;Kurtha|कुर्था'],
 ['jehanabad',216,'Jehanabad|जहानाबाद;Ghosi|घोसी;Makhdumpur|मखदुमपुर*'],
 ['aurangabad',219,'Goh|गोह;Obra|ओबरा;Nabinagar|नबीनगर;Kutumba|कुटुंबा*;Aurangabad|औरंगाबाद;Rafiganj|रफीगंज'],
 ['gaya',225,'Gurua|गुरुआ;Sherghati|शेरघाटी;Imamganj|इमामगंज*;Barachatti|बाराचट्टी*;Bodh Gaya|बोधगया*;Gaya Town|गया नगर;Tikari|टिकारी;Belaganj|बेलागंज;Atri|अत्री;Wazirganj|वजीरगंज'],
 ['nawada',235,'Rajauli|रजौली*;Hisua|हिसुआ;Nawada|नवादा;Gobindpur|गोविंदपुर;Warsaliganj|वारिसलीगंज'],
 ['jamui',240,'Sikandra|सिकंदरा*;Jamui|जमुई;Jhajha|झाझा;Chakai|चकाई']
];
const pcRows=[
 [1,'Valmiki Nagar','वाल्मीकि नगर',[1,2,3,4,5,9]], [2,'Paschim Champaran','पश्चिम चंपारण',[6,7,8,10,11,12]],
 [3,'Purvi Champaran','पूर्वी चंपारण',[13,14,15,16,17,19]], [4,'Sheohar','शिवहर',[18,20,21,22,23,30]],
 [5,'Sitamarhi','सीतामढ़ी',[24,25,26,27,28,29]], [6,'Madhubani','मधुबनी',[31,32,35,36,86,87]],
 [7,'Jhanjharpur','झंझारपुर',[33,34,37,38,39,40]], [8,'Supaul','सुपौल',[41,42,43,44,45,72]],
 [9,'Araria','अररिया',[46,47,48,49,50,51]], [10,'Kishanganj','किशनगंज',[52,53,54,55,56,57]],
 [11,'Katihar','कटिहार',[63,64,65,66,67,68]], [12,'Purnia','पूर्णिया',[58,59,60,61,62,69]],
 [13,'Madhepura','मधेपुरा',[70,71,73,74,75,77]], [14,'Darbhanga','दरभंगा',[79,80,81,82,83,85]],
 [15,'Muzaffarpur','मुजफ्फरपुर',[88,89,91,92,93,94]], [16,'Vaishali','वैशाली',[90,95,96,97,98,125]],
 [17,'Gopalganj','गोपालगंज',[99,100,101,102,103,104],'SC'], [18,'Siwan','सीवान',[105,106,107,108,109,110]],
 [19,'Maharajganj','महाराजगंज',[111,112,113,114,115,116]], [20,'Saran','सारण',[117,118,119,120,121,122]],
 [21,'Hajipur','हाजीपुर',[123,124,126,127,128,129],'SC'], [22,'Ujiarpur','उजियारपुर',[130,134,135,136,137,138]],
 [23,'Samastipur','समस्तीपुर',[78,84,131,132,133,139],'SC'], [24,'Begusarai','बेगूसराय',[141,142,143,144,145,146,147]],
 [25,'Khagaria','खगड़िया',[76,140,148,149,150,151]], [26,'Bhagalpur','भागलपुर',[152,153,154,155,156,158]],
 [27,'Banka','बाँका',[157,159,160,161,162,163]], [28,'Munger','मुंगेर',[165,166,167,168,178,179]],
 [29,'Nalanda','नालंदा',[171,172,173,174,175,176,177]], [30,'Patna Sahib','पटना साहिब',[180,181,182,183,184,185]],
 [31,'Pataliputra','पाटलिपुत्र',[186,187,188,189,190,191]], [32,'Arrah','आरा',[192,193,194,195,196,197,198]],
 [33,'Buxar','बक्सर',[199,200,201,202,203,210]], [34,'Sasaram','सासाराम',[204,205,206,207,208,209],'SC'],
 [35,'Karakat','काराकाट',[211,212,213,219,220,221]], [36,'Jahanabad','जहानाबाद',[214,215,216,217,218,233]],
 [37,'Aurangabad','औरंगाबाद',[222,223,224,225,227,231]], [38,'Gaya','गया',[226,228,229,230,232,234],'SC'],
 [39,'Nawada','नवादा',[170,235,236,237,238,239]], [40,'Jamui','जमुई',[164,169,240,241,242,243],'SC']
];
const boundary={effectiveFrom:null,effectiveTo:null,dataYear:2019,status:'historical-snapshot',note:'2019 के आधिकारिक अभिलेख का मानचित्रण। परिसीमन के बाद सीमाएँ बदल सकती हैं। वर्तमान प्रतिनिधि या वर्तमान सीमा की पुष्टि नहीं।'};
export const assemblyConstituencies=districtRows.flatMap(([districtId,start,rows])=>rows.split(';').map((entry,index)=>{
 const [nameEn,marked]=entry.split('|'),nameHi=marked.replace(/[*#]/g,''),number=start+index,reservation=marked.endsWith('*')?'SC':marked.endsWith('#')?'ST':'unreserved',district=districts.find(item=>item.slug===districtId),pc=pcRows.find(row=>row[3].includes(number));
 return makeRecord('constituency',`ac-${number}`,nameHi,nameEn,`${nameHi} विधानसभा क्षेत्र क्रमांक ${number} — ${district.nameHindi} जिला; 2019 के संसदीय मानचित्रण का संदर्भ।`,['constituencyDistricts','electoralPlan'],{route:`/politics/constituencies/ac-${number}`,evidence:'historical',number,chamber:'assembly',districtIds:[districtId],divisionNames:[district.division],parliamentaryId:`pc-${pc[0]}`,reservation,boundary,aliases:[`AC ${number}`,`${number}`,`${nameEn} Assembly`],currentDataRef:'politics-assembly-members'});
}));
export const parliamentaryConstituencies=pcRows.map(([number,nameEn,nameHi,segments,reservation='unreserved'])=>{
 const districtIds=[...new Set(assemblyConstituencies.filter(item=>segments.includes(item.number)).flatMap(item=>item.districtIds))];
 return makeRecord('constituency',`pc-${number}`,nameHi,nameEn,`${nameHi} लोकसभा क्षेत्र क्रमांक ${number} — ${segments.length} विधानसभा खंड; 2019 आधिकारिक मानचित्रण।`,['electoralPlan'],{route:`/politics/constituencies/pc-${number}`,evidence:'historical',number,chamber:'lokSabha',assemblyIds:segments.map(id=>`ac-${id}`),districtIds,divisionNames:[...new Set(districtIds.map(id=>districts.find(item=>item.slug===id).division))],reservation,boundary,aliases:[`PC ${number}`,`${number}`,`${nameEn} Lok Sabha`],currentDataRef:'politics-lok-sabha-members'});
});
export const constituencies=[...assemblyConstituencies,...parliamentaryConstituencies];
export const constituencyBySlug=slug=>constituencies.find(item=>item.slug===slug)||null;
