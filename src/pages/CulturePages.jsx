import {Link,Navigate,useParams} from 'react-router-dom';
import {cultureItems} from '../data/catalog';
import {cultureBySlug} from '../data/culture';
import {EmptyState} from '../components/Portal';
import CultureDetailPage,{CultureLanding} from '../components/culture/CultureModule';
import PerformanceCultureDetailPage,{PerformanceCollections} from '../components/culture/PerformanceCulture';
import MovementCultureDetailPage,{MovementCollections} from '../components/culture/MovementCulture';
import {FestivalLandingPreview} from '../components/festivals/FestivalModule';
import {LanguageLandingPreview} from '../components/languages/LanguageModule';
import {FoodLandingPreview} from '../components/food/FoodModule';
import {CultureRegionDiscovery} from '../components/culture/CultureRegionDiscovery';

export function Culture(){return <><CultureLanding legacyItems={cultureItems}/><CultureRegionDiscovery/><PerformanceCollections/><MovementCollections/><FestivalLandingPreview/><LanguageLandingPreview/><FoodLandingPreview/></>}
export function CultureDetail(){const {slug}=useParams();if(slug==='bhikhari-thakur')return <Navigate replace to="/personalities/bhikhari-thakur"/>;const topic=cultureBySlug(slug);if(topic)return topic.movementType?<MovementCultureDetailPage topic={topic}/>:topic.performanceType?<PerformanceCultureDetailPage topic={topic}/>:<CultureDetailPage topic={topic}/>;const legacy=cultureItems.find(x=>x.slug===slug);return legacy?<LegacyCultureDetail item={legacy}/>:<main><EmptyState title="सांस्कृतिक विषय नहीं मिला" description="नाम या पता बदल गया हो सकता है।" actionLabel="संस्कृति देखें" actionTo="/culture"/></main>}
function LegacyCultureDetail({item:x}){return <main className="legacy-culture-note"><h1>{x.name}</h1><p>{x.description}</p><p>यह संक्षिप्त परिचय है। इसका गहन, स्रोत-सत्यापित संस्करण आगामी Culture phases में जोड़ा जाएगा।</p><Link to="/culture">संस्कृति निर्देशिका पर लौटें</Link></main>}
