import {readdir,readFile,writeFile,mkdir} from 'node:fs/promises';
const assets={};const types={html:'text/html; charset=utf-8',js:'text/javascript; charset=utf-8',css:'text/css; charset=utf-8',png:'image/png',jpg:'image/jpeg',json:'application/json'};
async function collect(dir,prefix=''){for(const f of await readdir(dir,{withFileTypes:true})){if(f.name==='server'||f.name==='.openai')continue;const name=prefix+'/'+f.name;if(f.isDirectory())await collect(dir+'/'+f.name,name);else assets[name]={type:types[f.name.split('.').pop()]||'application/octet-stream',data:(await readFile(dir+'/'+f.name)).toString('base64')}}}
await collect('dist');await mkdir('dist/server',{recursive:true});await mkdir('dist/.openai',{recursive:true});
await writeFile('dist/server/assets.mjs','export const assets = '+JSON.stringify(assets)+';');await writeFile('dist/server/index.js',await readFile('server/worker.mjs'));await writeFile('dist/.openai/hosting.json',await readFile('.openai/hosting.json'));
