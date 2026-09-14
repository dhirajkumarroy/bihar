export default function SectionHeader({eyebrow,title,description,action,dark=false,className=''}) {
  return <div className={`ui-section-header${dark?' is-dark':''}${className?` ${className}`:''}`}><div>{eyebrow&&<span>{eyebrow}</span>}<h2>{title}</h2>{description&&<p>{description}</p>}</div>{action&&<div className="ui-section-header__action">{action}</div>}</div>;
}
