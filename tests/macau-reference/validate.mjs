import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const root=new URL('./',import.meta.url),manifest=JSON.parse(await readFile(new URL('manifest.json',root),'utf8'));
const sources=new Set(),files=new Set(),hashes=new Set(),counts={};
for(const item of manifest.images){
 for(const key of ['file','expectedLabel','author','license','licenseUrl','sourcePage','originalUrl'])if(!item[key])throw Error(`${item.file}: missing ${key}`);
 if(item.file.includes('..')||item.file.startsWith('/'))throw Error('Unsafe file path');
 const source=new URL(item.originalUrl);source.search='';
 const bytes=await readFile(new URL(item.file,root));
 if(bytes[0]!==255||bytes[1]!==216)throw Error(`${item.file}: not JPEG`);
 const hash=createHash('sha256').update(bytes).digest('hex');
 if(files.has(item.file)||sources.has(source.href)||hashes.has(hash))throw Error(`${item.file}: duplicate file/source/content`);
 files.add(item.file);sources.add(source.href);hashes.add(hash);counts[item.expectedLabel]=(counts[item.expectedLabel]||0)+1;
 if(item.labelStatus!=='unverified'&&!(item.labelStatus==='disputed'&&item.reviewStatus==='quarantined'))throw Error(`${item.file}: needs explicit review provenance`);
}
console.log(JSON.stringify({images:files.size,counts,quarantined:manifest.images.filter(i=>i.reviewStatus==='quarantined').length,checks:'required attribution, unique paths/sources/bytes, JPEG signatures, provisional labels'},null,2));
