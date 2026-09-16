// Experimental measurable profiles, not validated botanical probabilities.
// Each rule: feature, allowed minimum/maximum, importance. Missing features abstain.
const ENGINE_PROFILES = [
 {id:'hibiscus',name:'Hibiscus / 朱槿',latin:'Hibiscus rosa-sinensis group',taxonRank:'horticultural group',stage:'flowering',part:'flower',rules:{colour:[['warm',.35,1,1]],shape:[['fill',.3,.95,1]],centre:[['center_yellow',0,.4,1]],surface:[['texture',0,.3,1]]}},
 {id:'ixora',name:'Ixora / 龍船花',latin:'Ixora',taxonRank:'genus',stage:'flowering',part:'flower cluster',rules:{colour:[['warm',.3,1,1]],shape:[['fill',.15,.8,1]],centre:[['center_yellow',0,.6,1]],surface:[['texture',.15,.65,1]]}},
 {id:'lantana',name:'Lantana / 馬纓丹',latin:'Lantana',taxonRank:'genus',stage:'flowering',part:'flower cluster',rules:{colour:[['warm',.25,1,1],['color_diversity',.3,1,1]],shape:[['fill',.25,.85,1]],centre:[['center_yellow',0,.8,1]],surface:[['texture',.12,.6,1]]}},
 {id:'plumeria',name:'Frangipani / 雞蛋花',latin:'Plumeria',taxonRank:'genus',stage:'flowering',part:'flower',rules:{colour:[['pale_or_pink',.3,1,1]],shape:[['fill',.25,.85,1]],centre:[['center_yellow',.08,.9,1]],surface:[['texture',0,.22,1]]}},
 {id:'bougainvillea',name:'Bougainvillea / 簕杜鵑',latin:'Bougainvillea',taxonRank:'genus',stage:'flowering',part:'flower/bract candidate',rules:{colour:[['pale_or_pink',.25,1,1]],shape:[['fill',.2,.9,1]],centre:[['center_yellow',0,.15,1]],surface:[['texture',0,.35,1]]}},
 {id:'bidens',name:'Beggarticks / 鬼針草',latin:'Bidens',taxonRank:'genus',stage:'flowering',part:'flower head',rules:{colour:[['pale',.2,.95,1]],shape:[['fill',.15,.7,1]],centre:[['center_yellow',.15,1,2],['outer_yellow',0,.3,1]],surface:[['texture',0,.4,1]]}},
 {id:'waterlily',name:'Water lily',latin:'Nymphaea',taxonRank:'genus',stage:'flowering',part:'flower',rules:{colour:[['pale_or_pink',.25,1,1]],shape:[['fill',.4,1,1]],centre:[['center_yellow',.08,1,1]],surface:[['texture',.04,.4,1]]}},
 {id:'dandelion',name:'Dandelion',latin:'Taraxacum',taxonRank:'genus',stage:'flowering',part:'flower head',rules:{colour:[['yellow',.55,1,2]],shape:[['fill',.3,1,1]],centre:[['outer_yellow',.4,1,1]],surface:[['texture',.08,.6,1]]}},
 {id:'dandelion',name:'Dandelion',latin:'Taraxacum',taxonRank:'genus',stage:'mature_seed_head',part:'seed-head candidate',rules:{colour:[['pale',.55,1,2],['yellow',0,.08,1]],shape:[['fill',.25,1,1]],centre:[['center_yellow',0,.08,1]],surface:[['texture',.12,.7,2]]}},
 {id:'daisy',name:'Common daisy',latin:'Bellis perennis',taxonRank:'species candidate',stage:'flowering',part:'flower head',rules:{colour:[['pale',.3,1,1]],shape:[['fill',.35,.9,1]],centre:[['center_yellow',.2,1,2],['outer_yellow',0,.2,1]],surface:[['texture',.02,.4,1]]}},
 {id:'poppy',name:'Poppy',latin:'Papaver',taxonRank:'genus',stage:'flowering',part:'flower',rules:{colour:[['red',.4,1,1]],shape:[['fill',.35,1,1]],centre:[['center_yellow',0,.12,1]],surface:[['texture',0,.3,1]]}},
 {id:'clover',name:'Clover',latin:'Trifolium',taxonRank:'genus',stage:'flowering',part:'flower cluster',rules:{colour:[['pink',.35,1,1]],shape:[['fill',.35,1,1]],centre:[['center_yellow',0,.12,1]],surface:[['texture',.1,.6,1]]}},
 {id:'bluebell',name:'Bluebell',latin:'Hyacinthoides',taxonRank:'genus',stage:'flowering',part:'flower candidate',rules:{colour:[['blue',.4,1,1]],shape:[['fill',.15,.8,1]],centre:[['center_yellow',0,.1,1]],surface:[['texture',0,.4,1]]}}
];

// Draft VIEW hypotheses, not genus-wide botanical facts. A mismatch is soft evidence.
// References describe anatomy; mapping anatomy to the visible silhouette still needs review.
const OUTLINE_REFERENCES = {
 waterlily: {tips:['pointed'], source:'https://www.wildflower.org/plants/result.php?id_plant=nyod', scope:'Pointed visible tips hypothesis, based on Nymphaea odorata; not all cultivars or viewpoints'},
 clover: {outline:['rounded'], source:'https://plants.ces.ncsu.edu/plants/trifolium-pratense/', scope:'Whole rounded head hypothesis for Trifolium pratense; individual flowers not measured'},
 dandelion: {outline:['rounded'], source:'https://plants.ces.ncsu.edu/plants/taraxacum-officinale/', scope:'Intact mature seed-head outline only; not flowering petals'}
};
for(const profile of ENGINE_PROFILES){
 const view=OUTLINE_REFERENCES[profile.id];
 if(!view||(profile.id==='dandelion'&&profile.stage!=='mature_seed_head'))continue;
 profile.morphology=Object.fromEntries(Object.entries(view).filter(([key])=>['outline','tips'].includes(key)));
 profile.morphologyScope=view.scope;profile.morphologySource=view.source;
}

ENGINE_PROFILES.push({id:'sunflower',name:'Sunflower / 向日葵',latin:'Helianthus annuus candidate',taxonRank:'species candidate',stage:'flowering',part:'composite-head hypothesis',calibrationStatus:'experimental',requiredFeatures:['ray_enclosure','disc_contrast'],source:'https://plants.ces.ncsu.edu/plants/helianthus-annuus/',rules:{colour:[['outer_yellow',.45,1,1]],shape:[['ray_enclosure',.8,1,1]],centre:[['disc_contrast',.12,1,1],['disc_fraction',.04,.72,1]],surface:[]}});

for(const p of ENGINE_PROFILES){if(['sunflower','daisy','bidens'].includes(p.id))p.headLayout='disc_with_outer_rays';if(p.id==='dandelion'&&p.stage==='flowering')p.headLayout='all_rays';}

// Crop-level expectations for the v2 evidence trace. These compare a measured
// observation with source-backed plant knowledge but remain inspect-only until
// an independent structure evaluation authorizes ranking weight.
const VISIBLE_STRUCTURE_EXPECTATIONS={
 hibiscus:{allowed:['single_large_flower_candidate'],status:'development_supported',sourceRecord:'botanical-knowledge:hibiscus',scope:'One dominant open flower crop; double and heavily occluded forms remain unreviewed'},
 waterlily:{allowed:['single_large_flower_candidate'],status:'development_supported',sourceRecord:'botanical-knowledge:waterlily',scope:'One dominant open flower crop; leaf attachment is a separate discriminator'},
 poppy:{allowed:['single_large_flower_candidate'],status:'source_only',sourceRecord:'botanical-knowledge:poppy',scope:'Single open flower view; not evaluated by the structure pilot'},
 plumeria:{allowed:['single_large_flower_candidate'],status:'development_supported',sourceRecord:'botanical-knowledge:plumeria',scope:'Only when one dominant open blossom is selected; multiple large flowers must remain unresolved'},
 ixora:{allowed:['small_flower_cluster_candidate'],status:'development_supported',sourceRecord:'botanical-knowledge:ixora',scope:'Cluster crop with several separate small corollas'},
 lantana:{allowed:['small_flower_cluster_candidate'],status:'development_supported',sourceRecord:'botanical-knowledge:lantana',scope:'Cluster crop with several separate small corollas'},
 sunflower:{allowed:['composite_head_candidate'],status:'development_supported',sourceRecord:'botanical-knowledge:sunflower',scope:'Disc-plus-ray head only'},
 daisy:{allowed:['composite_head_candidate'],status:'development_supported',sourceRecord:'botanical-knowledge:daisy',scope:'Disc-plus-ray head only'},
 bidens:{allowed:['composite_head_candidate'],status:'development_supported',sourceRecord:'botanical-knowledge:bidens',scope:'Disc-plus-ray head; the smaller angled pilot view abstained'},
 clover:{allowed:['small_flower_cluster_candidate'],status:'source_only',sourceRecord:'botanical-knowledge:clover',scope:'Botanical cluster semantics; crop-level observer mapping is not evaluated'},
 bluebell:{allowed:['small_flower_cluster_candidate'],status:'source_only',sourceRecord:'botanical-knowledge:bluebell',scope:'Raceme/cluster semantics; crop-level observer mapping is not evaluated'},
 bougainvillea:{allowed:[],status:'unsupported_observer_class',sourceRecord:'botanical-knowledge:bougainvillea',scope:'Bract-dominant displays are outside the current three positive observer classes'}
};
for(const p of ENGINE_PROFILES){
 const expectation=p.id==='dandelion'&&p.stage==='flowering'?{allowed:[],status:'unsupported_observer_class',sourceRecord:'botanical-knowledge:dandelion',scope:'All-ray flowering head is outside the current disc-plus-ray observer class'}:p.id==='dandelion'?null:VISIBLE_STRUCTURE_EXPECTATIONS[p.id];
 if(expectation)p.visibleStructureExpectation={observationScope:'selected_crop',rankingMode:'inspect_only',...expectation};
}

// Provisional visible-region layouts; these never provide the observed count.
for(const p of ENGINE_PROFILES){if(['hibiscus','plumeria'].includes(p.id))p.regionLayout=['few_broad'];if(['sunflower','daisy','bidens'].includes(p.id))p.regionLayout=['many_narrow'];}
