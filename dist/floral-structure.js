// Species-independent visible floral-structure observer.
// This is an abstaining development experiment: it describes coarse image
// structure and never supplies a botanical flower/floret count or taxon score.
const FloralStructure=(()=>{
 const VERSION='0.1.0';
 const VALUES={single:'single_large_flower_candidate',composite:'composite_head_candidate',cluster:'small_flower_cluster_candidate',unresolved:'unresolved'};
 const clamp=value=>Math.max(0,Math.min(1,value));
 const observation=(value,status,reason,evidence,metrics)=>({version:VERSION,value,status,reason,evidence,metrics});
 function geometry(mask,w,h){
  let n=0,cx=0,cy=0,edge=0;
  for(let p=0;p<mask.length;p++)if(mask[p]){const x=p%w,y=Math.floor(p/w);n++;cx+=x;cy+=y;if(!x||!y||x===w-1||y===h-1)edge++;}
  cx/=n||1;cy/=n||1;const radii=[];for(let p=0;p<mask.length;p++)if(mask[p])radii.push(Math.hypot(p%w-cx,Math.floor(p/w)-cy));radii.sort((a,b)=>a-b);
  return{n,cx,cy,radius:radii[Math.floor(radii.length*.95)]||1,edge_fraction:n?edge/n:0};
 }
 function luminance(data,p){return(data[p*4]*.299+data[p*4+1]*.587+data[p*4+2]*.114)/255;}
 function texture(data,mask,w,h){
  let n=0,grad=0,strong=0,turns=0;
  for(let y=2;y<h-2;y++)for(let x=2;x<w-2;x++){const p=y*w+x;if(!mask[p])continue;n++;const v=luminance(data,p),gx=Math.abs(luminance(data,p-1)-luminance(data,p+1)),gy=Math.abs(luminance(data,p-w)-luminance(data,p+w)),g=(gx+gy)/2;grad+=g;if(g>.09)strong++;let hi=true,lo=true;for(const q of [p-2,p+2,p-w*2,p+w*2])if(mask[q]){const qv=luminance(data,q);hi&&=v>qv+.025;lo&&=v<qv-.025;}if(hi||lo)turns++;}
  return{pixels:n,gradient:n?grad/n:0,strong_edge_fraction:n?strong/n:0,extrema_fraction:n?turns/n:0};
 }
 function centreZone(source,mask,w,h,g){
  const supplied=source?.masks?.centre||[],count=supplied.reduce?.((a,b)=>a+b,0)||0;if(count>32)return supplied;
  const zone=new Uint8Array(mask.length),radius=g.radius*.34;for(let p=0;p<mask.length;p++)if(mask[p]&&Math.hypot(p%w-g.cx,Math.floor(p/w)-g.cy)<=radius)zone[p]=1;return zone;
 }
 function annulusZone(mask,w,g){const zone=new Uint8Array(mask.length);for(let p=0;p<mask.length;p++)if(mask[p]){const d=Math.hypot(p%w-g.cx,Math.floor(p/w)-g.cy)/(g.radius||1);if(d>.42&&d<.9)zone[p]=1;}return zone;}
 function regionPattern(source,g){
  const methods=source?.morphology?.methods||[],method=methods.find(item=>item.name==='seeded_gradient_flood')||methods[0],regions=method?.regions||[];
  if(regions.length<3)return{count:regions.length,similarity:0,radial_alignment:0,distributed_centres:0};
  const areas=regions.map(r=>r.area).sort((a,b)=>a-b),median=areas[Math.floor(areas.length/2)]||1,kept=regions.filter(r=>r.area>=median*.35&&r.area<=median*2.8),similarity=kept.length/regions.length;
  let radial=0,distributed=0;for(const r of kept){const d=Math.hypot(r.x-g.cx,r.y-g.cy)/(g.radius||1);if(d>.28&&d<1.15)radial++;if(d>.18)distributed++;}
  return{count:regions.length,similarity,radial_alignment:kept.length?radial/kept.length:0,distributed_centres:kept.length?distributed/kept.length:0,kept:kept.length};
 }
 function radialPattern(data,mask,w,g){
  const centre=[0,0,0],outer=[0,0,0],bins=new Uint16Array(24);let cn=0,on=0;
  for(let p=0;p<mask.length;p++)if(mask[p]){const x=p%w,y=Math.floor(p/w),dx=x-g.cx,dy=y-g.cy,d=Math.hypot(dx,dy)/(g.radius||1);let target=null;if(d<.34){target=centre;cn++;}else if(d>.48&&d<.92){target=outer;on++;bins[Math.floor((Math.atan2(dy,dx)+Math.PI)/(Math.PI*2)*bins.length)%bins.length]++;}if(target)for(let k=0;k<3;k++)target[k]+=data[p*4+k];}
  const contrast=cn&&on?Math.hypot(...centre.map((value,k)=>value/cn-outer[k]/on))/(255*Math.sqrt(3)):0,annulusCoverage=[...bins].filter(value=>value>Math.max(2,g.radius*.025)).length/bins.length;
  return{colour_contrast:contrast,annulus_angular_coverage:annulusCoverage,centre_pixels:cn,outer_pixels:on};
 }
 function analyze(data,w,h,source={},context={}){
  const mask=source?.masks?.flower||new Uint8Array(w*h),g=geometry(mask,w,h),quality=source?.quality||{},pattern=regionPattern(source,g),radial=radialPattern(data,mask,w,g),centre=centreZone(source,mask,w,h,g),centreTexture=texture(data,centre,w,h),outerTexture=texture(data,annulusZone(mask,w,g),w,h),head=source?.head_structure?.status==='centre_surrounded_by_yellow_outer_region',petals=source?.petals||{},coarse=context.coarse||{};
  const multiple=Boolean(coarse?.quality?.issues?.some?.(issue=>/Multiple similarly prominent regions/.test(issue))),clipped=g.edge_fraction>.012||source?.morphology?.reason==='Flower region touches the image boundary';
  const metrics={flower_pixels:g.n,edge_contact_fraction:g.edge_fraction,centre_texture:centreTexture,outer_texture:outerTexture,radial_pattern:radial,region_pattern:pattern,petal_regions:{status:petals.status||'unresolved',count:petals.visible_region_count??null,shape:petals.shape||null},head_region_pair:head,coarse_multiple_candidates:multiple};
  if(!quality.usable||!g.n)return observation(VALUES.unresolved,'unresolved','No reliable flower region is available for visible-structure review.',[],metrics);
  if(multiple)return observation(VALUES.unresolved,'unresolved','Several similarly prominent targets are present; frame-level floral structure is not assigned.',['coarse_multiple_candidates'],metrics);
  if(clipped&&g.edge_fraction>.04)return observation(VALUES.unresolved,'unresolved','The selected floral region is too clipped for a bounded structure claim.',['flower_mask_edge_contact'],metrics);
  // Composite needs two independent observations: a disc/outer-ray region pair
  // and repeated fine texture within the proposed disc. Central dots alone fail.
  const repeatedCentre=centreTexture.pixels>60&&centreTexture.strong_edge_fraction>.055&&centreTexture.extrema_fraction>.008;
  const measuredDiscRay=head&&repeatedCentre||!head&&repeatedCentre&&centreTexture.strong_edge_fraction>.15&&centreTexture.strong_edge_fraction<.23&&radial.colour_contrast>.12;
  if(measuredDiscRay)return observation(VALUES.composite,'observed','A repeated fine disc-like centre and a surrounding ray-like annulus are both visible.',['disc_like_centre_repetition','outer_ray_annulus'],metrics);
  // A cluster claim is deliberately conservative: several similarly sized,
  // spatially separate region interiors must be present without one disc/ray pair.
  const clusterRegions=!head&&centreTexture.strong_edge_fraction>.23&&((pattern.count>=5&&pattern.kept>=4&&pattern.similarity>=.62)||centreTexture.extrema_fraction>.11&&outerTexture.strong_edge_fraction>.16);
  if(!head&&clusterRegions)return observation(VALUES.cluster,'observed','Several similarly scaled, spatially separate blossom-region candidates are visible; total flowers are not counted.',['separate_small_corolla_candidates','multiple_local_centres'],metrics);
  const stableOuter=petals.status==='stable_region_candidates'&&petals.visible_region_count>=3&&petals.visible_region_count<=16;
  const oneDominant=!multiple&&g.edge_fraction<=.04;
  if(!head&&oneDominant&&(stableOuter||centreTexture.strong_edge_fraction<.15&&radial.colour_contrast>.11))return observation(VALUES.single,'observed','Large outer floral parts surround one shared central area; no supported repeated small-corolla or disc/ray pattern was found.',['large_outer_parts','shared_central_area'],metrics);
  const why=head&&!repeatedCentre?'A disc/outer-ray colour proposal exists, but independent fine-centre repetition is not strong enough.':clipped?'The visible structure is clipped or occluded.':'The image evidence does not separate one large flower from repeated small floral units.';
  return observation(VALUES.unresolved,'unresolved',why,head?['outer_ray_annulus_candidate']:[],metrics);
 }
 return{VERSION,VALUES,analyze};
})();
if(typeof module!=='undefined')module.exports=FloralStructure;
