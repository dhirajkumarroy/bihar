export default function Card({as:Component='article',className='',interactive=false,...props}) {
  return <Component className={`ui-card${interactive?' ui-card--interactive':''}${className?` ${className}`:''}`} {...props}/>;
}
