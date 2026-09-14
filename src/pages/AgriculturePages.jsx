import {Navigate,useParams} from 'react-router-dom';
import {EmptyState} from '../components/Portal';
import {AgricultureDirectory,AgricultureLanding,CropProfile,LandUseProfile,RegionalProfile} from '../components/geography/AgricultureModule';
import {cropBySlug,regionBySlug} from '../data/geography/agriculture';

const Missing=({type})=><main><EmptyState title={`${type} नहीं मिला`} actionLabel="कृषि भूगोल देखें" actionTo="/geography/agriculture"/></main>;

export function Agriculture(){return <AgricultureLanding/>}
export function Crops(){return <AgricultureDirectory kind="crops"/>}
export function AgricultureRegions(){return <AgricultureDirectory kind="regions"/>}
export function LandUse(){return <LandUseProfile/>}
export function CropDetail(){const {slug}=useParams(),item=cropBySlug(slug);if(item&&slug!==item.slug)return <Navigate replace to={item.seo.canonical}/>;return item?<CropProfile item={item}/>:<Missing type="फसल"/>}
export function AgricultureRegionDetail(){const {slug}=useParams(),item=regionBySlug(slug);if(item&&slug!==item.slug)return <Navigate replace to={item.seo.canonical}/>;return item?<RegionalProfile item={item}/>:<Missing type="कृषि क्षेत्र"/>}
