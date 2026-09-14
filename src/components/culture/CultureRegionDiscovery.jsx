import {Link} from 'react-router-dom';
const regions=[
 {name:'मिथिला',en:'Mithila',items:[['मैथिली','/languages/maithili'],['मिथिला चित्रकला','/culture/mithila-painting'],['समदाउन','/culture/samdaun'],['झिझिया','/culture/jhijhiya'],['सामा-चकेवा','/culture/festivals/sama-chakeva'],['मिथिला भोजन','/food/mithila-cuisine'],['मधुबनी','/district/madhubani']]},
 {name:'भोजपुर',en:'Bhojpur',items:[['भोजपुरी','/languages/bhojpuri'],['बिदेसिया','/culture/bidesia'],['बिरहा','/culture/birha'],['लौंडा नाच','/culture/launda-naach'],['लिट्टी–चोखा','/food/litti-chokha'],['सत्तू','/food/sattu'],['सारण','/district/saran']]},
 {name:'मगध',en:'Magadh',items:[['मगही','/languages/magahi'],['तिलकुट','/food/tilkut'],['सिलाव खाजा','/food/silao-khaja'],['मगध भोजन','/food/magadh-cuisine'],['गया','/district/gaya'],['नालंदा','/district/nalanda']]},
 {name:'अंग',en:'Anga',items:[['अंगिका','/languages/angika'],['मंजूषा कला','/culture/manjusha-art'],['बिहुला–विषहरी','/culture/festivals/bihula-bishahari'],['अंग–भागलपुर भोजन','/food/anga-food'],['भागलपुर','/district/bhagalpur']]},
 {name:'चंपारण',en:'Champaran',items:[['चंपारण भोजन','/food/champaran-food'],['अहुना मांस','/food/champaran-ahuna-meat'],['पश्चिम चंपारण','/district/west-champaran']]},
 {name:'सीमांचल',en:'Seemanchal',items:[['सुरजापुरी','/languages/surjapuri'],['सीमांचल भोजन','/food/seemanchal-food'],['पूर्णिया','/district/purnia'],['किशनगंज','/district/kishanganj']]}
];
export function CultureRegionDiscovery(){return <section className="culture-region-discovery"><header><small>क्षेत्र से खोजें</small><h2>जुड़ी हुई सांस्कृतिक यात्राएँ</h2><p>सांस्कृतिक क्षेत्रों की सीमाएँ आधुनिक प्रशासनिक जिलों से पूरी तरह समान नहीं होतीं। नीचे के संबंध साझा भूगोल और सांस्कृतिक संदर्भ दिखाते हैं—एक समान origin नहीं।</p></header><div>{regions.map(r=><article key={r.en}><h3>{r.name}</h3><small>{r.en}</small><nav>{r.items.map(([label,to])=><Link key={to} to={to}>{label}</Link>)}</nav></article>)}</div></section>}
