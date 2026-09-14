import {Navigate,useParams} from 'react-router-dom';
import {EmptyState} from '../components/Portal';
import {DemographicConceptPage,EducationPage,HealthPage,HumanDevelopmentPage,MigrationPage,PopulationPage,SocietyLanding,UrbanizationPage} from '../components/society/SocietyModule';
import {demographicConceptBySlug} from '../data/society';

const Missing=()=> <main><EmptyState title="सामाजिक विषय नहीं मिला" description="यह विषय उपलब्ध नहीं है या इसका पता बदल गया है।" actionLabel="समाज module देखें" actionTo="/society"/></main>;
export function Society(){return <SocietyLanding/>}
export function SocietyPopulation(){return <PopulationPage/>}
export function SocietyUrbanization(){return <UrbanizationPage/>}
export function SocietyMigration(){return <MigrationPage/>}
export function SocietyEducation(){return <EducationPage/>}
export function SocietyHealth(){return <HealthPage/>}
export function SocietyHumanDevelopment(){return <HumanDevelopmentPage/>}
export function SocietyDetail(){const {slug}=useParams();const item=demographicConceptBySlug(slug);if(!item)return <Missing/>;if(slug!==item.slug)return <Navigate replace to={item.seo.canonical}/>;return <DemographicConceptPage item={item}/>}
