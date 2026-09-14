import {useEffect} from 'react';
import {Link} from 'react-router-dom';
import {ArrowRight,ChevronRight,BookOpen,MapPin,ExternalLink} from 'lucide-react';
import {Card,Badge,ActionLink,EmptyState as SharedEmptyState} from './ui';

export function SEO({title,description,type='website',canonicalPath,image='/assets/bihar-hero.png',keywords,schema={}}){
 useEffect(()=>{
  const desc=description||`${title} — सम्पूर्ण बिहार पोर्टल पर प्रामाणिक जानकारी।`,origin=location.origin,normalizedPath=location.pathname.replace(/^\/districts\//,'/district/'),url=canonicalPath?`${origin}${canonicalPath}`:`${origin}${normalizedPath}`,imageUrl=image.startsWith('http')?image:`${origin}${image}`;
  const personSlugs=['chandragupta-maurya','chanakya','bindusara','ashoka','aryabhata','xuanzang','yijing','bakhtiyar-khalji','sher-shah-suri','veer-kunwar-singh','gandhi-in-bihar','rajendra-prasad'];
  const inferredPerson=location.pathname.startsWith('/personalities/')||personSlugs.some(slug=>location.pathname===`/history/${slug}`),effectiveType=inferredPerson?'person':type;
  const schemaType=effectiveType==='person'?'Person':effectiveType==='article'?'Article':effectiveType==='place'?'Place':'WebPage',openGraphType=effectiveType==='person'?'profile':effectiveType==='article'?'article':'website';
  const fullTitle=title.includes('सम्पूर्ण बिहार')?title:`${title} | सम्पूर्ण बिहार`;
  document.title=fullTitle;
  document.documentElement.lang='hi';
  const set=(selector,attr,value)=>{let el=document.head.querySelector(selector);if(!el){el=document.createElement('meta');document.head.appendChild(el)}el.setAttribute(attr,value)};
  set('meta[name="description"]','content',desc);
  set('meta[name="robots"]','content','index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
  if(keywords)set('meta[name="keywords"]','content',keywords);
  set('meta[property="og:title"]','content',fullTitle);
  set('meta[property="og:description"]','content',desc);
  set('meta[property="og:type"]','content',openGraphType);
  set('meta[property="og:url"]','content',url);
  set('meta[property="og:image"]','content',imageUrl);
  set('meta[property="og:site_name"]','content','सम्पूर्ण बिहार — Bihar Portal');
  set('meta[property="og:locale"]','content','hi_IN');
  set('meta[name="twitter:card"]','content','summary_large_image');
  set('meta[name="twitter:title"]','content',fullTitle);
  set('meta[name="twitter:description"]','content',desc);
  set('meta[name="twitter:image"]','content',imageUrl);
  let canonical=document.querySelector('link[rel="canonical"]');if(!canonical){canonical=document.createElement('link');canonical.rel='canonical';document.head.appendChild(canonical)}canonical.href=url;
  let json=document.querySelector('#page-schema');if(!json){json=document.createElement('script');json.id='page-schema';json.type='application/ld+json';document.head.appendChild(json)}
  json.textContent=JSON.stringify({'@context':'https://schema.org','@type':schemaType,name:fullTitle,description:desc,url,image:imageUrl,inLanguage:'hi',publisher:{'@type':'Organization',name:'सम्पूर्ण बिहार',url:origin,logo:{'@type':'ImageObject',url:`${origin}/assets/bihar-districts-heritage.svg`}},...schema});
 },[title,description,type,canonicalPath,image,keywords,schema]);return null
}
export function Breadcrumbs({items=[]}){useEffect(()=>{let el=document.querySelector('#breadcrumb-schema');if(!el){el=document.createElement('script');el.id='breadcrumb-schema';el.type='application/ld+json';document.head.appendChild(el)}const origin=location.origin;el.textContent=JSON.stringify({'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{position:1,name:'मुखपृष्ठ',item:`${origin}/`},...items.map((x,i)=>({position:i+2,name:x.label,item:x.to?`${origin}${x.to}`:location.href}))].map(x=>({'@type':'ListItem',...x}))});},[items]);return <nav className="breadcrumbs" aria-label="ब्रेडक्रंब"><Link to="/">मुखपृष्ठ</Link>{items.map(x=><span key={x.label}><ChevronRight aria-hidden="true"/>{x.to?<Link to={x.to}>{x.label}</Link>:<b aria-current="page">{x.label}</b>}</span>)}</nav>}
export function PageHero({eyebrow,title,description,image,children}){return <section className={'page-hero '+(image?'with-image':'')} style={image?{'--page-image':`url(${image})`}:null}><div><span>{eyebrow}</span><h1>{title}</h1><p>{description}</p>{children}</div></section>}
export function ContentSection({title,children,id}){return <section id={id} className="content-section"><h2>{title}</h2><div>{children}</div></section>}
export function RelatedContent({title='संबंधित सामग्री',items=[]}){if(!items.length)return null;return <section className="related"><h2>{title}</h2><div>{items.map(x=><Link key={x.title||x.name} to={x.to||'#'}><small>{x.type||'और पढ़ें'}</small><b>{x.title||x.name}</b><ArrowRight/></Link>)}</div></section>}
export function Sources({sources=[]}){if(!sources.length)return null;return <details className="sources"><summary><BookOpen/> स्रोत और संदर्भ</summary><ul>{sources.map(s=><li key={s.title}><a href={s.url} target="_blank" rel="noreferrer">{s.title}{s.type&&<small>{s.type.replaceAll('-',' ')}</small>}<ExternalLink/></a></li>)}</ul></details>}
export function EmptyState(props){return <SharedEmptyState {...props}/>}
export function ImageGallery({items=[],fallback='/assets/bihar-hero.png'}){const shown=items.length?items:[{src:fallback,alt:'बिहार विरासत का सांकेतिक चित्र',caption:'सांकेतिक ऐतिहासिक पुनर्निर्माण',type:'historical-reconstruction'}];return <div className="gallery">{shown.map((x,i)=><figure key={i}><img loading="lazy" src={x.src} alt={x.alt}/><figcaption>{x.caption}{x.type==='historical-reconstruction'&&<em>AI ऐतिहासिक पुनर्निर्माण</em>}</figcaption></figure>)}</div>}
export function TagList({items=[]}){return <div className="tag-list">{items.map(x=><Badge key={x}>{x}</Badge>)}</div>}
export function InfoGrid({items=[]}){return <div className="info-grid">{items.map(([label,value])=><article key={label}><small>{label}</small><b>{Array.isArray(value)?value.join(' · '):value}</b></article>)}</div>}
export function Cards({items=[],base='',render}){return <div className="portal-grid">{items.map(x=><Card as={Link} interactive to={`${base}/${x.slug}`} key={x.slug}><Badge variant="heritage">{x.category||x.era||'सम्पूर्ण बिहार'}</Badge><h3>{x.name||x.title}</h3><p>{x.description||x.introduction||x.summary}</p>{render?.(x)}<ActionLink>विस्तार से जानें</ActionLink></Card>)}</div>}
export function DistrictLink({name}){return <Link className="district-link" to="/districts"><MapPin/> {name} जिला देखें</Link>}
