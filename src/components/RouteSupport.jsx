import {Component,useEffect,useRef,useState} from 'react';
import {Link,useLocation,useNavigate,useNavigationType} from 'react-router-dom';

class RouteErrorBoundary extends Component {
  state={hasError:false};

  static getDerivedStateFromError(){return {hasError:true};}

  componentDidUpdate(previousProps){
    if(this.state.hasError&&previousProps.resetKey!==this.props.resetKey)this.setState({hasError:false});
  }

  render(){
    if(this.state.hasError)return <main className="route-error" tabIndex="-1"><p className="route-error__eyebrow">सम्पूर्ण बिहार</p><h1>यह पृष्ठ अभी नहीं खुल सका</h1><p>कृपया दोबारा प्रयास करें या नीचे दिए गए किसी सुरक्षित रास्ते से आगे बढ़ें।</p><div className="route-error__actions"><Link className="btn primary" to="/">मुखपृष्ठ</Link><Link className="btn secondary" to="/search">खोजें</Link></div></main>;
    return this.props.children;
  }
}

export function PortalErrorBoundary({children}){
  const location=useLocation();
  return <RouteErrorBoundary resetKey={`${location.pathname}${location.search}`}>{children}</RouteErrorBoundary>;
}

export function RouteAnnouncer(){
  const location=useLocation();
  return <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{location.pathname==='/'?'मुखपृष्ठ':'नया पृष्ठ'} खुल गया</p>;
}

// Keep this inside the route Suspense boundary so lazy page anchors exist first.
export function RouteScroll(){
  const {pathname,search,hash,key}=useLocation(),navigationType=useNavigationType(),previousLocation=useRef(null);
  useEffect(()=>{
    const previous=previousLocation.current;
    const resetPage=!previous||previous.pathname!==pathname||previous.search===search;
    previousLocation.current={pathname,search};
    const frame=requestAnimationFrame(()=>{
      if(hash){
        let id=hash.slice(1);
        try{id=decodeURIComponent(id);}catch{/* A malformed fragment must not break navigation. */}
        document.getElementById(id)?.scrollIntoView({block:'start',behavior:'instant'});
      }else if(resetPage&&navigationType!=='POP'){
        window.scrollTo({top:0,left:0,behavior:'instant'});
      }
    });
    return()=>cancelAnimationFrame(frame);
  },[pathname,search,hash,key,navigationType]);
  return null;
}

export function NotFoundPage(){
  const [query,setQuery]=useState(''),navigate=useNavigate();
  const submit=event=>{event.preventDefault();navigate(query.trim()?`/search?q=${encodeURIComponent(query.trim())}`:'/search');};
  return <main className="notfound"><p className="route-error__eyebrow">त्रुटि 404</p><b aria-hidden="true">404</b><h1>यह पृष्ठ उपलब्ध नहीं है</h1><p>पता बदल गया हो सकता है, या यह सामग्री प्रकाशित नहीं है। आप खोज कर सकते हैं या किसी प्रमुख विषय पर लौट सकते हैं।</p><form className="notfound__search" role="search" onSubmit={submit}><label><span className="sr-only">सम्पूर्ण बिहार में खोजें</span><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="विषय, स्थान या जिला खोजें"/></label><button className="btn primary" type="submit">खोजें</button></form><div className="notfound__links"><Link to="/">मुखपृष्ठ</Link><Link to="/history">इतिहास</Link><Link to="/districts">जिले</Link><Link to="/tourism">पर्यटन</Link><button type="button" onClick={()=>window.history.back()}>पिछले पृष्ठ पर जाएँ</button></div></main>;
}
