// One-off asset format optimisation. Only files explicitly named in the C9 media ledger.
const fs=require('node:fs'),path=require('node:path');
const sharp=require('../.g9-browser-audit/c8-tools/node_modules/sharp');
const root=path.resolve(__dirname,'../public');
const media=require('./load-data-module.cjs').loadDataModule(path.resolve(__dirname,'../src/data/religion/media.js')).religionMedia;
(async()=>{for(const m of media){const file=path.resolve(root,'.'+m.src);if(!file.startsWith(path.join(root,'images/religion')+path.sep))throw Error('Unsafe target');if(fs.statSync(file).size<=450*1024)continue;const input=fs.readFileSync(file);let output;for(const quality of [75,68,60,52]){output=await sharp(input).webp({quality}).toBuffer();if(output.length<=450*1024)break;}if(output.length>450*1024)throw Error('Could not meet budget '+m.id);fs.writeFileSync(file,output);console.log(m.id,output.length+' bytes');}})().catch(e=>{console.error(e);process.exitCode=1;});
