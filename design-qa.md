# Flower Lens identification flow QA

final result: passed

## Visual evidence

- Selected flow board: `/Users/10a/.codex/generated_images/01a0aa58-6560-79a1-b286-af376f4abfa7/exec-ac62ffa8-c2ea-47af-8851-485c6fbab6bd.png` (1448 × 1086).
- Selected photo-led template: `/Users/10a/.codex/skills/artifact-template-flower-lens-identification-flow/assets/reference.png` (1487 × 1058).
- Implementation: `output/flow-qa/choose-final.png`, `process-final.png`, `identify-final.png`; additional `review.png`, `follow.png`.
- Full-view comparisons: `output/flow-qa/comparison.png`, `template-comparison.png`.
- Focused evidence-row comparison: `output/flow-qa/details-comparison.png`.
- Responsive captures: `output/flow-qa/mobile-identify.png`, `mobile-review.png`, `mobile-follow.png`.
- Browser viewport override: 1440 × 1024 desktop, 390 × 844 mobile; reset after verification. Desktop full-page capture is 1425 × 1056; mobile identification full-page capture is 375 × 1614. The browser captures content excluding its 15px scrollbar. Images were normalized proportionally with Pillow for side-by-side comparison; no stretching. The design board contains abbreviated small screen frames, so the retained desktop template also anchors proportions.
- State: actual first gallery image, processing and identification. Source flowers and literal candidate values differ intentionally: implementation uses existing test photos and actual engine outputs, never mock botanical determinations.

## Findings and comparison history

- Initial evidence rows used standard icons instead of visual details. Replaced colour, centre, and outline icons with actual photo-derived thumbnails. A generated illustration is labeled as illustrative context and used for the unmeasured leaf/follow-up area. Captures `identify-before.png` and `identify-final.png` document this refinement.
- In the follow-up failure case, earlier views were initially reachable only after finishing the new flow. Added a return-to-earlier-photo action to all relevant screens so an unusable second image cannot strand the prior observation.
- Final desktop, focused-row, and mobile comparisons show no unresolved P0/P1/P2 visual issues.

## Required fidelity surfaces

- Typography: Georgia serif display headings and brand, Arial UI text preserve the template hierarchy. Long scientific names and explanatory copy wrap.
- Layout: photo-led desktop split, persistent five-stage header, evidence inspector, lightweight separators and green primary action. Mobile stacks regions and preserves navigation and actions; measured layout fits the viewport.
- Tokens: near-white background, neutral image well, deep green, warm amber, and gray unresolved states. Status uses icons and words, not color alone.
- Imagery: real test photos, actual engine masks/crops/highlighted measurement areas, measured photo details, and a generated botanical framing example. Crop proportions preserved and magnification capped at 2× the analysis resolution. Unlike the initial hero mock, imperfect inputs remain imperfect as requested.
- Copy: no confidence percentages or automatic species confirmation. Leaf status says Not measured rather than claiming absence. Region quality is separate from processing completion. Candidate evidence is described as experimental ranges, not botanical proof. Additional photographs are clearly analyzed separately.

## Functional verification

- Chose test photo, processed it with the real engine, viewed mask, used center selection, inspected clues, selected center highlighting, reviewed top three candidates, and reached follow-up.
- Uploaded a local test JPEG through the real file picker, verified preview and enabled action, and processed it as the next image. Its overly broad mask correctly disabled identification with a quality explanation.
- Mobile review and follow-up navigation and controls inspected; no horizontal viewport overflow.
- Main app browser warning/error logs were empty during these checks.
- Both legacy pages rendered under `/dev/` and `/dev/collect`. The local collection page correctly reports sign-in required; production storage was not modified or tested.
- Build and all 16 automated tests pass. Tests cover new/legacy routes, static asset resolution, redirects, gallery image/credit availability, unobservable evidence abstention, mask clipping, plus existing engine and private collection behavior.

## Accepted differences and limits

- Supported botanical measurements are limited by the existing experimental engine. The UI intentionally does not reproduce the design mock's exact species labels or inferred leaf detector.
- Actual measurement overlays replace decorative numbered leaders. Selecting a clue highlights the measured region rather than fabricated feature landmarks.
- The preview uses real lower-resolution analysis data with neutral surrounding space, as agreed after choosing the template.
- Follow-up photos remain in session memory; there is no combined multi-view scorer or new persistence service.
- Broad manual upload/error testing across browsers and devices remains future coverage. Keyboard-accessible image-centre selection is available alongside pointer seeding.

## Implementation checklist

- [x] New flow at `/` and old tools at `/dev`.
- [x] Real processing and evidence, no mock result claims.
- [x] Desktop/mobile visual inspection and focused comparison.
- [x] Main interactions, image upload, follow-up and quality-blocked state.
- [x] Existing and new automated checks pass.

## Follow-up polish

- Optional: additional botanical illustrations for other growth forms.
- Optional: a richer keyboard seed-position control beyond image-centre selection.

## Region-selection follow-up fix

Reproduced the user-reported stop on Test photo 04: the selected close-up exceeded the engine coverage threshold, disabling continuation. Added an explicit Continue with uncertain region action only for a contained user seed with that sole quality warning. Clue states remain uncertain and candidate review carries a visible quality warning. Empty masks, missed taps, and additional quality failures stay blocked. Browser-verified the same sample through centre selection, clue inspection, and candidate review. All 17 tests pass, including a regression covering both the permitted close-up and disallowed failure cases.
