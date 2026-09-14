export default function Chip({active=false,className='',...props}) {
  return <button type="button" aria-pressed={active} className={`ui-chip${active?' is-active':''}${className?` ${className}`:''}`} {...props}/>;
}
export const FilterChip=Chip;
