import {Navigate,useParams} from 'react-router-dom';
import {EmptyState} from '../components/Portal';
import {AdministrationPage,DistrictAdministrationPage,ExecutivePage,GovernanceDetailPage,GovernanceLanding,JudiciaryPage,LegislaturePage,LocalGovernmentPage,PanchayatiRajPage,PublicServicesPage,StateGovernmentPage,UrbanLocalBodiesPage} from '../components/governance/GovernanceModule';
import {governanceEntityBySlug} from '../data/governance';

const Missing=()=> <main><EmptyState title="शासन विषय नहीं मिला" description="यह विषय उपलब्ध नहीं है या इसका पता बदल गया है।" actionLabel="शासन module देखें" actionTo="/governance"/></main>;
export function Governance(){return <GovernanceLanding/>}
export function GovernanceAdministration(){return <AdministrationPage/>}
export function GovernanceStateGovernment(){return <StateGovernmentPage/>}
export function GovernanceLegislature(){return <LegislaturePage/>}
export function GovernanceExecutive(){return <ExecutivePage/>}
export function GovernanceJudiciary(){return <JudiciaryPage/>}
export function GovernanceLocalGovernment(){return <LocalGovernmentPage/>}
export function GovernancePanchayatiRaj(){return <PanchayatiRajPage/>}
export function GovernanceUrbanLocalBodies(){return <UrbanLocalBodiesPage/>}
export function GovernancePublicServices(){return <PublicServicesPage/>}
export function GovernanceDistrictAdministration(){return <DistrictAdministrationPage/>}
export function GovernanceDetail(){const {slug}=useParams();const item=governanceEntityBySlug(slug);if(!item)return <Missing/>;if(slug!==item.slug)return <Navigate replace to={item.seo.canonical}/>;return <GovernanceDetailPage item={item}/>}
