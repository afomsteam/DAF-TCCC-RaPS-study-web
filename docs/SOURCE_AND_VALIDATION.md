# Source and Validation Control

## Locked operational baseline

The generator starts from `afomsteam/DAF-TCCC-RaPS-WEB` and refuses to build unless `app.js` and `tiers.js` match the SHA-256 values in `upstream-lock.json`. This makes the generated study app a controlled derivative rather than an untracked fork of an unknown live revision.

## CMC

The CMC module is extracted directly from upstream Tier 3 after the source lock passes. Expected verification result:

- Source: `TCCC-CMC-TTA-05-02 · 30 MAY 26`
- 16 sections
- 124 evaluator criteria
- 28 critical criteria
- 7 timers
- CUF and TFC retained before MARCH-PAWS

The generator does not manually reconstruct the 124-item CMC module.

## Targeted modules

**TQ — Two-Handed (Windlass) Tourniquet Application in TFC**

Source: TCCC CMC Skills Assessment Checklist, Module 6, `#TCCC-CMC-12-01`, 16 NOV 20, pages 1–2. Expected: 15 criteria / 11 critical. Timing criteria retained: steps 1–7 within 1 minute; documentation/application process within 3 minutes.

**NPA — Nasopharyngeal Airway Insertion**

Source: TCCC CMC Skills Assessment Checklist, Module 7, `#TCCC-CMC-12-01`, 23 SEP 21, page 4. Expected: 13 criteria / 7 critical.

**NDC — Needle Decompression of the Chest**

Source: TCCC CMC Skills Assessment Checklist, Module 8, `#TCCC-CMC-12-01`, 16 NOV 20, pages 3–4. Expected: 15 criteria / 12 critical. Step 8 retains the 5–10 second catheter-hold standard and a linked range timer.

**BLOOD — Administration of Blood Products**

Source: TCCC CMC Skills Assessment Checklist, Module 11, `#TCCC-CMC-12-01`, 26 MAY 21, pages 6–7. Expected: 26 criteria / 11 critical.

## Failure classification control

Failure pattern taxonomy:

- Not performed / incomplete
- Incorrect technique
- Timing / sequence
- Unsafe action
- Other / unclear

Primary contributor taxonomy:

- Knowledge / cue recognition
- Judgment / prioritization
- Psychomotor execution
- Communication / teamwork
- System / performance context

These are descriptive study fields, not proof of causal mechanism. Evaluator/administrative problems that invalidate an observation should be handled through void/correction/retest procedures, not assigned as a participant contributor.

## Change control

A change to clinical criteria, critical flags, timer standards, scenario logic, scoring/finalization, study taxonomy, source versions, or evaluator workflow must be reviewed as a measurement-instrument change. Update the source lock only after reviewing upstream differences. Re-calibration is required when the study protocol/calibration plan says the change can affect scoring or reliability.
