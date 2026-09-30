const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..'),read=file=>fs.readFileSync(path.join(root,file),'utf8');
const failures=[],check=(condition,message)=>{if(!condition)failures.push(message)};
const app=read('src/App.jsx'),footer=read('src/components/Layout.jsx'),policy=read('src/pages/PolicyPages.jsx'),portal=read('src/components/Portal.jsx'),consent=read('src/components/CookieConsent.jsx'),search=read('src/pages/SearchPage.jsx'),index=read('index.html'),robots=read('public/robots.txt'),sitemapScript=read('scripts/generate-sitemap.cjs'),vercel=read('vercel.json');
const routes=['/about','/contact','/privacy','/cookies','/editorial-policy','/advertising','/disclaimer','/terms','/about/data-freshness'];
for(const route of routes){check(app.includes(`path="${route}"`),`missing policy route ${route}`);check(sitemapScript.includes(`addUrl('${route}'`),`policy route absent from sitemap generator: ${route}`)}
for(const heading of ['गोपनीयता नीति','उपयोग की शर्तें','अस्वीकरण','संपादकीय और corrections नीति','विज्ञापन और affiliate disclosure'])check(policy.includes(heading),`missing policy content: ${heading}`);
for(const route of ['/privacy','/contact','/editorial-policy','/advertising','/terms'])check(footer.includes(`to="${route}"`),`footer lacks accessible link ${route}`);
check(consent.includes('localStorage')&&consent.includes('Analytics स्वीकार करें')&&consent.includes('Analytics अस्वीकार करें'),'cookie preference controls are incomplete');
check(!/googletagmanager\.com\/gtag\/js/.test(index),'Analytics must not load in static HTML before consent');
check(portal.includes('noIndex')&&portal.includes('siteConfig.url'),'SEO component lacks controlled noindex/canonical support');
check(search.includes('noIndex'),'internal search must be noindex');
check(!sitemapScript.includes("addUrl('/search'"),'internal search must not be in sitemap');
check(!sitemapScript.includes('<lastmod>${today}</lastmod>'),'sitemap must not fake lastmod timestamps');
check(robots.includes('User-agent: *')&&robots.includes('Sitemap:'),'robots.txt lacks crawl/sitemap directives');
check(index.includes('rel="canonical"')&&index.includes('https://bihar-eight.vercel.app/'),'static HTML lacks root canonical');
check(vercel.includes('"source": "/(.*)"')&&vercel.includes('"destination": "/index.html"'),'Vercel SPA deep-link rewrite is missing');
if(failures.length){console.error(`SEO/policy validation failed: ${failures.length}`);failures.forEach(message=>console.error(`  × ${message}`));process.exit(1)}
console.log('SEO and policy validation passed');console.log(`Public policy routes: ${routes.length}`);console.log('Consent-gated Analytics: passed');console.log('Search indexing boundary: passed');console.log('Sitemap/robots checks: passed');
