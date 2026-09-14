export default function SearchToolbar({children,className='',label='खोज और फ़िल्टर'}) {
  return <div className={`ui-toolbar${className?` ${className}`:''}`} role="search" aria-label={label}>{children}</div>;
}
