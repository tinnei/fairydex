// Shared reporting semantics. Source labels never enter the image-analysis pipeline.
const BenchmarkMetrics=(()=>{
 const epsilon=.001;
 function assess(candidates,expected,usable=true,error=null){
  if(error)return {status:'error',top1:false,top3:false,top3TieInclusive:false,reason:String(error),leaders:[]};
  const ranked=[...candidates].sort((a,b)=>b.score-a.score),top=ranked[0],row=ranked.find(r=>r.id===expected);
  if(!row)return {status:'unsupported',top1:false,top3:false,top3TieInclusive:false,reason:'Expected group is absent from active profiles',leaders:[]};
  if(!usable||!top||top.score<=0)return {status:'unresolved',top1:false,top3:false,top3TieInclusive:false,reason:'No usable flower evidence',leaders:[]};
  const leaders=ranked.filter(r=>Math.abs(r.score-top.score)<epsilon).map(r=>r.id),higher=ranked.filter(r=>r.score-row.score>=epsilon).length,tied=ranked.filter(r=>Math.abs(r.score-row.score)<epsilon).length;
  const top1=leaders.length===1&&leaders[0]===expected;return {status:leaders.length>1?'tied':top1?'correct':'wrong',top1,top3:higher+tied<=3,top3TieInclusive:higher<3,leaders,expectedScore:row.score};
 }
 function summarize(rows){const done=rows.filter(r=>r.status!=='not_run'),n=done.length,counts={correct:0,wrong:0,tied:0,unresolved:0,error:0,unsupported:0};for(const r of done)counts[r.status]=(counts[r.status]||0)+1;return {total:n,counts,top1:done.filter(r=>r.top1).length,top3:done.filter(r=>r.top3).length,top3TieInclusive:done.filter(r=>r.top3TieInclusive).length,leafAvailable:done.filter(r=>r.leafAvailable).length,leafWins:done.filter(r=>r.top1&&!r.flowerOnly?.top1).length,leafLosses:done.filter(r=>!r.top1&&r.flowerOnly?.top1).length};}
 function compare(current,previous){if(current.datasetHash!==previous.datasetHash||JSON.stringify(current.options)!==JSON.stringify(previous.options)||current.split!==previous.split)return {compatible:false,reason:'Different dataset, options or split; comparison withheld'};const old=new Map(previous.rows.map(r=>[r.id,r]));let improved=0,regressed=0,unchanged=0,paired=0;for(const r of current.rows){const p=old.get(r.id);if(!p||r.status==='not_run'||p.status==='not_run')continue;paired++;if(r.top1&&!p.top1)improved++;else if(!r.top1&&p.top1)regressed++;else unchanged++;}return {compatible:true,paired,improved,regressed,unchanged};}
 return {assess,summarize,compare};
})();
if(typeof module!=='undefined')module.exports=BenchmarkMetrics;
