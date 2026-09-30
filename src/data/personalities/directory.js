// Small discovery records: the full biography stays in its lazy route chunk.
export const rajendraDiscovery={
 id:'rajendra-prasad',slug:'rajendra-prasad',nameHindi:'डॉ. राजेंद्र प्रसाद',nameEnglish:'Dr. Rajendra Prasad',
 aliases:['राजेंद्र प्रसाद','डॉ राजेंद्र प्रसाद','राजेन्द्र प्रसाद','Rajendra Prasad','Dr Rajendra Prasad','President Rajendra Prasad','First President of India','जीरादेई','Ziradei'],
 summary:'जीरादेई से चंपारण, संविधान सभा और भारत के प्रथम राष्ट्रपति पद तक — स्रोतों, तस्वीरों और समयरेखा के साथ जीवन-परिचय।',
 canonical:'/personalities/rajendra-prasad'
};
export const personalitySearchRecords=[
 {id:'person:rajendra-prasad',title:rajendraDiscovery.nameHindi,to:rajendraDiscovery.canonical,type:'व्यक्तित्व',aliases:rajendraDiscovery.aliases,description:rajendraDiscovery.summary},
 {id:'p1:history',title:'राजेंद्र प्रसाद — स्वतंत्रता आंदोलन',to:'/history/rajendra-prasad',type:'इतिहास',aliases:['Rajendra Prasad','राजेंद्र प्रसाद'],keywords:['Champaran','Constituent Assembly']},
 {id:'p1:siwan',title:'सीवान',to:'/district/siwan',type:'जिला',aliases:['Ziradei','जीरादेई'],keywords:['Rajendra Prasad','राजेंद्र प्रसाद'],description:'जीरादेई और राजेंद्र प्रसाद के जन्मस्थान का जिला-संदर्भ।'},
 {id:'p1:ziradei',title:'जीरादेई — राजेंद्र प्रसाद का जन्मस्थान',to:rajendraDiscovery.canonical+'#ziradei',type:'स्थल',aliases:['Ziradei','जीरादेई'],keywords:['Rajendra Prasad','राजेंद्र प्रसाद'],description:'जन्मस्थान का ऐतिहासिक संदर्भ और सीवान जिले से संबंध।'},
 {id:'p1:sadaqat',title:'सदाकत आश्रम — राजेंद्र प्रसाद का अंतिम निवास',to:rajendraDiscovery.canonical+'#sadaqat',type:'स्थल',aliases:['Sadaqat Ashram'],keywords:['Rajendra Prasad','राजेंद्र प्रसाद','Patna'],description:'आश्रम, बिहार विद्यापीठ और सार्वजनिक जीवन का ऐतिहासिक संबंध।'}
];
