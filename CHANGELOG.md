# Changelog

## 3.0.0-research

- Rebased the study build on the SHA-256 locked DAF TCCC RaPS source instead of a parallel scaffold.
- Replaced legacy 9-choice failure-mode taxonomy with exactly 5 study categories.
- Replaced legacy 12-choice contributor taxonomy with exactly 5 study categories.
- Required failure mode + primary contributor for every critical and noncritical FAIL.
- Removed “Unclassified / review later” as a selectable/savable normal workflow state.
- Removed secondary “Contributing factor” field from the live failure-classification workflow.
- Required objective comment for “Other / unclear.”
- Restricted NT to noncritical criteria not elicited by the approved scenario.
- Made missing FAIL classification a finalization blocker for every failed criterion.
- Mapped timer-standard failures to “Timing / sequence”; contributor still must be selected before finalization.
- Changed causal “root cause” display language to observed failure patterns and evaluator-attributed primary contributors.
- Preserved full pinned CMC Tier 3 content including CUF, TFC, MARCH-PAWS, later phases, and all CMC timers.
- Added study-targeted TQ, NPA, NDC, and BLOOD modules.
- Added privacy-safe longitudinal participant metadata and criterion-level Study Dataset CSV export.
- Added upstream source lock, research verification suite, Android build workflow, web build workflow, and optional manual Pages deploy.
