// Fetch openly licensed Commons media and retain machine-readable attribution.
// Run only when updating editorial assets; not needed for application builds.
const fs=require('node:fs'),path=require('node:path');
const sharp=require('../.g9-browser-audit/c8-tools/node_modules/sharp');
const requests=require('../docs/C9-MEDIA-REQUESTS.json');
const root=path.resolve(__dirname,'../public/images/religion');
const clean=value=>String(value||'').replace(/<[^>]*>/g,'').replace(/&amp;/g,'&').replace(/&#39;/g,"'").trim();
const headers={'User-Agent':'SampoornBiharEditorial/1.0 (cultural heritage image attribution audit)'};
async function get(url){const result=await fetch(url,{headers,signal:AbortSignal.timeout(30000)});if(!result.ok)throw Error(result.status+' '+url);return result;}
(async()=>{
 fs.mkdirSync(root,{recursive:true});
 const ledgerFile=path.join(root,'credits.json'),ledger=fs.existsSync(ledgerFile)?JSON.parse(fs.readFileSync(ledgerFile,'utf8')):[];
 for(const asset of requests){
  if(ledger.some(x=>x.id===asset.id)&&fs.existsSync(path.join(root,asset.folder,asset.id+'.webp')))continue;
  try{
   const url=new URL('https://commons.wikimedia.org/w/api.php');url.search=new URLSearchParams({action:'query',format:'json',titles:'File:'+asset.file,prop:'imageinfo',iiprop:'url|extmetadata',iiurlwidth:'1440'});
   const data=await(await get(url)).json(),page=Object.values(data.query.pages)[0],info=page.imageinfo?.[0];if(!info)throw Error('Missing file '+asset.file);
   const m=info.extmetadata,license=clean(m.LicenseShortName?.value),licenseUrl=m.LicenseUrl?.value;
   if(!/^(CC BY|CC0|Public domain)/.test(license)||!licenseUrl)throw Error('License needs manual review: '+license);
   const input=asset.local?fs.readFileSync(path.resolve(__dirname,'../public',asset.local)):Buffer.from(await(await get(info.thumburl||info.url)).arrayBuffer());
   const folder=path.join(root,asset.folder);fs.mkdirSync(folder,{recursive:true});
   const original=sharp(input);const src='/images/religion/'+asset.folder+'/'+asset.id+'.webp';
   let encoded;for(const quality of [82,75,68,60,52]){encoded=await original.clone().resize({width:1440,withoutEnlargement:true}).webp({quality}).toBuffer();if(encoded.length<=450*1024)break;}
   if(encoded.length>450*1024)throw Error('Image needs manual optimisation: '+asset.id);
   fs.writeFileSync(path.join(folder,asset.id+'.webp'),encoded);
   await original.clone().resize({width:640,withoutEnlargement:true}).webp({quality:79}).toFile(path.join(folder,asset.id+'-small.webp'));
   const dimensions=await sharp(path.join(folder,asset.id+'.webp')).metadata();
   ledger.push({id:asset.id,src,thumbnail:src.replace('.webp','-small.webp'),alt:asset.alt,caption:asset.caption||asset.alt,credit:clean(m.Artist?.value),source:info.descriptionurl,original:info.url,license,licenseUrl,usageStatus:'open-license',type:'authentic-photograph',changes:'Resized and converted to WebP; no generated content or subject alterations.',width:dimensions.width,height:dimensions.height,verifiedOn:'2026-09-30'});
   fs.writeFileSync(ledgerFile,JSON.stringify(ledger,null,2)+'\n');console.log('SAVED',asset.id,license);
  }catch(error){console.error('FAILED',asset.id,error.message);process.exitCode=1;}
 }
})();
