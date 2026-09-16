# Flower Lens pilot review — summary and next-batch recommendation (v2, corrected)

**Date:** 16 September 2026 (v2 corrections applied same day, against an acceptance review)
**Scope:** desktop visual review of 10 varied reference images (no masks, bounding boxes, or pixel annotation produced). Companion file: `flower-lens-pilot-review.xlsx` (now three sheets: the 10-image pilot review, a manifest-derived 17-image next-batch proposal, and a Legend).

## What changed in this revision

An acceptance check against the workbook, the local manifests, and three spot-checked images (hibiscus-01, dandelion-01, bougainvillea-03) found five things worth correcting, all now fixed in the workbook and reflected below:

1. **Hibiscus-01 was mis-described as "petal only."** Re-examined: the image does show a partial reddish tubular structure projecting from the lower-left, consistent with a Hibiscus-type staminal column, alongside the petals. Its tip (where anther/stigma detail would be) is cropped out of frame. The workbook row now separates what's visible (petals + partial column) from what can't be measured (complete column, calyx, full outline), instead of one absolute claim.
2. **plumeria-07.jpg was wrongly implied to be "already reviewed"** in the previous version of this summary, because it came up as context for the disputed plumeria-08. It has no row of its own and was never reviewed. It's now listed correctly in the next-batch proposal as an unreviewed, same-session companion of plumeria-08.
3. **Bidens-01's attribution was a placeholder**, not the real manifest data. Corrected to: Charles J. Sharp; CC BY-SA 4.0; https://commons.wikimedia.org/wiki/File:Three-spot_grass_yellow_(Eurema_blanda_arsakia)_on_Spanish_needle_(Bidens_pilosa)_Xindian.jpg (licence: https://creativecommons.org/licenses/by-sa/4.0). That same source title also names the plant species directly — *Bidens pilosa* — which is more specific than the manifest's own genus-level `expectedLabel`; the workbook now reports both, neither independently re-verified.
4. **Some wording overstated confidence.** Dandelion and bluebell species calls are now stated as provisional (resting on the Commons title only, not checked against a flora source), not as settled low-uncertainty identifications. The water-lily "blue lotus" naming issue is now framed strictly as a review flag about the title's wording — not as proof the *Nymphaea* genus label is wrong, and not grounds for excluding the file.
5. **The 15–20 image next-batch size claim was overstated.** With 12 active candidates and the planner's own 10–20-examples-per-candidate target, that implies roughly 120–240 reviewed images collection-wide. A 15–20 image batch is cumulative progress toward that, not a batch that meets it — restated accordingly below.

Template changes that were previously only *recommended* (structural class, target region count, stage visibility, reservation status) are now actually implemented as columns in the pilot sheet, rather than left as prose suggestions.

## What this batch covered

Ten images were drawn from `tests/macau-reference` (hibiscus, ixora, lantana, plumeria, bougainvillea, bidens — 6 groups) and `tests/flower-images` (water-lily, dandelion, common-poppy, common-bluebell — 4 of 6 groups), chosen for variety rather than representativeness: different species, a partial-structure crop, a multi-stage frame, an insect-stress-case, a manifest-flagged disputed/quarantined image, a near-duplicate pair, a bract-vs-true-flower case, a growth-stage mismatch (seed head vs. flower), a cultivar colour variant, and a bud-stage image.

This is 10 of 60 total collection files (48 macau-reference + 12 flower-images). It is a variety sample, not a representative accuracy sample — stated plainly so it isn't read as more coverage than it is.

## Key findings

**One quarantined label could not be corroborated, and the likely alternative is also unconfirmed.** `plumeria/plumeria-08.jpg` is already flagged `disputed`/`quarantined` in the source manifest (`splitStatus: "excluded-pending-review"`). This review checked it against Wikipedia's description of *Plumeria pudica* (white petals, yellow centre) and Missouri Botanical Garden's description of *Allamanda cathartica* (yellow, trumpet-shaped, white throat markings). Neither matches cleanly — the photo shows a fully yellow flower with a tan/brown star-textured throat. This corroborates the existing dispute; it does not resolve it. Recommend an expert or community (e.g. iNaturalist) identification, and recommend the file's existing exclusion stay in force in the meantime.

**A genuine near-duplicate pair exists and is already flagged.** `bougainvillea-03.jpg` and `bougainvillea-07.jpg` are the same photograph, one cropped from the other (manifest `possibleCaptureGroup`). Confirmed visually. `bougainvillea-07.jpg` itself is unreviewed and is included in the next-batch proposal below so the crop can be checked against the same conclusions before the "treat as one example" rule is applied.

**A common-name flag sits inside the water-lily set's own metadata — not a disputed label.** `water-lily-02.jpg`'s Commons title is "Blue lotus (Nymphaea sp)" — pairing the informal name "lotus" (properly genus *Nelumbo*) with the correct water-lily genus *Nymphaea*, while the actual flower is pink/magenta, not blue. This is raised as something worth a second look, not as proof the genus label is wrong. A lightweight validator check across the full manifest for title-text vs. genus-field mismatches like this one could surface similar cases automatically, as a proposal, not an automatic correction rule.

**A growth-stage/plant-part mismatch was found in a "flower" folder.** `dandelion-01.jpg`'s sharp, in-focus subject is a mature seed head ("clock"), not an open flower; the actual bloom in the frame is fully out of focus. Per `PROJECT-MEMORY.md`, dandelion flowers and seed heads need different profiles, so this file should be tagged (or split) as a seed-head example specifically. The species call itself (*Taraxacum officinale*) rests on the Commons title alone and hasn't been independently checked.

**A partial-structure crop, corrected.** `hibiscus-01.jpg` is an extreme macro crop that does include a partial reddish tubular structure (likely a staminal column) alongside the petals, though its diagnostic tip is cropped out and no calyx or full outline is visible. Worth a product decision on whether this counts as enough for a coarse plant-part tag, versus needing exclusion from flower-mask training entirely.

**A colour-cultivar case may need its own tag.** `common-poppy-02.jpg` is white with a pink rim — consistent with the well-documented "Shirley poppy" cultivar group of *Papaver rhoeas*, not the wild-type scarlet colour most reference material shows. That read is this review's own inference from published cultivar descriptions, not an independently confirmed identification of this specific specimen. If colour is weighted heavily in scoring (as `PROJECT-MEMORY.md` suggests it currently is), an unqualified red-poppy rule would likely reject this valid example.

**Two structural examples align with the roadmap:**
- `bougainvillea-03.jpg` cleanly shows the bract-vs-true-flower distinction (confirmed against Clemson HGIC): three small white true flowers nested in large magenta bracts. Good anchor example for the "bract-dominant display" structural class `PROJECT-MEMORY.md` lists as not yet separated.
- `lantana-08.jpg` (already manifest-flagged as a stress case) and `bidens-01.jpg` (not previously flagged) both show insect occlusion at two different severities — one insect-dominant (butterfly covers ~50% of frame, most central/sharpest object), one insect-contact (butterfly touches but doesn't dominate). These are now distinguishable via the workbook's new structural-class and quality-problem fields rather than one undifferentiated "insect present" note.

**Ixora also surfaced a structural point**: the ixora image mixes roughly 6–8 inflorescence clusters at different bud/bloom stages in one frame (needs per-cluster annotation, not one tag per image) — now captured via the new "target region count" and "stage visibility" columns instead of prose alone.

No claims of validated species identity are made anywhere in this batch beyond what a cited source supports; every other cell uses "unknown" or a provisional/genus-level hedge.

## Reservation-status check (performed before selecting the next batch)

Both `manifest.json` files were checked for every `splitStatus`, `reviewStatus`, `labelStatus`, and `datasetStatus` value present. The only reservation or exclusion flag found anywhere in either manifest is `plumeria-08.jpg`'s `splitStatus: "excluded-pending-review"` / `datasetStatus: "quarantined"` — already reviewed in this pilot and already excluded from the working set. No other file in either manifest carries a reserved, held-out, or evaluation-only flag. Nothing was held back from the batch proposal below for reservation reasons beyond that one already-known file.

## Next batch: 17 images, manifest-derived (see "Next batch proposal (17)" sheet)

Selection method: full manifest inventory (60 files) minus the 10 already-reviewed files = 50-file remaining pool. This batch takes 17 of those 50:

- **All 8 remaining flower-images files** — `dandelion-02`, `common-daisy-01`, `common-daisy-02`, `red-clover-01`, `red-clover-02`, `common-poppy-01`, `common-bluebell-02`, `water-lily-01` — closing that collection out completely (`common-daisy` and `red-clover` currently have zero reviewed images each).
- **9 macau-reference capture-group companions**, so every known correlated capture group gets reviewed as a set rather than sampled piecemeal: `ixora-04` through `ixora-08` (all 5 members of the `ixora-madikai-vijayanrajapuram-MP` group), `lantana-06` and `lantana-07` (`yellow-lantana-camara-series`), `plumeria-07` (`plumeria-pudica-flower-series`, companion to the already-reviewed disputed plumeria-08), and `bougainvillea-07` (`bougainvillea-prahlad-balaji-original-and-crop`, companion to the already-reviewed bougainvillea-03).

This batch plus the pilot brings cumulative reviewed coverage to 27 of 60 files (45%). As noted above, this is progress toward — not fulfillment of — `PRODUCT-PLANNER.md`'s 10–20-examples-per-candidate annotation-pilot target, which across 12 active candidates implies roughly 120–240 images collection-wide.

**Remaining after this batch (33 files, for batch 3+):** `hibiscus` 02–08 (7), `ixora` 02–03 (2), `lantana` 01–05 (5), `plumeria` 01–06 (6), `bougainvillea` 01–02, 04–06, 08 (6), `bidens` 02–08 (7).

## Template changes now implemented (not just recommended)

- **Growth stage split into two fields**: "Growth stage (phenological)" and "Stage visibility (assessable from this image?)" — several images in this pilot showed a stage other than the one implied by their folder or filename (dandelion seed head, bluebell bud), or mixed stages in one frame (ixora).
- **"Structural class" column added**, using a fixed vocabulary (single-bloom / cluster-of-separate-flowers / composite-head-capitulum / bract-dominant-display / bud-not-open / fruiting-seed-head / multiple-stages-in-frame / not-assessable), separate from free-text "Flower structure." This keeps a true fused composite head (bidens) from being conflated with a cluster of separate small flowers (ixora, lantana) under one "composite" label.
- **"Target region count" column added**, estimating how many distinct flower/cluster regions a future annotation pass would need per image.
- **"Dataset reservation status" column added**, copying `splitStatus`/`reviewStatus`/`datasetStatus` verbatim from the source manifest into the review sheet, so exclusions are visible without cross-referencing the manifest separately.
- **Reviewer/review-date columns left genuinely blank** (no placeholder date) — to be filled in only after an actual human review of that row.

Two template ideas from the first draft are still open, not yet implemented pending your agreement: an explicit "occlusion severity" scale (none / partial-contact / dominant-occluder) distinct from the free-text quality-problems field, and a "common-name vs. genus/species consistency" flag (consistent / mismatch / not checked) modeled on the water-lily case.

## What was not done in this pass

No pixel-level flower masks, bounding boxes, or petal-tip annotations were produced — this was a desktop visual/metadata review only, consistent with "Annotate each visible plant instance separately... Record a bounding box or mask" being a follow-on step in `tests/macau-reference/README.md`, not this pass's scope. No files under `tests/`, `dist/`, `server/`, or the manifests were modified; no source labels, dataset splits, or scoring rules were changed. All outputs are in this handoff folder. Reviewer and review-date fields are blank and await human sign-off; the botanical sources cited above were consulted in this pass but not independently re-verified in the 16 September acceptance check, and should be spot-checked again before any claim here is relied on for scoring or training decisions.
