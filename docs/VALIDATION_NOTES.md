# Content Validation Notes

## Purpose

Version 0.1.2 corrects the CMC regression introduced in the first study build. The first assessment is again the full Combat Medic/Corpsman Tactical Trauma Assessment from the uploaded v2.21.0 baseline, cross-checked against the 30 May 2026 abbreviated CMC checklist. CUF and TFC are restored ahead of the full MARCH-PAWS sequence, followed by CPR, communication, documentation, and preparation for evacuation.

## CMC — restored Tier 3 baseline

The CMC module now preserves all 16 baseline sections, 124 evaluator criteria, 28 critical criteria, and seven timer definitions from the prior Tier 3 implementation. It is intentionally not collapsed into the separate 28-point study checklist.

A fixed SHA-256 validation signature is checked by `npm run verify`. Any accidental deletion, rewording, critical-flag change, timer change, or section reordering inside the restored CMC object will cause validation to fail until the change is deliberately reviewed and the baseline is formally revised.

## TQ — selected pages 1–2

The windlass-tourniquet module remains limited to the selected source pages. The evaluator count-up timer remains pinned to the assessment and evaluates the requested `< 1:00` standard, while the separate source documentation timing remains available.

## NPA — selected page 4

The NPA module remains limited to the selected page 4 checklist, including inspection, lubrication, bevel orientation, 90-degree insertion, advancement until the flange is flush, reassessment, positioning, and documentation.

## NDC — selected pages 3–4

The NDC module remains limited to the selected pages 3–4 and retains the 5–10 second decompression-hold timer.

## Blood — selected pages 6–7

The blood module remains limited to the uploaded 26 May 2021 administration-of-blood-products checklist pages 6–7. Source wording is preserved rather than silently modernized.

## Software rule

Clinical-source changes and software changes should be versioned separately. If a source instrument is deliberately revised, update `www/tiers.js`, increment `www/version.js`, document the content change, and rerun `npm run verify` before building the APK.
