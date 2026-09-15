# Macau shortlist — Commons references

Downloaded JPEG references for six targets: hibiscus, Ixora, lantana, plumeria, bougainvillea, and Bidens. Run `node tests/macau-reference/validate.mjs` from the project root for current counts and integrity checks.

These are **reference candidates**, not a validated benchmark or a claim that the photographs were taken in Macau. Search-derived labels have not been independently verified. Every record starts with an unknown stage and plant part and needs visual annotation before use in training or accuracy reporting.

`manifest.json` retains the Commons file page, original and downloaded URLs, author, license and license link. Preserve this attribution alongside redistributed images. Wikimedia thumbnail resizing is the only image modification. Individual licenses apply; consult the linked file page for attribution details.

`crawl.py` records download metadata and only accepts JPEG bytes. It can reproduce the search, but search ordering can change; the checked-in manifest identifies the actual selected files.

Review priority: identify a visible target region; assign flowering/bud/fruit/seed-head stage where observable; confirm the genus/species scope with a reliable botanical source; flag close-ups, occlusions and multiple plants. Keep unreviewed references separate from scored tests.

## Review before evaluation

- Target labels identify the search group, not necessarily a verified species. Ixora, Plumeria, Bougainvillea, and Bidens may require genus-level labels.
- Annotate each visible plant instance separately; a photograph may contain more than one stage.
- Record a bounding box or mask, stage, visible part, reviewer, and identification source. Unknown is a valid label.
- Keep related photographs of the same plant or photographic session in the same dataset split. Different filenames do not guarantee independent examples.
- Include difficult backgrounds, pale petals, insects and partially hidden flowers as tagged stress cases.
- Do not use these unreviewed images to report accuracy or silently change the live ranker's supported species.

The validator detects exact duplicate bytes and repeated source URLs; near-duplicate views still require visual review.
