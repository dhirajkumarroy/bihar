import {Link,useLocation} from 'react-router-dom';
import {NotFoundPage} from '../components/RouteSupport';
import {ContentSection,RelatedContent} from '../components/Portal';
import {politicsRecordForPath,partyHistory,alliances} from '../data/politics';
import {PoliticsShell,Prose,Landing,Note,PartiesDirectory,InstitutionsDirectory,PeopleDirectory,PartyProfile,PartyComparison,InstitutionProfile,GovernmentDiagram,ConstituencyDirectory,ConstituencyProfile,ElectoralGeography,ElectionHistory,Timeline,HistoryOverview,Movements,Governments,PersonProfile,CurrentDashboard,DepartmentDirectory,CurrentItem} from '../components/politics/PoliticsModule';

function Content({record}){
 if(record.type==='party')return <PartyProfile party={record}/>;
 if(record.type==='institution')return <InstitutionProfile record={record}/>;
 if(record.type==='constituency')return <ConstituencyProfile record={record}/>;
 if(record.type==='person')return <PersonProfile record={record}/>;
 switch(record.route){
  case '/politics':return <Landing record={record}/>;
  case '/politics/parties':return <PartiesDirectory/>;
  case '/politics/parties/compare':return <PartyComparison/>;
  case '/politics/institutions':return <InstitutionsDirectory/>;
  case '/politics/people':return <PeopleDirectory/>;
  case '/politics/constituencies':return <ConstituencyDirectory/>;
  case '/politics/assembly/constituencies':return <ConstituencyDirectory assemblyOnly/>;
  case '/politics/electoral-geography':return <><Prose sections={record.sections}/><ElectoralGeography/></>;
  case '/politics/elections/history':return <ElectionHistory/>;
  case '/politics/party-history':return <Timeline records={partyHistory}/>;
  case '/politics/history':return <HistoryOverview/>;
  case '/politics/movements':return <Movements/>;
  case '/politics/alliances':return <><Note><p>यह 2025 के दो स्रोत-रिपोर्टेड संदर्भ हैं, बिहार के सभी गठबंधनों का पूर्ण इतिहास नहीं। सीट-बँटवारा, सरकार गठन और गठबंधन सदस्यता अलग तथ्य हैं।</p></Note><Timeline records={alliances}/><CurrentItem id="politics-alliances"/></>;
  case '/politics/chief-ministers':
  case '/politics/governments':return <Governments/>;
  case '/politics/current':return <><Prose sections={record.sections}/><CurrentDashboard/></>;
  case '/governance/departments':return <DepartmentDirectory/>;
  default:return <>{record.slug==='government'&&<GovernmentDiagram/>}<Prose sections={record.sections}/>{record.slug==='assembly'&&<><ContentSection title="क्षेत्र और पदाधिकारी"><Link className="politics-button" to="/politics/assembly/constituencies">243 विधानसभा क्षेत्र देखें</Link><div className="politics-grid"><CurrentItem id="politics-speaker"/><CurrentItem id="politics-deputy-speaker"/><CurrentItem id="politics-opposition-leader"/><CurrentItem id="politics-assembly-members"/></div></ContentSection><Link to="/politics/governments">ऐतिहासिक कार्यकाल</Link></>}{record.slug==='council'&&<CurrentItem id="politics-council-members"/>}{record.slug.startsWith('parliament')&&<RelatedContent items={[{title:'लोकसभा',to:'/politics/parliament/lok-sabha'},{title:'राज्यसभा',to:'/politics/parliament/rajya-sabha'},{title:'लोकसभा क्षेत्र · 2019',to:'/politics/constituencies?chamber=lokSabha'}]}/>} {record.slug==='parliament/lok-sabha'&&<CurrentItem id="politics-lok-sabha-members"/>}{record.slug==='parliament/rajya-sabha'&&<CurrentItem id="politics-rajya-sabha-members"/>}{record.slug==='elections'&&<RelatedContent items={[{title:'चुनावों के अभिलेख',to:'/politics/elections/history'},{title:'नवीनतम सत्यापन स्थिति',to:'/politics/current'},{title:'निर्वाचन क्षेत्र',to:'/politics/constituencies'}]}/>} {record.slug==='local-government'&&<><CurrentItem id="politics-local-elections"/><RelatedContent items={[{title:'पंचायती राज',to:'/governance/panchayati-raj'},{title:'नगर निकाय',to:'/governance/urban-local-bodies'},{title:'लोक सेवाएँ',to:'/governance/public-services'}]}/></>}</>;
 }
}
export default function PoliticsPage(){const {pathname}=useLocation(),path=pathname.replace(/\/$/,'')||'/',record=politicsRecordForPath(path);if(!record)return <NotFoundPage/>;return <PoliticsShell record={record} governance={path.startsWith('/governance/')}><Content key={record.route} record={record}/></PoliticsShell>;}
