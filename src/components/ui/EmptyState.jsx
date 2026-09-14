import {SearchX} from 'lucide-react';
export default function EmptyState({title='कोई परिणाम नहीं मिला',text='वर्तनी या फ़िल्टर बदलकर दोबारा प्रयास करें।',action}) {
  return <div className="ui-empty" role="status"><span><SearchX aria-hidden="true"/></span><h3>{title}</h3><p>{text}</p>{action}</div>;
}
