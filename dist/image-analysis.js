// Two-pass image analysis shared by the test bench and character map.
const FlowerImage=(()=>{
 function draw(img,box,limit){const scale=Math.min(1,limit/Math.max(box.width,box.height)),c=document.createElement('canvas');c.width=Math.max(1,Math.round(box.width*scale));c.height=Math.max(1,Math.round(box.height*scale));const ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(img,box.x,box.y,box.width,box.height,0,0,c.width,c.height);return c;}
 function analyze(img,profiles,options={}){
  const full={x:0,y:0,width:img.naturalWidth,height:img.naturalHeight},coarse=draw(img,full,192),pixels=coarse.getContext('2d').getImageData(0,0,coarse.width,coarse.height),proposal=FlowerEngine.extract(pixels.data,coarse.width,coarse.height);
  let crop=full;if(proposal.quality.usable){let l=coarse.width,t=coarse.height,r=0,b=0;for(let p=0;p<proposal.masks.flower.length;p++)if(proposal.masks.flower[p]){l=Math.min(l,p%coarse.width);r=Math.max(r,p%coarse.width);t=Math.min(t,Math.floor(p/coarse.width));b=Math.max(b,Math.floor(p/coarse.width));}
   if(r>l&&b>t){const padding=Math.max(8,Math.max(r-l,b-t)*.16),x=Math.max(0,l-padding),y=Math.max(0,t-padding),right=Math.min(coarse.width,r+padding+1),bottom=Math.min(coarse.height,b+padding+1);crop={x:x/coarse.width*full.width,y:y/coarse.height*full.height,width:(right-x)/coarse.width*full.width,height:(bottom-y)/coarse.height*full.height};}}
  const canvas=draw(img,crop,384),data=canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height),initial=FlowerEngine.analyze(data.data,canvas.width,canvas.height,profiles,options);let out=initial,leafCanvas=null;
  if(typeof LeafEngine!=='undefined'){
   leafCanvas=draw(img,full,384);const lp=leafCanvas.getContext('2d').getImageData(0,0,leafCanvas.width,leafCanvas.height),exclude=new Uint8Array(leafCanvas.width*leafCanvas.height);
   if(proposal.quality.usable)for(let p=0;p<exclude.length;p++){const x=Math.min(coarse.width-1,Math.floor(p%leafCanvas.width/leafCanvas.width*coarse.width)),y=Math.min(coarse.height-1,Math.floor(Math.floor(p/leafCanvas.width)/leafCanvas.height*coarse.height));exclude[p]=proposal.masks.flower[y*coarse.width+x];}
   const leaf=LeafEngine.analyze(lp.data,leafCanvas.width,leafCanvas.height,exclude),knowledge=typeof BOTANICAL_KNOWLEDGE==='undefined'?null:BOTANICAL_KNOWLEDGE;out=LeafEngine.combine(out,leaf,LeafEngine.rank(leaf,knowledge));
  }
  out.triage=typeof IdentificationV2==='undefined'?null:IdentificationV2.triage(proposal,out.leaf,initial.head_structure);
  out.image={original:full,crop,detailWidth:canvas.width,detailHeight:canvas.height,coarseQuality:proposal.quality};return{out,canvas,leafCanvas};
 }
 return{analyze};
})();
