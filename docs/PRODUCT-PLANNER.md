# Flower Lens product-planner notebook

Last updated: 15 September 2026

## Purpose

This is the durable research and roadmap companion to `PROJECT-MEMORY.md`. It translates botanical and computer-vision evidence into small, testable product increments for an explainable flower-recognition MVP.

## Current product question

What lightweight measurements and capture interactions can separate a small local flower catalog reliably enough to teach users what the system noticed, while abstaining when the photograph cannot support a distinction?

## Planning principles

- Prefer a short decision key over a universal classifier.
- Ask what is visible before asking which taxon it is.
- Separate photo quality, segmentation, structure, and classification so failures are diagnosable.
- Use categorical botanical traits only when the image can actually support them.
- Treat petal count as a noisy observation, not a fact, when petals overlap or the flower is oblique.
- Prefer top-k candidates plus a useful follow-up photo instruction over forced top-1 output.
- Measure progress on held-out, user-like photos and include an explicit abstention/error tradeoff.

## Research brief

### Recommended recognition pattern

Treat the MVP as an explainable visual key rather than a universal species recognizer:

1. guided capture and a photo-quality gate;
2. a user tap that seeds the flower mask;
3. several independent, interpretable feature families;
4. a structural class followed by a short candidate ranking;
5. abstention or one discriminating follow-up request.

Published comparative work on flower recognition supports combining local colour and shape evidence rather than relying on whole-image colour alone. The practical implication for Flower Lens is to measure colour only inside a plausible flower region and keep it separate from outline, centre, and context evidence. See [Nilsback and Zisserman, *Automated Flower Classification over a Large Number of Classes*](https://www.robots.ox.ac.uk/~vgg/publications/2008/Nilsback08b/nilsback08b.pdf) and [Angelova et al., *Development and Deployment of a Large-Scale Flower Recognition System*](https://arxiv.org/abs/1708.03570).

### Guided capture is part of the recognizer

Ask for a front-on close-up with one bloom filling roughly 40–80% of the frame, then ask the user to tap the bloom. Reject or retake severe blur, highlight/shadow clipping, tiny subjects, and flowers cut by the image edge.

When the leading candidates depend on growth habit or leaves, request one targeted second view rather than guessing. Useful second views include the side/back of the flower, leaf attachment to the stem, and the whole plant. These capture recommendations align with [iNaturalist's plant-photography guidance](https://www.inaturalist.org/posts/95047-tips-for-taking-photographs-important-for-plants). iNaturalist also demonstrates that place, date, and broader taxonomy can rerank visual results; Flower Lens should keep those as optional priors that cannot override visual contradictions. See the [iNaturalist computer-vision demo](https://www.inaturalist.org/pages/computer_vision_demo).

### User-assisted segmentation is the highest-value lightweight trick

Use the tap point as a foreground seed. In Lab or HSV space, grow local colour-similar regions, clean the result with small morphological operations, and retain the connected component containing the tap. Penalize border contact and implausibly small or large masks. Show the mask overlay and offer a minimal include/exclude correction.

This turns an unconstrained scene-understanding problem into guided measurement. Interactive foreground segmentation has strong precedent, including [GrabCut in One Cut](https://openaccess.thecvf.com/content_iccv_2013/html/Tang_GrabCut_in_One_2013_ICCV_paper.html), although the MVP can start with simpler seeded region growth.

An optional “neutral background” capture mode is also promising. A smartphone flower-counting study deliberately placed dark cardboard behind flowers to make segmentation reliable: [Liu et al., smartphone-based flower counting](https://pmc.ncbi.nlm.nih.gov/articles/PMC4610574/). This should be offered as a rescue technique, not required for normal use.

### Make structural evidence cheap and honest

- **Outline:** aspect ratio, circularity, solidity, eccentricity, and boundary roughness.
- **Visible tips/lobes:** smooth the boundary at several levels; compute the centroid-to-boundary radius by angle; count only peaks that persist across smoothing levels.
- **Symmetry:** compare mask overlap under candidate rotations such as 3-, 4-, 5-, and 6-fold symmetry.
- **Centre:** compare an inner disc with outer petal rings in perceptual colour space; measure centre size and contrast.
- **Colour:** use Lab or HSV histograms inside an eroded flower mask to avoid background bleed; emphasize hue and chroma over illumination.
- **Context:** from a second user-marked crop, record leaf shape, basal versus stem placement, opposite/alternate/whorled arrangement, and floating versus terrestrial habit.

Return a range such as “about 4–6 visible lobes,” not an exact petal count, when occlusion, oblique viewpoint, or multi-scale disagreement makes counting uncertain. Research on fine-grained chrysanthemum recognition found that flower edges and disc florets carry important discriminating evidence, supporting a separate centre/edge treatment: [Liu et al., *Fine-Grained Recognition of Chrysanthemum Cultivars*](https://pmc.ncbi.nlm.nih.gov/articles/PMC6892201/).

### Ranking and abstention

Normalize a candidate score only over observed features. Require evidence from at least two independent families. A hard diagnostic conflict, poor mask, small lead, or insufficient coverage should produce “Not enough evidence,” followed by the single photo or binary question that best separates the top two candidates.

Before calibration, call the output **match strength**, not probability. After calibration, confidence should combine capture/mask quality, evidence coverage, and an empirically calibrated top-one versus top-two margin.

### Water-lily repair

Do not solve water lily with raw peak count alone. Combine:

1. high radial symmetry and a many-tip band, while marking the literal count as unreliable;
2. strong centre-to-petal contrast and layered radial texture;
3. a separate habitat/leaf check for a floating round or oval leaf, including a visible notch or cleft.

When these contextual cues are absent, request a wider second image showing the flower, water surface, and leaves. Report “water-lily-like growth form” rather than species identification unless locality and diagnostic traits justify a narrower claim.

## Candidate lightweight feature families

| Family | Candidate measurement | Product explanation | Main risk |
|---|---|---|---|
| Capture quality | blur, clipping, subject size, exposure | “Move closer” or “Hold still” | Rejecting usable images |
| Segmentation | foreground proposal stability, border contact, colour/edge agreement | “We could not isolate one flower” | Background or bracts become foreground |
| Outline | radial-distance signature, circularity, solidity, aspect ratio | “Broad layered form” or “narrow bell form” | Viewpoint and occlusion |
| Repetition | radial peaks, symmetry consistency, component count | “About five visible lobes” or “many ray florets” | Literal petal-count claims |
| Centre | centre colour, centre-to-ring contrast, centre size | “Yellow centre surrounded by pale petals” | Stamens and reflections |
| Colour | perceptual colour proportions inside the mask | “Mostly pink with a pale centre” | Lighting and white balance |
| Plant context | vegetation above/below/around flower, round-leaf candidate, bare-stalk cue | “Round leaves beside a water-level bloom” | Green background is not necessarily a leaf |
| Structural class | single bloom, composite head, cluster, bell/tube, bract-dominant | “Cluster of many small flowers” | Requires annotated examples |

## Near-term experiment queue

1. **Annotation pilot:** label 10–20 examples per active candidate with flower mask, centre point, visible-tip points, stage, structural class, and quality flags.
2. **Segmentation audit:** measure mask overlap and proposal-selection failure separately from identification.
3. **Radial signature prototype:** smooth the flower boundary, sample radius by angle, and count only stable peaks across several smoothing levels. Return a range such as “4–6 visible lobes.”
4. **Structural gate:** distinguish single broad bloom, many-ray composite head, compact cluster, and hanging bell/tube before applying taxon profiles.
5. **Guided second view:** when the top candidates depend on leaves or arrangement, ask for one targeted follow-up image rather than guessing.
6. **Calibration:** reserve a held-out set, choose thresholds by coverage versus error, and retain a visible “not enough evidence” state.

### Suggested implementation order

- **Phase 0 — instrumentation:** store the feature vector, mask-quality flags, candidate ranking, correction, and error category with each reviewed test case.
- **Phase 1 — capture and mask:** tap-to-seed, mask overlay/correction, subject-size and retake gates.
- **Phase 2 — structure:** radial signature, multi-scale tip range, symmetry, outline metrics, and inner/outer colour rings.
- **Phase 3 — active evidence:** leaf/stem crop, growth-habit questions, and optional date/location reranking.
- **Phase 4 — calibration:** choose weights and abstention thresholds on held-out phone photos; expand the catalog only when each new class meets the acceptance gate.

A tiny on-device model could later assist segmentation or feature extraction, but it is not necessary for a credible first MVP and should not replace visible rule-based evidence.

## Evaluation scorecard

- Flower-mask overlap or boundary quality.
- Structural-class balanced accuracy.
- Top-1 and top-3 taxon accuracy at the declared taxonomic rank.
- Coverage: proportion of cases receiving an automatic answer.
- Selective risk: error rate among automatically answered cases.
- Calibration: whether reported confidence bands match observed correctness.
- Follow-up value: accuracy improvement after the requested second photo.
- Explanation faithfulness: whether highlighted evidence is actually used by the scorer.

Build the dataset by individual plant rather than image. Keep photographs of the same plant, photographer, or burst in one split to prevent near-duplicate leakage. Include an explicit unknown/distractor class and stratify results by lighting, viewpoint, device, species, and capture protocol.

For every evaluation cycle, classify each failure as capture, segmentation, feature extraction, knowledge/profile, or genuinely non-diagnostic. Fix the largest bucket before adding more rules. Run feature-family ablations—colour only, shape only, centre only, then context—to verify that each addition contributes real held-out value.

Provisional product targets, to validate rather than claim: at least 90% accuracy among accepted supported-catalog cases at 70% or greater coverage, and at most 5% false acceptance on unknowns.

## Decision log

### 15 September 2026 — default to structure-first, selective recognition

The next engine iteration should not add more broad species ranges first. It should improve capture checks and segmentation, derive a few stable structural features, gate candidates by flower structure, and calibrate abstention. Petal evidence should be expressed as a visible-tip range with uncertainty until overlap handling is validated.

### 15 September 2026 — use active follow-up instead of silent weak evidence

When the top two candidates differ mainly by a missing leaf, attachment, side-view, or habitat trait, Flower Lens should ask for that evidence directly. Optional date and approximate location may rerank candidates but must never overpower a visible diagnostic conflict.
