import {patnaDistrict} from './patna';
import {patnaDivisionDistricts} from './patnaDivision';
import {magadhDivisionDistricts} from './magadhDivision';
import {tirhutDivisionDistricts} from './tirhutDivision';
import {saranDivisionDistricts,darbhangaDivisionDistricts} from './saranDarbhangaDivisions';
import {kosiDivisionDistricts,purniaDivisionDistricts} from './kosiPurniaDivisions';
import {bhagalpurDivisionDistricts,mungerDivisionDistricts} from './bhagalpurMungerDivisions';

export {patnaDistrict} from './patna';
export {patnaDivisionDistricts,nalandaDistrict,bhojpurDistrict,buxarDistrict,rohtasDistrict,kaimurDistrict} from './patnaDivision';
export {magadhDivisionDistricts,gayaDistrict,nawadaDistrict,aurangabadDistrict,jehanabadDistrict,arwalDistrict} from './magadhDivision';
export {tirhutDivisionDistricts,muzaffarpurDistrict,eastChamparanDistrict,westChamparanDistrict,sitamarhiDistrict,sheoharDistrict,vaishaliDistrict} from './tirhutDivision';
export {saranDivisionDistricts,darbhangaDivisionDistricts,saranDistrict,siwanDistrict,gopalganjDistrict,darbhangaDistrict,madhubaniDistrict,samastipurDistrict} from './saranDarbhangaDivisions';
export {kosiDivisionDistricts,purniaDivisionDistricts,saharsaDistrict,supaulDistrict,madhepuraDistrict,purniaDistrict,katiharDistrict,arariaDistrict,kishanganjDistrict} from './kosiPurniaDivisions';
export {bhagalpurDivisionDistricts,mungerDivisionDistricts,bhagalpurDistrict,bankaDistrict,mungerDistrict,jamuiDistrict,khagariaDistrict,lakhisaraiDistrict,sheikhpuraDistrict,begusaraiDistrict} from './bhagalpurMungerDivisions';
export const deepDistricts=[patnaDistrict,...patnaDivisionDistricts,...magadhDivisionDistricts,...tirhutDivisionDistricts,...saranDivisionDistricts,...darbhangaDivisionDistricts,...kosiDivisionDistricts,...purniaDivisionDistricts,...bhagalpurDivisionDistricts,...mungerDivisionDistricts];
export const deepDistrictBySlug=slug=>deepDistricts.find(d=>d.slug===slug);
