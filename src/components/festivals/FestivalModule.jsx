import {lazy,Suspense} from 'react';
const ReligionConnections=lazy(()=>import('../religion/ReligionConnections'));
import {useMemo,useState} from 'react';
import {Link,NavLink,Navigate,useLocation,useParams,useSearchParams} from 'react-router-dom';
import {ArrowRight,CalendarDays,Landmark,MapPin,Search} from 'lucide-react';
import {SEO,Breadcrumbs,ContentSection,Sources,EmptyState} from '../Portal';
import {festivalBySlug,festivalDirectory,normalizeFestivalTerm,seasonLabels,monthLabels} from '../../data/festivals';
import {CurrentEventOccurrence} from '../current/CurrentData';
import '../../festivals.css';

const categories=[['/festivals','सभी पर्व'],['/festivals/religious','धार्मिक परंपराएँ'],['/festivals/fairs','मेले व महोत्सव'],['/festivals/seasonal','ऋतु-कैलेंडर']];
const titleFor=path=>categories.find(([to])=>to===path)?.[1]||'सभी पर्व';
const regionAliases={Mithila:'मिथिला',Magadha:'मगध',Anga:'अंग',Patna:'पटना',Vaishali:'वैशाली'};
const Cards=({items=[]})=>items.length?<div className="c8-cards">{items.map((x,i)=><article key={x.title||i}><h3>{x.title}</h3><p>{x.text}</p>{x.to&&<Link to={x.to}>संबंधित पृष्ठ <ArrowRight aria-hidden="true"/></Link>}</article>)}</div>:null;
const Links=({title,items=[]})=>items.length?<section className="c8-related"><h2>{title}</h2><div>{items.map(x=><Link to={x.to} key={x.to}><span>{x.title}</span><ArrowRight aria-hidden="true"/></Link>)}</div></section>:null;
const Paragraphs=({items=[]})=>items.map((p,i)=><p key={i}>{p}</p>);
const Image=({media,hero=false})=><img src={media.src} srcSet={`${media.thumbnail} 640w, ${media.src} 1440w`} sizes={hero?'(max-width: 800px) 100vw, 55vw':'(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw'} alt={media.alt} width={media.width} height={media.height} loading={hero?'eager':'lazy'} fetchPriority={hero?'high':'auto'} decoding="async"/>;
const Photo=({media,hero=false})=><figure className="c8-photo"><Image media={media} hero={hero}/><figcaption>{media.caption}<span>{media.disclosure}</span></figcaption></figure>;

export function TraditionNote({type='लोककथा और आस्था',children}){return <aside className="c8-note"><Landmark aria-hidden="true"/><div><b>{type}</b><p>{children}</p></div></aside>}
export function CurrentFestivalNotice({topic}){return <div><p>{topic.dateNotice}</p><CurrentEventOccurrence eventId={topic.currentDataKey||topic.slug}/></div>}
export function SeasonalCalendar({topics=festivalDirectory}){
 return <section className="c8-calendar" id="seasonal-calendar"><small>सांस्कृतिक समय · वर्तमान आयोजन-सूची नहीं</small><h2>ऋतुओं के साथ बिहार</h2><p>महीने अनुमानित परिचय हैं। चंद्र कैलेंडर, अधिकमास और आयोजक-आधारित कार्यक्रम अलग रखे गए हैं।</p><div>{Object.entries(seasonLabels).map(([key,label])=>{const entries=topics.filter(x=>x.seasonGroup===key);return entries.length>0&&<article key={key}><h3>{label}</h3>{entries.map(x=><Link to={x.seo.canonical} key={x.slug}>{x.nameHi}<ArrowRight aria-hidden="true"/></Link>)}</article>})}</div></section>;
}
export function FestivalLandingPreview(){return <section className="festival-landing-preview"><span>ऋतु, नदी, परिवार और लोक-स्मृति</span><h2>पर्व, मेले और सांस्कृतिक कैलेंडर</h2><p>{festivalDirectory.length} सांस्कृतिक परिचय — आस्था, इतिहास और बदलती वार्षिक तिथियों को अलग रखते हुए।</p><div>{festivalDirectory.slice(0,5).map(x=><Link to={x.seo.canonical} key={x.slug}><small>{x.collection==='fairs'?'मेला':'पर्व'}</small><b>{x.nameHi}</b><ArrowRight/></Link>)}</div><Link className="festival-all-link" to="/festivals">पर्व और मेले देखें <ArrowRight/></Link></section>}

export function FestivalDirectory(){
 const location=useLocation(),[params,setParams]=useSearchParams();
 const query=params.get('q')||'',faith=params.get('faith')||'',season=params.get('season')||'',region=params.get('region')||'',month=params.get('month')||'';
 const category=location.pathname.split('/')[2]||'all';
 const update=(key,value)=>{const next=new URLSearchParams(params);value?next.set(key,value):next.delete(key);setParams(next,{replace:key==='q'});};
 const topics=useMemo(()=>festivalDirectory.filter(x=>{
  const inCategory=category==='fairs'?x.collection==='fairs':category==='religious'?x.faith!=='सांस्कृतिक / नागरिक':true;
  const text=normalizeFestivalTerm([x.nameHi,x.nameEn,...x.aliases,...x.culturalRegions,...x.culturalRegions.map(region=>regionAliases[region]||''),...x.districts].join(' '));
  return inCategory&&(!faith||x.faith===faith)&&(!season||x.seasonGroup===season)&&(!region||x.culturalRegions.includes(region))&&(!month||x.months.includes(Number(month)))&&normalizeFestivalTerm(query).split(' ').filter(Boolean).every(term=>text.includes(term));
 }),[query,faith,season,region,month,category]);
 if(location.pathname==='/culture/festivals')return <Navigate replace to={'/festivals'+location.search+location.hash}/>;
 const filtered=Boolean(query||faith||season||region||month),canonical=location.pathname;
 const title=category==='all'?'बिहार के पर्व, मेले और परंपराएँ':titleFor(canonical);
 const featured=festivalBySlug('chhath');
 return <main className="c8-page">
  <SEO title={title} description="छठ, होली, धार्मिक परंपराएँ और बिहार के मेले: इतिहास, लोककथा, भोजन, गीत, शिल्प और यात्रा का स्रोत-आधारित परिचय।" canonicalPath={canonical} image={featured.hero.src} noIndex={params.size>0} schema={{'@type':'CollectionPage'}}/>
  <Breadcrumbs items={category==='all'?[{label:'पर्व और मेले'}]:[{label:'पर्व और मेले',to:'/festivals'},{label:title}]}/>
  <header className="c8-hero"><div><p className="c8-eyebrow">बिहार की जीवित परंपराएँ</p><h1>{title}</h1><p>घाट की पहली किरण से घर-आँगन के गीतों तक। बिहार के उत्सवों को उनकी अपनी कथा, भाषा और समुदाय के साथ जानें।</p><p className="c8-subtle">शैक्षिक सांस्कृतिक परिचय · किसी धर्म का प्रचार नहीं</p><Link className="btn primary" to="/festivals/chhath-puja">छठ के चार दिन जानें <ArrowRight aria-hidden="true"/></Link><div className="c8-stats"><span><b>{festivalDirectory.length}</b> सांस्कृतिक परिचय</span><span><b>{festivalDirectory.filter(x=>x.collection==='fairs').length}</b> मेले व महोत्सव</span></div></div><Photo media={featured.hero} hero/></header>
  <nav className="c8-tabs" aria-label="पर्व श्रेणियाँ">{categories.map(([to,label])=><NavLink end key={to} to={to}>{label}</NavLink>)}</nav>
  <section className="c8-browser" aria-labelledby="festival-browser-title"><h2 id="festival-browser-title">अपनी रुचि से खोजें</h2><form className="c8-filters" role="search" onSubmit={event=>event.preventDefault()}>
   <label className="c8-query"><span><Search aria-hidden="true"/> पर्व या स्थान</span><input type="search" name="q" value={query} onChange={event=>update('q',event.target.value)} placeholder="छठ, Chhath, होली, मिथिला…"/></label>
   <label><span>धार्मिक / सांस्कृतिक संदर्भ</span><select name="faith" value={faith} onChange={event=>update('faith',event.target.value)}><option value="">सभी संदर्भ</option>{[...new Set(festivalDirectory.map(x=>x.faith))].sort().map(value=><option key={value}>{value}</option>)}</select></label>
   <label><span>ऋतु / कैलेंडर</span><select name="season" value={season} onChange={event=>update('season',event.target.value)}><option value="">सभी ऋतुएँ</option>{Object.entries(seasonLabels).map(([value,label])=><option value={value} key={value}>{label}</option>)}</select></label>
   <label><span>क्षेत्र</span><select name="region" value={region} onChange={event=>update('region',event.target.value)}><option value="">सभी क्षेत्र</option>{[...new Set(festivalDirectory.flatMap(x=>x.culturalRegions))].sort().map(value=><option key={value}>{value}</option>)}</select></label>
   <label><span>अनुमानित महीना</span><select name="month" value={month} onChange={event=>update('month',event.target.value)}><option value="">सभी महीने</option>{monthLabels.map((label,index)=><option value={index+1} key={label}>{label}</option>)}</select></label>
  </form>
  <div className="c8-results"><p role="status" aria-live="polite">{topics.length} परिचय मिले{filtered?' · फ़िल्टर सक्रिय':''}</p>{filtered&&<button type="button" className="btn secondary" onClick={()=>setParams({})}>फ़िल्टर हटाएँ</button>}</div>
  <p className="c8-subtle">महीने का फ़िल्टर चलती इस्लामी तिथियों, अधिकमास या अघोषित कार्यक्रमों को अनुमानित तारीख नहीं देता।</p>
  {topics.length?<div className="c8-grid">{topics.map(x=><article className="c8-card" key={x.slug}><Link to={x.seo.canonical}><Image media={x.hero}/><div><small>{x.collection==='fairs'?'मेला / महोत्सव':'पर्व / परंपरा'} · {seasonLabels[x.seasonGroup]}</small><h3>{x.nameHi}</h3><p lang="en" className="c8-english">{x.nameEn}</p><p>{x.summary}</p><span className="c8-read">परिचय पढ़ें <ArrowRight aria-hidden="true"/></span></div></Link><p className="c8-card-credit">AI सांकेतिक चित्र · वास्तविक आयोजन की फ़ोटो नहीं</p></article>)}</div>:<EmptyState title="इस खोज से कोई परिचय नहीं मिला" description="नाम बदलें या सक्रिय फ़िल्टर हटाएँ। सभी सांस्कृतिक परंपराएँ एक ही महीने या क्षेत्र से नहीं जुड़ी होतीं।" actionLabel="सभी पर्व देखें" actionTo="/festivals"/>}
  </section>
  {(category==='seasonal'||category==='all')&&<SeasonalCalendar topics={topics}/>}
  <TraditionNote type="तिथि, कथा और प्रमाण">धार्मिक कथाएँ आस्था और लोक-स्मृति के रूप में प्रस्तुत हैं। ऐतिहासिक दावों के स्रोत अलग देखें। यात्रा, प्रवेश, यातायात और वर्तमान वर्ष के कार्यक्रम की पुष्टि आधिकारिक सूचना से करें।</TraditionNote>
 </main>;
}

function FestivalTimeline({stages}){
 const [open,setOpen]=useState(0);
 return <ol className="c8-timeline">{stages.map((stage,index)=><li key={stage.title}><button type="button" aria-expanded={open===index} aria-controls={`festival-day-${index}`} onClick={()=>setOpen(current=>current===index?null:index)}><span>दिन {index+1}</span><b>{stage.title}</b><span aria-hidden="true">{open===index?'−':'+'}</span></button><div id={`festival-day-${index}`} hidden={open!==index}><p>{stage.text}</p></div></li>)}</ol>;
}

export function FestivalDetailPage(){
 const {slug}=useParams(),location=useLocation(),x=festivalBySlug(slug);
 if(!x)return <main className="c8-page"><SEO title="पर्व उपलब्ध नहीं है" description="यह पर्व या मेला हमारे प्रकाशित संग्रह में उपलब्ध नहीं है।" noIndex/><h1>यह पर्व उपलब्ध नहीं है</h1><EmptyState title="नाम या पता जाँचें" description="पर्व और मेले की सूची में खोजकर देखें।" actionLabel="पर्व और मेले" actionTo="/festivals"/></main>;
 if(location.pathname!==x.seo.canonical)return <Navigate replace to={x.seo.canonical+location.search+location.hash}/>;
 const related=[...(x.relatedBlogs||[]),...x.relatedCulture,...x.relatedTourism,...x.relatedDistricts,...x.relatedHistory,...x.relatedFood,...x.relatedLanguages].filter((item,index,array)=>array.findIndex(value=>value.to===item.to)===index);
 const relatedFestivals=x.relatedFestival.map(festivalBySlug).filter(Boolean).map(item=>({title:item.nameHi,to:item.seo.canonical}));
 const schema={'@type':'Article',headline:x.nameHi,alternativeHeadline:x.nameEn,about:{'@type':'Thing',name:x.nameEn,alternateName:x.aliases},inLanguage:['hi','en'],spatialCoverage:{'@type':'Place',name:x.culturalRegions.join(', ')},citation:x.sources.map(source=>source.url)};
 return <main className="c8-page c8-detail">
  <SEO title={x.seo.title} description={x.seo.description} canonicalPath={x.seo.canonical} image={x.hero.src} type="article" schema={schema}/>
  <Breadcrumbs items={[{label:'पर्व और मेले',to:'/festivals'},{label:x.nameHi}]}/>
  <header className="c8-hero"><div><Link className="c8-eyebrow" to={x.collection==='fairs'?'/festivals/fairs':'/festivals'}>{x.collection==='fairs'?'मेले और महोत्सव':'पर्व और परंपराएँ'}</Link><h1>{x.nameHi}</h1><p lang="en" className="c8-english">{x.nameEn}</p><p>{x.summary}</p><p className="c8-region"><MapPin aria-hidden="true"/>{x.culturalRegions.join(' · ')}</p></div><Photo media={x.hero} hero/></header>
  <dl className="c8-quick">{[['धार्मिक / सांस्कृतिक संदर्भ',x.religion],['ऋतु',x.season],['महीना / कैलेंडर',x.traditionalCalendar],['क्षेत्र',x.culturalRegions.join(' · ')],['अवधि',x.durationContext]].map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
  <nav className="c8-section-nav" aria-label="इस पृष्ठ पर">{[['overview','परिचय'],['history','इतिहास'],['mythology','कथा'],['rituals','परंपराएँ'],['foods','भोजन'],['music','गीत'],['crafts','शिल्प'],['tourism','यात्रा'],['gallery','चित्र'],['sources','स्रोत']].map(([id,label])=><a href={`#${id}`} key={id}>{label}</a>)}</nav>
  <div className="c8-reading">
   <article lang={x.contentLanguage}>
    <ContentSection id="overview" title="परिचय और सांस्कृतिक जीवन"><p>{x.intro}</p><Paragraphs items={x.culturalContext}/><p>{x.socialMeaning}</p><p>{x.communityContext}</p></ContentSection>
    <ContentSection id="history" title="इतिहास और प्रमाण"><Paragraphs items={x.history}/></ContentSection>
    <section id="mythology"><h2>धार्मिक कथा और स्मृति</h2><TraditionNote type={x.slug==='bihar-diwas'?'नागरिक स्मरण':'आस्था, कथा और व्याख्या'}>{x.mythology}</TraditionNote></section>
    <ContentSection id="calendar" title="ऋतु और कैलेंडर"><p><CalendarDays aria-hidden="true"/> {x.approximateGregorianPeriod}</p><CurrentFestivalNotice topic={x}/></ContentSection>
    <ContentSection id="rituals" title={x.festivalStages?.length?'छठ के चार दिन और परंपराएँ':'अनुष्ठान और परंपराएँ'}>{x.festivalStages?.length>0&&<FestivalTimeline key={x.slug} stages={x.festivalStages}/>}<Cards items={x.rituals}/>{x.traditions!==x.rituals&&<Cards items={x.traditions}/>}</ContentSection>
    <ContentSection id="foods" title="भोजन और साझा स्वाद"><Cards items={x.foods}/></ContentSection>
    <ContentSection id="music" title="गीत, कथा और मौखिक परंपरा"><Cards items={[...x.songs,...x.dances]}/><p className="c8-subtle">यह संगीत-संदर्भ है, ऑडियो संग्रह नहीं। अधिकार-सत्यापन के बिना रिकॉर्डिंग या पूरे गीत प्रकाशित नहीं किए गए हैं।</p></ContentSection>
    <ContentSection id="crafts" title="शिल्प, वस्तुएँ और पहनावा"><Cards items={x.crafts}/><p>{x.dress}</p></ContentSection>
    <ContentSection id="tourism" title="स्थान और जिम्मेदार यात्रा"><Cards items={[...x.places,...x.riverConnections,...x.pilgrimageConnections,...x.fairs]}/><Paragraphs items={x.tourism}/></ContentSection>
    <ContentSection id="today" title="बदलती परंपराएँ"><Paragraphs items={x.modernChanges}/></ContentSection>
   </article>
   <aside className="c8-side"><small>इस परिचय के साथ</small><h2>कथा से स्थान तक</h2><p>सांस्कृतिक जानकारी और वर्तमान आयोजन की सूचना अलग हैं।</p><Links title="जिले और स्थल" items={related.slice(0,5)}/><Link className="btn secondary" to="/festivals">सभी पर्व देखें</Link></aside>
  </div>
  <section id="gallery" className="c8-gallery"><h2>चित्र-दीर्घा</h2><p>सभी दृश्य AI-सहायता से बनाए गए सांकेतिक चित्र हैं। कुछ संबंधित सांस्कृतिक संदर्भ कई परिचयों में साझा हैं; ये स्थल, अनुष्ठान या आयोजन का ऐतिहासिक प्रमाण नहीं हैं।</p><div>{x.gallery.map(media=><Photo key={media.src} media={media}/>)}</div></section>
  <Suspense fallback={null}><ReligionConnections festival={x.slug}/></Suspense>
  <Links title="संबंधित पर्व और मेले" items={relatedFestivals}/>
  <Links title="संस्कृति, स्थान और यात्रा" items={related}/>
  <section id="sources" className="c8-sources"><h2>स्रोत और संपादकीय सीमा</h2><p>इन स्रोतों में सांस्कृतिक विवरण और कुछ पुराने आयोजन-संस्करण दोनों हैं। सूची में मौजूद किसी पुरानी तारीख को वर्तमान कार्यक्रम न समझें। स्थानीय रूप बदल सकते हैं।</p><Sources sources={x.sources}/><Link to="/editorial-policy">संपादकीय नीति</Link></section>
 </main>;
}
