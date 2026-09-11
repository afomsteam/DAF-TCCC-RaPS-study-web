# Data Dictionary

| Field | Purpose |
|---|---|
| participantId | Coded research participant identifier. No SSN/DoD ID/PHI. |
| timepoint | baseline, month3, or month6. |
| studyArm | control, frequency, deliberate. Used for analysis; should not influence scoring. |
| assessmentId | cmc_tta, tourniquet, airway_npa, respiration_ndc, blood_admin. |
| scenarioVersion | PI-approved scenario version used during encounter. |
| evaluatorId | Calibrated evaluator code. |
| appBuild | App version/build identifier for measurement provenance. |
| checklistVersion | Approved checklist/source-map version. |
| rating | pass, fail, nt, or no. |
| failureMode | Required after every FAIL; one of five protocol-approved categories. |
| contributor | Required after every FAIL; one of five evaluator-attributed categories. |
| timer elapsedMs | Required timer result in milliseconds. |
