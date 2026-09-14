import {Navigate,useParams} from 'react-router-dom';
import {EmptyState} from '../components/Portal';
import {LanguageDetailPage,LanguageDirectory} from '../components/languages/LanguageModule';
import {languageBySlug} from '../data/languages';
export function Languages(){return <LanguageDirectory/>}
export function LanguageDetail(){const {slug}=useParams(),topic=languageBySlug(slug);if(!topic)return <main><EmptyState title="भाषा या लिपि नहीं मिली" description="नाम या पता बदल गया हो सकता है।" actionLabel="भाषा निर्देशिका देखें" actionTo="/languages"/></main>;if(slug!==topic.slug)return <Navigate replace to={`/languages/${topic.slug}`}/>;return <LanguageDetailPage topic={topic}/>}
