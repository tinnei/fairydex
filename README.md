# Flower Lens visual flow

This branch preserves the local Flower Lens implementation created on 16 September 2026. It is an independent snapshot, not a replacement for the newer identification engine on main.

The main page provides photo selection, browser-local image processing, region review, measured clues, experimental candidate rankings, and independent follow-up photos. Old pages are under `/dev/` and `/dev/collect`.

Run `npm run dev` for the local preview. Run `npm run build` followed by `npm test` for validation.

See [flow documentation](docs/IDENTIFICATION-FLOW.md) and [QA record](design-qa.md). The recognizer uses a small fixed profile catalog; results are suggestions, not calibrated identifications. Cloud collection code exists, but the local preview is not connected to authentication or persistent cloud storage.

Local credentials and unrelated pet assets are excluded. No public website deployment is performed by this snapshot.
