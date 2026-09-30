const fs=require('fs');
const path=require('path');
const root=path.join(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const assert=(condition,message)=>{if(!condition)throw new Error(message);};

const index=read('src/data/searchIndex.js');
const page=read('src/pages/SearchPage.jsx');
const requiredTypes=['जिला','पर्यटन','इतिहास','नदी','प्राकृतिक क्षेत्र','जल तंत्र','पारिस्थितिकी','कृषि','अर्थव्यवस्था','समाज','शासन','व्यक्तित्व','लेख'];

assert(index.includes('export const searchIndex=mergeEntries(')&&index.includes('politicsSearchRecords'),'Canonical politics search integration is missing');
assert(index.includes('const mergeEntries='),'Search index must deduplicate canonical routes');
assert(index.includes('const scoreEntry='),'Search index must define ranking');
assert(index.includes('if(title===query)return 1000;'),'Exact canonical-title ranking is missing');
assert(index.includes('if(aliases.includes(query))return 940;'),'Exact alias ranking is missing');
assert(requiredTypes.every(type=>index.includes(`type:'${type}'`)||index.includes(`'${type}'`)),`Search index is missing one or more content types: ${requiredTypes.join(', ')}`);
assert(!index.includes('body.map('),'Search index must not import complete blog article bodies');
assert(page.includes('useSearchParams'),'Search query must be preserved in the URL');
assert(page.includes('searchPortal(query)'),'Search page must use the central search index');
assert(page.includes('noIndex'),'Search page must be noindex');
assert(!page.includes('cultureSearchByQuery'),'Legacy per-page search filtering should not remain');

console.log('Search index audit passed');
console.log(`Covered content types: ${requiredTypes.length}`);
console.log('Canonical deduplication: enabled');
console.log('URL query state: enabled');
