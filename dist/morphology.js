// Species-independent region proposals. No botanical count is assumed or supplied.
const FlowerMorphology=(()=>{
 function components(mask,w,h){const seen=new Uint8Array(mask.length),out=[];for(let p=0;p<mask.length;p++){if(!mask[p]||seen[p])continue;const q=[p];seen[p]=1;for(let i=0;i<q.length;i++){const v=q[i],x=v%w,y=Math.floor(v/w);for(const u of [x?v-1:-1,x<w-1?v+1:-1,y?v-w:-1,y<h-1?v+w:-1])if(u>=0&&mask[u]&&!seen[u]){seen[u]=1;q.push(u);}}out.push(q);}return out;}
 function summarize(labels,data,w,h){const map=new Map();for(let p=0;p<labels.length;p++)if(labels[p]){let r=map.get(labels[p]);if(!r){r={id:labels[p],area:0,x:0,y:0,minx:w,maxx:0,miny:h,maxy:0,r:0,g:0,b:0};map.set(r.id,r);}const x=p%w,y=Math.floor(p/w);r.area++;r.x+=x;r.y+=y;r.minx=Math.min(r.minx,x);r.maxx=Math.max(r.maxx,x);r.miny=Math.min(r.miny,y);r.maxy=Math.max(r.maxy,y);r.r+=data[p*4];r.g+=data[p*4+1];r.b+=data[p*4+2];}
 return [...map.values()].map(r=>({...r,x:r.x/r.area,y:r.y/r.area,colour:[r.r/r.area,r.g/r.area,r.b/r.area],extent:[r.maxx-r.minx+1,r.maxy-r.miny+1]}));}
 function run(data,mask,w,h,quality={usable:true}){
  const n=w*h,empty=reason=>({status:'unresolved',reason,width:w,height:h,methods:[],edges:new Float32Array(n)}),points=[];let cx=0,cy=0;
  for(let p=0;p<n;p++)if(mask[p]){points.push(p);cx+=p%w;cy+=Math.floor(p/w);}
  if(!quality.usable||points.length<180)return empty('Insufficient reliable flower pixels');
  if(points.some(p=>p%w===0||p%w===w-1||p<w||p>=n-w))return empty('Flower region touches the image boundary');
  cx/=points.length;cy/=points.length;
  const radii=points.map(p=>Math.hypot(p%w-cx,Math.floor(p/w)-cy)).sort((a,b)=>a-b),radius=radii[Math.floor(radii.length*.95)],domain=new Uint8Array(n);
  for(const p of points)if(Math.hypot(p%w-cx,Math.floor(p/w)-cy)>radius*.23&&!quality.centreMask?.[p])domain[p]=1;
  const rgb=new Float32Array(n*3),edges=new Float32Array(n);
  for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const p=y*w+x;for(let c=0;c<3;c++){let sum=0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)sum+=data[((y+dy)*w+x+dx)*4+c]*(dx===0?2:1)*(dy===0?2:1);rgb[p*3+c]=sum/4080;}}
  const values=[];for(let y=2;y<h-2;y++)for(let x=2;x<w-2;x++){const p=y*w+x;if(!domain[p])continue;let max=0;for(const q of [p-1,p+1,p-w,p+w])if(domain[q]){let d=0;for(let c=0;c<3;c++)d+=(rgb[p*3+c]-rgb[q*3+c])**2;max=Math.max(max,Math.sqrt(d));}edges[p]=max;values.push(max);}
  values.sort((a,b)=>a-b);const minArea=Math.max(15,Math.round(points.length*.008));
  function closed(threshold){
   const strong=Uint8Array.from(edges,(v,p)=>domain[p]&&v>threshold?1:0),dilate=new Uint8Array(n),wall=new Uint8Array(n);
   for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){let yes=0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)yes|=strong[(y+dy)*w+x+dx];dilate[y*w+x]=yes;}
   for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){let yes=1;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)yes&=dilate[(y+dy)*w+x+dx];wall[y*w+x]=yes&&domain[y*w+x];}
   const open=Uint8Array.from(domain,(v,p)=>v&&!wall[p]?1:0),parts=components(open,w,h).filter(g=>g.length>=minArea),labels=new Uint16Array(n);
   if(parts.length>64)return {labels,count:parts.length,oversegmented:true};parts.forEach((g,i)=>g.forEach(p=>labels[p]=i+1));return{labels,count:parts.length,oversegmented:false};
  }
  const threshold=Math.max(.035,values[Math.floor(values.length*.78)]||0),primary=closed(threshold),lo=closed(threshold*.8),hi=closed(threshold*1.2);
  const method=(name,labels,extra={})=>{const regions=summarize(labels,data,w,h);return{name,status:'exploratory',count:regions.length,regions,labels,...extra};};
  const methods=[method('closed_edges',primary.labels,{threshold,countRange:[Math.min(lo.count,primary.count,hi.count),Math.max(lo.count,primary.count,hi.count)],oversegmented:primary.oversegmented})];
  // Automatic markers come from sizable interiors, not a required petal count.
  if(lo.count!==primary.count)methods.push(method('closed_edges_fine',lo.labels,{threshold:threshold*.8,countRange:[Math.min(lo.count,primary.count,hi.count),Math.max(lo.count,primary.count,hi.count)]}));
  if(hi.count!==primary.count&&hi.count!==lo.count)methods.push(method('closed_edges_coarse',hi.labels,{threshold:threshold*1.2}));
  const seedParts=components(Uint8Array.from(lo.labels,v=>v?1:0),w,h).filter(g=>g.length>=minArea*2),labels=new Uint16Array(n),cost=new Float64Array(n).fill(Infinity),heap=[];
  function push(p,c,id){let i=heap.length;heap.push({p,c,id});while(i){const parent=(i-1)>>1;if(heap[parent].c<=c)break;heap[i]=heap[parent];i=parent;}heap[i]={p,c,id};}
  function pop(){const first=heap[0],last=heap.pop();if(heap.length){let i=0;while(i*2+1<heap.length){let j=i*2+1;if(j+1<heap.length&&heap[j+1].c<heap[j].c)j++;if(heap[j].c>=last.c)break;heap[i]=heap[j];i=j;}heap[i]=last;}return first;}
  if(seedParts.length>=2&&seedParts.length<=32){seedParts.forEach((g,i)=>{for(const p of g){labels[p]=i+1;cost[p]=0;push(p,0,i+1);}});
   while(heap.length){const {p,c,id}=pop();if(c!==cost[p]||labels[p]!==id)continue;const x=p%w,y=Math.floor(p/w);for(const q of [x?p-1:-1,x<w-1?p+1:-1,y?p-w:-1,y<h-1?p+w:-1])if(q>=0&&domain[q]){const next=c+1+edges[q]*40;if(next<cost[q]){cost[q]=next;labels[q]=id;push(q,next,id);}}}
   // Merge adjacent fragments only when mean colour and their interface both agree.
   const stats=summarize(labels,data,w,h),by=new Map(stats.map(r=>[r.id,r])),adj=new Map(),parent=new Map(stats.map(r=>[r.id,r.id]));const root=id=>{while(parent.get(id)!==id)id=parent.get(id);return id;};
   for(let p=0;p<n;p++)if(labels[p])for(const q of [p%w<w-1?p+1:-1,p+w<n?p+w:-1])if(q>=0&&labels[q]&&labels[p]!==labels[q]){const a=Math.min(labels[p],labels[q]),b=Math.max(labels[p],labels[q]),key=a+':'+b,r=adj.get(key)||{a,b,sum:0,n:0};r.sum+=Math.max(edges[p],edges[q]);r.n++;adj.set(key,r);}
   for(const r of adj.values()){const a=by.get(r.a),b=by.get(r.b);if(Math.hypot(...a.colour.map((v,i)=>(v-b.colour[i])/255))<.10&&r.sum/r.n<threshold*.65)parent.set(root(r.b),root(r.a));}
   const ids=new Map();for(let p=0;p<n;p++)if(labels[p]){const id=root(labels[p]);if(!ids.has(id))ids.set(id,ids.size+1);labels[p]=ids.get(id);}methods.push(method('seeded_gradient_flood',labels,{seedCount:seedParts.length}));
  }
  return{status:'exploratory',reason:'Closed-edge and seeded-flood regions are proposals, not verified petals; counts do not enter identification scores',width:w,height:h,centre:{x:cx,y:cy,inferred:true},edges,methods};
 }
 return{run};
})();
if(typeof module!=='undefined')module.exports=FlowerMorphology;
