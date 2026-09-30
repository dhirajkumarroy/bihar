const fs = require('fs');
const path = require('path');

const baseUrl = process.env.SITE_URL || 'https://bihar-eight.vercel.app';

// Helper to extract exported items
const load = (relPath, varNames) => {
  try {
    const fullPath = path.join(__dirname, '..', relPath);
    if (!fs.existsSync(fullPath)) return {};
    let code = fs.readFileSync(fullPath, 'utf8')
      .replace(/import\s+.*?from\s+['"].*?['"];?/g, '')
      .replace(/export\s+(const|let|var|function|default)\s+/g, '$1 ')
      .replace(/export\s+\{.*?\};?/g, '');
    return Function(`${code}; return { ${varNames.map(v => `${v}: typeof ${v} !== 'undefined' ? ${v} : undefined`).join(', ')} };`)();
  } catch (err) {
    console.warn(`Could not parse ${relPath}:`, err.message);
    return {};
  }
};

const urls = new Set();

const addUrl = (route, priority = '0.7', changefreq = 'monthly') => {
  if (!route) return;
  const cleanRoute = route.startsWith('/') ? route : `/${route}`;
  urls.add(JSON.stringify({ loc: `${baseUrl}${cleanRoute}`, priority, changefreq }));
};

// 1. Core High-Priority Pages
addUrl('/', '1.0', 'weekly');
addUrl('/districts', '0.9', 'weekly');
addUrl('/tourism', '0.9', 'weekly');
addUrl('/culture', '0.9', 'weekly');
addUrl('/history', '0.9', 'weekly');
addUrl('/geography', '0.8', 'monthly');
addUrl('/food', '0.8', 'monthly');
addUrl('/languages', '0.8', 'monthly');
addUrl('/personalities', '0.8', 'monthly');
addUrl('/economy', '0.8', 'monthly');
addUrl('/society', '0.8', 'monthly');
addUrl('/governance', '0.8', 'monthly');
addUrl('/blog', '0.8', 'weekly');
addUrl('/about/data-freshness', '0.6', 'monthly');
addUrl('/about', '0.5', 'monthly');
addUrl('/contact', '0.4', 'monthly');
addUrl('/privacy', '0.3', 'yearly');
addUrl('/cookies', '0.3', 'yearly');
addUrl('/editorial-policy', '0.4', 'yearly');
addUrl('/advertising', '0.3', 'yearly');
addUrl('/disclaimer', '0.3', 'yearly');
addUrl('/terms', '0.3', 'yearly');

// 2. All 38 Districts
const { districts } = load('src/data/districts.js', ['districts']);
if (districts && Array.isArray(districts)) {
  districts.forEach(d => {
    if (d.slug) addUrl(`/district/${d.slug}`, '0.85', 'weekly');
  });
}

// 3. Tourism Destinations & Circuits
const { destinations } = load('src/data/tourism.js', ['destinations']);
if (destinations && Array.isArray(destinations)) {
  destinations.forEach(d => {
    if (d.slug) addUrl(`/tourism/${d.slug}`, '0.8', 'monthly');
  });
}

const { circuits } = load('src/data/tourism/circuits.js', ['circuits']);
if (circuits && Array.isArray(circuits)) {
  circuits.forEach(c => {
    if (c.slug || c.id) addUrl(`/tourism/circuits/${c.slug || c.id}`, '0.8', 'monthly');
  });
}

// 4. History Periods
const { historyPeriods } = load('src/data/history/periods.js', ['historyPeriods']);
if (historyPeriods && Array.isArray(historyPeriods)) {
  historyPeriods.forEach(h => {
    if (h.slug) addUrl(`/history/${h.slug}`, '0.75', 'monthly');
  });
}

// 5. Culture Traditions & Festivals
const festivalData=require('./load-data-module.cjs').loadDataModule(path.join(__dirname,'../src/data/festivals/index.js'));
for(const route of festivalData.festivalRoutes)addUrl(route,'0.75','monthly');
const religionData=require('./load-data-module.cjs').loadDataModule(path.join(__dirname,'../src/data/religion/index.js'));
for(const route of religionData.religionRoutes)addUrl(route,'0.75','monthly');

// 6. Food, Languages, Rivers, Personalities from catalog
const { foods, languages, personalities, rivers } = load('src/data/catalog.js', ['foods', 'languages', 'personalities', 'rivers']);
if (foods && Array.isArray(foods)) foods.forEach(x => x.slug && addUrl(`/food/${x.slug}`, '0.7', 'monthly'));
if (languages && Array.isArray(languages)) languages.forEach(x => x.slug && addUrl(`/languages/${x.slug}`, '0.7', 'monthly'));
if (rivers && Array.isArray(rivers)) rivers.forEach(x => x.slug && addUrl(`/geography/rivers/${x.slug}`, '0.75', 'monthly'));
if (personalities && Array.isArray(personalities)) personalities.forEach(x => x.slug && addUrl(`/personalities/${x.slug}`, '0.7', 'monthly'));

// 7. Blog posts
const { posts } = load('src/data/blogs.js', ['posts']);
if (posts && Array.isArray(posts)) posts.forEach(p => p.slug && addUrl(`/blog/${p.slug}`, '0.7', 'monthly'));

// 8. Geography Systems & Subpages
addUrl('/geography/rivers', '0.8', 'monthly');
addUrl('/geography/natural-regions', '0.75', 'monthly');
addUrl('/geography/basins', '0.75', 'monthly');
addUrl('/geography/water-systems', '0.75', 'monthly');
addUrl('/geography/groundwater', '0.7', 'monthly');
addUrl('/geography/irrigation', '0.7', 'monthly');
addUrl('/geography/floodplains', '0.7', 'monthly');
addUrl('/geography/ecology', '0.75', 'monthly');
addUrl('/geography/agriculture', '0.75', 'monthly');

// 9. Governance & Society & Economy Subpages
addUrl('/governance/administration', '0.7', 'monthly');
addUrl('/governance/state-government', '0.7', 'monthly');
addUrl('/governance/legislature', '0.7', 'monthly');
addUrl('/governance/executive', '0.7', 'monthly');
addUrl('/governance/judiciary', '0.7', 'monthly');
addUrl('/governance/local-government', '0.7', 'monthly');
addUrl('/governance/district-administration', '0.7', 'monthly');

addUrl('/society/population', '0.7', 'monthly');
addUrl('/society/urbanization', '0.7', 'monthly');
addUrl('/society/education', '0.7', 'monthly');
addUrl('/society/health', '0.7', 'monthly');
addUrl('/society/human-development', '0.7', 'monthly');

addUrl('/economy/sectors', '0.7', 'monthly');
addUrl('/economy/industry', '0.7', 'monthly');
addUrl('/economy/infrastructure', '0.7', 'monthly');
addUrl('/economy/transport', '0.7', 'monthly');
addUrl('/geography/agriculture', '0.75', 'monthly');

// Compile XML
// G7 uses actual module imports, including all valid detail routes; no filters/aliases.
const {loadDataModule}=require('./load-data-module.cjs');
const {politicsRoutes}=loadDataModule(path.join(__dirname,'../src/data/politics/index.js'));
for(const route of politicsRoutes)addUrl(route,'0.7','monthly');
for(const route of ['/governance/state','/governance/district','/governance/block','/governance/panchayati-raj','/governance/urban-local-bodies','/governance/public-services'])addUrl(route,'0.7','monthly');
// P1: index its real cross-module destinations as well as the existing profile URL.
// Legacy loaders omit some deep history/tourism records; do not duplicate known URLs.
const {rajendraPrasad:p1}=loadDataModule(path.join(__dirname,'../src/data/personalities/index.js'));
const knownPaths=new Set(Array.from(urls).map(s=>new URL(JSON.parse(s).loc).pathname));
for(const route of [p1.canonical,...p1.sections.flatMap(s=>(s.links||[]).map(([,to])=>to)),...p1.places.map(p=>p.to),...p1.relatedPeople.filter(p=>p.to).map(p=>p.to),'/history/rajendra-prasad']){
 const clean=route.split('#')[0];if(!knownPaths.has(clean)){addUrl(clean,'0.7','monthly');knownPaths.add(clean);}
}
const urlList = Array.from(urls).map(s => JSON.parse(s));
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlList.map(item => `  <url>
    <loc>${item.loc}</loc>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
fs.writeFileSync(sitemapPath, xml, 'utf8');
console.log(`Successfully generated sitemap with ${urlList.length} indexed URLs at ${sitemapPath}`);
