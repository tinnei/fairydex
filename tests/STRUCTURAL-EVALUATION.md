# Engine 0.7 structural evaluation

Read-only evaluation, 2026-09-14. No profile tuning performed by evaluator.

## Controlled 320px comparison

Both versions run through Node VM with ImageMagick Triangle aspect-preserving resize, maximum dimension 320px. Browser canvas interpolation may differ. Baseline code is repository commit `d7ff82d`; current code is the working-tree 0.7 implementation.

| Reference set | Images | 0.6 top1 | 0.7 top1 | 0.6 top3 | 0.7 top3 |
|---|---:|---:|---:|---:|---:|
| Legacy | 12 | 2 | 2 | 3 | 3 |
| Macau | 47 | 12 | 14 | 34 | 34 |

These are unverified reference-label agreement counts, not identification accuracy or held-out validation. The quarantined Macau image is excluded. Top1/top3 use stable array order: 41 of 59 current examples have exact ties for highest score, so these metrics are sensitive to catalog order. All results remain review-required, with no accepted identifications.

The previously reported 0.6 baseline at160px was legacy2/4 and Macau14/30 for top1/top3. It should not be treated as a controlled comparison with the new320px UI.

## Waterlily reference cases

| File | Current waterlily array rank | Relevant evidence | Limitation |
|---|---:|---|---|
| water-lily-01.jpg | 2 | 8 outline tips; surrounding vegetation; yellow/orange center hypothesis | Exact score1 tie with Bidens and common daisy; unresolved |
| water-lily-02.jpg | 4 | 12 outline tips; dark center, no gold center | Score0.943, below bougainvillea/clover1 and ixora0.976; unresolved |

Outline tips are not petal counts. Overlapping petals, inflorescences, bracts and segmentation errors prevent a reliable anatomical count. Vegetation location is measured in image coordinates; basal/opposite/alternate/floating leaf arrangement remains unknown.

## User screenshot diagnostic

Input is a crop of the uploaded screenshot, x7/y99/w308/h284, excluding the ORIGINAL UI overlay. It is not the original photo or an independent evaluation example. At320px:

- Old engine: waterlily ranked4; its score was below top tied candidates.
- New engine: waterlily is in an exact score1 four-way tie with hibiscus, plumeria and bougainvillea. Its array position4 must not be presented as meaningful separation.
- New flower coverage0.189; pink fraction0.494;7 visible outline tips.
- Yellow/orange center hypothesis at(168.77,141.24), center gold fraction0.139 versus outer0.027.
- The UI is intended to display AMBIGUOUS for ties. This run evaluates the engine output, not browser presentation.

The center and flower-region evidence improved, but the screenshot is still not uniquely identified as waterlily. Broad uncalibrated profile intervals leave ties; actual leaf anatomy and reliable petal structure require further evidence.

## Reproducibility

Scratch files: `baseline-v06-320.json`, `after-v07-final-320.json`, `user-crop-comparison.json`, `evaluate-v06-320.cjs`, `evaluate-v07-320.cjs`, `evaluate-user-crop.cjs`. The evaluator made no changes to site files.
