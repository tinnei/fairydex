import { assets } from './assets.mjs';
const json=(data,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
export default {async fetch(req,env){
 const url=new URL(req.url),path=url.pathname;
 if(!path.startsWith('/api/')){
 const redirects={'/dev':'/dev/','/collect':'/dev/collect','/collect/':'/dev/collect','/collect.html':'/dev/collect'};
 if(redirects[path])return Response.redirect(new URL(redirects[path],url),308);
 const key=path==='/dev/'?'/dev/index.html':path==='/dev/collect'||path==='/dev/collect/'?'/dev/collect.html':path==='/'?'/index.html':path;
 const asset=assets[key];if(!asset)return new Response('Not found',{status:404});return new Response(Uint8Array.from(atob(asset.data),c=>c.charCodeAt(0)),{headers:{'Content-Type':asset.type}})}
 const user=req.headers.get('oai-authenticated-user-id');if(!user)return json({error:'Sign in to use your collection.'},401);
 if(req.method!=='GET'&&req.headers.get('Origin')!==url.origin)return json({error:'Invalid request origin.'},403);
 if(!env.BUCKET)return json({error:'Collection storage unavailable. Please retry later.'},503);
 const prefix='observations/'+encodeURIComponent(user)+'/';
 try{
 if(path==='/api/observations'&&req.method==='GET'){
 const page=await env.BUCKET.list({prefix,limit:30,cursor:url.searchParams.get('cursor')||undefined,include:['customMetadata']});
 return json({items:page.objects.map(o=>JSON.parse(o.customMetadata.record)),cursor:page.truncated?page.cursor:null});}
 if(path==='/api/observations'&&req.method==='POST'){
 if(Number(req.headers.get('content-length'))>12582912)return json({error:'Choose a photo smaller than 10 MB.'},413);
 const form=await req.formData(),photo=form.get('photo');if(!photo||typeof photo.arrayBuffer!=='function'||photo.size>10485760||!photo.size)return json({error:'Choose a photo smaller than 10 MB.'},400);
 const bytes=new Uint8Array(await photo.arrayBuffer());const type=bytes[0]===255&&bytes[1]===216?'image/jpeg':bytes[0]===137&&bytes[1]===80&&bytes[2]===78&&bytes[3]===71?'image/png':String.fromCharCode(...bytes.slice(0,4))==='RIFF'&&String.fromCharCode(...bytes.slice(8,12))==='WEBP'?'image/webp':null;
 if(!type)return json({error:'Use a JPEG, PNG or WebP photo. Export HEIC as JPEG first.'},400);
 let input;try{input=JSON.parse(form.get('metadata'))}catch{return json({error:'Invalid observation details.'},400)}
 if(!input||!Number.isFinite(Date.parse(input.observedAt)))return json({error:'Choose a valid observation time.'},400);
 const location=input.location;if(location&&(!Number.isFinite(location.latitude)||Math.abs(location.latitude)>90||!Number.isFinite(location.longitude)||Math.abs(location.longitude)>180||!Number.isFinite(location.accuracy)||location.accuracy<0))return json({error:'Invalid location.'},400);
 const id=input.id;if(typeof id!=='string'||!/^\d{13}-[0-9a-f-]{36}$/.test(id))return json({error:'Invalid observation ID.'},400);
 const key=prefix+id,prior=await env.BUCKET.head(key);if(prior)return json(JSON.parse(prior.customMetadata.record));
 const record={id,observedAt:new Date(input.observedAt).toISOString(),uploadedAt:new Date().toISOString(),name:null,status:'unidentified',notes:String(input.notes||'').slice(0,300),filename:String(photo.name||'photo').slice(0,100),location:location?{latitude:location.latitude,longitude:location.longitude,accuracy:location.accuracy,capturedAt:String(location.capturedAt||'').slice(0,40),source:'device_at_collection'}:null};
 await env.BUCKET.put(key,bytes,{httpMetadata:{contentType:type},customMetadata:{record:JSON.stringify(record)}});return json(record,201);}
 const match=path.match(/^\/api\/observations\/(\d{13}-[0-9a-f-]{36})\/photo$/);
 if(match&&req.method==='GET'){const object=await env.BUCKET.get(prefix+match[1]);if(!object)return json({error:'Photo not found.'},404);return new Response(object.body,{headers:{'Content-Type':object.httpMetadata.contentType,'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}})}
 return json({error:'Not found.'},404);
 }catch(error){console.error('Collection request failed',error);return json({error:'Could not access your collection. Your selected photo has not been cleared; please retry.'},503)}
}};
