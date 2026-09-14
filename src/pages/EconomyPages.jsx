import {Navigate,useParams} from 'react-router-dom';
import {EmptyState} from '../components/Portal';
import {ClusterProfile,DevelopmentPage,EconomicConcepts,EconomyLanding,EmploymentMigration,IndustryDirectory,IndustryProfile,InfrastructureDirectory,InfrastructureProfile,SectorProfile,TransportNetwork,UrbanEconomy} from '../components/economy/EconomyModule';
import {clusterBySlug,industryBySlug,infrastructureBySlug,sectorBySlug} from '../data/economy';

const Missing=()=> <main><EmptyState title="आर्थिक विषय नहीं मिला" actionLabel="अर्थव्यवस्था देखें" actionTo="/economy"/></main>;
export function Economy(){return <EconomyLanding/>}
export function EconomySectors(){return <EconomicConcepts/>}
export function EconomyIndustry(){return <IndustryDirectory/>}
export function EconomyInfrastructure(){return <InfrastructureDirectory/>}
export function EconomyTransport(){return <TransportNetwork/>}
export function EconomyUrban(){return <UrbanEconomy/>}
export function EconomyDevelopment(){return <DevelopmentPage/>}
export function EconomyMigration(){return <EmploymentMigration/>}
export function EconomyDetail(){const {slug}=useParams();const sector=sectorBySlug(slug),industry=industryBySlug(slug),cluster=clusterBySlug(slug),infra=infrastructureBySlug(slug);const item=sector||industry||cluster||infra;if(!item)return <Missing/>;if(slug!==item.slug)return <Navigate replace to={item.seo.canonical}/>;if(sector)return <SectorProfile item={sector}/>;if(industry)return <IndustryProfile item={industry}/>;if(cluster)return <ClusterProfile item={cluster}/>;return <InfrastructureProfile item={infra}/>}
