import {useCallback,useEffect,useId,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import {Link,NavLink,useLocation} from 'react-router-dom';
import {ChevronDown,Menu,Search,X} from 'lucide-react';
import {SectionHeader} from './ui';

const groups=[
  {label:'खोजें',match:['/history','/district','/districts','/geography','/culture','/festivals','/religion','/food','/languages'],items:[['इतिहास','/history'],['जिले','/districts'],['भूगोल और नदियाँ','/geography'],['संस्कृति','/culture'],['पर्व और मेले','/festivals'],['धार्मिक विरासत','/religion'],['भोजन','/food'],['भाषाएँ','/languages']]},
  {label:'यात्रा',match:['/tourism'],items:[['पर्यटन','/tourism'],['यात्रा सर्किट','/tourism#circuits'],['प्रकृति और वन','/geography/ecology'],['विरासत और इतिहास','/history']]},
  {label:'बिहार आज',match:['/economy','/society','/politics','/governance','/personalities'],items:[['अर्थव्यवस्था','/economy'],['समाज','/society'],['कृषि','/geography/agriculture'],['राजनीति और चुनाव','/politics'],['शासन व संस्थाएँ','/governance'],['विभाग और सेवाएँ','/governance/departments'],['व्यक्तित्व','/personalities']]},
  {label:'परिचय',match:['/about','/editorial-policy','/privacy','/contact'],items:[['पोर्टल के बारे में','/about'],['डेटा की ताजगी','/about/data-freshness'],['संपादकीय नीति','/editorial-policy'],['संपर्क','/contact']]}
];

const routeMatches=(path,match)=>match.some(prefix=>prefix==='/'?path==='/':path===prefix||path.startsWith(`${prefix}/`));

function NavGroup({group,mobile=false,isOpen,onToggle,onClose,onNavigate}){
  const location=useLocation(),active=routeMatches(location.pathname,group.match),menuId=useId();
  const handleKeyDown=event=>{
    if(event.key==='Escape'&&isOpen){
      event.preventDefault();event.stopPropagation();onClose();
      event.currentTarget.querySelector('summary')?.focus();
    }
  };
  // Mobile accordion headings move when a group collapses. Do not collapse on
  // pointer-induced blur before the next heading has received its click.
  return <details open={isOpen} className={`site-navigation__group${active?' is-active':''}`} onKeyDown={handleKeyDown} onBlur={event=>{if(!mobile&&!event.currentTarget.contains(event.relatedTarget))onClose();}}>
    <summary aria-expanded={isOpen} aria-controls={menuId} onClick={event=>{event.preventDefault();onToggle();}}>{group.label}<ChevronDown aria-hidden="true"/></summary>
    <div id={menuId} className="site-navigation__menu">{group.items.map(([label,to])=>{
      const [pathname,hash]=to.split('#'),selected=location.pathname===pathname&&(hash?location.hash===`#${hash}`:!location.hash);
      return <Link key={to} to={to} className={selected?'active':undefined} aria-current={selected?'page':undefined} onClick={onNavigate}>{label}</Link>;
    })}</div>
  </details>;
}

export function Navbar(){
  const [open,setOpen]=useState(false),[openGroup,setOpenGroup]=useState(null);
  const panelRef=useRef(null),triggerRef=useRef(null),navigationRef=useRef(null),location=useLocation();
  const close=useCallback(()=>{setOpen(false);setOpenGroup(null);},[]);
  const groupProps=(group,mobile=false)=>({group,mobile,isOpen:openGroup===group.label&&open===mobile,onToggle:()=>setOpenGroup(current=>current===group.label?null:group.label),onClose:()=>setOpenGroup(current=>current===group.label?null:current),onNavigate:close});
  useEffect(()=>{close();},[location.key,close]);
  useEffect(()=>{
    const dismissOutside=event=>{if(!event.target.closest('.site-navigation__group')||(!navigationRef.current?.contains(event.target)&&!panelRef.current?.contains(event.target)))setOpenGroup(null);};
    const breakpoint=window.matchMedia('(max-width: 1100px)');
    // Entering mobile layout must not close a menu opened just after reflow,
    // before the asynchronous media-query change event is delivered.
    const changeLayout=event=>{setOpenGroup(null);if(!event.matches)setOpen(false);};
    document.addEventListener('pointerdown',dismissOutside);
    breakpoint.addEventListener('change',changeLayout);
    return()=>{document.removeEventListener('pointerdown',dismissOutside);breakpoint.removeEventListener('change',changeLayout);};
  },[close]);
  useEffect(()=>{
    if(!open)return undefined;
    const panel=panelRef.current,originalOverflow=document.body.style.overflow,originalRootOverflow=document.documentElement.style.overflow;
    // The panel lives outside the sticky header, so its backdrop filter cannot clip it.
    const background=[...document.body.children].filter(element=>element!==panel).map(element=>[element,element.inert]);
    background.forEach(([element])=>{element.inert=true;});
    document.body.style.overflow='hidden';
    document.documentElement.style.overflow='hidden';
    const focusable=()=>[...panel.querySelectorAll('a[href],button:not([disabled]),summary,[tabindex]:not([tabindex="-1"])')].filter(element=>element.getClientRects().length>0);
    const focusFirst=()=>focusable()[0]?.focus();
    const onKeyDown=event=>{
      if(event.key==='Escape'){
        // Let an expanded group handle Escape first, before dismissing the dialog.
        if(event.target.closest('.site-navigation__group[open]'))return;
        event.preventDefault();close();return;
      }
      if(event.key!=='Tab')return;
      const items=focusable();if(!items.length)return;
      const first=items[0],last=items[items.length-1];
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
      if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
    };
    panel.addEventListener('keydown',onKeyDown);
    focusFirst();
    return()=>{background.forEach(([element,inert])=>{element.inert=inert;});document.body.style.overflow=originalOverflow;document.documentElement.style.overflow=originalRootOverflow;panel.removeEventListener('keydown',onKeyDown);if(triggerRef.current?.getClientRects().length)triggerRef.current.focus({preventScroll:true});};
  },[open,close]);
  return <>
    <a className="skip" href="#main-content">मुख्य सामग्री पर जाएँ</a>
    <div className="topline"><span>बिहार की विरासत • संस्कृति • पर्यटन</span><span>हिंदी <i/> English</span></div>
    <header className="site-header">
      <Link to="/" className="brand" aria-label="सम्पूर्ण बिहार मुखपृष्ठ" onClick={close}><span className="seal">अ</span><span><b>सम्पूर्ण बिहार</b><small>इतिहास से भविष्य तक</small></span></Link>
      <nav ref={navigationRef} className="site-navigation" aria-label="मुख्य नेविगेशन"><NavLink end to="/" onClick={close} className={({isActive})=>`site-navigation__home${isActive?' is-active':''}`}>मुखपृष्ठ</NavLink>{groups.map(group=><NavGroup key={group.label} {...groupProps(group)}/>)}</nav>
      <div className="actions"><Link to="/search" onClick={close} aria-label="सम्पूर्ण बिहार में खोजें"><Search size={20}/></Link><button ref={triggerRef} className="menu" type="button" aria-expanded={open} aria-controls="mobile-navigation" aria-label={open?'मेन्यू बंद करें':'मेन्यू खोलें'} onClick={()=>{setOpenGroup(null);setOpen(value=>!value);}}>{open?<X/>:<Menu/>}</button></div>
    </header>
    {open&&createPortal(<aside ref={panelRef} id="mobile-navigation" className="mobile-nav" role="dialog" aria-modal="true" aria-label="मुख्य मेन्यू"><div className="mobile-nav__header"><b>बिहार को जानें</b><button type="button" onClick={close} aria-label="मेन्यू बंद करें"><X/></button></div><Link className="mobile-nav__search" to="/search" onClick={close}><Search aria-hidden="true"/> खोजें</Link><div className="mobile-nav__groups"><NavLink end className="mobile-nav__home" to="/" onClick={close}>मुखपृष्ठ</NavLink>{groups.map(group=><NavGroup key={group.label} {...groupProps(group,true)}/>)}</div></aside>,document.body)}
  </>;
}

export function Footer(){
  const openCookieSettings=()=>window.dispatchEvent(new Event('sampoorn-bihar:cookie-settings'));
  return <footer>
    <div className="footer-mark"><span className="seal light">अ</span><div><h3>सम्पूर्ण बिहार</h3><p>बिहार की विरासत, संस्कृति और बदलते वर्तमान को संदर्भ और स्रोत के साथ समझने का हिंदी मंच।</p></div></div>
    <div><b>खोजें</b><Link to="/history">इतिहास</Link><Link to="/districts">जिले</Link><Link to="/geography">भूगोल</Link><Link to="/culture">संस्कृति</Link><Link to="/festivals">पर्व और मेले</Link><Link to="/food">भोजन</Link></div>
    <div><b>यात्रा</b><Link to="/tourism">पर्यटन</Link><Link to="/tourism#circuits">यात्रा सर्किट</Link><Link to="/geography/ecology">प्रकृति और वन</Link><Link to="/history">विरासत और इतिहास</Link></div>
    <div><b>ज्ञान</b><Link to="/economy">अर्थव्यवस्था</Link><Link to="/society">समाज</Link><Link to="/geography/agriculture">कृषि</Link><Link to="/politics">राजनीति और चुनाव</Link><Link to="/governance">शासन व संस्थाएँ</Link><Link to="/governance/civic-knowledge">नागरिक ज्ञान</Link><Link to="/personalities">व्यक्तित्व</Link></div>
    <div><b>जानकारी</b><Link to="/search">खोज</Link><Link to="/about/data-freshness">डेटा कार्यप्रणाली</Link><Link to="/editorial-policy">स्रोत व संपादकीय नीति</Link><Link to="/about">पोर्टल के बारे में</Link><Link to="/contact">सुधार सुझाएँ</Link><Link to="/privacy">गोपनीयता</Link><Link to="/advertising">विज्ञापन नीति</Link><Link to="/terms">उपयोग की शर्तें</Link><button type="button" className="privacy-settings" onClick={openCookieSettings}>कुकी विकल्प</button></div>
    <small>© 2026 सम्पूर्ण बिहार · भारत की ज्ञान-भूमि</small>
  </footer>;
}

export function SectionTitle({eyebrow,title,desc,dark=false,action}){return <SectionHeader className="section-title" eyebrow={eyebrow} title={title} description={desc} dark={dark} action={action}/>;}
