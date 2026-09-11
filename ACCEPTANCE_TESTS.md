# FieldReady 3.0.0-research — Acceptance Tests

Do not enroll participants until these checks pass on the exact APK/web build intended for study use.

## A. Build identity and source lock

- The welcome/app version shows `3.0.0-research`.
- `build-provenance.json` exists in the verified web-source artifact.
- GitHub Action `Generate source-locked study app` passes.
- GitHub Action `Verify research instrument` prints `VERIFY PASS`.

## B. FAIL workflow — the issue this repository specifically corrects

Test one **noncritical** criterion and one **critical** criterion.

1. Press FAIL.
2. A classification form opens immediately.
3. Failure mode shows **exactly five** choices: Not performed / incomplete; Incorrect technique; Timing / sequence; Unsafe action; Other / unclear.
4. Primary contributor shows **exactly five** choices: Knowledge / cue recognition; Judgment / prioritization; Psychomotor execution; Communication / teamwork; System / performance context.
5. There is no “Unclassified / review later.”
6. There is no secondary “Contributing factor” field.
7. Saving is blocked until both required selections are made.
8. Selecting Other / unclear is blocked until an objective comment is entered.
9. Repeat the test on a noncritical criterion and confirm the workflow is identical.

## C. Finalization lock

- Create a FAIL, then dismiss/interrupt classification before completing it. The criterion remains unresolved and finalization is blocked.
- Confirm N/O blocks finalization.
- Confirm an active/paused required timer blocks finalization.
- Confirm a timer standard that is not met produces Timing / sequence and still requires a primary contributor before finalization.

## D. NT behavior

- Critical criterion: NT must be blocked.
- Noncritical criterion: NT presents only the approved scenario-not-elicited rationale plus an optional objective note.
- Start a linked timer, then confirm NT is unavailable for that criterion.

## E. CMC content

- Module list includes CMC, TQ, NPA, NDC, BLOOD only.
- CMC begins with CUF and includes TFC before MARCH-PAWS sequence.
- CMC verification reports 124 criteria / 28 critical / 7 timers.
- Confirm MACE/head, CPR, communication, documentation, and evacuation sections remain present.

## F. Targeted skills

- TQ: 15 criteria / 11 critical; 1-minute and 3-minute timers present.
- NPA: 13 criteria / 7 critical.
- NDC: 15 criteria / 12 critical; 5–10 second timer present at the catheter-hold step.
- BLOOD: 26 criteria / 11 critical.

## G. Study data

- Add a participant using a privacy-safe Participant ID.
- Confirm study arm, clinical years, AFSC, work section, deployments, and prior TCCC exposure are captured.
- Create encounters at required study timepoints.
- Complete an evaluation with at least one classified failure and one NT.
- Export Study Dataset CSV and verify participant ID, study arm/timepoint, module, scenario/version, evaluator, criterion rating, failure mode, contributor, comment, NT reason, timer status, timestamps, and app version.

## H. Regression checks inherited from RaPS

- MAJCOM/installations selection functions.
- Local save persists after normal app close/reopen.
- PDF and all required CSV/JSON exports create files.
- Class/encounter closure locks edits while retaining viewing/export.
- Attempt 2 cannot begin unless Attempt 1 is finalized FAIL.
- Timer void requires an audit reason.
- Field/Review mode and Next Unresolved function without excessive scrolling.

Document the build version, device/browser, tester, date, and any deviations. A failed acceptance item is a stop condition until corrected and re-verified.
