# Flower Lens — project memory

Last updated: 2026-09-15. Current milestone: reproducible Commons benchmark v1; image engine remains 0.15.

## Read first

Both roles read this file before starting a task, then follow the relevant technical links. Follow the two-role agreement in `AGENTS.md`. Update this record after major changes, decisions, failures or evaluations. Preserve the reason for a decision and evidence that might change it.

## Product goal and scope

Help learners photograph common flowers in Macau and understand the visible evidence behind candidate identifications. Current flow: upload a photo → engine analysis → candidates and evidence. Keep the engineering interface minimal. `/collect` gathers photos with location and time for identification at home.

Prioritize the identification backbone before botanical illustrations and deeper educational presentation. Total petal count and actual leaf arrangement are desired capabilities, not delivered capabilities.

## Two roles

| Role | Owns | Handoff |
|---|---|---|
| Developer (primary agent) | Failure diagnosis, code, data handling, testing and delivery | Changes, evidence, limitations and next technical question |
| Product planner | Scope, milestones, acceptance criteria, decisions and major-update documentation | Rationale, open questions, evidence needed and next task |

The planner maintains the narrative record; the developer supplies verified implementation details and integrates documentation. Agent sessions are temporary; these records must remain with the source.

## Delivered and limitations

- Six Macau candidate groups—hibiscus, ixora, lantana, plumeria, bougainvillea and bidens—alongside legacy candidates.
- Separate feature-group scores and overall ranking, with matched and conflicting evidence.
- Heuristic flower-region proposals; separate vegetation/context measurements.
- Outline roundness, elongation, radial regularity and visible-tip estimates.
- Yellow/orange centre hypotheses and centre-versus-outer colour measurements.
- Nearby vegetation position in image coordinates.
- Explicit ambiguity for near ties; all identifications remain experimental.

Masks can include background or exclude real flower tissue. Outline tips are not total petals. Green regions are not confirmed leaves; their image position cannot establish basal, alternate, opposite, whorled or floating arrangement. Stage and taxon outputs remain hypotheses. Broad scoring intervals frequently tie. Reference labels are unverified and related captures are not independent evidence. The user's water-lily example remains unresolved.

## Major updates

| Version | Delivered | Evidence and remaining problem |
|---|---|---|
| 0.6 | Six Macau groups, data-driven profiles, separate feature groups and evidence output; automatic acceptance disabled pending validation | Mixed unverified label agreement and legacy regression; catalog coverage did not establish reliable recognition |
| 0.7 | Structural diagnostics, bounded pale-region growth, orange-centre support, vegetation context and ambiguity handling | Screenshot crop reached a four-way highest-score tie; 41/59 reference examples had exact top-score ties in the controlled 320px evaluation; recognition remains unresolved |

Details: [0.6 notes](tests/ENGINE-NOTES.md), [0.7 evaluation](tests/STRUCTURAL-EVALUATION.md), [structural implementation and plan](tests/STRUCTURE-PLAN.md).

Do not compare the earlier 160px benchmark directly with the 320px run as though only the ranker changed. Committed reports retain findings, but some raw evaluation artifacts referenced in those reports were stored in scratch; full reproducibility is not yet preserved.

## Decisions and lessons

| Decision or lesson | Why |
|---|---|
| Keep unknowns explicit | Plausible botanical explanations are not extracted evidence; invisible anatomy cannot be measured |
| Preserve the simple upload flow | Improve automatic extraction without mandatory observation questions |
| Show ties as ambiguous | Catalog order previously produced an arbitrary displayed winner |
| Treat colour-connected regions as proposals | Reflections and pale backgrounds contaminated flower masks |
| Validate extraction before increasing its ranking weight | More features cannot repair an incorrect region; silhouette peaks do not supply total petals |
| Separate related captures across development/evaluation by group | Near duplicates and repeated tuning on one screenshot can overstate generalization |
| Keep automatic acceptance disabled pending calibration | Abstention itself is not improved identification accuracy |

Supersede decisions with a dated explanation rather than silently removing the old rationale.

## Next milestone: reviewed structural evidence

Determine whether the engine measures the right structures before changing confidence or adding candidates.

1. Review reference labels and keep uncertain labels explicit.
2. Annotate a pilot covering reflections, white petals, overlapping blossoms, bracts and seed heads.
3. Record flower boundaries, visible tips, viewpoint, stage and occlusion where observable.
4. Group related captures; reserve an untouched evaluation split.
5. Measure region overlap, visible-tip error and abstention separately from ranking.
6. Decide from these findings whether to improve heuristics or introduce organ segmentation/keypoint detection.

Completion requires an annotation schema, reviewed examples with provenance and capture groups, a reproducible evaluation, and errors reported by failure group. Report ties and abstentions separately from array-order wins. Set any numeric acceptance gates before tuning on the relevant evaluation set. Preserve scripts and required inputs with the source rather than relying on scratch paths.

Later: detect leaf blades, stems and attachment nodes before actual leaf arrangement; calibrate feature reliability and score fusion; evaluate the final configuration on the untouched split before enabling accepted identifications.

## Next handoff

Developer: inspect the existing manifest and annotation/evaluation tooling; propose the smallest reproducible annotation pilot.

Planner: define pilot coverage and annotation terms, record the agreed criteria here, and document the results after implementation.

Open question: are failures dominated by segmentation, missing anatomical measurements, or profiles that cannot discriminate even with correct measurements? The next milestone must separate these causes.

## 2026-09-15 — flower catalogue

Added `/flowers`, subtly linked at the top right of the test bench. It reads the active engine profiles, groups duplicate taxa, and lists 12 candidates with scientific names, taxonomic level and supported stages (13 profiles). Experimental identification remains explicit. Rendering and page/asset routes were checked; no engine behavior changed.

## 2026-09-15 — proposed catalogue expansion

Added eight proposed collection targets to `/flowers`, separate from the 12 active candidates: Catharanthus roseus, Pentas lanceolata, Allamanda cathartica, Canna indica, Nelumbo nucifera, Portulaca grandiflora, Zephyranthes candida and Lagerstroemia speciosa. Commons category pages were opened and verified; links and testing rationale are retained in `dist/flower-expansion.js`. This is a scouting shortlist, not a verified survey of Macau abundance. Local locations, individual image labels/licences and cultivated hybrids require review. No images imported and no recognition support added. Next: collect a small attributed sample per target and confirm local sightings before creating engine profiles.

Sunflower (Helianthus annuus / 向日葵) added at user request, bringing the proposed list to nine. Commons category verified; recognition support remains planned.

Snowdrop (Galanthus nivalis / 雪滴花) added at user request as an extra reference target, not a confirmed Macau flower. Ten planned entries total; Commons category verified.

## 2026-09-15 — botanical knowledge testing

Added source-backed draft records for all **22 catalogue flowers** and **48 stage hypotheses**: flowering and vegetative for all, dandelion seed head, and lotus/poppy/bidens fruiting. Records link NC State, NParks and RHS descriptions and state representative-taxon scope; missing and variable traits remain explicit.

The optional `/knowledge` engineering page tests 18 manually supplied fields with separate flower, leaf, context and fruit scores and overall ranking. It includes source links, explicit count units, provenance, synthetic presets, reference-photo display and JSON export. It does not extract anatomy from photos. Catalogue names link to their knowledge record. The main image engine still contains 12 taxa.

All 27 tests passed (16 knowledge, 11 existing). Eight synthetic positive cases ranked the expected candidate; pink-only abstained and a single available seed-stage candidate reported limited stage coverage. These are logic checks, not photo-recognition accuracy.

Decision update: the user's request expands knowledge/testing coverage before extraction validation, superseding that sequencing only. Camera extraction of petals and leaf arrangement, automatic recognition for the ten additions, and validated acceptance remain unfinished.

Details and reproducible usage: [botanical knowledge](docs/BOTANICAL-KNOWLEDGE.md). Next: annotate a small attributed real-photo set and compare semantic versus image results, recording extraction errors, profile conflicts, ties and stage gaps before tuning.

## 2026-09-15 — botanical-first silhouette evidence (0.8)

User decision: organize identification around observable botanical characteristics, using ordinary language first and numerical measurements internally only where necessary.

The active 256px guided pipeline now describes the selected silhouette as rounded, lobed/elongated or unclear, and prominent outline tips as rounded, pointed, mixed or unclear. Two smoothing scales must agree. Unusable, small and edge-clipped regions abstain. Shape labels appear first in the feature panel, with numeric diagnostics retained. Shape expectations participate within the existing shape group, not as an additional independent organ vote.

Three provisional view profiles are connected: water-lily pointed outline tips (representative N. odorata), red-clover rounded whole head, and dandelion rounded mature seed head. Source links and scope limits are stored alongside profiles. Other candidates have no categorical expectations yet; absent knowledge is not positive evidence. These are view hypotheses, not comprehensive genus definitions. The 22-entry semantic knowledge page remains separate.

Whole outlines do not establish individual petal tips, total petals, flower tubes, leaf arrangement or stage. Removed over-specific outline labels such as “bell or tube”. Automatic acceptance remains disabled. This connection precedes the reviewed annotation pilot at the user's request, but does not supersede its validation requirement. Earlier 320px evaluation notes remain historical, not descriptions of this active pipeline.

Evidence: 31 logic tests pass, including synthetic rounded/lobed contours, broad/narrow apexes, quality abstention and ranking changes with colour held fixed. These tests do not measure real-photo identification accuracy. Next: review real region boundaries and silhouette labels, starting with water lily, clover and seed heads, before extending view profiles or tuning thresholds.

## 2026-09-15 — automatic head structure (0.9)

User decision: the test bench is upload → automatic analysis → read-only evidence. Removed photo taps, seed markers, tap-required status and retry-region prompts. Feedback is deferred to a future feature page; no feedback workflow was added.

A bounded yellow-region closing and enclosure check proposes whole head, contrasting centre and outer rays. It requires a sizeable, centrally located enclosed region, surrounding yellow evidence and brightness contrast. Large edge-connected blue regions are excluded from general flower proposals. The three read-only colour masks expose these hypotheses. When enclosure is absent, centre/rays stay empty and unknown; general flower-region analysis remains available.

Sunflower now has an experimental image profile requiring enclosure and disc contrast. Layout evidence contributes within shape scoring; known disc-and-ray layouts match, flowering dandelion's all-ray layout conflicts, unreviewed layout expectations are neutral rather than affirmative evidence. Other related taxa/cultivars are incompletely represented. Automatic acceptance remains disabled.

Validation: 35 tests, including automatic synthetic head detection, solid-yellow/fragment negatives, mask containment/disjointness, automatic adapter rendering and an attributed sunflower development reference. The reference ranks sunflower first and visual inspection shows the darker centre retained separately from yellow rays. Its reusable RGBA input, licence/source and transformation are preserved in tests/head-reference. This one development photo is not a held-out accuracy evaluation. User screenshot's original photo was not available separately for evaluation.

Limitations: colour/closing heuristics, not semantic organ segmentation. Yellow nonflowers with similar rings can resemble a head. Open, overlapping, clipped, small, multicoloured or double heads may fail; no exact floret counts, petal anatomy or leaf attachment inferred. Next: annotated sunflower/lookalike photos across backgrounds and viewpoints, measuring region quality separately from candidate rank.

## 2026-09-15 — visible outer-region count experiment (0.10)

Added read-only numbered regions alongside existing head/centre/ray proposals. Outer mask components are compared after three progressively larger centre exclusions. Counts must agree and the same components must persist. Output retains exact visible candidate-region count, 3/4/5/6/many category, broad/narrow/mixed region shape, and unresolved reasons. Small, clipped, unusable and merged/unstable regions abstain. No photo taps or feedback controls were added.

These are petal-or-ray REGION candidates, not anatomical petal counts. The method uses existing mask gaps; it does not yet detect internal overlapping-petal boundaries. Species expectations never supply the count. Only coarse few-broad/many-narrow layout can affect existing shape scoring; counts are not injected into semantic knowledge fields. Individual tip anatomy and total petals stay unverified. Tied top scores now display AMBIGUOUS rather than a catalog-order winner.

38 tests pass: separated synthetic 3–6 regions, numbering/containment, merged/clipped/poor-quality abstention and existing regressions. The preserved sunflower photo reports unresolved count because outer regions merge/change across centre exclusions. This is an extraction experiment, not validated recognition accuracy. Next: annotated petal boundaries in real images and internal-boundary detection for overlapping petals; do not relax stability checks just to obtain expected counts.

Display update: visible petal/ray region count now appears directly in the result panel and as an exact number in extracted features, including counts above six. Missing counts read Unresolved with the detector reason. No extraction or ranking changes.

## 2026-09-15 — internal-edge experiment (0.11)

Added smoothed luminance Sobel edges inside the proposed flower mask, excluding its immediate perimeter. Sustained radial boundary hypotheses must persist across two edge thresholds before cuts are used. Region stability checks then run again. Disagreement with an existing outline-region count abstains. A sixth read-only view shows grey edge signal and white proposed cuts; numbered region output records whether internal edges supplied separation. No feedback controls added.

40 tests pass, including a smooth connected disc containing five colour sectors: internal edges now separate five regions despite the absence of outline gaps. Smooth and short-mark negatives remain unresolved. Boundary/label containment is verified. Real sunflower and hibiscus references still return unresolved counts because their internal boundary hypotheses are not stable; no photo-count accuracy improvement is claimed.

Limitations: straight radial hypotheses from mask centroid miss curved/overlapping boundaries; luminance edges miss some equal-brightness colour transitions. Veins, folds and shadows can mimic divisions, including stable ones. Visible region candidates remain distinct from anatomical petals. Next: annotate real boundary paths and evaluate curved paths and colour-gradient evidence, separately from ranking. Do not tune to expected species counts.

## 2026-09-15 — botanical observation panel (0.12)

Reorganized evidence into Petal shape, Count, Arrangement, Centre and Leaf support, with numerical diagnostics collapsed. New `observations` output records value, status, reason and evidence view/region IDs separately from pixel features. Existing separated-region shape/count and disc/ray hypotheses are mapped conservatively. Individual petal tips, layer arrangement, staminal column and leaf anatomy remain unresolved; missing measurements are not absence. Sunflower-specific head diagnostics display only when detected.

41 tests pass, including observation provenance/unknown-anatomy checks and automatic adapter rendering. This is a schema/display change, not improved image recognition. No expected species counts fill observations and no extra independent ranking votes are introduced. Next: annotated curved boundaries for real water-lily and hibiscus images; evaluate region/count quality separately from identification.

## 2026-09-15 — morphology proposals and character map (0.13)

User decision: prioritize morphology within organ → character → observed state → candidate evidence. Added /characters as an automatic read-only diagram, linked from the main bench. Checks indicate measured candidate observations, never anatomy inferred from a species profile. Unresolved and not-measured states remain explicit. Region-method buttons change the displayed proposal only; no manual labels or correction workflow were added.

Shared image-analysis now proposes a flower at 192px, crops with padding, then measures up to 384px of original detail without upscaling. Both pages use this path. A species-independent morphology module uses smoothed RGB gradients, conservative edge closing and connected interior regions at three thresholds. A second seeded gradient flood fills curved regions and merges fragments across weak, similar-colour interfaces. This is a custom region-growing experiment, not a validated watershed implementation. Existing centre masks are excluded when available. Counts and numbered overlays remain exploratory and never enter species ranking or anatomical count fields. Existing supported observations retain their original tests.

45 tests pass, including morphology containment, smooth-region and connected-colour cases, routes/assets and prior collection/engine tests. Both browser adapters were exercised against real images using a canvas-backed DOM harness, including numbered overlays and evidence rendering. Full browser layout QA was unavailable (browser download failed).

Reproducible development references, attribution and evaluation are in tests/morphology-reference; run node scripts/evaluate-morphology.cjs with @napi-rs/canvas available. Shared crop-path results: hibiscus closed-edge proposals 2–6 and seeded flood 3; sunflower 5–9 and flood 7; water lily 7–14 and flood 10. Supported counts remain unresolved for all three. Visual inspection showed fragments and merged petals; a number matching expected anatomy is not proof. Crop/resolution changed legacy candidate ranks: hibiscus reference has plumeria first, water lily has plumeria first, sunflower has sunflower first. These remain unaccepted, uncalibrated suggestions. Do not claim improved identification accuracy.

Next: annotate visible petal boundaries and organ masks in a small independent set; compare split/merge and boundary errors across methods before increasing ranking influence. Straight radial assumptions no longer constrain exploratory regions, but automatic seeds, mask contamination, shadows and veins remain major limitations. The diagram is for inspecting this evidence, not validating the botanical character automatically.

Character-map colour node also displays measured region colours (at least 15% of selected pixels), explicitly scoped to mask pixels; it does not turn pale pixels into verified white petals. Main botanical observation panel retains its five columns.


## 2026-09-15 — structural evidence connected to ranking (0.14)

Sunflower was already present in the knowledge base and image profiles. Missing required head measurements previously excluded it from ranking. All candidates now remain inspectable: mean group compatibility is multiplied by weighted numerical-rule coverage, and both pages expose missing measurements/required traits. Unusable regions provide no measured ranking evidence; missing required traits block acceptance. Coverage is an engineering diagnostic, not calibrated confidence.

Added an explicit quality-gated bridge from detected head layout and stable outer-region layout into the existing shape score. These correlated observations do not become separate organ votes. Exploratory enclosed-edge and seeded-flood counts remain outside ranking and anatomical count fields.

A fallback centre/ray proposal uses spatial colour transitions, angular support and a bounded ellipse search. Warm/green separation and neck pruning reduce attached leaf/stem contamination. A relative-size guard prevents a water lily's yellow centre replacing its larger flower region; this was a regression found and repaired during development. Centre boundaries remain approximate and can include ray bases; the original strict enclosure detector retains its limitations. Both methods now report disc_contrast using normalized RGB mean distance between centre and ray masks, replacing the old brightness-only diagnostic; scores across versions are not directly comparable.

49 tests pass, including missing-evidence handling, the character bridge, bright-green-centre support, solid/fragment negatives and a screenshot-derived sunflower regression. That development crop now ranks sunflower first and excludes the tested lower leaf region. It is not the original uploaded photo or an independent evaluation. Provenance is in tests/user-reference/README.md; the fixture is not served by the public worker.

Preserved development references rank sunflower first, hibiscus as a plumeria/bougainvillea tie, and water lily as a plumeria/bidens/water-lily tie. Hibiscus and water-lily discrimination remains unresolved. All results remain unaccepted and supported petal-region counts remain unresolved. These changes repair evidence handling and one development failure; no general recognition-accuracy improvement is established.

Next: annotate flower-head and centre boundaries on independent sunflower/lookalike images across viewpoints, centre colours and backgrounds. Evaluate mask contamination, centre/ray detection and ranking separately before tuning further.


## 2026-09-15 — nearby-leaf evidence (0.15)

User decision: extend organ → character → observed state → candidate evidence to leaves, keeping automatic upload and read-only inspection. Leaf candidates are extracted from the full photo at up to 384px, independently of the flower crop. Green-region proposals exclude the mapped flower mask and use a small opening to reduce thin connections. Size, clipping, irregularity and weak-boundary checks decide whether a proposed blade can supply evidence. Both pages show candidate, selected crop and outline views; a fallback preview remains explicitly unresolved when none passes.

The first supported observations are coarse round/broad/narrow silhouettes and display-only endpoint shape. An isolated endpoint is not a verified botanical tip. Tip, base, margin, leaf type, stem attachment and arrangement remain unmeasured. A nearby candidate is not confirmed to belong to the photographed flower.

A separate leaf ranker uses the existing 22 source-backed draft leaf-shape records; representative-taxon scope and unknown mappings remain explicit. Nearby leaf evidence can only penalize contradictory candidates within 0.04 of the leading flower score, by at most 0.025 multiplied by leaf quality. Missing observations and unknown reference mappings leave scores unchanged. This bounded heuristic is provisional, not calibrated probability, and automatic acceptance remains disabled. Reference shapes, coverage and leaf adjustment are inspectable; reference traits never fill image observations.

Validation: 56 combined tests pass, including seven new leaf logic tests. Both browser adapters were exercised with a canvas-backed DOM harness; full browser layout QA was not performed. Visual review of four development references—the user's screenshot-derived sunflower and the Commons sunflower, hibiscus and water lily—found early colour-fragment false positives. A weak-boundary guard was added; all four now report unresolved leaf evidence and preserve their prior flower rankings. These results check abstention on those cases, not real-photo leaf recognition accuracy. No successful real-leaf identification result is established yet. Reproducible evaluation and provenance are in tests/leaf-reference/README.md and scripts/evaluate-leaves.cjs.

Next: collect and annotate clear isolated blades plus cluttered, clipped and overlapping negatives, preserving provenance and capture groups. Measure candidate/blade overlap and coarse-shape error separately from flower-rank changes. Validate on photos not used to tune the guards before expanding to margins, bases or anatomical leaf arrangement.


## 2026-09-15 — reproducible Commons benchmark v1

Added 50 new Commons photos across ten supported flower groups, with three development and two reserved photos per group. Source descriptions and visual screening provide provisional reference labels, not expert botanical verification. Source credits, licences, image hashes and split assignments are preserved. Distinct authors within each group reduce related-capture leakage; earlier user screenshot provenance remains unknown.

`npm run benchmark` runs the same `FlowerImage` canvas pipeline as the website using Node canvas, checks frozen input hashes and saves immutable reports with engine/dataset hashes, options and split. `/benchmarks` shows originals, flower/leaf masks, source credits, candidate ranks, split/group/status filters, saved-run comparisons and JSON export. See [benchmark protocol](tests/benchmark/README.md).

Only 30 development images were run: **4 uniquely correct, 6 wrong, 18 tied, 2 unresolved, 0 errors**. Strict top-three reference-label inclusion: 17/30; inclusion allowing boundary ties: 22/30. Leaf evidence was available in one image, with no ranking wins or losses. All 20 reserved images remain unrun. No engine thresholds or profiles were tuned during this milestone. Automatic acceptance remains disabled.

Validation: 59 tests passed, including tie handling, provenance uniqueness and split checks. A JavaScript DOM harness loaded the baseline and filtered six wrong results and twenty reserved entries; it did not validate browser layout or mask accuracy. Reference-label agreement is not general identification accuracy. No organ-mask ground truth exists yet.

Next: review development failures and ties, annotate whether masks target the correct object, and separate missing measurements from broad or conflicting profiles before tuning. Keep reserved images untouched until an engine revision and evaluation criteria are fixed.
