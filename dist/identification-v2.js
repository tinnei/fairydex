// Identification Test v2 orchestration. This module does not extract new anatomy.
// It makes the existing primary flower evidence, conditional leaf evidence and
// abstention path explicit and inspectable.
const IdentificationV2=(()=>{
 const POLICY={schema_version:'0.1',minimum_primary_coverage:.5,minimum_primary_groups:3,no_match_ceiling:.35};
 const observation=(value,status,reason,evidence=[])=>({value,status,reason,evidence});
 function triage(proposal,leaf,head){
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

  const headGrouping=head?.status&&head.status!=='unknown'?
   observation('one_head_candidate','region_candidate','One disc-and-outer-ray region was detected inside the selected crop; additional heads are not counted.',['centre_mask','outer_ray_mask']):
   observation('unresolved','unresolved','Head or crown count is not measured by the current proposal method.');
  const leafVisibility=leaf?.selectedId?
   observation('blade_candidate_visible','region_candidate','A complete-looking nearby green blade candidate is visible; association with the flower is unverified.',['leaf_candidate_'+leaf.selectedId]):
   observation('no_reliable_blade','unresolved',leaf?.observations?.reason||'No sufficiently complete isolated green blade was found.');
  return {framing,flower_multiplicity:multiplicity,head_grouping:headGrouping,leaf_visibility:leafVisibility,diagnostics:{flower_region_coverage:coverage,edge_contact_fraction:edgeFraction,proposal_count:proposal?.quality?.proposal_count??0}};
 }
 const score=(candidate,primary=false)=>primary?(candidate.flower_score??candidate.score):candidate.score;
 function ranked(candidates,primary){return candidates.map(candidate=>({...candidate,pipeline_score:score(candidate,primary)})).sort((a,b)=>b.pipeline_score-a.pipeline_score||String(a.id).localeCompare(String(b.id))).map((candidate,index)=>({...candidate,pipeline_rank:index+1}));}
 function build(out){
  const primary=ranked(out.candidates||[],true),top=primary[0],second=primary[1],minimumScore=out.thresholds?.minimum_score??.72,minimumLead=out.thresholds?.minimum_lead??.12,lead=(top?.pipeline_score||0)-(second?.pipeline_score||0),triageState=out.triage||{};
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
  const final=primaryPass?primary:secondaryRan?ranked(out.candidates||[],false):primary;
  const finalTop=final[0],finalSecond=final[1],finalLead=(finalTop?.pipeline_score||0)-(finalSecond?.pipeline_score||0);
  const finalPass=secondaryRan&&predicates.framing_usable&&predicates.single_target&&predicates.coverage_sufficient&&!finalTop?.missing_required?.length&&(finalTop?.observed_groups||0)>=POLICY.minimum_primary_groups&&finalTop?.calibrationStatus==='validated'&&(finalTop?.pipeline_score||0)>=minimumScore&&finalLead>=minimumLead;
  const noMatchEligible=predicates.analyzable&&predicates.framing_usable&&predicates.single_target&&predicates.coverage_sufficient&&(top?.pipeline_score||0)<POLICY.no_match_ceiling;
  let outcome='ambiguous',outcomeReason='Primary evidence is insufficient and secondary evidence did not establish a unique supported candidate.',internalState='assessable';
  if(primaryPass||finalPass){outcome='identified';outcomeReason=(primaryPass?'Primary':'Primary plus bounded secondary')+' evidence produced one experimental supported-catalogue leader.';}
  else if(noMatchEligible){outcome='no_match';outcomeReason='Usable observed evidence did not reach the conservative compatibility floor for any supported candidate.';}
  else if(!predicates.analyzable||!predicates.framing_usable||!predicates.single_target){internalState='not_assessable';outcomeReason='The image needs a clearer single, fully framed flower region before candidate evidence can be judged.';}
  const primaryById=new Map(primary.map(row=>[row.id,row]));
  return {
   schema_version:POLICY.schema_version,
   experimental:true,
   policy:{...POLICY,minimum_score:minimumScore,minimum_lead:minimumLead,automatic_acceptance_enabled:false},
   triage:triageState,
   primary:{evidence_families:{flower_region:out.quality?.usable?'measured':'unresolved',colour:top?.parts?.colour==null?'unresolved':'measured',petal_shape:out.observations?.petalShape?.status||'unresolved',centre_or_head:out.observations?.centre?.status||'unresolved',arrangement:out.observations?.arrangement?.status||'unresolved',stage:'candidate_hypothesis'},candidates:primary,lead,gate:{passed:primaryPass,predicates,insufficiencies}},
   secondary:{ran:secondaryRan,available:leafAvailable,reason:primaryPass?'Primary gate passed; secondary evidence was skipped for the decision.':!allowListed?'Primary failure is not eligible for secondary rescue.':!leafAvailable?'A nearby blade is the requested discriminator, but no reliable blade candidate is visible.':'Nearby blade compatibility was applied only to primary near-ties.',association:'unverified',changes:final.map(row=>{const before=primaryById.get(row.id);return{id:row.id,before_rank:before?.pipeline_rank,after_rank:row.pipeline_rank,before_score:before?.pipeline_score,after_score:row.pipeline_score,adjustment:row.pipeline_score-(before?.pipeline_score||0)};})},
   final:{outcome,internal_state:internalState,review_required:true,candidate_id:outcome==='identified'?finalTop?.id:null,candidate_name:outcome==='identified'?finalTop?.name:null,lead:finalLead,reason:outcomeReason,candidates:final,follow_up:outcome==='identified'?'Use a held-out calibrated evaluation before treating this as an accepted identification.':out.decision?.follow_up||'Take one clear view of a single flower and one complete leaf with its stem attachment.'}
  };
 }
 return {POLICY,triage,build};
})();
if(typeof module!=='undefined')module.exports=IdentificationV2;
