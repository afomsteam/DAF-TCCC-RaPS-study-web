# FieldReady Competency Study — Correct GitHub Repository

This repository is the **research-study derivative of the existing DAF TCCC RaPS app**, not a separate replacement scaffold. The build process downloads the locked RaPS baseline, verifies the exact `app.js` and `tiers.js` SHA-256 hashes, preserves the existing evaluator/program-manager framework, then applies the study-specific changes. If the upstream RaPS source changes or a required patch anchor is missing, the build stops instead of silently producing a different instrument.

## The failure menu is now hard-locked to 5 × 5

Every **FAIL**, critical or noncritical, opens the same required classification form. There is no “Unclassified / review later” path and no secondary “Contributing factor” field.

**Observed failure pattern — exactly 5 choices**

1. Not performed / incomplete
2. Incorrect technique
3. Timing / sequence
4. Unsafe action
5. Other / unclear

**Evaluator-attributed primary contributor — exactly 5 choices**

1. Knowledge / cue recognition
2. Judgment / prioritization
3. Psychomotor execution
4. Communication / teamwork
5. System / performance context

Both fields are required before the failed criterion is resolved. **Other / unclear** also requires an objective evaluator comment. A failed criterion with missing classification blocks finalization.

## NT rule

NT is restricted to one reason: **Approved scenario did not elicit this noncritical criterion.** Critical criteria cannot be NT. N/O remains unresolved. A started linked timer prevents NT for that criterion.

## What is preserved from RaPS

The repository starts from the locked RaPS baseline so it retains the mature workflow instead of recreating it: local/offline storage, MAJCOM and installation metadata, class/encounter lifecycle, participant roster, direct-observation checklist grading, critical criteria, Field/Review modes, timers, timer audit history and voids, notes, Attempt 2/remediation workflow, PDF/CSV/JSON exports, analytics, management views, class closure, Android file saving, and web/PWA behavior.

## Study assessment modules

The generated app contains only the study modules:

- **CMC** — exact pinned Tier 3 CMC object from the locked RaPS `tiers.js`: 16 sections, 124 criteria, 28 critical criteria, 7 timers; CUF and TFC remain intact before MARCH-PAWS.
- **TQ** — two-handed windlass tourniquet: 15 criteria, 11 critical; 1-minute and 3-minute timers.
- **NPA** — nasopharyngeal airway insertion: 13 criteria, 7 critical.
- **NDC** — needle decompression: 15 criteria, 12 critical; 5–10 second hold timer.
- **BLOOD** — administration of blood products: 26 criteria, 11 critical.

The targeted module wording and critical-task flags are defined in `scripts/targeted-assessments.mjs`; source references are documented in `docs/SOURCE_AND_VALIDATION.md`.

## Longitudinal study fields

Participant creation uses a privacy-safe Participant ID and adds study arm, clinical years of experience, AFSC, current work section/clinical area, deployment count, and prior TCCC exposure. Encounters carry a study timepoint. The dedicated **Study Dataset CSV** exports criterion-level data with study metadata, scenario/evaluator/version provenance, PASS/FAIL/NT/N/O, failure mode, primary contributor, timer-forced status, and timestamps.

## Build the Android APK in GitHub

1. Create a new GitHub repository or a clean branch.
2. Upload **all contents of this repository** to the repository root.
3. Commit/push to `main`.
4. Open **Actions → Build FieldReady Android APK**.
5. Run the workflow if it did not start automatically.
6. Download the artifact **FieldReady-Competency-Study-APK**.

The workflow uses Node 24 and Java 21, runs static tests, downloads and verifies the locked RaPS source, generates the study build, runs the research-instrument verification suite, creates the Capacitor Android wrapper, and builds the APK. It also uploads the exact verified web source used for that APK.

## Build the web app

Run **Actions → Build FieldReady Web App**. The artifact named **FieldReady-Web-App** contains the verified static site. The separate **Deploy FieldReady to GitHub Pages** workflow is intentionally manual so a repository without Pages enabled does not fail every push. Enable GitHub Pages with **GitHub Actions** as the source, then run that workflow.

## Source lock: why it exists

`upstream-lock.json` contains the required SHA-256 values for the RaPS `app.js` and `tiers.js`. If the live RaPS repository changes, the build will fail with `SOURCE LOCK FAILURE`. That is intentional for a research instrument. Review the upstream diff, determine whether it changes clinical content, timers, scoring, data capture, or evaluator behavior, re-calibrate when required, then deliberately update the hashes.

## Verification

`npm run verify` fails the build unless all of these are true: exactly 5 failure modes, exactly 5 contributors, every FAIL routes to required classification, no legacy “Unclassified / review later” option exists, the secondary contributing-factor UI is gone, NT uses only the study-approved reason, all unclassified FAILs block finalization, the approved five modules are the only modules present, CMC remains 124/28/7 with CUF and TFC, and TQ/NPA/NDC/BLOOD counts and timing criteria match the locked study definitions.

Before participant data collection, complete the manual checks in `ACCEPTANCE_TESTS.md`. Treat any later app/checklist/scenario/timer/taxonomy change as controlled research-instrument change management.

## Data warning

The app stores working data locally. Do not enter PHI, CUI, SSNs, DoD ID numbers, patient/casualty identifiers, or unnecessary PII. Export completed study data to the approved study repository according to the protocol and data-management plan. Clearing application data or uninstalling the Android app can remove local records.
