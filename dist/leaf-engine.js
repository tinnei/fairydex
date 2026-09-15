// Full-photo leaf/leaflet candidates. Geometry never establishes plant association.
const LeafEngine=(()=>{
 const min=a=>a.reduce((v,x)=>Math.min(v,x),Infinity),max=a=>a.reduce((v,x)=>Math.max(v,x),-Infinity);
 const empty=reason=>({shape:null,endShape:null,tip:null,base:null,margin:null,arrangement:null,reason});
 function components(mask,w,h){const seen=new Uint8Array(mask.length),out=[];for(let p=0;p<mask.length;p++){if(!mask[p]||seen[p])continue;const q=[p];seen[p]=1;for(let i=0;i<q.length;i++){const a=q[i],x=a%w,y=Math.floor(a/w);for(const b of [x?a-1:-1,x<w-1?a+1:-1,y?a-w:-1,y<h-1?a+w:-1])if(b>=0&&mask[b]&&!seen[b]){seen[b]=1;q.push(b);}}out.push(q);}return out;}
 function measure(points,w,h){
  const n=points.length;
  if(n>w*h*.65)return {area:n,box:null,axis:null,quality:0,usable:false,issues:['Large connected vegetation; overlapping blades possible'],observations:empty('Large connected vegetation; overlapping blades possible')};
  const cx=points.reduce((a,p)=>a+p%w,0)/n,cy=points.reduce((a,p)=>a+Math.floor(p/w),0)/n;
  let xx=0,xy=0,yy=0;for(const p of points){const x=p%w-cx,y=Math.floor(p/w)-cy;xx+=x*x;xy+=x*y;yy+=y*y;}
  const angle=.5*Math.atan2(2*xy,xx-yy),ux=Math.cos(angle),uy=Math.sin(angle),coords=points.map(p=>{const x=p%w-cx,y=Math.floor(p/w)-cy;return [x*ux+y*uy,-x*uy+y*ux];}),ts=coords.map(c=>c[0]),vs=coords.map(c=>c[1]),lo=min(ts),hi=max(ts),left=min(vs),right=max(vs),length=hi-lo+1,width=right-left+1,ratio=length/width,fill=n/(length*width);
  const clipped=points.some(p=>p%w<2||p%w>=w-2||p<w*2||p>=w*(h-2));
  const issues=[];if(n<100||length<25||width<8)issues.push('Too small for blade geometry');if(clipped)issues.push('Boundary reaches photo edge');if(n>w*h*.65)issues.push('Large connected vegetation; overlapping blades possible');if(fill<.55||fill>.9||ratio>8)issues.push('Irregular or merged region; single blade unresolved');
  const bins=Array.from({length:20},()=>[]);for(const [t,v] of coords)bins[Math.min(19,Math.floor((t-lo)/(hi-lo||1)*20))].push(v);
  const widths=bins.map(b=>b.length?max(b)-min(b)+1:0),end=(a,b)=>widths[b]?widths[a]/widths[b]:1;
  let shape=null,endShape=null;if(!issues.length){shape=ratio<1.3?'round':ratio>2.8?'narrow':'broad';if(length>=40&&ratio>=1.3){const ends=[end(1,4),end(18,15)];endShape=ends.some(r=>r<.42)?'pointed_end':ends.every(r=>r>.65)?'rounded_ends':'unclear';}}
  const quality=issues.length?0:Math.min(1,n/700)*Math.min(1,width/25);
  return {area:n,box:{x:min(points.map(p=>p%w)),y:min(points.map(p=>Math.floor(p/w))),right:max(points.map(p=>p%w)),bottom:max(points.map(p=>Math.floor(p/w)))},axis:{x1:cx+lo*ux,y1:cy+lo*uy,x2:cx+hi*ux,y2:cy+hi*uy},ratio,fill,quality,usable:!issues.length,issues,observations:{...empty(issues.join('; ')||'Selected green region silhouette; leaf/leaflet hypothesis'),shape,endShape}};
 }
 function analyze(data,w,h,flowerMask){
  const raw=new Uint8Array(w*h),core=new Uint8Array(w*h),labels=new Uint16Array(w*h);
  for(let p=0;p<raw.length;p++){const r=data[p*4],g=data[p*4+1],b=data[p*4+2];raw[p]=data[p*4+3]>=128&&!flowerMask?.[p]&&g>r*1.04&&g>b*1.15&&g>35&&g-Math.min(r,b)>18?1:0;}
  // A one-pixel opening separates narrow stems without filling gaps between blades.
  for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const p=y*w+x;core[p]=raw[p]&&raw[p-1]&&raw[p+1]&&raw[p-w]&&raw[p+w]?1:0;}
  const groups=components(core,w,h).filter(p=>p.length>=40).sort((a,b)=>b.length-a.length).slice(0,12),candidates=[];
  for(let i=0;i<groups.length;i++){const set=new Set(groups[i]);for(const p of groups[i])for(const q of [p-1,p+1,p-w,p+w])if(q>=0&&q<raw.length&&Math.abs(q%w-p%w)<=1&&raw[q])set.add(q);const points=[...set];const m=measure(points,w,h);
   // Low-contrast mask borders often cut through one shaded blade rather than its edge.
   let boundary=0,supported=0;for(const p of points){let outside=0,strong=0;for(const q of [p-1,p+1,p-w,p+w])if(q>=0&&q<raw.length&&Math.abs(q%w-p%w)<=1&&!set.has(q)){outside++;const delta=Math.hypot(data[p*4]-data[q*4],data[p*4+1]-data[q*4+1],data[p*4+2]-data[q*4+2])/(255*Math.sqrt(3));if(delta>.08)strong++;}if(outside){boundary++;if(strong) supported++;}}
   m.boundary_support=boundary?supported/boundary:0;
   if(m.usable&&m.boundary_support<.6){m.usable=false;m.quality=0;m.issues.push('Weak boundary; colour mask may cut through a shaded or overlapping blade');m.observations=empty(m.issues.join('; '));}
   candidates.push({...m,id:i+1});for(const p of points)if(!labels[p])labels[p]=i+1;}
  const selected=candidates.filter(c=>c.usable).sort((a,b)=>b.quality-a.quality||b.area-a.area)[0]||null,mask=Uint8Array.from(labels,v=>selected&&v===selected.id?1:0);
  return {version:'0.1',sample:{width:w,height:h},association:'unverified',status:selected?'leaf_region_candidate':'unresolved',selectedId:selected?.id||null,previewId:selected?.id||candidates.find(c=>c.box)?.id||null,candidates,labels,mask,observations:selected?.observations||empty('No sufficiently complete isolated green blade'),quality:selected?.quality||0};
 }
 // Coarsening reference outlines is one-way; broad does not establish heart/oval anatomy.
 function rank(leaf,knowledge){const coarse={oval:'broad',lance:'narrow',linear:'narrow',round:'round'};
  return (knowledge?.plants||[]).map(p=>{const trait=p.traits.leafShape,values=trait?.values||[],expected=[...new Set(values.map(v=>coarse[v]).filter(Boolean))],unmapped=values.filter(v=>!coarse[v]);const observed=leaf.observations.shape;
   // Unmapped alternatives may fit: do not treat incomplete knowledge as conflict.
   const match=observed&&expected.includes(observed),assessable=!!observed&&expected.length>0&&(match||!unmapped.length),score=assessable?(match?1:0):null;
   return {id:p.id,name:p.name,score,coverage:assessable?1:0,observed,expected,reference_shapes:values,sources:p.sources.filter(s=>trait?.sources.includes(s.id)),scope:p.scopeNote,missing:['verified tip','margin','base','attachment','arrangement'],association:'unverified'};
  }).sort((a,b)=>(b.score??-.1)-(a.score??-.1));
 }
 function combine(out,leaf,leafRanks){const best=out.candidates[0]?.score||0,nearTie=.04,cap=.025;const candidates=out.candidates.map(c=>{const evidence=leafRanks.find(r=>r.id===c.id),eligible=out.quality.usable&&best-c.score<=nearTie&&evidence?.score!=null,penalty=eligible?cap*leaf.quality*(1-evidence.score):0;return {...c,flower_score:c.score,leaf_evidence:evidence||null,leaf_adjustment:-penalty,score:Math.max(0,c.score-penalty)};}).sort((a,b)=>b.score-a.score).map((c,i)=>({...c,rank:i+1}));
  const top=candidates[0],lead=top.score-(candidates[1]?.score||0);return {...out,leaf,leaf_ranking:leafRanks,candidates,decision:{...out.decision,accepted:false,prediction:null,top_score:top.score,match_strength:top.score,lead},leaf_policy:{association:'unverified',maximum_penalty:cap,flower_near_tie:nearTie,meaning:'Nearby leaf compatibility can weakly separate near-tied flower candidates; never establish a species.'}};
 }
 return {analyze,measure,rank,combine};
})();
if(typeof module!=='undefined')module.exports=LeafEngine;
