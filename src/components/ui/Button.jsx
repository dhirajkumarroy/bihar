export default function Button({as:Component='button',variant='primary',size='md',className='',type,...props}) {
  return <Component type={Component==='button'?(type||'button'):type} className={`ui-button ui-button--${variant} ui-button--${size}${className?` ${className}`:''}`} {...props}/>;
}
