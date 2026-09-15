# Morphology development references

Three existing Commons thumbnail images, with original source page, author and licence in sources.json. Image bytes copied unchanged from the earlier reference collection. They are development examples, not held-out test cases or expert-reviewed petal annotations.

Run `node scripts/evaluate-morphology.cjs` from the project root with `@napi-rs/canvas` installed or `CODEX_PRIMARY_RUNTIME_NODE_MODULES` pointing to the runtime module directory. The shared browser crop/analysis path is executed using canvas image decoding and records evaluation.json. Runtime canvas interpolation may differ slightly from a browser. Check counts together with actual boundaries; coincidental correct numbers are not correctness evidence.
