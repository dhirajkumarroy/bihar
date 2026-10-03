import credits from '../../../public/images/personalities/ancient/credits.json' with {type:'json'};
export const ancientMedia=Object.fromEntries(credits.map(m=>[m.id,{...m,credit:m.credit||'Wikimedia Commons — फोटोग्राफर का नाम निर्दिष्ट नहीं'}]));
// Reuse the already licensed local asset without loading the religion module.
export const ashokaMedia={
 id:'vaishali-pillar',src:'/images/religion/buddhism/vaishali-pillar.webp',thumbnail:'/images/religion/buddhism/vaishali-pillar-small.webp',width:1440,height:961,smallWidth:640,
 alt:'कोल्हुआ के वैशाली पुरास्थल पर सिंह-शीर्ष स्तंभ और ईंटों का स्तूप',
 caption:'वैशाली पुरास्थल, कोल्हुआ में स्तूप और अशोक से संबद्ध सिंह-शीर्ष स्तंभ। यह विरासत-स्थल का आधुनिक छायाचित्र है, अशोक का चित्र नहीं।',
 credit:'Rohit Sharma',source:'https://commons.wikimedia.org/wiki/File:Ananda_Stupa_with_Ashok_lion_pillar_at_vaishali,_Bihar_03.jpg',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0',type:'authentic-photograph',reviewedOn:'2026-10-03'
};
