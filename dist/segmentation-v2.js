const leafMaskCanvas=document.getElementById("leafMaskPreview"),leafMaskCtx=leafMaskCanvas.getContext("2d");
const contextMaskCanvas=document.getElementById("contextMaskPreview"),contextMaskCtx=contextMaskCanvas.getContext("2d");

function pixelGroups(mask,size){
  const seen=new Uint8Array(mask.length),groups=[];
  for(let start=0;start<mask.length;start++){
    if(!mask[start]||seen[start])continue;
    const stack=[start],pixels=[];seen[start]=1;
    while(stack.length){
      const p=stack.pop(),x=p%size,y=(p/size)|0;pixels.push(p);
      for(const n of [p-1,p+1,p-size,p+size]){
        if(n<0||n>=mask.length||seen[n]||!mask[n])continue;
        const nx=n%size,ny=(n/size)|0;
        if(Math.abs(nx-x)+Math.abs(ny-y)!==1)continue;
        seen[n]=1;stack.push(n);
      }
    }
    if(pixels.length>=8)groups.push(pixels);
  }
  return groups;
}

function paintBinary(targetCtx,mask){
  const out=targetCtx.createImageData(160,160);
  for(let p=0;p<mask.length;p++){
    const i=p*4,v=mask[p]?255:18;
    out.data[i]=v;out.data[i+1]=v;out.data[i+2]=v;out.data[i+3]=255;
  }
  targetCtx.putImageData(out,0,0);
}

analyze=function(img){
  const size=160,total=size*size;
  ctx.clearRect(0,0,size,size);
  const scale=Math.max(size/img.naturalWidth,size/img.naturalHeight),w=img.naturalWidth*scale,h=img.naturalHeight*scale;
  ctx.drawImage(img,(size-w)/2,(size-h)/2,w,h);
  const image=ctx.getImageData(0,0,size,size),data=image.data;
  const seed=new Uint8Array(total),leafCandidate=new Uint8Array(total);
  const hsvPixels=new Array(total);

  for(let p=0;p<total;p++){
    const i=p*4,[hue,sat,val]=hsv(data[i],data[i+1],data[i+2]);hsvPixels[p]=[hue,sat,val];
    const green=sat>.14&&val>.12&&hue>=70&&hue<180;
    if(green)leafCandidate[p]=1;
    const floralHue=hue<22||hue>=292||(hue>=35&&hue<75)||(hue>=185&&hue<292);
    if(!green&&sat>.20&&val>.25&&floralHue)seed[p]=1;
  }

  let groups=pixelGroups(seed,size);
  if(!groups.length){
    const paleSeed=new Uint8Array(total);
    for(let p=0;p<total;p++){const [,sat,val]=hsvPixels[p];if(!leafCandidate[p]&&val>.68&&sat<.34)paleSeed[p]=1}
    groups=pixelGroups(paleSeed,size);
  }
  let primary=[];
  let best=-1;
  for(const group of groups){
    let sx=0,sy=0,pinkYellow=0;
    for(const p of group){
      sx+=p%size;sy+=(p/size)|0;
      const hue=hsvPixels[p][0];
      if(hue<22||hue>=292||(hue>=35&&hue<75))pinkYellow++;
    }
    const cx=sx/group.length,cy=sy/group.length;
    const centrality=Math.max(.15,1-Math.hypot(cx-size/2,cy-size/2)/(size*.72));
    const botanicalHue=.65+.55*(pinkYellow/group.length);
    const scalePenalty=group.length>total*.32?.12:1;
    const score=Math.sqrt(group.length)*(.45+.55*centrality)*botanicalHue*scalePenalty;
    if(score>best){best=score;primary=group}
  }

  const flower=new Uint8Array(total);
  for(const p of primary)flower[p]=1;
  for(let pass=0;pass<18;pass++){
    const add=[];
    for(let p=size+1;p<total-size-1;p++){
      if(flower[p]||leafCandidate[p])continue;
      if(!(flower[p-1]||flower[p+1]||flower[p-size]||flower[p+size]))continue;
      const i=p*4,[,sat,val]=hsvPixels[p];
      const warmPale=val>.48&&(sat>.08||data[i]>data[i+1]*1.025||data[i]>data[i+2]*1.025);
      const neutralPetal=val>.72&&sat<.24;
      if(warmPale||neutralPetal)add.push(p);
    }
    if(!add.length)break;
    for(const p of add)flower[p]=1;
  }

  const leaf=new Uint8Array(total),context=new Uint8Array(total);
  for(let p=0;p<total;p++){
    if(flower[p])continue;
    if(leafCandidate[p])leaf[p]=1;else context[p]=1;
  }

  const flowerParts=pixelGroups(flower,size).map(group=>group.length).sort((a,b)=>b-a);
  let flowerPixels=0,leafPixels=0,boundary=0,yellowInFlower=0,saturation=0,brightness=0;
  const count={pink:0,red:0,yellow:0,blue:0,pale:0,dark:0};
  for(let p=0;p<total;p++){
    if(leaf[p])leafPixels++;
    if(!flower[p])continue;
    flowerPixels++;
    const x=p%size,y=(p/size)|0,[hue,sat,val]=hsvPixels[p];
    saturation+=sat;brightness+=val;
    if(val<.25)count.dark++;
    if(val>.62&&sat<.38)count.pale++;
    if(sat>.12){
      if(hue<18||hue>=350)count.red++;
      else if(hue>=292&&hue<350)count.pink++;
      else if(hue>=35&&hue<78){count.yellow++;yellowInFlower++}
      else if(hue>=185&&hue<292)count.blue++;
    }
    if(x===0||y===0||x===size-1||y===size-1||!flower[p-1]||!flower[p+1]||!flower[p-size]||!flower[p+size])boundary++;
  }
  const denom=Math.max(1,flowerPixels),flowerCoverage=flowerPixels/total,largest=flowerParts[0]||0;
  const largestShare=largest/denom,boundaryRatio=boundary/denom,yellowCentre=yellowInFlower/denom;
  const fineTexture=Math.min(1,boundaryRatio*2.2),broadSurface=Math.max(0,largestShare*(1-fineTexture*.55));
  const f={
    pink:count.pink/denom,red:count.red/denom,yellow:count.yellow/denom,blue:count.blue/denom,
    green_context:leafPixels/total,pale:count.pale/denom,dark:count.dark/denom,
    flower_coverage:flowerCoverage,flower_components:flowerParts.length/20,largest_component_share:largestShare,
    boundary_ratio:boundaryRatio,broad_surface_score:broadSurface,fine_texture_score:fineTexture,
    yellow_center_ratio:yellowCentre,average_saturation:saturation/denom,average_brightness:brightness/denom
  };

  const stageResult=stageRanker(f);
  const rawRankers={colour:colourRanker(f),shape:shapeRanker(f,flowerParts),centre:centreRanker(f),context:contextRanker(f,flowerParts),stage:stageResult.scores};
  const rankers=Object.fromEntries(Object.entries(rawRankers).map(([name,scores])=>[name,normalize(scores)]));
  const weights={colour:.20,shape:.30,centre:.15,context:.15,stage:.20},scores={};
  for(const id of Object.keys(SPECIES))scores[id]=Object.entries(weights).reduce((sum,[name,weight])=>sum+rankers[name][id]*weight,0);
  const winners=Object.fromEntries(Object.entries(rankers).map(([name,scores])=>[name,Object.entries(scores).sort((a,b)=>b[1]-a[1])[0][0]]));
  const ranked=Object.entries(scores).sort((a,b)=>b[1]-a[1]).map(([id,score],index)=>{
    const stage=stageResult.stages[id],observation=SPECIES[id].observations.find(item=>item.stage===stage)||SPECIES[id].observations[0];
    return{rank:index+1,id,name:SPECIES[id].name,stage,plant_part:observation.plantPart,score:Number(score.toFixed(4)),parts:Object.fromEntries(Object.entries(rankers).map(([name,values])=>[name,Number(values[id].toFixed(4))])),ranker_wins:Object.values(winners).filter(winner=>winner===id).length};
  });
  const minimumScore=Number($("scoreThreshold").value),minimumLead=Number($("marginThreshold").value),lead=ranked[0].score-ranked[1].score,agreement=ranked[0].ranker_wins;
  const accepted=ranked[0].score>=minimumScore&&lead>=minimumLead&&agreement>=2;
  paintBinary(maskCtx,flower);paintBinary(leafMaskCtx,leaf);paintBinary(contextMaskCtx,context);
  return{engine_version:"0.5.0",sample:{width:size,height:size,pixels:total},segmentation:{flower_coverage:Number(flowerCoverage.toFixed(4)),leaf_coverage:Number((leafPixels/total).toFixed(4)),context_coverage:Number(((total-flowerPixels-leafPixels)/total).toFixed(4))},ensemble:{weights,ranker_winners:winners,required_agreement:2},thresholds:{minimum_score:minimumScore,minimum_lead:minimumLead},features:Object.fromEntries(Object.entries(f).map(([k,v])=>[k,Number(v.toFixed(4))])),rankers,candidates:ranked,decision:{accepted,prediction:accepted?ranked[0].id:null,predicted_stage:accepted?ranked[0].stage:null,observed_part:accepted?ranked[0].plant_part:null,top_score:ranked[0].score,lead:Number(lead.toFixed(4)),ranker_agreement:agreement,reason:accepted?"score_lead_and_ranker_agreement_passed":"insufficient_score_separation_or_agreement"}};
};
