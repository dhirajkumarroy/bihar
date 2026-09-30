// Native-module structural/history-route audit; not a historical fact certification.
const {loadDataModule:load}=require('./load-data-module.cjs'),path=require('node:path');
const m=load(path.resolve(__dirname,'../src/data/history/index.js'));
const pages=['ancientPages','magadhaPages','mauryaPages','h5Pages','h6Pages','h7Pages','h8Pages'].flatMap(key=>m[key]||[]);
const routes=new Set(),errors=[];
for(const x of pages){if(!x.slug||!x.title)errors.push('Missing slug/title');const route='/history/'+x.slug;if(routes.has(route))errors.push('Duplicate '+route);routes.add(route);}
// Period landing pages may be served by the existing overview renderer.
for(const x of m.historyPeriods)if(x.route&&!routes.has(x.route)&&!m.historyPeriods.some(p=>p.route===x.route&&p.id===x.route.split('/').at(-1)))errors.push('Unresolved history-period target '+x.route);
console.log(`History structural audit: ${pages.length} deep pages, ${m.historyPeriods.length} periods; ${errors.length} errors.`);
errors.forEach(x=>console.error(x));if(errors.length)process.exitCode=1;
