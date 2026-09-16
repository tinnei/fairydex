# Visible floral structure pilot

This predeclared 16-image pilot uses only images already assigned to the development split in `dist/benchmark/manifest.json`. It distinguishes one large flower candidate, a disc-plus-ray composite head candidate, a cluster of small flower candidates, and unresolved. It does not measure botanical flower/floret totals and does not affect candidate ranking.

Run `npm run structure-experiment`. The report includes unresolved in the confusion matrix and scores structure agreement separately from hard-case routing. The 20 reserved benchmark images are not loaded by the runner.

Passing this deliberately selected development pilot authorizes only a larger untouched evaluation. It does not validate recognition accuracy, calibrate confidence, or justify automatic acceptance.
