import {h5Pages,h6Pages,h7Pages,h8Pages,mauryaPages} from '../../data/history';
import AncientHistoryPage from './AncientHistoryPage';
import MauryaHistoryPage from './MauryaHistoryPage';
import KnowledgeHistoryPage from './KnowledgeHistoryPage';
import MedievalHistoryPage from './MedievalHistoryPage';
import ColonialHistoryPage from './ColonialHistoryPage';
import ModernHistoryPage from './ModernHistoryPage';

export default function HistoryDetailPage({page}){
  if(h8Pages.some(item=>item.slug===page.slug)) return <ModernHistoryPage page={page}/>;
  if(h7Pages.some(item=>item.slug===page.slug)) return <ColonialHistoryPage page={page}/>;
  if(h6Pages.some(item=>item.slug===page.slug)) return <MedievalHistoryPage page={page}/>;
  if(h5Pages.some(item=>item.slug===page.slug)) return <KnowledgeHistoryPage page={page}/>;
  return mauryaPages.some(item=>item.slug===page.slug)
    ? <MauryaHistoryPage page={page}/>
    : <AncientHistoryPage page={page}/>;
}
