// Identification Test v2 orchestration. This module does not extract new anatomy.
// It makes the existing primary flower evidence, conditional leaf evidence and
// abstention path explicit and inspectable.
const IdentificationV2=(()=>{
 const POLICY={schema_version:'0.2',minimum_primary_coverage:.5,minimum_primary_groups:3,no_match_ceiling:.35,visible_structure_ranking_mode:'inspect_only'};
 const STRUCTURE_TO_DISPLAY={single_large_flower_candidate:'single_flower',composite_head_candidate:'composite_head',small_flower_cluster_candidate:'flower_cluster'};
 const observation=(value,status,reason,evidence=[])=>({value,status,reason,evidence});
 function triage(proposal,leaf,structure){
  const mask=proposal?.masks?.flower||[],w=proposal?.sample?.width||0,h=proposal?.sample?.height||0;
  let area=0,edge=0;
  for(let p=0;p<mask.length;p++)if(mask[p]){area++;const x=p%w,y=Math.floor(p/w);if(!x||!y||x===w-1||y===h-1)edge++;}
  const coverage=proposal?.features?.flower_coverage??0,edgeFraction=area?edge/area:0,usable=Boolean(proposal?.quality?.usable);
  let framing;
  if(!area)framing=observation('unresolved','unresolved','No reliable flower-region proposal was isolated.');
  else if(coverage<.06)framing=observation('wide_or_small','needs_extra_handling','The selected region occupies less than 6% of the full-frame analysis.',['coarse_flower_mask']);
  else if(coverage>.6||edgeFraction>.16)framing=observation('tight_or_clipped','needs_extra_handling','The selected region dominates the frame or contacts too much of its edge.',['coarse_flower_mask']);
  else framing=observation('usable','observed','The selected region has usable full-frame scale and edge clearance.',['coarse_flower_mask']);

  const multiple=proposal?.quality?.issues?.some(issue=>/Multiple similarly prominent regions/.test(issue));
  const multiplicity=!area?observation('unresolved','unresolved','No reliable flower-region candidate.'):
   multiple?observation('multiple_candidates','needs_extra_handling','Several similarly prominent colour-connected regions were found; they are not verified flowers.',['coarse_proposals']):
   usable?observation('single_candidate','observed','One dominant flower-region candidate was selected; this is not a botanical flower count.',['coarse_proposals']):
   observation('unresolved','unresolved','The proposal set does not support a reliable single-versus-multiple judgement.',['coarse_proposals']);

  const floralStructure=structure?.value?
   observation(structure.value,structure.status,structure.reason,structure.evidence||[]):
   observation('unresolved','unresolved','Visible floral structure was not measured.');
  const leafVisibility=leaf?.selectedId?
   observation('blade_candidate_visible','region_candidate','A complete-looking nearby green blade candidate is visible; association with the flower is unverified.',['leaf_candidate_'+leaf.selectedId]):
   observation('no_reliable_blade','unresolved',leaf?.observations?.reason||'No sufficiently complete isolated green blade was found.');
  return {framing,flower_multiplicity:multiplicity,visible_floral_structure:floralStructure,leaf_visibility:leafVisibility,diagnostics:{flower_region_coverage:coverage,edge_contact_fraction:edgeFraction,proposal_count:proposal?.quality?.proposal_count??0,structure_metrics:structure?.metrics||null}};
 }
 const score=(candidate,primary=false)=>primary?(candidate.flower_score??candidate.score):candidate.score;
 function knowledgeIndex(knowledge){return new Map((knowledge?.plants||[]).map(plant=>[plant.id,plant]));}
 function structureEvidence(candidate,structure){
  const observed=structure?.value&&structure.value!=='unresolved'?structure.value:null,profile=candidate.visibleStructureExpectation,expected=profile?.allowed||[];
  if(!observed)return{observed:null,expected,status:'image_unresolved',reason:'Visible floral structure is unresolved; profile comparison is neutral.',ranking_mode:'inspect_only',source:null,scope:null};
  if(!profile)return{observed,expected,status:'profile_unknown',reason:'This candidate has no crop-level visible-structure expectation; comparison is neutral.',ranking_mode:'inspect_only',source:null,scope:null};
  if(profile.status==='unsupported_observer_class')return{observed,expected,status:'unsupported',reason:'This candidate uses a display class outside the current observer schema; comparison is neutral.',ranking_mode:'inspect_only',source:profile.sourceRecord,scope:profile.scope};
  const match=expected.includes(observed);return{observed,expected,status:match?'match':'conflict',reason:match?'Observed crop structure is compatible with the reviewed expectation.':'Observed crop structure conflicts with the reviewed expectation.',ranking_mode:'inspect_only',review_status:profile.status,source:profile.sourceRecord,scope:profile.scope};
 }
 function ranked(candidates,primary,structure){return candidates.map(candidate=>{const base=score(candidate,primary),support=structureEvidence(candidate,structure);return{...candidate,structure_evidence:support,structure_adjustment:0,pipeline_score:base};}).sort((a,b)=>b.pipeline_score-a.pipeline_score||String(a.id).localeCompare(String(b.id))).map((candidate,index)=>({...candidate,pipeline_rank:index+1}));}
 function knowledgeCoverage(structure,index,candidates){
  const cropObserved=structure?.value&&structure.value!=='unresolved'?structure.value:null,displayObserved=STRUCTURE_TO_DISPLAY[cropObserved]||null;if(!cropObserved)return{observed:null,semantic_observed:null,active_compatible:[],knowledge_only:[]};
  const active=new Set(candidates.map(candidate=>candidate.id)),matching=[...index.values()].filter(plant=>plant.traits?.display?.values?.includes(displayObserved));
  return{observed:cropObserved,semantic_observed:displayObserved,active_compatible:candidates.filter(candidate=>candidate.visibleStructureExpectation?.allowed?.includes(cropObserved)).map(candidate=>({id:candidate.id,name:candidate.name})),knowledge_only:matching.filter(plant=>!active.has(plant.id)).map(plant=>({id:plant.id,name:plant.name}))};
 }
 function build(out,knowledge){
  const triageState=out.triage||{},index=knowledgeIndex(knowledge),structure=triageState.visible_floral_structure,primary=ranked(out.candidates||[],true,structure),top=primary[0],second=primary[1],minimumScore=out.thresholds?.minimum_score??.72,minimumLead=out.thresholds?.minimum_lead??.12,lead=(top?.pipeline_score||0)-(second?.pipeline_score||0);
  const predicates={
   analyzable:Boolean(out.quality?.usable),
   framing_usable:triageState.framing?.value==='usable',
   single_target:triageState.flower_multiplicity?.value==='single_candidate',
   coverage_sufficient:(top?.coverage||0)>=POLICY.minimum_primary_coverage,
   required_traits_present:!top?.missing_required?.length,
   independent_groups_sufficient:(top?.observed_groups||0)>=POLICY.minimum_primary_groups,
   profile_validated:top?.calibrationStatus==='validated',
   score_sufficient:(top?.pipeline_score||0)>=minimumScore,
   lead_sufficient:lead>=minimumLead
  };
  const primaryPass=Object.values(predicates).every(Boolean);
  const insufficiencies=Object.entries(predicates).filter(([,pass])=>!pass).map(([name])=>name);
  const leafAvailable=triageState.leaf_visibility?.value==='blade_candidate_visible';
  const allowListed=predicates.analyzable&&predicates.framing_usable&&predicates.single_target&&predicates.coverage_sufficient&&predicates.score_sufficient&&(insufficiencies.includes('lead_sufficient')||insufficiencies.includes('required_traits_present')||insufficiencies.includes('independent_groups_sufficient'));
  const secondaryRan=!primaryPass&&allowListed&&leafAvailable;
  const final=primaryPass?primary:secondaryRan?ranked(out.candidates||[],false,structure):primary;
  const finalTop=final[0],finalSecond=final[1],finalLead=(finalTop?.pipeline_score||0)-(finalSecond?.pipeline_score||0);
  const finalPass=secondaryRan&&predicates.framing_usable&&predicates.single_target&&predicates.coverage_sufficient&&!finalTop?.missing_required?.length&&(finalTop?.observed_groups||0)>=POLICY.minimum_primary_groups&&finalTop?.calibrationStatus==='validated'&&(finalTop?.pipeline_score||0)>=minimumScore&&finalLead>=minimumLead;
  const noMatchEligible=predicates.analyzable&&predicates.framing_usable&&predicates.single_target&&predicates.coverage_sufficient&&(top?.pipeline_score||0)<POLICY.no_match_ceiling;
  let outcome='ambiguous',outcomeReason=insufficiencies.includes('lead_sufficient')?'Several candidates remain compatible with the observed evidence; the lead is not sufficient.':insufficiencies.length===1&&insufficiencies[0]==='profile_validated'?'One candidate clears the experimental evidence thresholds, but its image profile is not validated.':'Primary evidence is insufficient and secondary evidence did not establish a unique supported candidate.',internalState='assessable';
  if(primaryPass||finalPass){outcome='identified';outcomeReason=(primaryPass?'Primary':'Primary plus bounded secondary')+' evidence produced one experimental supported-catalogue leader.';}
  else if(noMatchEligible){outcome='no_match';outcomeReason='Usable observed evidence did not reach the conservative compatibility floor for any supported candidate.';}
  else if(!predicates.analyzable||!predicates.framing_usable||!predicates.single_target){internalState='not_assessable';outcomeReason='The image needs a clearer single, fully framed flower region before candidate evidence can be judged.';}
  const primaryById=new Map(primary.map(row=>[row.id,row])),coverage=knowledgeCoverage(structure,index,out.candidates||[]);
  const ambiguityCauses=[];
  if(!predicates.analyzable||!predicates.framing_usable||!predicates.single_target)ambiguityCauses.push({code:'input_not_assessable',scope:'image',message:'The frame does not contain one reliable, suitably framed target.'});
  if(!predicates.required_traits_present||!predicates.independent_groups_sufficient)ambiguityCauses.push({code:'measurement_missing',scope:'image',message:'Required image measurements or independent evidence groups are missing.'});
  if(top?.structure_evidence?.status==='profile_unknown')ambiguityCauses.push({code:'profile_expectation_missing',scope:'profile',candidateIds:[top.id],message:'The leading candidate has no reviewed crop-level structure expectation.'});
  if(!predicates.lead_sufficient)ambiguityCauses.push({code:'candidate_overlap',scope:'catalogue',candidateIds:primary.filter(row=>Math.abs(row.pipeline_score-(top?.pipeline_score||0))<minimumLead).map(row=>row.id),message:'Several candidates remain within the minimum lead.'});
  if(!predicates.profile_validated)ambiguityCauses.push({code:'validation_hold',scope:'policy',candidateIds:top?[top.id]:[],message:'The leading image profile is experimental and cannot produce automatic identification.'});
  const evidenceMap={
   image_processing:[
    {label:'Flower region',value:out.quality?.usable?'measured':'unresolved',source:'flower mask'},
    {label:'Centre / rays',value:out.observations?.centre?.status||'unresolved',source:'centre + outer-ray masks'},
    {label:'Outer regions',value:out.observations?.petalShape?.status||'unresolved',source:'edges + region proposals'}
   ],
   observed_character:{label:'Visible floral structure',value:structure?.value||'unresolved',status:structure?.status||'unresolved',reason:structure?.reason||'Not measured'},
   profile_comparisons:primary.slice(0,3).map(row=>({candidate_id:row.id,candidate_name:row.name,observed:row.structure_evidence.observed,expected:row.structure_evidence.expected,status:row.structure_evidence.status,reason:row.structure_evidence.reason,ranking_mode:row.structure_evidence.ranking_mode,source:row.structure_evidence.source,scope:row.structure_evidence.scope,score_effect:null})),
   gate:{passed:primaryPass,blockers:insufficiencies},
   catalogue_coverage:coverage
  };
  return {
   schema_version:POLICY.schema_version,
   experimental:true,
   policy:{...POLICY,minimum_score:minimumScore,minimum_lead:minimumLead,automatic_acceptance_enabled:false},
   triage:triageState,
   evidence_map:evidenceMap,
   ambiguity:{causes:ambiguityCauses},
   primary:{evidence_families:{flower_region:out.quality?.usable?'measured':'unresolved',colour:top?.parts?.colour==null?'unresolved':'measured',visible_structure:structure?.status||'unresolved',petal_shape:out.observations?.petalShape?.status||'unresolved',centre_or_head:out.observations?.centre?.status||'unresolved',arrangement:out.observations?.arrangement?.status||'unresolved',stage:'candidate_hypothesis'},candidates:primary,lead,gate:{passed:primaryPass,predicates,insufficiencies}},
   secondary:{ran:secondaryRan,available:leafAvailable,reason:primaryPass?'Primary gate passed; secondary evidence was skipped for the decision.':!allowListed?'Primary failure is not eligible for secondary rescue.':!leafAvailable?'A nearby blade is the requested discriminator, but no reliable blade candidate is visible.':'Nearby blade compatibility was applied only to primary near-ties.',association:'unverified',changes:final.map(row=>{const before=primaryById.get(row.id);return{id:row.id,before_rank:before?.pipeline_rank,after_rank:row.pipeline_rank,before_score:before?.pipeline_score,after_score:row.pipeline_score,adjustment:row.pipeline_score-(before?.pipeline_score||0)};})},
   final:{outcome,internal_state:internalState,review_required:true,candidate_id:outcome==='identified'?finalTop?.id:null,candidate_name:outcome==='identified'?finalTop?.name:null,leading_candidate:finalTop?{id:finalTop.id,name:finalTop.name,latin:finalTop.latin,stage:finalTop.stage,status:outcome==='identified'?'supported':'hypothesis'}:null,leading_candidates:final.filter(row=>Math.abs(row.pipeline_score-(finalTop?.pipeline_score||0))<1e-9).map(row=>({id:row.id,name:row.name,latin:row.latin,stage:row.stage})),lead:finalLead,reason:outcomeReason,candidates:final,follow_up:outcome==='identified'?'Use a held-out calibrated evaluation before treating this as an accepted identification.':out.decision?.follow_up||'Take one clear view of a single flower and one complete leaf with its stem attachment.'}
  };
 }
 return {POLICY,triage,build};
})();
if(typeof module!=='undefined')module.exports=IdentificationV2;
