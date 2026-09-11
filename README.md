# FieldReady Nurse Competency Study — GitHub-Ready Static App

This repository is a research-focused rewrite of the generic TCCC training/evaluation web app. It is designed to make the final-stage TSNRP/IRB revisions tangible before activation.

## What changed

- Dedicated **research encounter workflow** instead of generic class/training management.
- Required metadata: Participant ID, timepoint, study arm, clinical years, AFSC, work section, deployment count, prior TCCC exposure, evaluator ID, scenario version, assessment instance ID, app build, schema version, and checklist version.
- Protocol-aligned 5 failure modes and 5 evaluator-attributed primary contributors.
- Every failed criterion must have one failure mode and one contributor before finalization.
- `Other / unclear` requires an objective comment.
- Critical criteria cannot be marked NT.
- NT is only for noncritical criteria not elicited by the approved scenario.
- Required timers must be completed before finalization.
- Finalized encounters are locked and exportable.
- Calibration log is separated from participant records.
- Browser/local storage warning is explicit; browser storage is not the research database.

## Important activation note

`checklist-cmc.js` is modular on purpose. Before real participant use, the PI must verify or replace the source-map content with the fully approved CMC checklist and targeted skill pages, lock the source version, and recalibrate evaluators. A successful web build is not clinical source approval.

## Deploy on GitHub Pages

1. Create a new GitHub repository.
2. Upload all files from this folder to the repository root.
3. Go to **Settings → Pages**.
4. Set source to **GitHub Actions**.
5. Push to `main` or run the workflow manually.

## Local validation

```bash
node tests/validation.js
```

## Data exports

The app exports JSON, criterion-level CSV, timer CSV, calibration log JSON, and a data dictionary CSV. Export finalized records promptly into the approved study data environment.
