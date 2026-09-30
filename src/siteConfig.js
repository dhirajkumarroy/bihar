const configuredUrl=import.meta.env.VITE_SITE_URL||'https://bihar-eight.vercel.app';

export const siteConfig=Object.freeze({
 name:'सम्पूर्ण बिहार',
 alternateName:'Sampoorn Bihar',
 url:configuredUrl.replace(/\/+$/,''),
 contactEmail:import.meta.env.VITE_CONTACT_EMAIL||'contact@sampoornbihar.in',
 privacyEmail:import.meta.env.VITE_PRIVACY_EMAIL||'privacy@sampoornbihar.in',
 correctionsEmail:import.meta.env.VITE_CORRECTIONS_EMAIL||'corrections@sampoornbihar.in',
 analyticsMeasurementId:import.meta.env.VITE_GA_MEASUREMENT_ID||'G-NVED04F4SW',
 policyLastUpdated:'2026-09-26'
});

export const absoluteUrl=path=>`${siteConfig.url}${path?.startsWith('/')?path:`/${path||''}`}`;
