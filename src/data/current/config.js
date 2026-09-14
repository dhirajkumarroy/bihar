export const currentDataTypes=['officeholder','project-status','institution-leadership','event-date','visitor-notice','administrative-count','statistic','operational-status','legal-status','designation-status','other-current'];
export const currentRecordStatuses=['current','scheduled','expired','superseded','unverified','archived'];

export const freshnessPolicies={
 'officeholder-30':{id:'officeholder-30',label:'पदाधिकारी',maxAgeDays:30,dueSoonRatio:.2,staleBehavior:'fallback'},
 'project-status-90':{id:'project-status-90',label:'परियोजना स्थिति',maxAgeDays:90,dueSoonRatio:.2,staleBehavior:'show-stale-warning'},
 'operational-status-90':{id:'operational-status-90',label:'संचालन स्थिति',maxAgeDays:90,dueSoonRatio:.2,staleBehavior:'show-stale-warning'},
 'administrative-count-180':{id:'administrative-count-180',label:'प्रशासनिक गणना',maxAgeDays:180,dueSoonRatio:.2,staleBehavior:'fallback'},
 'annual-statistic-450':{id:'annual-statistic-450',label:'वार्षिक आँकड़ा',maxAgeDays:450,dueSoonRatio:.2,staleBehavior:'show-stale'},
 'event-explicit':{id:'event-explicit',label:'तारीख वाला आयोजन',maxAgeDays:null,dueSoonRatio:0,staleBehavior:'archive'},
 'visitor-notice-explicit':{id:'visitor-notice-explicit',label:'यात्री सूचना',maxAgeDays:null,dueSoonRatio:0,staleBehavior:'hide'}
};

export const currentDataOwnership=[
 {module:'G1 Geography',class:'D',rule:'वर्ष-लेबल वाले स्थिर भौगोलिक आँकड़े; live weather नहीं।'},
 {module:'G2 Water',class:'D',rule:'स्थिर hydrology; live river-level या flood alert नहीं।'},
 {module:'G3 Ecology',class:'D',rule:'स्थिर ecology; sightings और access alerts नहीं।'},
 {module:'G4 Agriculture',class:'D',rule:'स्थिर farming context; prices/advisories नहीं।'},
 {module:'G5 Economy',class:'B/C',rule:'परियोजना, airport operational status और latest-known markers central registry में।'},
 {module:'G6 Society',class:'D',rule:'Census और dated human-development series स्थिर रहते हैं।'},
 {module:'G7 Institutions',class:'C',rule:'भविष्य के leadership records central registry में; अभी कोई record नहीं।'},
 {module:'G8 Governance',class:'A/B',rule:'Governor/Chief Minister officeholder and administrative counts central registry में।'},
 {module:'Tourism',class:'E',rule:'केवल dated official visitor notices; initial registry intentionally empty।'},
 {module:'Festivals',class:'E',rule:'Officially published event dates only; seasonal context stable module में।'}
];

export const currentEntityKeys={
 administration:['subdivisions','blocks'],
 statistic:['gsdp-current-2023-24','pcgsdp-current-2023-24'],
 event:['chhath']
};

export const currentDataMethodology={
 referenceDate:'2026-09-13',
 correctionContact:'corrections@sampoornbihar.in',
 policyVersion:'G9 / 2026-09-13',
 staleMessage:'वर्तमान जानकारी पुनः सत्यापनाधीन है।',
 unavailableMessage:'वर्तमान जानकारी सत्यापनाधीन है।'
};
