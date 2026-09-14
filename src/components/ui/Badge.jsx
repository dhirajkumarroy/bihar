export default function Badge({as:Component='span',variant='neutral',className='',...props}) {
  return <Component className={`ui-badge ui-badge--${variant}${className?` ${className}`:''}`} {...props}/>;
}
