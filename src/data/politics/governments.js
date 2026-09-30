import {makeRecord} from './model';

const names={
 'shri-krishna-singh':['श्रीकृष्ण सिंह','Shri Krishna Singh'], 'deep-narayan-singh':['दीप नारायण सिंह','Deep Narayan Singh'],
 'binodanand-jha':['विनोदानंद झा','Binodanand Jha'], 'krishna-ballabh-sahay':['कृष्ण बल्लभ सहाय','Krishna Ballabh Sahay'],
 'mahamaya-prasad-sinha':['महामाया प्रसाद सिन्हा','Mahamaya Prasad Sinha'], 'satish-prasad-singh':['सतीश प्रसाद सिंह','Satish Prasad Singh'],
 'bindeshwari-prasad-mandal':['बिंदेश्वरी प्रसाद मंडल','Bindeshwari Prasad Mandal'], 'bhola-paswan-shastri':['भोला पासवान शास्त्री','Bhola Paswan Shastri'],
 'harihar-singh':['हरिहर सिंह','Harihar Singh'], 'daroga-prasad-rai':['दरोगा प्रसाद राय','Daroga Prasad Rai'],
 'karpoori-thakur':['कर्पूरी ठाकुर','Karpoori Thakur'], 'kedar-pandey':['केदार पांडेय','Kedar Pandey'],
 'abdul-gafoor':['अब्दुल गफूर','Abdul Gafoor'], 'jagannath-mishra':['जगन्नाथ मिश्र','Jagannath Mishra'],
 'ram-sundar-das':['रामसुंदर दास','Ram Sundar Das'], 'chandrashekhar-singh':['चंद्रशेखर सिंह','Chandrashekhar Singh'],
 'bindeshwari-dubey':['बिंदेश्वरी दुबे','Bindeshwari Dubey'], 'bhagwat-jha-azad':['भागवत झा आजाद','Bhagwat Jha Azad'],
 'satyendra-narayan-singh':['सत्येंद्र नारायण सिंह','Satyendra Narayan Singh'], 'lalu-prasad':['लालू प्रसाद','Lalu Prasad'],
 'rabri-devi':['राबड़ी देवी','Rabri Devi'], 'nitish-kumar':['नीतीश कुमार','Nitish Kumar'],
 'jitan-ram-manjhi':['जीतन राम मांझी','Jitan Ram Manjhi']
};
// Closed intervals transcribed from the Assembly archive, not an inferred cabinet list.
const rows=[
 ['shri-krishna-singh','1952-04-29','1961-01-31'],['deep-narayan-singh','1961-02-01','1961-02-18'],
 ['binodanand-jha','1961-02-18','1963-10-02'],['krishna-ballabh-sahay','1963-10-02','1967-03-05'],
 ['mahamaya-prasad-sinha','1967-03-05','1968-01-28'],['satish-prasad-singh','1968-01-28','1968-02-01'],
 ['bindeshwari-prasad-mandal','1968-02-01','1968-03-22'],['bhola-paswan-shastri','1968-03-22','1968-06-29'],
 ['harihar-singh','1969-02-26','1969-06-22'],['bhola-paswan-shastri','1969-06-22','1969-07-04'],
 ['daroga-prasad-rai','1970-02-16','1970-12-22'],['karpoori-thakur','1970-12-22','1971-06-02'],
 ['bhola-paswan-shastri','1971-06-02','1972-01-09'],['kedar-pandey','1972-03-19','1973-07-02'],
 ['abdul-gafoor','1973-07-02','1975-04-11'],['jagannath-mishra','1975-04-11','1977-04-30'],
 ['karpoori-thakur','1977-06-24','1979-04-21'],['ram-sundar-das','1979-04-21','1980-02-17'],
 ['jagannath-mishra','1980-06-08','1983-08-14'],['chandrashekhar-singh','1983-08-14','1985-03-12'],
 ['bindeshwari-dubey','1985-03-12','1988-02-13'],['bhagwat-jha-azad','1988-02-14','1989-03-10'],
 ['satyendra-narayan-singh','1989-03-11','1989-12-06'],['jagannath-mishra','1989-12-06','1990-03-10'],
 ['lalu-prasad','1990-03-10','1995-04-03'],['lalu-prasad','1995-04-04','1997-07-25'],
 ['rabri-devi','1997-07-25','1999-02-11'],['rabri-devi','1999-03-09','2000-03-02'],
 ['nitish-kumar','2000-03-03','2000-03-10'],['rabri-devi','2000-03-11','2005-03-06'],
 ['nitish-kumar','2005-11-24','2010-11-25'],['nitish-kumar','2010-11-26','2014-05-19'],
 ['jitan-ram-manjhi','2014-05-20','2015-02-22'],['nitish-kumar','2015-02-22','2015-11-19'],
 ['nitish-kumar','2015-11-20','2017-07-26'],['nitish-kumar','2017-07-27','2020-11-12'],
 ['nitish-kumar','2020-11-16','2022-08-09'],['nitish-kumar','2022-08-10','2024-01-28'],
 ['nitish-kumar','2024-01-28','2026-04-14']
];
export const governments=rows.map(([personId,start,end])=>makeRecord('government',`${personId}-${start}`,`${names[personId][0]} — ${start.slice(0,4)}`,`${names[personId][1]} tenure ${start}`,`विधान सभा के ऐतिहासिक अभिलेख में ${start} से ${end} तक दर्ज मुख्यमंत्री कार्यकाल।`,['cmArchive'],{route:`/politics/governments#${personId}-${start}`,personId,start,end,partyAtTime:null,coalition:null,assemblyContext:'कार्यकाल-सीमाएँ आधिकारिक सूची के अनुसार; यह प्रत्येक शपथग्रहण/कैबिनेट परिवर्तन की पूर्ण सूची नहीं।',evidence:'historical'}));
export const chiefMinisters=Object.entries(names).map(([slug,[nameHi,nameEn]])=>makeRecord('person',slug,nameHi,nameEn,`बिहार के मुख्यमंत्री के रूप में ${nameHi} का दर्ज ऐतिहासिक कार्यकाल और आधिकारिक स्रोत।`,['cmArchive'],{route:`/politics/people/${slug}`,evidence:'historical',tenureIds:governments.filter(item=>item.personId===slug).map(item=>item.id),birthDate:null,deathDate:null,affiliations:[],aliases:slug==='bindeshwari-prasad-mandal'?['B P Mandal','बी पी मंडल']:[],historicalRoles:['बिहार के मुख्यमंत्री — अवधि नीचे दिए गए अभिलेख में'],currentOfficeId:slug==='nitish-kumar'?null:undefined}));
export const governmentCoverage='यह 1952–14 अप्रैल 2026 के आधिकारिक दस्तावेज में बंद हो चुके कार्यकालों की सूची है। 1946 से पहले/बाद के premier काल, राष्ट्रपति शासन के अंतराल, प्रत्येक मंत्रिमंडल और चुनाव-पश्चात सभी शपथों को अलग पूर्ण रिकॉर्ड में अभी नहीं बदला गया है। दस्तावेज 2024–2026 को एक अवधि में दिखाता है।';
