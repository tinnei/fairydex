# Commons 10 × 5 benchmark

`npm run benchmark` runs 30 development photos through the exact FlowerImage browser pipeline using @napi-rs/canvas for decoding/canvas operations. The runner resolves @napi-rs/canvas from CODEX_PRIMARY_RUNTIME_NODE_MODULES when set, otherwise from normal Node dependencies. It is a test-runner dependency, not shipped in the browser. Input byte hashes are checked before analysis. Browser and native canvas resampling may differ slightly; this baseline records Node/canvas execution, not cross-browser equivalence.

Collection: dist/benchmark/manifest.json and dist/benchmark/images. Ten supported candidate groups, five images each. All labels are source descriptions screened visually for group and flowering stage, not expert-verified truth. The record includes author, licence, Commons page, download URL, transformations, SHA256, split and scope. See individual source/licence links before reusing the photos; resized derivatives retain their source licences. Reference photographs are not claimed to be captured in Macau.

Split: three development and two reserved per group, each from a different credited author within that group. Existing source pages were excluded; a source-unknown user screenshot may still have unidentified related captures. Author grouping cannot guarantee full independence. None of the reserved images enters the default runner. Viewing them for collection screening is distinct from engine evaluation; no engine thresholds were tuned in this milestone.

`npm run benchmark -- --split reserved` explicitly exposes the reserved set; `--split all` evaluates all 50. Saved reports record that exposure. Once inspected for engine improvements, these examples must not continue to be described as untouched. Keep later independent evaluation photos separate.

Runs are immutable timestamped report folders under dist/benchmark/runs, with original-photo references, flower/leaf mask previews and detailed ranking output. runs.json indexes history. Commit results and publish the Site to make a new snapshot visible at /benchmarks. Do not edit an existing snapshot to improve a result. Dataset/option/split mismatches block paired comparison; implementation hashes identify the tested code. Results may be shared by exporting run JSON from the page.

Metrics: 'correct' is a unique first candidate with usable flower evidence matching the reference group. Top ties are 'tied', unusable evidence is 'unresolved', processing failure is 'error', missing expected profile is 'unsupported'. These all stay in the processed-image denominator. Unrun images are excluded. Strict top-three requires the complete expected score-tie group to fit in three positions; tie-inclusive top-three includes ties crossing that boundary. Acceptance/review-required is separate and is intentionally disabled in the current engine. Leaf wins/losses compare untied first-candidate agreement before/after leaf adjustment on the same image.

Mask images are inspection aids, not segmentation ground truth. Complete leaf visibility, masks and exact petal counts have not been annotated. A nonempty mask is not evidence that it is correct. Selection excluded an apparent source-label mismatch and non-flowering/unrelated search hits before freezing the manifest. Reference-label mistakes may still exist.

To compare meaningful changes, run the frozen development set after an engine revision, inspect regressions and review labels/masks. Then evaluate reserved cases only at a deliberate checkpoint. No threshold or species-profile tuning is included in this benchmark feature.

## Identification Test v2 review fields

The v2 orchestration record is separate from the frozen v1 benchmark snapshot. A future benchmark schema revision should preserve, per image: framing/scale triage, dominant-versus-multiple proposal status, head-grouping status, reliable blade visibility, primary ranks and gate predicates, the exact reason secondary evidence did or did not run, before/after ranks and adjustments, and the final outcome plus internal assessability state. Schema, dataset, options and split must match before paired comparison.

Before reporting triage accuracy, manually annotate the 30 development photos for framing, target multiplicity/head grouping, flower-mask correctness and reliable leaf visibility. Do not infer these labels from the engine output. Keep all 20 reserved photos unrun until the v2 schema, gates and review metrics are frozen.

An attributed development-only unknown/distractor set is required to evaluate `no_match` and false identification. Poor captures remain `ambiguous` / `not_assessable`, not `no_match`. Report primary-only ties/top-k, secondary invocation and availability, wins/regressions, outcome coverage, selective risk, false no-match on supported examples and false identification on unknowns. Logic and synthetic tests do not establish recognition accuracy.
