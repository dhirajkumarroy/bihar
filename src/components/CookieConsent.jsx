import {useEffect,useState} from 'react';
import {Link} from 'react-router-dom';
import {siteConfig} from '../siteConfig';

const storageKey='sampoorn-bihar-cookie-preference';
const readPreference=()=>{try{return localStorage.getItem(storageKey)}catch{return null}};

function startAnalytics(){
 const id=siteConfig.analyticsMeasurementId;
 if(!id||document.querySelector(`script[data-sampoorn-analytics="${id}"]`))return;
 window[`ga-disable-${id}`]=false;
 window.dataLayer=window.dataLayer||[];
 window.gtag=window.gtag||function(){window.dataLayer.push(arguments)};
 window.gtag('js',new Date());
 window.gtag('config',id,{anonymize_ip:true});
 const script=document.createElement('script');script.async=true;script.src=`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;script.dataset.sampoornAnalytics=id;document.head.appendChild(script);
}

export default function CookieConsent(){
 const [preference,setPreference]=useState(()=>readPreference());
 useEffect(()=>{if(preference==='accepted')startAnalytics();if(preference==='declined')window[`ga-disable-${siteConfig.analyticsMeasurementId}`]=true;},[preference]);
 useEffect(()=>{const reopen=()=>setPreference(null);window.addEventListener('sampoorn-bihar:cookie-settings',reopen);return()=>window.removeEventListener('sampoorn-bihar:cookie-settings',reopen)},[]);
 const choose=value=>{try{localStorage.setItem(storageKey,value)}catch{}setPreference(value)};
 if(preference)return null;
 return <aside className="cookie-consent" role="dialog" aria-label="कुकी विकल्प" aria-live="polite"><div><b>कुकी विकल्प</b><p>हम केवल आपकी अनुमति पर Google Analytics का उपयोग करते हैं ताकि यह समझ सकें कि कौन-से पृष्ठ उपयोगी हैं। आवश्यक site preference आपके browser में रहती है।</p><Link to="/privacy">गोपनीयता नीति पढ़ें</Link> · <Link to="/cookies">कुकी नीति</Link></div><div className="cookie-actions"><button type="button" className="secondary" onClick={()=>choose('declined')}>Analytics अस्वीकार करें</button><button type="button" className="primary" onClick={()=>choose('accepted')}>Analytics स्वीकार करें</button></div></aside>
}
