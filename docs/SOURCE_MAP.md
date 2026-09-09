# Study Source Map

This file documents the controlled source material used for each assessment module.

| Module | Included source | App criteria | Critical |
|---|---|---:|---:|
| CMC | Full Tier 3 CMC Tactical Trauma Assessment restored from the uploaded v2.21.0 baseline and cross-checked to `CMC.pdf` (`TCCC-CMC-TTA-05-02`, 30 MAY 26) | 124 | 28 |
| TQ | `TQ.pdf`, pages 1–2 only — Two-Handed (Windlass) Tourniquet Application in TFC | 15 | 11 |
| NPA | `airway.pdf`, page 4 only — Nasopharyngeal Airway (NPA) Insertion | 13 | 7 |
| NDC | `respiration.pdf`, pages 3–4 only — Needle Decompression of the Chest | 15 | 12 |
| BLOOD | `blood.pdf`, pages 6–7 only — Administration of Blood Products | 26 | 11 |

## CMC content-control rule

CMC is not a shortened study-TTA module in this build. The full Tier 3 CMC assessment is restored as the first assessment and retains the baseline section sequence and wording, including:

- Care Under Fire (CUF)
- Tactical Field Care (TFC)
- Massive Hemorrhage
- Airway
- Respiration
- Circulation
- Hypothermia
- Head Injury / MACE 2
- Pain
- Antibiotics
- Additional Wounds
- Splinting
- CPR
- Communication
- Documentation
- Preparation for Evacuation

The baseline CMC object contains 124 evaluator criteria, 28 critical criteria, and seven configured timers. `npm run verify` includes a SHA-256 content check so accidental future trimming of the restored CMC module fails validation.

## Individual-skill scoring

The selected CMC individual-skill checklists state that proficiency requires passing all critical tasks marked `C`. The TQ, NPA, NDC, and BLOOD assessment modules preserve that critical-task gate.

## Study protocol documents

The uploaded 28-point study TTA checklist and trainer/evaluator plan remain study-planning and validation references. They are not substituted for or used to shorten the restored CMC Tier 3 assessment in this build.
