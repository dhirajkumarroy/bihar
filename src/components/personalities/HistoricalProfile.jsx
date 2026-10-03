import {useState} from 'react';
import {Link} from 'react-router-dom';
import {ArrowUpRight,ChevronDown,MapPin} from 'lucide-react';
import {SEO,Breadcrumbs,RelatedContent} from '../Portal';
import {ProfileImage,ProfileReferences} from './ProfilePrimitives';
import {historicalSchema,evidenceTypes} from '../../data/personalities/ancientSupport.js';
import {siteConfig} from '../../siteConfig';
import '../../personalities.css';
import '../../ancient-personalities.css';

const periods=[['all','पूरी समयरेखा'],['life','जीवन का संदर्भ'],['work','कार्य और ग्रंथ'],['legacy','बाद की विरासत']];
const evidenceLabel=type=><span className="ap-evidence" data-evidence={type} title={evidenceTypes[type].note}>{evidenceTypes[type].label}</span>;
function Claim({item,sources}){
 return <div className="p1-claim" data-claim={item.id}>{evidenceLabel(item.evidence)}<p>{item.text}</p><ProfileReferences ids={item.sources} sources={sources}/></div>;
}
function Timeline({profile,sources}){
 const [period,setPeriod]=useState('all'),[open,setOpen]=useState(null);
 const shown=profile.timeline.filter(e=>period==='all'||e.period===period);
 const staticMode=typeof window==='undefined';
 return <section id="life-timeline" className="p1-section p1-timeline">
  <div className="p1-section-head"><span className="p1-kicker">जीवन · कार्य · स्मृति</span><h2>समयरेखा</h2><p>{profile.timelineNote||'अनुमानित काल को सटीक तिथि नहीं बनाया गया है। बाद की विरासत में ग्रंथ, अध्ययन और स्मारक आते हैं; वे व्यक्ति के जीवन की घटनाएँ नहीं हैं।'}</p></div>
  {staticMode?<ol className="p1-milestones">{profile.timeline.map(e=><li key={e.id}><span className="ap-event-date">{e.label}</span><h3>{e.title}</h3><Claim item={e} sources={sources}/></li>)}</ol>:<>
   <div className="p1-filters" role="group" aria-label="समयरेखा का भाग">{periods.map(([id,label])=><button key={id} type="button" data-period={id} aria-pressed={period===id} onClick={()=>{setPeriod(id);setOpen(null);}}>{label}</button>)}</div>
   <p className="p1-count" role="status">{shown.length} पड़ाव · विवरण खोलें; एक समय में एक विवरण खुलता है।</p>
   <ol className="p1-events">{shown.map(e=><li key={e.id}><h3><button type="button" id={'ap-event-'+e.id} aria-controls={'ap-panel-'+e.id} aria-expanded={open===e.id} onClick={()=>setOpen(open===e.id?null:e.id)}><span className="ap-event-date">{e.label}</span><span>{e.title}</span><ChevronDown aria-hidden="true"/></button></h3><div role="region" id={'ap-panel-'+e.id} aria-labelledby={'ap-event-'+e.id} hidden={open!==e.id}><Claim item={e} sources={sources}/></div></li>)}</ol>
  </>}
 </section>;
}
export default function HistoricalProfile({profile}){
 const sources=Object.fromEntries(profile.sources.map(s=>[s.id,s]));
 return <article className={'p1-page ap-page ap-'+profile.slug+(profile.birthDate?' mp-page':'')} lang="hi" aria-labelledby="ap-title">
  <SEO title={profile.seo.title} exactTitle description={profile.seo.description} type="article" inferPerson={false} canonicalPath={profile.canonical} image={profile.hero.src} imageAlt={profile.hero.alt} keywords={profile.aliases.join(', ')} schema={historicalSchema(profile,siteConfig.url)}/>
  <div className="p1-shell"><Breadcrumbs items={[{label:'व्यक्तित्व',to:'/personalities'},{label:profile.nameHindi}]}/>
   <header className="p1-hero"><ProfileImage media={profile.hero} hero/><div className="p1-hero-copy"><span className="p1-kicker">{profile.eyebrow||'व्यक्तित्व · प्राचीन बिहार · ज्ञान की विरासत'}</span><p className="p1-life-dates">{profile.era}</p><h1 id="ap-title">{profile.nameHindi}</h1><p className="p1-english" lang="en">{profile.nameEnglish}</p><p className="p1-subtitle">{profile.subtitle}</p><p>{profile.introduction}</p><p className="ap-location"><MapPin aria-hidden="true"/> {profile.location}</p><ProfileReferences ids={profile.introSources} sources={sources}/><div className="p1-hero-actions"><a href="#life-context">जीवन परिचय <ArrowUpRight aria-hidden="true"/></a><a href="#life-timeline">समयरेखा</a><a href="#sources">स्रोत देखें</a></div></div></header>
   <section className="p1-facts" aria-labelledby="ap-facts"><h2 id="ap-facts">एक नज़र में</h2><dl>{profile.facts.map(f=><div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd><dd>{evidenceLabel(f.evidence)}<ProfileReferences ids={f.sources} sources={sources}/></dd></div>)}</dl></section>
   <details className="ap-evidence-key"><summary>प्रमाण और परंपरा के चिह्न कैसे पढ़ें?</summary><dl>{Object.entries(evidenceTypes).map(([id,e])=><div key={id}><dt>{evidenceLabel(id)}</dt><dd>{e.note}</dd></div>)}</dl></details>
   <div className="p1-reading-layout"><aside className="p1-toc"><nav aria-label={profile.nameHindi+' — विषय-सूची'}><span className="p1-kicker">इस परिचय में</span><ol>{profile.sections.map(s=><li key={s.id}><a href={'#'+s.id}>{s.title}</a></li>)}</ol><a href="#life-timeline">समयरेखा</a><a href="#related">आगे पढ़ें</a><a href="#sources">स्रोत और सीमाएँ</a></nav></aside><div className="p1-body">
    {profile.sections.map((s,i)=><section className="p1-section" id={s.id} key={s.id}><div className="p1-section-head"><span className="p1-section-number" aria-hidden="true">{String(i+1).padStart(2,'0')}</span><h2>{s.title}</h2></div>{s.paragraphs.map(p=><Claim key={p.id} item={p} sources={sources}/>)}
     {s.cards&&<><div className="ap-concepts">{s.cards.map(c=><div key={c.title}><h3>{c.title}</h3><p>{c.text}</p></div>)}</div><ProfileReferences ids={s.cardSources} sources={sources}/></>}
     {s.works&&<div className="p1-books">{s.works.map(w=><article key={w.title}><small>{w.form}</small><h3>{w.title}</h3><p>{w.text}</p><ProfileReferences ids={w.sources} sources={sources}/><a href={sources[w.sources[0]].url}>रचना / पुस्तक का स्रोत <ArrowUpRight aria-hidden="true"/></a></article>)}</div>}
     {s.example&&<aside className="ap-example" aria-label="संपादकीय शिक्षण-उदाहरण"><span className="p1-kicker">मूल ग्रंथ का उद्धरण नहीं</span><h3>{s.example.title}</h3><p className="ap-expression">{s.example.expression}</p><p>{s.example.text}</p></aside>}
     {s.links&&<nav className="p1-context-links" aria-label={s.title+' — आगे पढ़ें'}>{s.links.map(([label,to])=><Link to={to} key={to}>{label} <ArrowUpRight aria-hidden="true"/></Link>)}</nav>}
    </section>)}
   </div></div>
   <Timeline key={profile.id} profile={profile} sources={sources}/>
   <section id="related" className="p1-section"><div className="p1-section-head"><h2>व्यक्ति से व्यापक इतिहास तक</h2><p>जीवनी के साथ राजनीतिक, भौगोलिक और ज्ञान-परंपरा का संदर्भ पढ़ें।</p></div><RelatedContent items={profile.related}/></section>
   <section id="sources" className="p1-section p1-sources"><div className="p1-section-head"><span className="p1-kicker">संदर्भ · प्रमाण · संपादकीय सीमाएँ</span><h2>स्रोत और आगे का अध्ययन</h2><p>संपादकीय समीक्षा: <time dateTime={profile.reviewedOn}>{new Intl.DateTimeFormat('hi-IN',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(profile.reviewedOn+'T00:00:00Z'))}</time>। नीचे स्रोत का उपयोग और उसकी सीमा दी गई है।</p></div><div className="p1-limitations"><h3>इस परिचय की सीमाएँ</h3><ul>{profile.limitations.map(text=><li key={text}>{text}</li>)}</ul><Link to="/editorial-policy">संपादकीय नीति</Link></div>
    <ol className="p1-source-list">{profile.sources.map(s=><li key={s.id} id={'source-'+s.id}><span>{s.publisher} · {evidenceTypes[s.kind].label}</span><h3><a href={s.url}>{s.title} <ArrowUpRight aria-hidden="true"/></a></h3><p>{s.scope}</p></li>)}</ol>
   </section>
   <nav className="p1-bottom-nav" aria-label="जीवन-परिचय से आगे"><Link to="/personalities">सभी व्यक्तित्व</Link><Link to="/history">बिहार का इतिहास</Link><a href="#ap-title">ऊपर लौटें ↑</a></nav>
  </div>
 </article>;
}
