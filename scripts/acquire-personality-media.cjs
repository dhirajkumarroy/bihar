// Editorial asset acquisition, separate from builds. Preserve source rights metadata.
const fs=require('node:fs'),path=require('node:path');
const sharp=require('../.g9-browser-audit/c8-tools/node_modules/sharp');
const requests=require('../docs/P1-MEDIA-REQUESTS.json');
const root=path.resolve(__dirname,'../public/images/personalities/rajendra-prasad');
const clean=value=>String(value||'').replace(/<[^>]*>/g,'').replace(/&amp;/g,'&').replace(/&#39;/g,"'").trim();
async function get(url){const r=await fetch(url,{headers:{'User-Agent':'BiharPortalEditorial/1.0 (historical photograph attribution)'},signal:AbortSignal.timeout(30000)});if(!r.ok)throw Error(r.status+' '+url);return r;}
(async()=>{
 fs.mkdirSync(root,{recursive:true});const ledgerFile=path.join(root,'credits.json');const ledger=fs.existsSync(ledgerFile)?JSON.parse(fs.readFileSync(ledgerFile,'utf8')):[];
 for(const asset of requests){
  if(ledger.some(x=>x.id===asset.id)&&!process.argv.includes('--refresh='+asset.id)&&(asset.page||1)===(ledger.find(x=>x.id===asset.id).page||1))continue;
  try{
   const url=new URL('https://commons.wikimedia.org/w/api.php');url.search=new URLSearchParams({action:'query',format:'json',titles:'File:'+asset.file,prop:'imageinfo',iiprop:'url|extmetadata',iiurlwidth:'1200',...(asset.page?{iiurlparam:'page'+asset.page}:{})});
   const d=await(await get(url)).json(),info=Object.values(d.query.pages)[0].imageinfo?.[0];if(!info)throw Error('No file');
   const m=info.extmetadata,license=clean(m.LicenseShortName?.value),licenseUrl=m.LicenseUrl?.value||(/^Public domain/.test(license)?'https://creativecommons.org/publicdomain/mark/1.0/':'');
   if(!/^(CC BY|CC0|Public domain|GODL-India)/.test(license)||!licenseUrl)throw Error('Manual licence review: '+license);
   console.log('SOURCE',asset.id,JSON.stringify({license,description:clean(m.ImageDescription?.value),date:clean(m.DateTimeOriginal?.value),credit:clean(m.Artist?.value)}));
   const input=Buffer.from(await(await get(info.thumburl||info.url)).arrayBuffer()),original=sharp(input);
   const src='/images/personalities/rajendra-prasad/'+asset.id+'.webp';
   const encoded=await original.clone().resize({width:1200,withoutEnlargement:true}).webp({quality:80}).toBuffer();if(encoded.length>450*1024)throw Error('Optimise asset over 450KB');
   fs.writeFileSync(path.join(root,asset.id+'.webp'),encoded);
   await original.clone().resize({width:480,withoutEnlargement:true}).webp({quality:76}).toFile(path.join(root,asset.id+'-small.webp'));
   const dimensions=await sharp(encoded).metadata(),small=await sharp(path.join(root,asset.id+'-small.webp')).metadata();
   const previous=ledger.findIndex(x=>x.id===asset.id);if(previous>=0)ledger.splice(previous,1);
   ledger.push({id:asset.id,page:asset.page||1,src,thumbnail:src.replace('.webp','-small.webp'),width:dimensions.width,height:dimensions.height,smallWidth:small.width,alt:asset.alt,caption:asset.caption,credit:clean(m.Artist?.value),source:info.descriptionurl,original:info.url,license,licenseUrl,type:asset.type||'authentic-photograph',changes:'Resized and converted to WebP; no subject alterations or generated imagery.',reviewedOn:'2026-09-30'});
   fs.writeFileSync(ledgerFile,JSON.stringify(ledger,null,2)+'\n');console.log('SAVED',asset.id,encoded.length);
  }catch(e){console.error('FAILED',asset.id,e.message);process.exitCode=1;}
 }
})().catch(e=>{console.error(e);process.exitCode=1;});
