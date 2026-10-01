// Small discovery records: the full biography stays in its lazy route chunk.
export const rajendraDiscovery={
 id:'rajendra-prasad',slug:'rajendra-prasad',nameHindi:'डॉ. राजेंद्र प्रसाद',nameEnglish:'Dr. Rajendra Prasad',
 aliases:['राजेंद्र प्रसाद','डॉ राजेंद्र प्रसाद','राजेन्द्र प्रसाद','Rajendra Prasad','Dr Rajendra Prasad','President Rajendra Prasad','First President of India','जीरादेई','Ziradei'],
 summary:'जीरादेई से चंपारण, संविधान सभा और भारत के प्रथम राष्ट्रपति पद तक — स्रोतों, तस्वीरों और समयरेखा के साथ जीवन-परिचय।',
 canonical:'/personalities/rajendra-prasad'
};
export const kunwarDiscovery={
 id:'kunwar-singh',slug:'kunwar-singh',nameHindi:'वीर कुँवर सिंह',nameEnglish:'Veer Kunwar Singh',
 aliases:['वीर कुँवर सिंह','कुँवर सिंह','कुंवर सिंह','बाबू कुँवर सिंह','Babu Kunwar Singh','Kunwar Singh','Veer Kunwar Singh','Jagdishpur Kunwar Singh','1857 Kunwar Singh','कुँवर सिंह 1857','वीर कुंवर सिंह','बाबू कुंवर सिंह'],
 summary:'जगदीशपुर और भोजपुर से आरा–आजमगढ़ अभियान तक: 1857 के नेतृत्व, स्रोतों, समयरेखा और लोकस्मृति का विस्तृत परिचय।',
 canonical:'/personalities/kunwar-singh'
};
export const personalityDiscovery=[rajendraDiscovery,kunwarDiscovery];
export const personalitySearchRecords=[
 {id:'person:kunwar-singh',title:kunwarDiscovery.nameHindi,to:kunwarDiscovery.canonical,type:'व्यक्तित्व',aliases:kunwarDiscovery.aliases,description:kunwarDiscovery.summary},
 {id:'ks:history',title:'कुँवर सिंह — 1857 का बिहार',to:'/history/1857-bihar',type:'इतिहास',aliases:kunwarDiscovery.aliases,keywords:['Jagdishpur','जगदीशपुर']},
 {id:'ks:bhojpur',title:'भोजपुर',to:'/district/bhojpur',type:'जिला',aliases:kunwarDiscovery.aliases,keywords:['जगदीशपुर','Jagdishpur'],description:'कुँवर सिंह और जगदीशपुर का वर्तमान जिला-संदर्भ।'},
 {id:'ks:fort',title:'जगदीशपुर किला',to:'/tourism/jagdishpur-fort',type:'पर्यटन',aliases:kunwarDiscovery.aliases,keywords:['Jagdishpur','जगदीशपुर'],description:'कुँवर सिंह से जुड़ी विरासत और स्रोत-आधारित यात्रा सावधानी।'},
 {id:'ks:museum',title:'बाबू कुँवर सिंह स्मृति संग्रहालय',to:kunwarDiscovery.canonical+'#museum',type:'संग्रहालय',aliases:['Babu Kunwar Singh Smriti Sangrahalaya',...kunwarDiscovery.aliases],keywords:['Jagdishpur','जगदीशपुर'],description:'जगदीशपुर में सरकारी स्मृति संग्रहालय का परिचय।'},
 {id:'ks:jagdishpur',title:'जगदीशपुर — कुँवर सिंह का ऐतिहासिक आधार',to:kunwarDiscovery.canonical+'#place-jagdishpur',type:'स्थल',aliases:['Jagdishpur','जगदीशपुर',...kunwarDiscovery.aliases],description:'स्थान, जिला और 1857 से संबंध।'},
 {id:'person:rajendra-prasad',title:rajendraDiscovery.nameHindi,to:rajendraDiscovery.canonical,type:'व्यक्तित्व',aliases:rajendraDiscovery.aliases,description:rajendraDiscovery.summary},
 {id:'p1:history',title:'राजेंद्र प्रसाद — स्वतंत्रता आंदोलन',to:'/history/rajendra-prasad',type:'इतिहास',aliases:['Rajendra Prasad','राजेंद्र प्रसाद'],keywords:['Champaran','Constituent Assembly']},
 {id:'p1:siwan',title:'सीवान',to:'/district/siwan',type:'जिला',aliases:['Ziradei','जीरादेई'],keywords:['Rajendra Prasad','राजेंद्र प्रसाद'],description:'जीरादेई और राजेंद्र प्रसाद के जन्मस्थान का जिला-संदर्भ।'},
 {id:'p1:ziradei',title:'जीरादेई — राजेंद्र प्रसाद का जन्मस्थान',to:rajendraDiscovery.canonical+'#ziradei',type:'स्थल',aliases:['Ziradei','जीरादेई'],keywords:['Rajendra Prasad','राजेंद्र प्रसाद'],description:'जन्मस्थान का ऐतिहासिक संदर्भ और सीवान जिले से संबंध।'},
 {id:'p1:sadaqat',title:'सदाकत आश्रम — राजेंद्र प्रसाद का अंतिम निवास',to:rajendraDiscovery.canonical+'#sadaqat',type:'स्थल',aliases:['Sadaqat Ashram'],keywords:['Rajendra Prasad','राजेंद्र प्रसाद','Patna'],description:'आश्रम, बिहार विद्यापीठ और सार्वजनिक जीवन का ऐतिहासिक संबंध।'}
];
