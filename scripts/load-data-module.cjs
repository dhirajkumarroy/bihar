// Read local data modules with their imports intact. No import stripping or network.
const fs=require('node:fs');
const path=require('node:path');
const {registerHooks}=require('node:module');
const root=path.resolve(__dirname,'../src/data');
const resolveData=filename=>[filename,`${filename}.js`,path.join(filename,'index.js')].find(candidate=>fs.existsSync(candidate)&&fs.statSync(candidate).isFile());
registerHooks({resolve(specifier,context,nextResolve){
 if(specifier.startsWith('.')&&context.parentURL?.includes('/src/data/')){
  const {fileURLToPath,pathToFileURL}=require('node:url');
  const target=resolveData(path.resolve(path.dirname(fileURLToPath(context.parentURL)),specifier));
  if(target)return nextResolve(pathToFileURL(target).href,context);
 }
 return nextResolve(specifier,context);
}});
function loadDataModule(filename){
 const resolved=path.resolve(filename);
 const target=resolveData(resolved);
 if(!target||!target.startsWith(root+path.sep))throw new Error(`Invalid data module: ${filename}`);
 return require(target);
}
module.exports={loadDataModule};
