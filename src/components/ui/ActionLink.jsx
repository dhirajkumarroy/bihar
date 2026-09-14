import {ArrowRight} from 'lucide-react';
export default function ActionLink({as:Component='span',children,className='',...props}) {
  return <Component className={`ui-action-link${className?` ${className}`:''}`} {...props}>{children}<ArrowRight aria-hidden="true"/></Component>;
}
