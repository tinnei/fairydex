// Pure RGBA engine: independent of DOM and species-specific branching.
const FlowerEngine = (()=>{
 const clamp=x=>Math.max(0,Math.min(1,x));
 function color(r,g,b){const max=Math.max(r,g,b),min=Math.min(r,g,b),d=max-min;let h=0;if(d){h=max===r?(g-b)/d:max===g?(b-r)/d+2:(r-g)/d+4;h=(h*60+360)%360}const s=max?d/max:0,v=max/255;let label='other';if(v<.18)label='dark';else if(s<.12)label=v>.55?'pale':'other';else if((h>=290||h<15)&&r>g+8)label=s<.65&&v>.5||h>=290?'pink':'red';else if(h<35)label='red';else if(h<72)label='yellow';else if(h<175)label='green';else if(h<290)label='blue';return {h,s,v,label};}
 function groups(mask,w,h){const seen=new Uint8Array(mask.length),out=[];for(let i=0;i<mask.length;i++){if(!mask[i]||seen[i])continue;const pixels=[],queue=[i];seen[i]=1;for(let j=0;j<queue.length;j++){const p=queue[j],x=p%w,y=Math.floor(p/w);pixels.push(p);for(const n of [x>0?p-1:-1,x<w-1?p+1:-1,y>0?p-w:-1,y<h-1?p+w:-1])if(n>=0&&mask[n]&&!seen[n]){seen[n]=1;queue.push(n)}}if(pixels.length>=8)out.push(pixels)}return out;}
 function smooth(values,r){return values.map((_,i)=>{let sum=0;for(let d=-r;d<=r;d++)sum+=values[(i+d+values.length)%values.length];return sum/(r*2+1)})}
 function peakCount(values){const mean=values.reduce((a,b)=>a+b,0)/values.length;let count=0;for(let i=0;i<values.length;i++)if(values[i]>values[(i+values.length-1)%values.length]&&values[i]>=values[(i+1)%values.length]&&values[i]>mean*1.04)count++;return count}
 function structure(chosen,flower,leaf,data,w,h,cx,cy,minx,miny,maxx,maxy){if(!chosen.length)return{circularity:null,solidity:null,aspect_ratio:null,symmetry:null,visible_tips_low:null,visible_tips_high:null,tip_stability:null,centre_contrast:null,vegetation_below:null,structural_class:'unknown'};let perimeter=0;const radii=Array(72).fill(0),inner=[0,0,0,0],outer=[0,0,0,0],maxRadius=Math.max(1,...chosen.map(p=>Math.hypot(p%w-cx,Math.floor(p/w)-cy)));for(const p of chosen){const x=p%w,y=Math.floor(p/w),r=Math.hypot(x-cx,y-cy),bin=Math.floor(((Math.atan2(y-cy,x-cx)+Math.PI*2)%(Math.PI*2))/(Math.PI*2)*72)%72;radii[bin]=Math.max(radii[bin],r);for(const n of [x?p-1:-1,x<w-1?p+1:-1,y?p-w:-1,y<h-1?p+w:-1])if(n<0||!flower[n])perimeter++;const bucket=r<=maxRadius*.32?inner:outer;bucket[0]+=data[p*4];bucket[1]+=data[p*4+1];bucket[2]+=data[p*4+2];bucket[3]++}for(let i=0;i<radii.length;i++)if(!radii[i]){let d=1;while(d<72&&!radii[(i-d+72)%72]&&!radii[(i+d)%72])d++;radii[i]=radii[(i-d+72)%72]||radii[(i+d)%72]||maxRadius*.5}const tips=[1,2,3].map(r=>peakCount(smooth(radii,r))).sort((a,b)=>a-b),low=tips[0],high=tips[2],stability=1-(high-low)/Math.max(1,high);let symmetry=0;for(const order of [3,4,5,6]){const a=Math.PI*2/order,co=Math.cos(a),si=Math.sin(a);let hit=0;for(const p of chosen){const x=p%w-cx,y=Math.floor(p/w)-cy,rx=Math.round(cx+x*co-y*si),ry=Math.round(cy+x*si+y*co);if(rx>=0&&rx<w&&ry>=0&&ry<h&&flower[ry*w+rx])hit++}symmetry=Math.max(symmetry,hit/chosen.length)}const avg=b=>b[3]?[b[0]/b[3],b[1]/b[3],b[2]/b[3]]:[0,0,0],ia=avg(inner),oa=avg(outer);let vegetation=0,below=0;for(let p=0;p<leaf.length;p++)if(leaf[p]){vegetation++;if(Math.floor(p/w)>cy)below++}const boxArea=(maxx-minx+1)*(maxy-miny+1),circularity=clamp(4*Math.PI*chosen.length/Math.max(1,perimeter*perimeter)),solidity=clamp(chosen.length/Math.max(1,boxArea)),aspect=(maxx-minx+1)/Math.max(1,maxy-miny+1),structuralClass=low>=9&&stability>.55?'many outline peaks':high<=7&&solidity>.45?'broad outline':aspect<.72?'elongated outline':'irregular outline';return{circularity,solidity,aspect_ratio:clamp(aspect/2),symmetry,visible_tips_low:clamp(low/20),visible_tips_high:clamp(high/20),tip_stability:clamp(stability),centre_contrast:clamp(Math.hypot(ia[0]-oa[0],ia[1]-oa[1],ia[2]-oa[2])/220),vegetation_below:vegetation?below/vegetation:null,structural_class:structuralClass}}

 // Silhouette observations only: never infer petal anatomy or total petal count.
 function describeOutline(mask,w,h,quality){
  const unknown=reason=>({outline:{value:'unknown',reason},tips:{value:'unknown',reason},scope:'selected region silhouette',petal_tip_shape:'unknown',petal_count:null});
  const pixels=[];let cx=0,cy=0,border=false;
  for(let p=0;p<mask.length;p++)if(mask[p]){pixels.push(p);cx+=p%w;cy+=Math.floor(p/w);if(p%w===0||p%w===w-1||p<w||p>=w*(h-1))border=true;}
  if(!quality.usable||pixels.length<150||border)return unknown(border?'Outline touches the image edge':'Region is too small or unreliable');
  cx/=pixels.length;cy/=pixels.length;
  const raw=Array(120).fill(0);for(const p of pixels){const x=p%w-cx,y=Math.floor(p/w)-cy;const a=(Math.atan2(y,x)+2*Math.PI)%(2*Math.PI);const i=Math.floor(a/(2*Math.PI)*120);raw[i]=Math.max(raw[i],Math.hypot(x,y));}
  if(raw.filter(r=>!r).length>12)return unknown('Incomplete radial outline');
  for(let i=0;i<120;i++)if(!raw[i])raw[i]=(raw[(i+119)%120]+raw[(i+1)%120])/2;
  const pass=radius=>{
   const r=smooth(raw,radius),mean=r.reduce((a,b)=>a+b)/120;
   const variation=Math.sqrt(r.reduce((a,b)=>a+(b-mean)**2,0)/120)/mean;
   const peaks=[];for(let i=0;i<120;i++)if(r[i]>r[(i+119)%120]&&r[i]>=r[(i+1)%120]&&r[i]>mean*1.08){
    // Prominent tips only; side slope provides a visible narrow/broad apex cue.
    const side=(r[(i+116)%120]+r[(i+4)%120])/2;
    if(r[i]-side>mean*.035)peaks.push((r[i]-side)/mean);
   }
   const narrow=peaks.filter(x=>x>.12).length;
   return {outline:variation<.07?'rounded':variation>.13?'lobed_or_elongated':'unknown',tips:peaks.length<3?'unknown':narrow/peaks.length>=.75?'pointed':narrow/peaks.length<=.25?'rounded':'mixed',peakCount:peaks.length};
  };
  const a=pass(1),b=pass(2),same=key=>a[key]===b[key]?a[key]:'unknown';
  return {outline:{value:same('outline'),reason:'Overall radius variation, checked at two smoothing scales'},tips:{value:same('tips'),reason:'Shape of prominent silhouette tips, checked at two smoothing scales'},scope:'selected region silhouette',petal_tip_shape:'unknown',petal_count:null};
 }

 // Bounded morphological closing joins small gaps between visible rays.
 function headProposal(data,w,h,colors){
  const n=w*h,ray=new Uint8Array(n),dilated=new Uint8Array(n),closed=new Uint8Array(n);
  for(let p=0;p<n;p++){const c=colors[p];ray[p]=data[p*4+3]>=128&&c.h>=30&&c.h<=75&&c.s>.35&&c.v>.65?1:0;}
  const radius=2;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){let hit=0;for(let dy=-radius;dy<=radius&&!hit;dy++)for(let dx=-radius;dx<=radius;dx++){const xx=x+dx,yy=y+dy;if(xx>=0&&xx<w&&yy>=0&&yy<h&&ray[yy*w+xx]){hit=1;break;}}dilated[y*w+x]=hit;}
  for(let y=radius;y<h-radius;y++)for(let x=radius;x<w-radius;x++){let hit=1;for(let dy=-radius;dy<=radius&&hit;dy++)for(let dx=-radius;dx<=radius;dx++)if(!dilated[(y+dy)*w+x+dx]){hit=0;break;}closed[y*w+x]=hit;}
  const proposals=[];
  for(const rim of groups(closed,w,h)){
   if(rim.length<80)continue;
   const xs=rim.map(p=>p%w),ys=rim.map(p=>Math.floor(p/w)),l=Math.min(...xs),r=Math.max(...xs),t=Math.min(...ys),b=Math.max(...ys);
   if(l<=2||t<=2||r>=w-3||b>=h-3||rim.length>n*.7)continue;
   const barrier=new Uint8Array(n);rim.forEach(p=>barrier[p]=1);
   const seen=new Uint8Array(n),q=[];for(let y=t;y<=b;y++)for(let x=l;x<=r;x++)if((x===l||x===r||y===t||y===b)&&!barrier[y*w+x]){q.push(y*w+x);seen[y*w+x]=1;}
   for(let j=0;j<q.length;j++){const p=q[j],x=p%w,y=Math.floor(p/w);for(const v of [x>l?p-1:-1,x<r?p+1:-1,y>t?p-w:-1,y<b?p+w:-1])if(v>=0&&!barrier[v]&&!seen[v]){seen[v]=1;q.push(v);}}
   const holes=new Uint8Array(n);for(let y=t;y<=b;y++)for(let x=l;x<=r;x++){const p=y*w+x;if(!barrier[p]&&!seen[p])holes[p]=1;}
   for(const centrePixels of groups(holes,w,h)){
    if(centrePixels.length<40||centrePixels.length<rim.length*.04||centrePixels.length>rim.length*2.5)continue;
    const cx=centrePixels.reduce((v,p)=>v+p%w,0)/centrePixels.length,cy=centrePixels.reduce((v,p)=>v+Math.floor(p/w),0)/centrePixels.length;
    if(Math.abs(cx-(l+r)/2)>(r-l)*.2||Math.abs(cy-(t+b)/2)>(b-t)*.2)continue;
    const sectors=new Set(),outer=new Uint8Array(n),centre=new Uint8Array(n),head=new Uint8Array(n);let rayN=0,rayV=0,centreV=0;
    for(const p of rim)if(ray[p]){outer[p]=1;head[p]=1;rayN++;rayV+=colors[p].v;sectors.add(Math.floor(((Math.atan2(Math.floor(p/w)-cy,p%w-cx)+2*Math.PI)%(2*Math.PI))/(2*Math.PI)*16));}
    for(const p of centrePixels){centre[p]=1;head[p]=1;centreV+=colors[p].v;}
    if(sectors.size<13||rayN<80)continue;
    const contrast=rayV/rayN-centreV/centrePixels.length;if(contrast<.12)continue;
    // Closed pixels only bridge the local ring, never fill the whole rectangle.
    rim.forEach(p=>head[p]=1);
    proposals.push({head,centre,rays:outer,area:rim.length+centrePixels.length,coverage:sectors.size/16,contrast,centreFraction:centrePixels.length/(rim.length+centrePixels.length)});
   }
  }
  proposals.sort((a,b)=>b.area-a.area);return proposals.length&&!(proposals[1]?.area>proposals[0].area*.8)?proposals[0]:null;
 }

 // Alternative spatial head hypothesis: a sizeable contrasting centre surrounded
 // by yellow rays. Does not require a closed colour boundary or a dark centre.
 // Species-independent; no petal count is inferred from angular samples.
 function spatialHead(data,w,h,colors){
  const n=w*h,warm=Uint8Array.from(colors,(c,p)=>data[p*4+3]>=128&&c.h>=15&&c.h<=60&&data[p*4]>data[p*4+1]*1.05&&c.s>.3&&c.v>.3?1:0),found=[];
  for(const pixels of groups(warm,w,h).sort((a,b)=>b.length-a.length).slice(0,3)){
   if(pixels.length<180)continue;
   const xs=pixels.map(p=>p%w).sort((a,b)=>a-b),ys=pixels.map(p=>Math.floor(p/w)).sort((a,b)=>a-b),q=(a,t)=>a[Math.floor((a.length-1)*t)];
   const initialX=(q(xs,.10)+q(xs,.90))/2,initialY=(q(ys,.10)+q(ys,.90))/2,rx=(q(xs,.90)-q(xs,.10))*.7,ry=(q(ys,.90)-q(ys,.10))*.7;
   const cx0=initialX,cy0=initialY;
   if(Math.min(rx,ry)<10||Math.min(rx,ry)/Math.max(rx,ry)<.65||cx0-rx<2||cy0-ry<2||cx0+rx>w-3||cy0+ry>h-3)continue;
   let cx=cx0,cy=cy0;
   const sample=(r,a)=>{const x=Math.round(cx+rx*r*Math.cos(a)),y=Math.round(cy+ry*r*Math.sin(a));return x>=0&&x<w&&y>=0&&y<h?y*w+x:-1;};
   let best=null;
   for(const dx of [-.2,-.1,0,.1,.2])for(const dy of [-.2,-.1,0,.1,.2]){cx=cx0+rx*dx;cy=cy0+ry*dy;
   for(const radius of [.38,.44,.50,.56,.62,.68]){
    let supported=0,contrast=0,raySectors=0;
    for(let j=0;j<24;j++){
     const a=j*Math.PI*2/24,inside=[0,0,0],outside=[0,0,0];let yellow=0,valid=true;
     for(const [offset,target] of [[-.10,inside],[-.04,inside],[.07,outside],[.14,outside]]){const p=sample(radius+offset,a);if(p<0||data[p*4+3]<128){valid=false;break;}for(let k=0;k<3;k++)target[k]+=data[p*4+k]/510;}
     if(!valid)continue;
     for(const r of [.78,.88,1]){const p=sample(r,a);if(p>=0&&colors[p].label==='yellow'&&colors[p].s>.3)yellow++;}
     if(yellow>=1)raySectors++;
     const delta=Math.hypot(...inside.map((v,k)=>v-outside[k]))/Math.sqrt(3);
     if(delta>.08&&yellow>=1){supported++;contrast+=delta;}
    }
    if(supported>=16&&raySectors>=20&&(!best||supported>best.supported||(supported===best.supported&&radius>best.radius)))best={cx,cy,radius,supported,coverage:raySectors/24,contrast:contrast/supported};
   }
   }
   if(!best)continue;cx=best.cx;cy=best.cy;
   const head=new Uint8Array(n),centre=new Uint8Array(n),rays=new Uint8Array(n);let area=0,centreN=0;
   for(let p=0;p<n;p++){if(data[p*4+3]<128)continue;const r=Math.hypot((p%w-cx)/rx,(Math.floor(p/w)-cy)/ry);if(r<=best.radius){centre[p]=head[p]=1;centreN++;area++;}else if(r<=1.28&&warm[p]){head[p]=rays[p]=1;area++;}}
   // Break narrow connections to stems before retaining the central component.
   // Restore the local boundary only inside the original proposal.
   const eroded=new Uint8Array(n),neck=2;
   for(let y=neck;y<h-neck;y++)for(let x=neck;x<w-neck;x++){let full=true;for(let dy=-neck;dy<=neck&&full;dy++)for(let dx=-neck;dx<=neck;dx++)if(!head[(y+dy)*w+x+dx]){full=false;break;}eroded[y*w+x]=full?1:0;}
   const attached=groups(eroded,w,h).find(g=>g.some(p=>centre[p]));if(!attached)continue;
   const restored=new Uint8Array(n);for(const p of attached)for(let dy=-neck;dy<=neck;dy++)for(let dx=-neck;dx<=neck;dx++){const x=p%w+dx,y=Math.floor(p/w)+dy;if(x>=0&&x<w&&y>=0&&y<h&&head[y*w+x])restored[y*w+x]=1;}
   area=0;centreN=0;for(let p=0;p<n;p++){head[p]=restored[p];if(!head[p])centre[p]=rays[p]=0;area+=head[p];centreN+=centre[p];}
   if(area>n*.7||area-centreN<80||centreN/area>.72)continue;
   found.push({head,centre,rays,area,coverage:best.coverage,contrast:best.contrast,centreFraction:centreN/area,method:'spatial_colour_transition'});
  }
  found.sort((a,b)=>b.area-a.area);return found.length&&!(found[1]?.area>found[0].area*.8)?found[0]:null;
 }

 // Count separated OUTER regions, never silhouette peaks or expected species petals.
 function petalRegions(mask,w,h,quality){
  const empty=reason=>({status:'unresolved',visible_region_count:null,category:'unresolved',unit:'petal_or_ray_region_candidate',shape:'unknown',reason,regions:[],labels:new Uint8Array(w*h)});
  const points=[];let cx=0,cy=0;for(let p=0;p<mask.length;p++)if(mask[p]){points.push(p);cx+=p%w;cy+=Math.floor(p/w);}
  if(!quality.usable||points.length<180)return empty('Region too small or unreliable');
  if(points.some(p=>p%w===0||p%w===w-1||p<w||p>=w*(h-1)))return empty('Flower boundary is clipped');
  cx/=points.length;cy/=points.length;
  const radii=points.map(p=>Math.hypot(p%w-cx,Math.floor(p/w)-cy)).sort((a,b)=>a-b),radius=radii[Math.floor(radii.length*.98)];
  function split(fraction){
   const outer=new Uint8Array(w*h);for(const p of points)if(Math.hypot(p%w-cx,Math.floor(p/w)-cy)>radius*fraction)outer[p]=1;
   return groups(outer,w,h).filter(g=>g.length>=Math.max(12,points.length*.012));
  }
  const trials=[.48,.54,.60].map(split),counts=trials.map(g=>g.length);
  if(counts.some(n=>n!==counts[0])||counts[0]<3||counts[0]>24)return empty('Outer regions merge or change count across three centre exclusions');
  const mid=trials[1];
  // Verify the same regions persist, not merely an equal count of different fragments.
  for(const other of [trials[0],trials[2]])for(const g of mid){const set=new Set(g);if(other.filter(hh=>hh.filter(p=>set.has(p)).length>=Math.min(g.length,hh.length)*.65).length!==1)return empty('Region boundaries are unstable');}
  const sorted=mid.map(g=>{let x=0,y=0;for(const p of g){x+=p%w;y+=Math.floor(p/w);}x/=g.length;y/=g.length;const a=Math.atan2(y-cy,x-cx),co=Math.cos(a),si=Math.sin(a);let minR=Infinity,maxR=-Infinity,minT=Infinity,maxT=-Infinity;for(const p of g){const dx=p%w-cx,dy=Math.floor(p/w)-cy,r=dx*co+dy*si,t=-dx*si+dy*co;minR=Math.min(minR,r);maxR=Math.max(maxR,r);minT=Math.min(minT,t);maxT=Math.max(maxT,t);}const ratio=(maxT-minT)/Math.max(1,maxR-minR);return{pixels:g,x,y,angle:a,shape:ratio>.8?'broad':ratio<.55?'narrow':'intermediate'};}).sort((a,b)=>a.angle-b.angle);
  const labels=new Uint8Array(w*h);sorted.forEach((r,i)=>r.pixels.forEach(p=>labels[p]=i+1));
  const broad=sorted.filter(r=>r.shape==='broad').length,narrow=sorted.filter(r=>r.shape==='narrow').length,shape=broad/sorted.length>=.75?'broad':narrow/sorted.length>=.75?'narrow':'mixed';
  return{status:'stable_region_candidates',visible_region_count:sorted.length,category:sorted.length<=6?String(sorted.length):'many',unit:'petal_or_ray_region_candidate',shape,reason:'Separated outer regions persist across three centre exclusions; hidden or overlapping petals are not counted',regions:sorted.map((r,i)=>({label:i+1,x:r.x,y:r.y,shape:r.shape,area:r.pixels.length})),labels};
 }

 // Edges are evidence of boundaries, not proof of anatomical petal divisions.
 function edgePetals(data,mask,w,h,quality){
  const n=w*h,gray=new Float32Array(n),blur=new Float32Array(n),gx=new Float32Array(n),gy=new Float32Array(n),edges=new Uint8Array(n),boundary=new Uint8Array(n);
  let cx=0,cy=0,count=0;const points=[];
  for(let p=0;p<n;p++){gray[p]=(.299*data[p*4]+.587*data[p*4+1]+.114*data[p*4+2])/255;if(mask[p]){cx+=p%w;cy+=Math.floor(p/w);count++;points.push(p);}}
  cx/=count||1;cy/=count||1;
  for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){let v=0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)v+=gray[(y+dy)*w+x+dx]*(dx===0?2:1)*(dy===0?2:1);blur[y*w+x]=v/16;}
  const magnitudes=[];
  for(let y=2;y<h-2;y++)for(let x=2;x<w-2;x++){const p=y*w+x;if(!mask[p]||!mask[p-2]||!mask[p+2]||!mask[p-2*w]||!mask[p+2*w])continue;
   gx[p]=(blur[p-w+1]+2*blur[p+1]+blur[p+w+1]-blur[p-w-1]-2*blur[p-1]-blur[p+w-1])/4;
   gy[p]=(blur[p+w-1]+2*blur[p+w]+blur[p+w+1]-blur[p-w-1]-2*blur[p-w]-blur[p-w+1])/4;
   magnitudes.push(Math.hypot(gx[p],gy[p]));
  }
  magnitudes.sort((a,b)=>a-b);const threshold=Math.max(.025,(magnitudes[Math.floor(magnitudes.length*.85)]||0)*.7);
  for(let p=0;p<n;p++)if(Math.hypot(gx[p],gy[p])>threshold)edges[p]=1;
  const base=petalRegions(mask,w,h,quality),radius=points.length?points.map(p=>Math.hypot(p%w-cx,Math.floor(p/w)-cy)).sort((a,b)=>a-b)[Math.floor(points.length*.95)]:0;
  function seams(multiplier){
   const scores=Array(180).fill(0);
   for(let a=0;a<180;a++){const angle=a*Math.PI/90,co=Math.cos(angle),si=Math.sin(angle);let hit=0,valid=0;
    for(let j=0;j<16;j++){const r=radius*(.35+j*.035),x=Math.round(cx+co*r),y=Math.round(cy+si*r);if(x<2||x>=w-2||y<2||y>=h-2)continue;const p=y*w+x;if(!mask[p])continue;valid++;let best=0;for(let d=-1;d<=1;d++){const xx=Math.round(x-si*d),yy=Math.round(y+co*d),q=yy*w+xx;best=Math.max(best,Math.abs(-si*gx[q]+co*gy[q]));}if(best>threshold*multiplier)hit++;}
    scores[a]=valid>=13?hit/valid:0;
   }
   const peaks=[];for(let a=0;a<180;a++)if(scores[a]>=.75&&scores[a]>scores[(a+179)%180]&&scores[a]>=scores[(a+1)%180])peaks.push(a);
   peaks.sort((a,b)=>scores[b]-scores[a]);const selected=[];for(const a of peaks)if(selected.every(b=>Math.min(Math.abs(a-b),180-Math.abs(a-b))>=6))selected.push(a);return selected.sort((a,b)=>a-b);
  }
  const a=seams(.85),b=seams(1.15);
  const stable=a.length>=3&&a.length<=24&&a.length===b.length&&a.every(x=>b.some(y=>Math.min(Math.abs(x-y),180-Math.abs(x-y))<=2));
  let result=base,used=false;
  if(stable&&quality.usable&&radius>=15){const cut=mask.slice();for(const angle of a){const co=Math.cos(angle*Math.PI/90),si=Math.sin(angle*Math.PI/90);for(let r=radius*.3;r<radius*1.2;r+=.5){const x=Math.round(cx+r*co),y=Math.round(cy+r*si);for(let d=-1;d<=1;d++){const xx=Math.round(x-si*d),yy=Math.round(y+co*d);if(xx>=0&&xx<w&&yy>=0&&yy<h&&mask[yy*w+xx]){boundary[yy*w+xx]=1;cut[yy*w+xx]=0;}}}}
   const split=petalRegions(cut,w,h,quality);
   if(split.visible_region_count===a.length){
    if(base.visible_region_count!=null&&base.visible_region_count!==split.visible_region_count){result={...base,status:'unresolved',visible_region_count:null,category:'unresolved',shape:'unknown',regions:[],labels:new Uint8Array(n),reason:'Outline and internal-edge counts disagree'};}
    else{result=split;used=true;result.reason='Region count persists after cuts along sustained internal-edge hypotheses; veins and folds can still mislead';}
   }
  }
  return{...result,method:used?'internal_edges_and_region_stability':'outer_region_stability',edge_diagnostics:{threshold,boundary_count:stable?a.length:null,stable,used_for_count:used},edges,boundary};
 }
 function extract(data,w,h,options={}){
 const total=w*h,colors=Array.from({length:total},(_,p)=>color(...data.slice(p*4,p*4+3))),eligible=new Uint8Array(total),leaf=new Uint8Array(total),valid=new Uint8Array(total);let validCount=0;
 for(let p=0;p<total;p++){if(data[p*4+3]<128)continue;valid[p]=1;validCount++;const c=colors[p];leaf[p]=c.label==='green'?1:0;eligible[p]=!leaf[p]&&c.v>.3&&(['red','pink','yellow','blue','pale'].includes(c.label))?1:0;}
 // Large edge-connected blue patches are background proposals, not flower tissue.
 const blue=Uint8Array.from(colors,(c,p)=>valid[p]&&c.label==='blue'?1:0);
 for(const region of groups(blue,w,h))if(region.length>total*.12&&region.some(p=>p%w===0||p%w===w-1||p<w||p>=total-w))region.forEach(p=>eligible[p]=0);
 let head=options.seed?null:(headProposal(data,w,h,colors)||spatialHead(data,w,h,colors));
 // Pale and chromatic regions compete together; no color-first fallback.
 const proposals=groups(eligible,w,h).map(pixels=>{let sx=0,sy=0,border=0;for(const p of pixels){const x=p%w,y=Math.floor(p/w);sx+=x;sy+=y;if(x===0||y===0||x===w-1||y===h-1)border++}const coverage=pixels.length/Math.max(1,validCount),centrality=1-Math.hypot(sx/pixels.length-w/2,sy/pixels.length-h/2)/Math.hypot(w/2,h/2);return{pixels,score:Math.sqrt(pixels.length)*(.6+.4*centrality)*(coverage>.7?.05:1)/(1+border/Math.sqrt(pixels.length))}}).sort((a,b)=>b.score-a.score);
 // A yellow centre alone must not replace a much larger surrounding bloom.
 if(head&&proposals[0]&&head.area<proposals[0].pixels.length*.55)head=null;
 const flower=new Uint8Array(total),background=new Uint8Array(total);let selected=proposals[0]||null,seedIndex=null;if(options.seed&&Number.isFinite(options.seed.x)&&Number.isFinite(options.seed.y)){const sx=Math.round(clamp(options.seed.x)*(w-1)),sy=Math.round(clamp(options.seed.y)*(h-1));seedIndex=sy*w+sx;selected=proposals.find(p=>p.pixels.includes(seedIndex))||null}if(head)selected={pixels:Array.from(head.head.keys()).filter(p=>head.head[p]),score:Infinity};const chosen=selected?.pixels||[];chosen.forEach(p=>flower[p]=1);
 // Retain the measured connected region; do not blindly flood bright reflections.
 let minx=w,miny=h,maxx=0,maxy=0,cx=0,cy=0;for(const p of chosen){const x=p%w,y=Math.floor(p/w);minx=Math.min(minx,x);maxx=Math.max(maxx,x);miny=Math.min(miny,y);maxy=Math.max(maxy,y);cx+=x;cy+=y}cx/=chosen.length||1;cy/=chosen.length||1;
 const radius=Math.max(1,Math.min(maxx-minx+1,maxy-miny+1)*.28),counts={pink:0,red:0,yellow:0,blue:0,pale:0,dark:0},center={n:0,yellow:0},outer={n:0,yellow:0};let texture=0,edges=0;
 for(let p=0;p<total;p++){if(!valid[p])continue;if(flower[p]){leaf[p]=0;const c=colors[p];if(c.label in counts)counts[c.label]++;const region=Math.hypot(p%w-cx,Math.floor(p/w)-cy)<=radius?center:outer;region.n++;if(c.label==='yellow')region.yellow++;for(const n of [p%w<w-1?p+1:-1,p+w<total?p+w:-1])if(n>=0&&flower[n]){texture+=Math.abs(c.v-colors[n].v);edges++}}else if(!leaf[p])background[p]=1;}
 const n=chosen.length||1,features=Object.fromEntries(Object.entries(counts).map(([key,value])=>[key,value/n]));Object.assign(features,{warm:features.pink+features.red+features.yellow,pale_or_pink:features.pale+features.pink,color_diversity:1-Math.max(...Object.values(counts))/n,fill:chosen.length?chosen.length/((maxx-minx+1)*(maxy-miny+1)):0,texture:edges?clamp(texture/edges*4):null,center_yellow:center.n?center.yellow/center.n:null,outer_yellow:outer.n?outer.yellow/outer.n:null,flower_coverage:chosen.length/Math.max(1,validCount),vegetation_coverage:leaf.reduce((a,b)=>a+b,0)/Math.max(1,validCount)});Object.assign(features,structure(chosen,flower,leaf,data,w,h,cx,cy,minx,miny,maxx,maxy));
 let clipped=0,gradient=0,gradientN=0;for(let p=0;p<total;p++){if(!valid[p])continue;if(colors[p].v<.025||colors[p].v>.985)clipped++;if(p%w<w-1){gradient+=Math.abs(colors[p].v-colors[p+1].v);gradientN++}}const exposureClipping=clipped/Math.max(1,validCount),focusScore=gradient/Math.max(1,gradientN);const issues=[];if(options.seed&&selected===null)issues.push('Tap did not land on a detectable flower region');if(chosen.length<24)issues.push('Too few target pixels');if(features.flower_coverage>.7)issues.push('Target region covers most of image; segmentation uncertain');if(!head&&!options.seed&&proposals.length>1&&proposals[1].score>proposals[0].score*.8)issues.push('Multiple similarly prominent regions');if(exposureClipping>.88)issues.push('Most pixels are clipped to deep shadow or highlight');if(focusScore<.002)issues.push('Very little edge detail; image may be blurred');
 // Use one contrast definition for both proposal methods: RGB mean distance.
 let discContrast=null;if(head){const a=[0,0,0],b=[0,0,0];let an=0,bn=0;for(let p=0;p<total;p++){if(head.centre[p]){an++;for(let k=0;k<3;k++)a[k]+=data[p*4+k];}if(head.rays[p]){bn++;for(let k=0;k<3;k++)b[k]+=data[p*4+k];}}if(an&&bn)discContrast=clamp(Math.hypot(...a.map((v,k)=>v/an-b[k]/bn))/(255*Math.sqrt(3)));}
 features.ray_enclosure=head?.coverage??null;features.disc_contrast=discContrast;features.disc_fraction=head?.centreFraction??null;
 const petals=edgePetals(data,flower,w,h,{usable:issues.length===0});features.region_layout=petals.status==='stable_region_candidates'?(petals.visible_region_count<=6&&petals.shape==='broad'?'few_broad':petals.visible_region_count>6&&petals.shape==='narrow'?'many_narrow':null):null;
 features.morphology=describeOutline(flower,w,h,{usable:issues.length===0});
 return{features,petals,masks:{flower,leaf,context:background,centre:head?.centre||new Uint8Array(total),rays:head?.rays||new Uint8Array(total)},head_structure:{status:head?'centre_surrounded_by_yellow_outer_region':'unknown',method:head?.method||(head?'closed_yellow_ring':'unresolved'),scope:'Experimental image regions; not verified florets'},quality:{usable:issues.length===0,issues,proposal_count:proposals.length,seeded:Boolean(options.seed),seed_contained:seedIndex==null?null:Boolean(flower[seedIndex]),focus_score:focusScore,exposure_clipping:exposureClipping},sample:{width:w,height:h,pixels:validCount}};
 }
 function rank(features,profiles,characters={}){const hypotheses=profiles.map(profile=>{const parts={},evidence=[],missingFeatures=[],missingRequired=(profile.requiredFeatures||[]).filter(key=>features[key]==null||!Number.isFinite(features[key]));let totalWeight=0,observedWeight=0;for(const [part,rules] of Object.entries(profile.rules)){let sum=0,weight=0;for(const [feature,min,max,w] of rules){totalWeight+=w;const value=features[feature];if(value==null||!Number.isFinite(value)){missingFeatures.push(feature);continue;}observedWeight+=w;const distance=value<min?min-value:value>max?value-max:0;const fit=clamp(1-distance/.35);sum+=fit*w;weight+=w;evidence.push({part,feature,value,expected:[min,max],fit,contradiction:distance>0})}parts[part]=weight?sum/weight:null;}// Categorical silhouette compatibility contributes within the existing shape group.
 const observed=features.morphology;const semantic=[];
 if(characters.region_layout&&profile.regionLayout){const fit=profile.regionLayout.includes(characters.region_layout)?1:0;semantic.push(fit);evidence.push({part:'shape',feature:'separated_region_layout',value:characters.region_layout,expected:profile.regionLayout,fit,contradiction:fit===0});}

 if(characters.head_layout){
  const expected=profile.headLayout||'unreviewed';const fit=expected==='disc_with_outer_rays'?1:expected==='all_rays'?0:.5;
  semantic.push(fit);evidence.push({part:'shape',feature:'head_layout',value:'disc_with_outer_rays',expected:[expected],fit,contradiction:expected==='all_rays',unknown:expected==='unreviewed'});
 }

 for(const [feature,expected] of Object.entries(profile.morphology||{})){
  const value=observed?.[feature]?.value;if(!value||value==='unknown')continue;
  const fit=expected.includes(value)?1:0;semantic.push(fit);
  evidence.push({part:'shape',feature:'outline_'+feature,value,expected,fit,contradiction:fit===0,source:'silhouette hypothesis',scope:profile.morphologyScope});
 }
 if(semantic.length){const fit=semantic.reduce((a,b)=>a+b,0)/semantic.length;parts.shape=parts.shape==null?fit:(parts.shape+fit)/2;}
 const present=Object.values(parts).filter(x=>x!==null),compatibility=present.length?present.reduce((a,b)=>a+b,0)/present.length:0,coverage=totalWeight?observedWeight/totalWeight:0,score=compatibility*coverage;return{...profile,parts,score,compatibility,coverage,missing_features:[...new Set(missingFeatures)],missing_required:missingRequired,evidence_status:missingRequired.length?'incomplete_structure':observedWeight?'measured_evidence':'no_measurements',evidence,observed_groups:present.length}}).sort((a,b)=>b.score-a.score);const seen=new Set();return hypotheses.filter(row=>{if(seen.has(row.id))return false;seen.add(row.id);return true}).map((row,i)=>({...row,rank:i+1}));}

 function botanicalObservations(extracted){
  const petals=extracted.petals,usable=extracted.quality.usable;
  const unknown=(reason,evidence=[])=>({value:null,status:'unresolved',reason,evidence});
  const valid=usable&&petals.status==='stable_region_candidates';
  return {
   petalShape:valid?{value:petals.shape,status:'region_candidate',reason:'Shape of separated outer regions; individual petal anatomy unverified',evidence:petals.regions.map(r=>({view:'petalPreview',region:r.label,shape:r.shape}))}:unknown(petals.reason),
   petalTip:unknown('Complete individual petal tips are not yet traced'),
   visibleCount:valid?{value:petals.visible_region_count,status:'region_candidate',unit:'visible_outer_region',reason:'Numbered regions, not total anatomical petals',evidence:petals.regions.map(r=>({view:'petalPreview',region:r.label}))}:unknown(petals.reason),
   arrangement:unknown('Overlapping petal layers are not yet measured'),
   centre:usable&&extracted.head_structure.status!=='unknown'?{value:'contrasting_centre_with_surrounding_yellow_region',status:'region_candidate',reason:'Disc/ray region hypothesis; does not resolve a column or cluster of stamens',evidence:[{view:'centreMaskPreview'},{view:'rayMaskPreview'}]}:unknown('Central column and stamen cluster are not yet resolved'),
   leafSupport:unknown('Green pixels are not verified leaf blades or attachments')
  };
 }
 function analyze(data,w,h,profiles,options={}){const extracted=extract(data,w,h,options),observations=botanicalObservations(extracted),characters={head_layout:observations.centre.value?'disc_with_outer_rays':null,region_layout:extracted.quality.usable?extracted.features.region_layout:null},candidates=rank(extracted.quality.usable?extracted.features:{},profiles,characters),top=candidates[0],second=candidates[1],lead=top.score-(second?.score||0),threshold=Math.max(.72,options.minimumScore||0),margin=Math.max(.12,options.minimumLead||0);const accepted=top.calibrationStatus==='validated'&&!top.missing_required.length&&extracted.quality.usable&&top.observed_groups>=3&&top.score>=threshold&&lead>=margin,followUp=top.id==='waterlily'?'Take a wider photo showing the flower, water surface, and a complete floating leaf.':lead<margin&&second?`One more view could separate ${top.name} from ${second.name}; include a leaf and its stem attachment.`:'Take one front-on close-up with the whole flower inside the frame.';return{engine_version:'0.15.0',...extracted,morphology:typeof FlowerMorphology==='undefined'?null:FlowerMorphology.run(data,extracted.masks.flower,w,h,{...extracted.quality,centreMask:extracted.masks.centre}),observations,ranking_characters:characters,candidates,thresholds:{minimum_score:threshold,minimum_lead:margin},decision:{accepted,prediction:accepted?top.id:null,top_score:top.score,match_strength:top.score,lead,follow_up:followUp,reason:!extracted.quality.usable?extracted.quality.issues.join('; '):top.calibrationStatus!=='validated'?'Experimental profiles need reviewed examples; candidate suggestions only':accepted?'Profile match':'Candidates overlap or evidence is insufficient'}};}
 return{extract,rank,analyze,describeOutline,petalRegions,edgePetals,botanicalObservations};
})();
if(typeof module!=='undefined')module.exports=FlowerEngine;
