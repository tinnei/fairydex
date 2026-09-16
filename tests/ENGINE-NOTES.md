# Engine 0.6 experimental candidates

The six Macau groups are now in the live candidate catalog alongside legacy groups. `dist/engine-profiles.js` supplies stage-specific numeric rules to the generic scorer. These are developer-proposed exploratory ranges, not measured species distributions or validated botanical rules. No reference images were used to fit these ranges. All profiles remain uncalibrated; automatic accepted identifications are disabled pending reviewed masks, labels and evaluation.

The engine preserves image aspect ratio, compares pale and colored proposals together, and removes broad bright-pixel flood expansion. Masks remain heuristic: green pixels are vegetation candidates, not confirmed leaves. Background can still be selected as a flower candidate.

New measurements: central vs outer yellow fraction relative to selected-region centroid; internal adjacent-pixel brightness differences; bounding-box fill. These do not establish petal count, radial symmetry, flower tubes, bracts, or leaf arrangement. UI evidence reports numerical compatibility and conflicts only. Growth stage is a hypothesis; confirmed stage remains unknown.

Scores average observed groups without normalizing a weak winner to 1. Missing measurements abstain. Stage profiles compete within a taxon before the taxon list is ranked. Similar profiles can tie; list order is not additional evidence.

Research context (diagnostic traits are not yet detected):
- https://biodiversitysg.nparks.gov.sg/our-biodiversity/flowering-plants/shrubs-herbaceous-plants/ixora-cultivars/
- https://www.nparks.gov.sg/florafaunaweb/flora/2/1/2178
- https://www.nparks.gov.sg/florafaunaweb/flora/1/3/1339
- https://www.nparks.gov.sg/florafaunaweb/flora/3/6/3616
- https://www.nparks.gov.sg/florafaunaweb/flora/3/0/3074

Run `node --test tests/engine.test.cjs` for regression checks. Reference-label smoke results must not be reported as real-world accuracy. The unreviewed Wikimedia collection includes related captures and is not a held-out dataset. Collection uploads and storage are unchanged.
# Smoke evaluation, 14 September 2026

On 47 unverified Macau reference labels, top-1/top-3 agreement changed from 0/0 to 14/30. On 12 legacy references it regressed from 4/10 to 2/4. These are counts, not validated accuracy. The benchmark used ImageMagick resizing and Node VM execution; preprocessing also changed from cropping to aspect fit. All new results abstain from automatic acceptance because the profiles are uncalibrated. Do not interpret abstention as improved recognition. Next work should review labels and segmentation, then calibrate with separate development and held-out sets.
