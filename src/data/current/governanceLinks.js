import {departments,publicServices} from '../governance';
// Migrate existing dated link checks without inventing a newer verification date.
export const governanceLinkRecords=[
 ...departments.map(item=>({id:`governance-department-${item.id}`,name:item.nameHi,entityType:'department',entityId:item.id,dataType:'directory-link',value:{label:item.nameHi,url:item.officialUrl},effectiveFrom:null,effectiveTo:null,lastVerified:item.lastVerified,freshnessPolicy:'directory-link-90',status:'current',source:{...item.sources[0],accessedAt:item.lastVerified},notes:'नाम और लिंक का पूर्व सत्यापन; विभागीय पुनर्गठन और कार्य-आवंटन मूल सरकारी निर्देश से जाँचें।',confidence:'dated-source'})),
 ...publicServices.map(item=>({id:`governance-service-${item.id}`,name:item.nameHi,entityType:'service',entityId:item.id,dataType:'directory-link',value:{label:item.nameHi,url:item.officialUrl},effectiveFrom:null,effectiveTo:null,lastVerified:item.lastVerified,freshnessPolicy:'directory-link-90',status:'current',source:{...item.source,accessedAt:item.lastVerified},notes:'यह आधिकारिक प्रवेश-लिंक का dated record है; आवेदन स्वीकार होने, पात्रता या सेवा चालू होने की गारंटी नहीं।',confidence:'dated-source'}))
];
