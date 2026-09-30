import {useMemo} from 'react';
import {Link,useSearchParams} from 'react-router-dom';
import {Search} from 'lucide-react';
import {searchPortal} from '../data/searchIndex';
import {SEO,PageHero,EmptyState} from '../components/Portal';

const suggestedLinks=[['इतिहास','/history'],['जिले','/districts'],['पर्यटन','/tourism'],['संस्कृति','/culture'],['भूगोल','/geography']];

export default function SearchPage(){
  const [searchParams,setSearchParams]=useSearchParams();
  const query=searchParams.get('q')||'';
  const results=useMemo(()=>searchPortal(query),[query]);
  const updateQuery=value=>{
    const next=value.trim()?{q:value}:{};
    setSearchParams(next,{replace:true});
  };
  return <main>
    <SEO title="खोज" description="बिहार के इतिहास, जिलों, पर्यटन, संस्कृति, भाषा, भोजन, भूगोल और शासन की एकीकृत खोज।" canonicalPath="/search" noIndex/>
    <PageHero eyebrow="सम्पूर्ण बिहार" title="ज्ञान खोजें" description="हिंदी, English नाम और प्रचलित aliases से एक canonical विषय तक पहुँचें।"/>
    <section className="search-page" aria-labelledby="search-results-heading">
      <form role="search" onSubmit={event=>event.preventDefault()}>
        <label className="search-page__field"><Search aria-hidden="true"/><span className="sr-only">सम्पूर्ण बिहार में खोजें</span><input autoFocus value={query} onChange={event=>updateQuery(event.target.value)} placeholder="जैसे—Madhubani Painting, मैथिली, Silaw Khaja…"/></label>
      </form>
      {!query&&<div className="search-page__suggestions"><p>इन विषयों से शुरू करें:</p>{suggestedLinks.map(([label,to])=><Link key={to} to={to}>{label}</Link>)}</div>}
      {!!query&&<p id="search-results-heading" className="search-page__count" aria-live="polite">“{query}” के लिए {results.length} परिणाम</p>}
      {!!query&&!results.length&&<EmptyState title="इस खोज के लिए कोई परिणाम नहीं मिला" description="दूसरी वर्तनी आज़माएँ, हिंदी या English नाम से खोजें, या नीचे के मुख्य विषयों में जाएँ।" action={<div className="search-page__suggestions">{suggestedLinks.map(([label,to])=><Link key={to} to={to}>{label}</Link>)}</div>}/>}
      <ol className="search-results">{results.map(item=><li key={item.id}><Link to={item.to}><div><small>{item.type}{item.region?` · ${item.region}`:''}</small><h2>{item.title}</h2><p>{item.description||'सम्पूर्ण बिहार का संदर्भित विषय।'}</p></div><span aria-hidden="true">→</span></Link></li>)}</ol>
    </section>
  </main>;
}
