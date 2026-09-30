import {chiefMinisters} from './governments';
import {personalities} from '../catalog';
import {makeRecord} from './model';
const canonicalPeople=personalities.filter(item=>['rajendra-prasad','jayaprakash-narayan','kunwar-singh'].includes(item.slug)).map(item=>makeRecord('person-reference',item.slug,item.name,item.slug.replaceAll('-',' '),item.role,['history'],{evidence:'historical',route:`/personalities/${item.slug}`,canonicalEntityRef:`personalities:${item.slug}`,aliases:item.aliases||[]}));
export const politicalFigures=[...chiefMinisters,...canonicalPeople];
