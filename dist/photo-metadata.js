// Small, read-only JPEG EXIF reader. Missing or malformed fields stay unknown.
const PhotoMetadata=(()=>{
 const bytesToText=(bytes,start,length)=>String.fromCharCode(...bytes.slice(start,start+length)).replace(/\0.*$/,'').trim();
 function readExif(bytes){
  if(bytes.length<12||bytes[0]!==0xff||bytes[1]!==0xd8)return{};
  let pos=2;
  while(pos+4<=bytes.length){if(bytes[pos]!==0xff)break;const marker=bytes[pos+1];if(marker===0xda||marker===0xd9)break;const length=(bytes[pos+2]<<8)|bytes[pos+3];if(length<2||pos+2+length>bytes.length)break;
   if(marker===0xe1&&length>=8&&bytesToText(bytes,pos+4,6)==='Exif'){
    return readTiff(bytes,pos+10,pos+2+length);
   }pos+=2+length;
  }return{};
 }
 function readTiff(bytes,base=0,end=bytes.length){
    const little=bytes[base]===0x49&&bytes[base+1]===0x49;if(!little&&!(bytes[base]===0x4d&&bytes[base+1]===0x4d))return{};
    const u16=p=>p+2<=end?(little?bytes[p]|bytes[p+1]<<8:bytes[p]<<8|bytes[p+1]):null;
    const u32=p=>p+4<=end?(little?(bytes[p]|bytes[p+1]<<8|bytes[p+2]<<16|bytes[p+3]<<24)>>>0:((bytes[p]<<24|bytes[p+1]<<16|bytes[p+2]<<8|bytes[p+3])>>>0)):null;
    if(u16(base+2)!==42)return{};
    function entries(offset){if(!Number.isInteger(offset)||offset<8)return new Map();const start=base+offset,n=u16(start);if(n==null||n>100||start+2+n*12>end)return new Map();const map=new Map();for(let i=0;i<n;i++){const p=start+2+i*12,tag=u16(p),type=u16(p+2),count=u32(p+4),value=u32(p+8);if(tag!=null&&type!=null&&count!=null&&value!=null)map.set(tag,{type,count,value,inline:p+8})}return map}
    function field(map,tag){const e=map.get(tag);if(!e)return null;const unit={1:1,2:1,3:2,4:4,5:8,7:1,10:8}[e.type];if(!unit||e.count>1000)return null;const length=e.count*unit,start=length<=4?e.inline:base+e.value;if(start<base||start+length>end)return null;return{...e,start,length}}
    function ascii(map,tag){const f=field(map,tag);return f?.type===2?bytesToText(bytes,f.start,f.length):null}
    function rational(map,tag){const f=field(map,tag);if(!f||![5,10].includes(f.type)||f.count<3)return null;const out=[];for(let i=0;i<3;i++){const a=u32(f.start+i*8),b=u32(f.start+i*8+4);if(a==null||!b)return null;out.push(a/b)}return out}
    const root=entries(u32(base+4)),exif=entries(root.get(0x8769)?.value),gps=entries(root.get(0x8825)?.value);
    const rawTime=ascii(exif,0x9003)||ascii(exif,0x9004),offset=ascii(exif,0x9011)||ascii(exif,0x9012)||null;
    let localTime=null;if(rawTime&&/^\d{4}:\d{2}:\d{2} \d{2}:\d{2}:\d{2}$/.test(rawTime)){const value=rawTime.replace(/^(.{4}):(.{2}):(.{2}) /,'$1-$2-$3T');if(validLocalTime(value))localTime=value}
    let coordinates=null;const lat=rational(gps,2),lon=rational(gps,4),latRef=ascii(gps,1),lonRef=ascii(gps,3);if(lat&&lon&&[lat,lon].every(v=>v[0]>=0&&v[1]>=0&&v[1]<60&&v[2]>=0&&v[2]<60)&&/^[NS]$/.test(latRef||'')&&/^[EW]$/.test(lonRef||'')){const latitude=(lat[0]+lat[1]/60+lat[2]/3600)*(latRef==='S'?-1:1),longitude=(lon[0]+lon[1]/60+lon[2]/3600)*(lonRef==='W'?-1:1);if(Number.isFinite(latitude)&&Math.abs(latitude)<=90&&Number.isFinite(longitude)&&Math.abs(longitude)<=180)coordinates={latitude,longitude,accuracy:null,capturedAt:null,source:'photo_exif'}}
    return{localTime,offset:/^[+-](?:0\d|1[0-3]):[0-5]\d$|^[+-]14:00$/.test(offset||'')?offset:null,coordinates};
 }
 function validLocalTime(value){if(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(value))return false;const date=new Date(value+'Z');return Number.isFinite(date.getTime())&&date.toISOString().slice(0,19)===value}
 function readImage(bytes){
  if(bytes[0]===255&&bytes[1]===216)return readExif(bytes);
  const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
  if(bytes[0]===137&&bytesToText(bytes,1,3)==='PNG'){for(let p=8;p+12<=bytes.length;){const n=view.getUint32(p);if(p+12+n>bytes.length)break;if(bytesToText(bytes,p+4,4)==='eXIf')return readTiff(bytes,p+8,p+8+n);p+=12+n}}
  if(bytesToText(bytes,0,4)==='RIFF'&&bytesToText(bytes,8,4)==='WEBP'){for(let p=12;p+8<=bytes.length;){const n=view.getUint32(p+4,true);if(p+8+n>bytes.length)break;if(bytesToText(bytes,p,4)==='EXIF'){const base=p+8+(bytesToText(bytes,p+8,6)==='Exif'?6:0);return readTiff(bytes,base,p+8+n)}p+=8+n+(n%2)}}return{};
 }
 async function fromFile(file){try{const bytes=new Uint8Array(await file.arrayBuffer());return readImage(bytes)}catch{return{}}}
 return{readExif,readImage,validLocalTime,fromFile};
})();
if(typeof module!=='undefined')module.exports=PhotoMetadata;
