# Identification flow

The main page `/` is the photo-led five-stage Flower Lens interface. It uses the existing `engine-v3.js` and `engine-profiles.js` without changing the recognition rules.

1. Choose one of six credited test photographs or upload JPEG, PNG, or WebP (up to 10 MB).
2. Process locally and inspect Original, Crop, or Mask. Click the original to seed the selected flower region, or use Select image centre. Crop padding changes only the preview. Empty regions, missed taps, and severe quality problems cannot continue. A user-selected region whose only warning is that it covers most of the image can explicitly continue with uncertain evidence; engine quality remains unchanged.
3. Inspect measured colour and centre contrast; outline and tip estimates remain uncertain, and leaf traits remain unmeasured. Click clues to highlight their supporting pixels.
4. Review three actual candidate suggestions, their experimental-range matches and conflicts, and an engine-provided follow-up instruction.
5. Add a follow-up view. Photos are analyzed independently, with earlier views retained for comparison during the session. Closing or refreshing clears session photos.

## Routes

- `/`: main flow
- `/dev/`: old guided test bench
- `/dev/collect`: old private collection page
- `/collect`, `/collect/`, and `/collect.html`: redirect to `/dev/collect`
- `/api/observations`: unchanged private collection API

`/dev` is a path, not a DNS subdomain. No deployment, DNS, hosting ID, authentication, or storage permissions were changed.

## Local preview and verification

Run `npm run dev` for a bundled Worker preview at http://localhost:4173. Pass `-- --port 4174` to choose another port. Restart the preview after changing files; the preview serves built assets.

Run `npm run build` then `npm test`. The generated Worker asset bundle is excluded from version control. Browser QA is recorded in `design-qa.md`.

Main UI: `dist/index.html`, `dist/flow.css`, `dist/flow.js`. Evidence presentation rules: `dist/flow-model.js`. Legacy browser adapters and styling are in `dist/dev/`; shared engine scripts remain in `dist/`.

Real samples and their original attribution live under `dist/assets/samples`. The generated botanical framing illustration is in `dist/assets/flow/wider-view.png`. Standard UI icons are the bundled Lucide library, with its license retained under `dist/vendor`.
