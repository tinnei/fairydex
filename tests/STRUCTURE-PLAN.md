# Structural identification milestone

## Implemented in 0.7

- Preserve the whole uploaded photo and measure at a maximum of 320 pixels per side.
- Use chromatic seed components with bounded growth into pale adjacent pixels to reduce connected reflections. This is a heuristic proposal, not a semantic flower mask; white flowers with no chromatic centre still use the previous component proposal.
- Measure outline roundness, covariance elongation, radial regularity and separated radial outline peaks.
- Measure yellow/orange centre patches, including orange stamens formerly excluded by the yellow threshold. Anchor to a nearby compact colour patch when supported, otherwise to the silhouette centroid; expose the method. This is a centre hypothesis, not a detected reproductive organ.
- Show the visible-tip estimate separately from total petal count. Total petals remain unknown. Overlap, bracts, compound heads and side views make silhouette peaks unsuitable as a botanical petal count.
- Abstain on small, cropped or strongly elongated outlines. A measured silhouette can still be wrong when segmentation is wrong.
- Measure nearby vegetation below and around the flower in image coordinates. These are context observations only; they do not establish leaf identity or stem attachment and do not yet influence species ranking.
- Add a weak morphology contradiction check, limited to a 15% score reduction, using explicitly experimental silhouette ranges. It cannot increase confidence or enable automatic acceptance.
- Keep every result experimental until profiles and acceptance thresholds have independent validation.
- Present near ties as Ambiguous instead of allowing catalog order to select the displayed answer.

## Next milestones

1. Review the reference labels and annotate flower polygons, visible tips, viewpoint, growth stage and occlusion. Keep capture families together and reserve an untouched evaluation split.
2. Measure segmentation overlap and visible-tip error independently of ranking. Check water reflections, white petals, overlapping blossoms, bracts and seed heads as separate failure groups.
3. Replace silhouette heuristics with an organ segmentation/keypoint model if these errors remain dominant. A petal detector needs visible-petal annotations; increasing ranker weights cannot supply missing visual evidence.
4. For leaf placement, detect individual leaf blades, stem paths and attachment nodes. Only then classify basal, alternate, opposite or whorled arrangement. Collect full-plant photos alongside close-ups for this milestone; retain the simple upload flow.
5. Calibrate part reliability and score fusion on reviewed development examples; report final results once on the untouched split. Do not optimize repeated water-lily screenshots as a substitute for evaluation.

## References and limits

- [NParks Nymphaea cultivars](https://www.nparks.gov.sg/florafaunaweb/flora/2/2/2271): water-lily leaf notch and floating habit. Neither is inferred from vegetation colour alone.
- [NParks blue water lily](https://www.nparks.gov.sg/florafaunaweb/flora/8/7/8756): example of flower and leaf diversity; a single cultivar cannot establish genus-wide rules.
- [OpenCV contour features](https://docs.opencv.org/4.13.0/dd/d49/tutorial_py_contour_features.html): geometric descriptors provide shape measurements, not botanical interpretation. This implementation uses plain JavaScript, not OpenCV.

Numeric silhouette ranges and extraction thresholds are engineering hypotheses, not verified botanical measurements or calibrated probabilities.
