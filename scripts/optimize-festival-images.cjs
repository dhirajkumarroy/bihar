// Optional local asset-build tool: npm install --prefix .g9-browser-audit/c8-tools sharp
const fs=require('node:fs'),path=require('node:path');
const sharp=require('../.g9-browser-audit/c8-tools/node_modules/sharp');
const manifest=require('../docs/C8-IMAGE-PROMPTS.json');
const root=path.resolve(__dirname,'../public/images/festivals');
(async()=>{for(const asset of manifest.assets){
 const target=path.resolve(root,asset.file);
 if(!target.startsWith(root+path.sep))throw Error('Invalid asset path');
 fs.mkdirSync(path.dirname(target),{recursive:true});
 for(const [file,width] of [[target,1440],[target.replace('.webp','-small.webp'),640]]){
  await sharp(asset.original).resize({width,withoutEnlargement:true}).webp({quality:79,effort:5}).toFile(file);
  const info=await sharp(file).metadata();console.log(path.relative(root,file),info.width,info.height,fs.statSync(file).size);
 }
}})().catch(error=>{console.error(error);process.exit(1)});
