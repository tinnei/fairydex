// Presentation decisions are separate from the experimental recognition rules.
export function regionBounds(mask, width, height) {
  let left=width, top=height, right=-1, bottom=-1, sx=0, sy=0, count=0;
  for(let p=0;p<mask.length;p++) if(mask[p]) {
    const x=p%width, y=Math.floor(p/width);
    left=Math.min(left,x); right=Math.max(right,x); top=Math.min(top,y); bottom=Math.max(bottom,y);
    sx+=x; sy+=y; count++;
  }
  return count ? {left,top,right,bottom,cx:sx/count,cy:sy/count,count,
    clipped:left===0||top===0||right===width-1||bottom===height-1} : null;
}

export function describeClues(out) {
  const f=out.features, good=out.quality.usable;
  const bounds=regionBounds(out.masks.flower,out.sample.width,out.sample.height);
  const colours=[['pink','Pink'],['red','Red / orange'],['yellow','Yellow'],['blue','Blue / purple'],['pale','Pale']].sort((a,b)=>(f[b[0]]||0)-(f[a[0]]||0));
  const [colour,label]=colours[0], hasColour=Number.isFinite(f[colour])&&f[colour]>.15;
  return [
    {id:'colour',icon:'palette',title:hasColour?`${label} in the selected region`:'Colour is unclear',state:good&&hasColour?'observed':'uncertain',detail:good?'Measured inside the flower mask. Lighting can change how colour appears.':'Review the selected region before using its colour.',value:hasColour?`${Math.round(f[colour]*100)}% of selected pixels`:null},
    {id:'centre',icon:'scan-eye',title:f.centre_contrast>.12?'Centre differs from the outer region':'Similar centre and outer colour',state:good&&Number.isFinite(f.centre_contrast)?'observed':'uncertain',detail:'Compares the inner and outer parts of the selected region; this is not a verified botanical centre.'},
    {id:'outline',icon:'flower-2',title:bounds?.clipped?'Flower region touches the edge':'Outline and visible tips',state:'uncertain',detail:!good?'A clearer flower region is needed.':bounds?.clipped?'The image may cut off part of the flower. Try another view.':`About ${Math.round((f.visible_tips_low||0)*20)}–${Math.round((f.visible_tips_high||0)*20)} visible tips in the mask. Overlap and viewpoint make this estimate uncertain.`},
    {id:'leaves',icon:'leaf',title:'Leaves and plant context',state:'missing',detail:f.vegetation_coverage>.02?'Green pixels are present, but leaf shape and attachment have not been verified.':'Leaf shape and attachment have not been measured from this photo.'}
  ];
}

export function canReview(out) {
  if (!out?.candidates?.length) return false;
  if (out.quality.usable) return true;
  // A user-selected close-up can still be inspected. Do not change engine quality
  // or mark its measurements as observed; this only permits an explicit review.
  const issues=out.quality.issues || [];
  return out.quality.seed_contained===true && issues.length>0 &&
    issues.every(issue=>issue==='Target region covers most of image; segmentation uncertain');
}
