# Flower Lens project memory

Last reconstructed: 15 September 2026

## Product intent

Flower Lens is a visual field-guide prototype for children and adults. A person photographs a flower, sees a simplified botanical construction derived from observable traits, and receives a small ranked set of possible matches. The experience should teach noticing rather than present an opaque answer.

The first MVP is deliberately narrow: flowers and flower heads from a small, curated knowledge base. It uses lightweight, explainable image measurements instead of a large recognition model. A result must remain a suggestion until the evidence and calibration justify automatic identification.

## Working roles

- **Developer:** owns implementation, tests, diagnostics, technical findings, and honest reporting of limitations.
- **Product planner:** owns the roadmap, botanical and recognition research, decision records, evaluation design, and summaries of major changes.
- Both roles read this file before material work and update it after a major experiment, decision, release, or discovery.

## Current architecture

- `dist/engine-v3.js` is the active pure RGBA feature extractor and scorer.
- `dist/engine-profiles.js` contains stage-specific, numeric candidate profiles.
- `dist/engine-ui.js` adapts the engine to the browser and renders masks, feature values, candidates, matched evidence, and conflicts.
- `dist/species-data.js` contains an older diagnostic-trait knowledge structure for six legacy groups. It is not yet the authoritative source for all active profiles.
- `server/worker.mjs` serves the static experience and provides private, per-user observation storage in R2.
- `build.mjs` packages browser assets and generates `dist/server/index.js` plus the hosted configuration.

The current candidate catalog contains hibiscus, ixora, lantana, plumeria, bougainvillea, bidens, water lily, dandelion, common daisy, poppy, red clover, and common bluebell. Some entries operate at genus or horticultural-group level, so the UI must not imply species-level certainty.

## Engine state: version 0.6 experimental

The engine currently:

1. Preserves the source aspect ratio and downsamples to fit within 160 x 160 pixels.
2. Assigns valid pixels to coarse colour labels.
3. Treats green pixels as vegetation candidates.
4. Builds connected flower-region proposals from pale or chromatic pixels and selects one proposal using size, centrality, border contact, and coverage penalties.
5. Measures colour fractions, bounding-box fill, local brightness texture, centre-versus-outer yellow, flower coverage, and vegetation coverage.
6. Scores each stage profile by compatibility with its observed feature ranges.
7. Ranks distinct taxa and reports matched and conflicting evidence.

Automatic acceptance is intentionally disabled because no profile has `calibrationStatus: "validated"`. The interface says **Review required** and treats growth stage as a hypothesis.

## Decisions already made

### Keep the system explainable

Feature values and candidate evidence should be visible. The engine must not normalize a weak winner into artificial confidence, and list order must never act as evidence.

### Abstain when evidence is weak

Missing measurements abstain instead of scoring as failures. Uniform images, empty masks, overly broad regions, and similarly prominent proposals are treated as quality problems. Closely overlapping candidates should be shown as ambiguous.

### Separate flower, vegetation, and context

The earlier whole-image approach confused pink flowers with surrounding colour and water reflections. The current engine exposes three mutually exclusive masks, although the vegetation mask still means only “green pixel candidate,” not a verified leaf.

### Treat life stage and observed part explicitly

Dandelion flowers and mature seed heads require different profiles. A taxon may have multiple stage hypotheses, but only the best stage is retained in the taxon ranking. Stage remains unconfirmed until the necessary structures are detected.

### Do not claim accuracy from the current reference set

The Macau reference images are unreviewed and include related captures; they are not an independent held-out benchmark. Previous smoke counts were 14/47 top-1 and 30/47 top-3 on the Macau set, while legacy examples regressed to 2/12 top-1 and 4/12 top-3. These are label-agreement counts, not measured real-world accuracy.

## Known failure modes

- Pale petals and water reflections can compete for the flower mask.
- The largest or most central colourful component may be background, a bract, or only part of the flower.
- Orange stamens can fall outside the current yellow-centre rule.
- Broad profile ranges create ties and high-looking but uninformative fits.
- Bounding-box fill is not a robust substitute for flower outline or petal geometry.
- Local brightness variation is not a reliable botanical texture measurement.
- Green coverage does not reveal leaf identity, leaf arrangement, or leaf-to-stem attachment.
- Overlapping petals make literal petal counts unreliable from a single photograph.
- Clusters, composite flower heads, bracts, and single flowers are not yet separated as different structural types.
- `species-data.js` and `engine-profiles.js` can drift because the same botanical knowledge is represented twice.

## Evidence still missing

- Reviewed flower masks and visible-petal annotations.
- Verified taxon labels and explicit label rank for every example.
- Separate development, calibration, and held-out evaluation sets.
- Capture conditions and failure labels, including blur, occlusion, multiple flowers, clipping, low light, and distracting backgrounds.
- Detectors for radial structure, visible petal tips or lobes, centre-to-edge profiles, flower clusters, tubes or bells, bracts, reproductive columns, leaf shapes, and leaf placement.
- Calibration that maps scores and score margins to observed error rates.

## Immediate roadmap

1. Define a compact annotation format for flower boundary, centre, visible petal tips, leaf regions, flower/cluster type, stage, taxon, and image-quality flags.
2. Hand-review a small balanced development set before changing more rules.
3. Evaluate segmentation independently of classification; do not tune the ranker to compensate for a bad mask.
4. Add a small set of stable structural measurements: radial distance signature, peak count with uncertainty, circularity/solidity, centre colour, and vegetation position around/below the flower.
5. Split “single flower,” “composite head,” “cluster,” and “bract-dominant display” before taxon ranking.
6. Calibrate abstention on held-out examples and keep top-k suggestions as the default output until error bounds are credible.
7. Consolidate botanical facts and numeric scoring rules behind one schema to prevent knowledge drift.

## Validation and operating notes

Run validation in this order:

```sh
npm run build
npm test
```

The build step generates `dist/server/index.js`, which the collection tests import. Running `npm test` on a fresh checkout before building causes a missing-module failure even though the engine checks themselves pass.

Current reconstructed baseline: eight tests pass after build. They cover private collection storage behavior, request validation, empty/uniform image rejection, mutually exclusive masks, centre-position evidence, rule-driven ranking, missing-feature abstention, and the expanded candidate catalog.

## Update protocol

After a major change, append a dated entry below containing:

- hypothesis and user problem;
- code/data changed;
- evaluation set and metrics;
- result, including regressions;
- decision and next experiment;
- remaining uncertainty.

Never rewrite a failed experiment as success. Preserve failures because they constrain the next design.

## Change log

### 15 September 2026 — memory restored

- Reconstructed product intent, architecture, engine behavior, prior decisions, smoke results, known limitations, and next steps from the current source, tests, and prior shared conversation.
- Confirmed the clean-checkout validation dependency: build first, then test.
- Confirmed eight passing automated tests after the build.
- Added a companion product-planning research note for lightweight recognition practices.

### 15 September 2026 — guided recognition instrumentation shipped

- Added tap-guided flower proposal selection; a tap must land inside a detectable flower region or fail explicitly.
- Added conservative blur and severe exposure-clipping diagnostics without using them to claim calibrated capture quality.
- Added normalized outline, symmetry, inner-versus-outer colour contrast, vegetation position, and multi-scale visible-tip range measurements.
- Kept structural class as explanatory evidence only; it does not hard-route or eliminate taxa before reviewed annotations exist.
- Renamed the displayed score to uncalibrated match strength, retained Review required, and added candidate-specific follow-up photo guidance, including wider leaf/water context for water lily.
- Expanded the automated baseline from eight to eleven passing checks after build.
