const {test}=require('node:test'), assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const scope=vm.createContext({});
for(const file of ['botanical-knowledge','knowledge-ranker','knowledge-cases','engine-profiles','flower-expansion'])vm.runInContext(fs.readFileSync(`dist/${file}.js`,'utf8'),scope);
const {knowledge,ranker,cases,ids}=vm.runInContext('({knowledge:BOTANICAL_KNOWLEDGE,ranker:KnowledgeRanker,cases:KNOWLEDGE_CASES,ids:[...ENGINE_PROFILES,...FLOWER_EXPANSION].map(p=>p.id)})',scope);
const observe=values=>Object.fromEntries(Object.entries(values).map(([key,value])=>[key,{value,source:'fixture'}]));
test('all 22 catalogue entries have valid sourced traits and distinct stages',()=>{
 assert.equal(knowledge.plants.length,22);
 assert.deepEqual(new Set(knowledge.plants.map(p=>p.id)),new Set(ids));
 for(const plant of knowledge.plants){
  assert.ok(plant.referenceTaxon);assert.ok(plant.scopeNote);assert.ok(plant.notes);
  const sources=new Set(plant.sources.map(s=>s.id));
  for(const s of plant.sources)assert.match(s.url,/^https:\/\/(plants\.ces\.ncsu\.edu|www\.nparks\.gov\.sg|www\.rhs\.org\.uk)\//);
  assert.equal(new Set(plant.stages.map(s=>s.stage)).size,plant.stages.length);
  for(const traits of [plant.traits,...plant.stages.map(s=>s.traits)])for(const [key,trait] of Object.entries(traits)){
   assert.ok(knowledge.fields[key],key);if(trait===null)continue;
   assert.ok(trait.values.length>0);trait.values.forEach(v=>assert.ok(knowledge.fields[key].values.includes(v),`${plant.id}.${key}: ${v}`));
   assert.ok(trait.sources.length);trait.sources.forEach(id=>assert.ok(sources.has(id)));
  }
 }
});
for(const example of cases)test(`synthetic semantic case: ${example.label}`,()=>{
 const out=ranker.rank(observe(example.values),knowledge);
 assert.equal(out.accepted,false);
 if(example.expected)assert.equal(out.candidates[0].id,example.expected);
 if(example.expectedStatus)assert.equal(out.status,example.expectedStatus);
});
test('empty, colour-only and unknown leaf observations cannot establish a result',()=>{
 const empty=ranker.rank({},knowledge);assert.equal(empty.status,'insufficient_evidence');
 assert.ok(empty.candidates.every(c=>c.score===0&&c.rank===1&&c.evidence.length===0));
 const pink=ranker.rank(observe({colour:'pink'}),knowledge);assert.equal(pink.status,'insufficient_evidence');
 assert.ok(pink.candidates.every(c=>!c.parts.leaf));
});
test('identical candidates tie independently of catalogue order',()=>{
 const a=ranker.rank(observe({colour:'pink'}),knowledge);
 const b=ranker.rank(observe({colour:'pink'}),{...knowledge,plants:[...knowledge.plants].reverse()});
 assert.deepEqual(a.candidates.map(c=>[c.id,c.score,c.rank]),b.candidates.map(c=>[c.id,c.score,c.rank]));
 assert.ok(a.candidates.filter(c=>c.rank===1).length>1);
});
test('seed stage never compares against flowering colour and signals limited coverage',()=>{
 const out=ranker.rank(observe({stage:'mature_seed_head',fruitForm:'pappus_ball',leafPosition:'basal',leafMargin:'lobed'}),knowledge);
 assert.equal(out.status,'limited_stage_coverage');assert.equal(out.lead,null);
 assert.equal(out.candidates[0].stage,'mature_seed_head');assert.ok(out.candidates[0].evidence.every(e=>e.feature!=='colour'));
 const withColour=ranker.rank(observe({stage:'mature_seed_head',colour:'white'}),knowledge);
 assert.equal(withColour.candidates[0].evidence[0].state,'unknown');
});
test('count requires units and does not compare tepals to petals',()=>{
 const noUnit=ranker.rank(observe({count:'6'}),knowledge);assert.equal(noUnit.ignored.length,1);assert.ok(!noUnit.observations.count);
 const tepals=ranker.rank(observe({stage:'flowering',count:'6',countUnit:'tepal'}),knowledge);
 assert.equal(tepals.candidates.find(c=>c.id==='snowdrop').evidence[0].state,'match');
 assert.equal(tepals.candidates.find(c=>c.id==='poppy').evidence[0].state,'unknown');
});
test('unmeasured anatomy cannot be passed off as image evidence',()=>{
 assert.throws(()=>ranker.rank({count:{value:'6',source:'image_measurement'}},knowledge),/does not measure/);
 assert.throws(()=>ranker.rank({colour:{value:'pink',source:'reference'}},knowledge),/Invalid observation/);
 assert.throws(()=>ranker.rank({colour:{value:'pink',source:'manual',reliability:-1}},knowledge),/Invalid reliability/);
 assert.equal(ranker.rank({colour:{value:'pink',source:'manual',reliability:0}},knowledge).candidates[0].score,0);
});
test('conflicting leaf evidence lowers water-lily agreement and missing facts are neutral',()=>{
 const a=ranker.rank(observe({stage:'flowering',shape:'cup',leafAttachment:'deep_notch'}),knowledge);
 const b=ranker.rank(observe({stage:'flowering',shape:'cup',leafAttachment:'peltate_complete'}),knowledge);
 assert.ok(a.candidates.find(c=>c.id==='waterlily').score>b.candidates.find(c=>c.id==='waterlily').score);
 assert.equal(a.candidates.find(c=>c.id==='sunflower').evidence.find(e=>e.feature==='leafAttachment').state,'unknown');
});
