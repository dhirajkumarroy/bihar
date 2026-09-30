import {Link} from 'react-router-dom';
import {religionRecords} from '../../data/religion/index.js';

// Reverse links are derived from C9 IDs; C8 and Tourism remain the content owners.
export default function ReligionConnections({festival,tourism}){
 const records=religionRecords.filter(x=>festival?x.festivals.includes(festival):x.tourism.includes(tourism));
 if(!records.length)return null;
 return <section className="related" aria-label="धार्मिक अर्थ और पवित्र स्थल"><h2>धार्मिक अर्थ और पवित्र स्थल</h2><p>यात्रा या पर्व-विवरण से अलग—आस्था, इतिहास और प्रमाण के वर्गीकरण के साथ।</p><div>{records.map(x=><Link key={x.id} to={x.seo.canonical}><small>{x.type==='place'?'पवित्र स्थल':x.type==='tradition'?'धार्मिक परंपरा':'धार्मिक संदर्भ'}</small><b>{x.nameHindi}</b></Link>)}</div></section>;
}
