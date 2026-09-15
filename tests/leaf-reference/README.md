# Leaf development checks

Run `node scripts/evaluate-leaves.cjs` with @napi-rs/canvas available (or CODEX_PRIMARY_RUNTIME_NODE_MODULES set). It uses the original photos and attribution under tests/morphology-reference plus the screenshot-derived RGBA under tests/user-reference. No new public photo dataset is implied.

The evaluator runs the same full-photo leaf pass and flower crop path as both pages. evaluation.json records candidate issues, selected observations and flower/combined scores. All four initial examples remain leaf-unresolved. Visual review before adding the boundary-support gate found shaded colour fragments masquerading as complete blades; the gate rejects them. This is a known extraction limitation, not a successful leaf recognition benchmark.

Next dataset: isolated, fully visible leaf/leaflet blades with manually reviewed masks and endpoints; include overlapping, clipped, low-contrast and non-leaf green objects. Tip/base identity needs visible attachment. Compare mask correctness separately from species ranking.
