import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../dist/server/index.js';
import {describeClues,canReview,regionBounds} from '../dist/flow-model.js';
const get=path=>worker.fetch(new Request('https://test.local'+path),{});
test('main flow and relocated legacy pages have distinct working routes and assets',async()=>{
 const main=await get('/');assert.match(await main.text(),/Follow the clues/);
 const dev=await get('/dev/');assert.match(await dev.text(),/Guided Test Bench/);
 const collection=await get('/dev/collect');assert.match(await collection.text(),/Your discoveries/);
 for(const [from,to] of [['/dev','/dev/'],['/collect','/dev/collect'],['/collect.html','/dev/collect']]){const response=await get(from);assert.equal(response.status,308);assert.equal(response.headers.get('location'),'https://test.local'+to);}
 for(const route of ['/dev/','/dev/collect','/']){const html=await (await get(route)).text();for(const [,src]of html.matchAll(/(?:src|href)="([^"#]+\.(?:js|css))"/g)){const url=new URL(src,'https://test.local'+route);assert.equal((await get(url.pathname)).status,200,url.pathname);}}
 assert.equal((await get('/missing')).status,404);
});
test('all gallery samples are served and retain attribution',async()=>{const data=await(await get('/assets/samples/manifest.json')).json();assert.equal(data.length,6);for(const sample of data){assert.ok(sample.author&&sample.sourcePage&&sample.licenseUrl);assert.equal((await get(sample.src)).status,200);}});
const out={quality:{usable:true},features:{pink:.7,centre_contrast:.4,visible_tips_low:.2,visible_tips_high:.3,vegetation_coverage:.5},sample:{width:3,height:3},masks:{flower:[0,0,0,0,1,0,0,0,0]},candidates:[{name:'Candidate'}]};
test('failed processing cannot become observed clues or a reviewable answer',()=>{const bad={...out,quality:{usable:false}};assert.equal(canReview(bad),false);assert.ok(describeClues(bad).every(c=>c.state!=='observed'));assert.equal(canReview(null),false);});
test('leaf and petal claims remain unresolved even with usable measurements',()=>{const clues=describeClues(out);assert.equal(clues.find(c=>c.id==='leaves').state,'missing');assert.equal(clues.find(c=>c.id==='outline').state,'uncertain');assert.equal(clues.find(c=>c.id==='colour').state,'observed');assert.equal(canReview(out),true);});
test('actual mask bounds detect clipping and empty regions',()=>{assert.equal(regionBounds([0,0,0,0],2,2),null);assert.equal(regionBounds(out.masks.flower,3,3).clipped,false);assert.equal(regionBounds([1,0,0,0],2,2).clipped,true);});
test('user-selected close-ups can be reviewed without promoting uncertain evidence',()=>{
 const closeup={...out,quality:{usable:false,seed_contained:true,issues:['Target region covers most of image; segmentation uncertain']}};
 assert.equal(canReview(closeup),true);
 assert.ok(describeClues(closeup).every(c=>c.state!=='observed'));
 assert.equal(closeup.quality.usable,false);
 for(const issue of ['Too few target pixels','Tap did not land on a detectable flower region','Very little edge detail; image may be blurred']) {
  assert.equal(canReview({...closeup,quality:{...closeup.quality,issues:[...closeup.quality.issues,issue]}}),false);
 }
 assert.equal(canReview({...closeup,quality:{...closeup.quality,seed_contained:false}}),false);
});
