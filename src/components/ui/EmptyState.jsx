import {SearchX} from 'lucide-react';
import {Link} from 'react-router-dom';
const resolveAction=({action,actionLabel,actionTo})=>action||(actionLabel&&actionTo?<Link className="ui-button ui-button--secondary" to={actionTo}>{actionLabel}</Link>:null);
export default function EmptyState({title='कोई परिणाम नहीं मिला',text='वर्तनी या फ़िल्टर बदलकर दोबारा प्रयास करें।',action}) {
  return <div className="ui-empty" role="status"><span><SearchX aria-hidden="true"/></span><h3>{title}</h3><p>{arguments[0].description||text}</p>{resolveAction(arguments[0])}</div>;
}
