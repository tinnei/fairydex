// Runs the predeclared development-only visible floral structure pilot.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');process.chdir(root);
const {createCanvas,loadImage}=require((process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES?process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/':'')+'@napi-rs/canvas');
const pilot=JSON.parse(fs.readFileSync('tests/structure-experiment/manifest.json')),benchmark=JSON.parse(fs.readFileSync('dist/benchmark/manifest.json')),byId=new Map(benchmark.images.map(item=>[item.id,item]));
const sources=['morphology.js','engine-profiles.js','engine-v3.js','botanical-knowledge.js','leaf-engine.js','floral-structure.js','identification-v2.js','image-analysis.js'];
const context=vm.createContext({document:{createElement:()=>createCanvas(1,1)}});for(const file of sources)vm.runInContext(fs.readFileSync('dist/'+file,'utf8'),context);vm.runInContext('this.vision=FlowerImage;this.profiles=ENGINE_PROFILES',context);
const labels=pilot.allowed_labels;
function summarize(rows){
 const matrix=Object.fromEntries(labels.map(expected=>[expected,Object.fromEntries(labels.map(actual=>[actual,0]))]));for(const row of rows)matrix[row.expected][row.actual]++;
 const positive=labels.slice(0,3),byClass=Object.fromEntries(positive.map(label=>{const group=rows.filter(row=>row.expected===label);return[label,{agreed:group.filter(row=>row.agreed).length,total:group.length}];}));
 const hard=rows.filter(row=>row.expected==='unresolved'),falseComposite=rows.filter(row=>row.expected==='single_large_flower_candidate'&&row.actual==='composite_head_candidate').length;
 return{positive_agreement:{agreed:rows.filter(row=>row.expected!=='unresolved'&&row.agreed).length,total:rows.filter(row=>row.expected!=='unresolved').length},by_class:byClass,hard_routing:{unresolved:hard.filter(row=>row.actual==='unresolved').length,total:hard.length},single_large_false_composites:falseComposite,confusion_matrix:matrix,passed:Object.values(byClass).every(value=>value.agreed>=3)&&hard.filter(row=>row.actual==='unresolved').length===4&&falseComposite===0};
}
(async()=>{
 const rows=[];
 for(const review of pilot.images){
  const item=byId.get(review.id);if(!item)throw Error('Unknown benchmark id '+review.id);if(item.split!=='development'||review.split!=='development')throw Error('Pilot may load development images only: '+review.id);
  const img=await loadImage(fs.readFileSync('dist'+item.image));Object.defineProperty(img,'naturalWidth',{value:img.width});Object.defineProperty(img,'naturalHeight',{value:img.height});
  const {out}=context.vision.analyze(img,context.profiles,{}),actual=out.visible_floral_structure?.value||'unresolved';rows.push({id:review.id,expected:review.structure_label,actual,agreed:actual===review.structure_label,status:out.visible_floral_structure?.status||'unresolved',reason:out.visible_floral_structure?.reason||'Observer unavailable',evidence:out.visible_floral_structure?.evidence||[],review_route_reason:review.route_reason,metrics:out.visible_floral_structure?.metrics||null});console.log(review.id,review.structure_label,'=>',actual);
 }
 const summary=summarize(rows),report={pilot:pilot.version,created_at:new Date().toISOString(),scope:pilot.scope,reserved_images_loaded:0,summary,rows};fs.writeFileSync('tests/structure-experiment/evaluation.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(summary));
})().catch(error=>{console.error(error);process.exitCode=1;});
