# Study Dataset CSV — Core Data Dictionary

The dedicated `Study Dataset CSV` is one row per participant × attempt × criterion for the currently opened study encounter.

| Field | Meaning |
|---|---|
| participant_id | Privacy-safe study participant identifier |
| study_arm | control / frequency / deliberate |
| timepoint | baseline / 3mo-pre / 3mo-post / 6mo-pre / 6mo-post |
| clinical_years | Clinical experience in years |
| afsc | AFSC recorded for the participant |
| work_section | Current work section / clinical area |
| deployments | Deployment count captured for study analysis |
| prior_tccc_exposure | Brief/coded prior TCCC exposure field |
| encounter_id / encounter_label | Local study encounter identifiers |
| module / module_source | CMC, TQ, NPA, NDC, BLOOD and locked source text |
| scenario / scenario_version | Approved scenario/version used |
| evaluator_id | Evaluator identifier at the encounter/attempt |
| attempt | Attempt 1 or remediation Attempt 2 |
| final_result | PASS / FAIL when finalized |
| criterion_id / section | Source-locked criterion and section |
| critical | YES/NO source/approved critical flag |
| grade | pass / fail / nt / no |
| failure_mode | One of five simplified failure-mode codes when grade=fail |
| primary_contributor | One of five simplified evaluator-attributed contributor codes when grade=fail |
| failure_comment | Objective comment; required for Other / unclear |
| nt_reason | `scenario-not-elicited` when grade=nt |
| timer_forced | YES if a linked timer standard forced FAIL |
| app_version | Instrument build version |

The export also includes the existing RaPS location/MAJCOM/site metadata to support future multi-site aggregation.
