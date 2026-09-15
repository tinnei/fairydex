# Botanical knowledge v1 — 2026-09-15

## Purpose and scope

Determine whether correct anatomical observations can distinguish our catalogue entries before trying to extract those observations from photos. `/knowledge` is optional engineering tooling; the main image upload flow and its 12 candidate taxa are unchanged.

All 22 catalogue entries have source-backed draft records in `dist/botanical-knowledge.js`. These are developer encodings of NC State Extension, NParks and RHS descriptions, not expert-reviewed labels. Source URLs, review dates, taxonomic scope and null traits are retained with each record. Commons remains an image sourcing location; a category label alone is not anatomical ground truth.

The records cover 48 stage hypotheses: flowering and vegetative for all 22 entries, dandelion mature seed head, and lotus, poppy and bidens fruiting. Vegetative means leaf-only testing, not proof that a plant has no flowers elsewhere. Buds and other fruiting stages are not yet modelled. A single available stage candidate is marked `limited_stage_coverage`, not a unique identification.

## Schema

Each plant has an ID, display name, catalogue taxon, explicit reference taxon, scope note, source registry, traits and stage variants. Genus-level catalogue names backed by one representative species are labelled accordingly (for example, the Bidens reference is B. alba). This must not be interpreted as comprehensive genus coverage.

Each trait is either null or `{values: [...], sources: [...]}`. Source IDs resolve inside the plant record. Fields contain the shared vocabulary, part and provisional diagnostic weight. Trait values are compact, developer-selected categories. Shape labels simplify botanical descriptions; the live references remain authoritative.

| Group | Fields |
|---|---|
| Stage | stage |
| Flower | display, colour, shape, countUnit, count, centre, orientation |
| Leaf | leafShape, leafType, leafArrangement, leafMargin, leafPosition, leafAttachment, leafTexture |
| Context | growth, habitat |
| Fruit | fruitForm |

There are 18 fields. `many` means more than six. Petals, corolla lobes, tepals, ray florets and bracts are distinct units. Counts apply to an individual flower or to rays on one composite head, never the silhouette peak count of an image. The flower-cluster display describes the whole inflorescence; shape and lobe count describe an individual flower in it. For bougainvillea, colour describes the bracts and shape the actual tubular flower.

Count is ignored when its unit is unknown or incompatible with a reference. Several counts deliberately remain null, including complex canna structures and insufficiently checked bluebell/lotus counts. Lantana's count is unscored because descriptions conflict. Cultivated doubles are acknowledged where sourced; they are not exhaustively covered.

## Observations and ranking

`KnowledgeRanker.rank(observations, BOTANICAL_KNOWLEDGE)` is DOM-independent. Observations use `{value, source, reliability}`. Provenance is `manual`, `fixture`, or `image_measurement`. Reliability is an explicit [0,1] input weighting, not a calibrated confidence. Invalid vocabularies and unsupported provenance throw errors. The only allowed image-measurement semantic field is colour; no image bridge is currently connected, and the UI supplies manual or fixture evidence only.

Reference facts are never inserted as observations. Loading a reference does not fill the form. Selecting a synthetic preset clears the photo, and uploading a new photo clears observations to prevent unrelated evidence reuse. Photos remain local to the browser. Exported JSON contains file metadata and observations/results, not image bytes.

Stage selects eligible variants. Nonflowering variants do not compare against flowering traits. Unknown stage retains alternatives; the best variant per taxon is ranked and tied stage alternatives remain visible.

Within each supplied part, matching evidence contributes positive weight, conflicts negative weight, and missing reference traits zero. The part score divides by all supplied weight, including unknown reference traits, so missing knowledge cannot receive a perfect match. Overall score averages supplied part scores. Stage and countUnit do not add independent votes. Unobserved parts do not vote. Group weighting and thresholds are provisional engineering choices, not learned likelihoods.

Outputs include evidence provenance, source IDs, matches, conflicts, missing traits, part coverage, signed scores [-1,1] and ties. Equal scores share rank; ordering inside ties is deterministic and carries no biological meaning. Fewer than three weighted fields or fewer than two matching parts is insufficient evidence. Review suggestions require more evidence and separation, but `accepted` is always false. An out-of-catalogue flower may resemble a record; this is not a validated open-set classifier.

## Verification

Run `npm test`. The milestone passes 27 tests: 11 existing collection/image tests and 16 knowledge tests. Eight positive synthetic presets rank the expected candidate; pink-only evidence remains insufficient. Checks cover source/schema integrity across all22 records, stage applicability, count units, missingness, invalid provenance, contradictions and order-independent ties. Synthetic inputs live in `dist/knowledge-cases.js`; assertions live in `tests/knowledge.test.cjs`.

No real-photo accuracy improvement is claimed. No new Commons images were downloaded or used to fit weights. Missing knowledge, cultivar variability and representative-species scope need review.

## Next experiment

Annotate real photographs with independently reviewed visible traits, including failed water-lily and dandelion images. Keep original photos, attribution/licence, capture groups and annotations together. Compare manual semantic results with existing image results; classify failures as incorrect extraction, inadequate reference traits, ambiguity or unsupported stage. Use a held-out split before calibrating scores or enabling automatic acceptance.
