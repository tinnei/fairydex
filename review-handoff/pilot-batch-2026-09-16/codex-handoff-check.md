# Pilot handoff check

Checked 16 September 2026 against the supplied workbook, summary, local manifests and three visual spot checks.

## Milestone status

M1: draft delivered; corrections, human review and template agreement pending.

- The workbook contains 10 review rows covering 10 existing image files, each with exactly one matching manifest entry.
- All 10 human reviewer cells are blank. The Legend says the dates are placeholders, not sign-off.
- The local collections contain 48 Macau-reference images and 12 flower-images. This pilot covers 10 of 60 files, not a representative accuracy sample.
- No masks, bounding boxes or petal-tip annotations were delivered. Labels remain provisional.
- I visually spot-checked hibiscus-01, dandelion-01 and bougainvillea-03, not all 10 images. This check is not botanical verification.

## Corrections for the next Claude pass

1. **Hibiscus, row 2:** replace the absolute “petal-only / no stamen column” claim. The image visibly includes a central projecting structure as well as petals. The full outline is cropped and the projecting structure is incomplete, so its diagnostic value remains uncertain. Separate what is visible from what cannot be measured.
2. **Next-batch inventory:** the summary calls plumeria-07 already reviewed, but it has no workbook row. Do not exclude it on that basis. Derive the remaining file list from manifest filenames minus the actual 10 workbook filenames. Inspect capture-group companions without counting them as fully reviewed unless they receive their own rows.
3. **Attribution, N7:** replace the Bidens placeholder with the manifest attribution: Charles J. Sharp; CC BY-SA 4.0; https://commons.wikimedia.org/wiki/File:Three-spot_grass_yellow_(Eurema_blanda_arsakia)_on_Spanish_needle_(Bidens_pilosa)_Xindian.jpg . Retain the licence URL: https://creativecommons.org/licenses/by-sa/4.0 .
4. **Evidence wording:** source titles and plausible appearances do not verify specimen identity. Keep dandelion and bluebell species calls provisional. Treat the water-lily common-name concern as a review flag, not proof of an incorrect genus label or an automatic exclusion rule. Botanical references were not independently rechecked in this acceptance pass.
5. **Structural fields:** use separate fields for floral structure, number of target regions, stage, and stage visibility. Mixed stages are not a floral structure class. Avoid using “composite” for both a true composite flower head and a cluster of separate flowers without a precise definition.
6. **Work size:** 15–20 images total can be the next review batch. It does not satisfy the planner's 10–20 examples per active candidate goal.

## Useful findings to retain

- The manifest already quarantines plumeria-08. Preserve that exclusion pending appropriate review.
- The manifest groups bougainvillea-03 and -07 together. Preserve capture groups when assigning any future split.
- The dandelion spot check supports a sharp seed head as the primary target and a blurred flower in the background.
- The bougainvillea spot check supports distinguishing the large coloured display from the small central flower structures.
- Occlusion severity and per-region stage are useful proposed annotation fields.

## Next handoff

Claude: correct the pilot and produce a manifest-derived 15–20-image batch proposal, including missing daisy/clover coverage and relevant capture-group companions. Keep any already reserved evaluation images out of development selection; establish reservation status before choosing the batch.

You: review unresolved observations and agree the revised template. Fill reviewer and actual review date only after review.

Codex: verify the revised package and map accepted fields to the engine's existing schema before any integration. No source labels, dataset splits or scoring rules changed in this pass.
