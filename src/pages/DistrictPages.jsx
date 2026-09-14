import {useMemo,useState} from 'react';
import {useParams,Link} from 'react-router-dom';
import {Search,List,Grid2X2,RotateCcw} from 'lucide-react';
import {districts,divisions} from '../data/districts';
import {SEO,Breadcrumbs,PageHero,TagList,EmptyState} from '../components/Portal';
import DistrictDetailPage from '../components/district/DistrictDetailPage';
import {deepDistrictBySlug,deepDistricts} from '../data/districts/index';

const deepBySlug=new Map(deepDistricts.map(d=>[d.slug,d]));
const directoryDistricts=districts.map(base=>{
  const deep=deepBySlug.get(base.slug);
  return {...base,headquarters:deep?.headquarters||base.headquarters,famousFor:deep?.famousFor||base.famousFor,aliases:deep?.aliases||[],searchText:[base.nameHindi,base.nameEnglish,deep?.headquarters,...(deep?.aliases||[]),...(deep?.famousFor||[])].filter(Boolean).join(' ').toLocaleLowerCase('hi')};
});
const normalize=value=>value.trim().toLocaleLowerCase('hi').normalize('NFKC');

function InvalidDistrict(){return <main><SEO title="जिला नहीं मिला" description="यह जिला पता उपलब्ध नहीं है। बिहार के 38 सत्यापित जिला पृष्ठों में से सही जिला चुनें।"/><Breadcrumbs items={[{label:'जिले',to:'/districts'},{label:'जिला नहीं मिला'}]}/><EmptyState title="जिला नहीं मिला" text="खोजा गया जिला पता उपलब्ध नहीं है। जिला निर्देशिका से सही पृष्ठ चुनें।"/><p className="district-invalid-action"><Link to="/districts">सभी 38 जिले देखें →</Link></p></main>}

export function DistrictDetail(){const {slug}=useParams(),district=deepDistrictBySlug(slug);return district?<DistrictDetailPage district={district}/>:<InvalidDistrict/>}

export function DistrictDirectory(){
 const [q,setQ]=useState(''),[division,setDivision]=useState('सभी'),[mode,setMode]=useState('grid');
 const shown=useMemo(()=>{const query=normalize(q);return directoryDistricts.filter(d=>(division==='सभी'||d.division===division)&&(!query||d.searchText.normalize('NFKC').includes(query)))},[q,division]);
 const reset=()=>{setQ('');setDivision('सभी')};
 return <main><SEO title="बिहार के 38 जिले" description="बिहार के सभी 38 जिलों को नौ प्रमंडलों, हिंदी-अंग्रेजी नाम, मुख्यालय और विशिष्ट पहचान के साथ खोजें।" canonicalPath="/districts"/><PageHero eyebrow="प्रशासन और पहचान" title="बिहार के 38 जिले" description="नौ प्रमंडलों में फैले हर जिले का इतिहास, भूगोल, संस्कृति और यात्रा परिचय।"/><section className="directory"><div className="filterbar" role="search"><label><Search aria-hidden="true"/><span className="sr-only">जिला खोजें</span><input value={q} onChange={e=>setQ(e.target.value)} placeholder="नाम, मुख्यालय या पहचान खोजें"/></label><select value={division} onChange={e=>setDivision(e.target.value)} aria-label="प्रमंडल चुनें"><option>सभी</option>{divisions.map(x=><option key={x}>{x}</option>)}</select><button type="button" onClick={()=>setMode(mode==='grid'?'list':'grid')} aria-label={mode==='grid'?'सूची दृश्य दिखाएँ':'ग्रिड दृश्य दिखाएँ'} aria-pressed={mode==='list'}>{mode==='grid'?<List/>:<Grid2X2/>}</button>{(q||division!=='सभी')&&<button type="button" onClick={reset} aria-label="खोज और प्रमंडल फ़िल्टर रीसेट करें"><RotateCcw/></button>}</div><p className="directory-result-count" aria-live="polite">{shown.length} जिले</p><div className={'district-cards '+mode}>{shown.map(d=><Link to={`/district/${d.slug}`} key={d.slug}><small>{d.division} प्रमंडल</small><h2>{d.nameHindi}</h2><p>{d.nameEnglish} · मुख्यालय: {d.headquarters}</p><TagList items={d.famousFor.slice(0,3)}/></Link>)}</div>{!shown.length&&<EmptyState title="कोई जिला नहीं मिला" text="खोज शब्द या प्रमंडल फ़िल्टर बदलकर देखें।"/>}</section></main>
}
