window.FIELDREADY_CONFIG = {
  appName: "FieldReady Nurse Competency Study",
  buildId: "fieldready-research-v0.3.0-locked",
  buildDate: "2026-09-10",
  schemaVersion: "2026.09.research.1",
  studyPurpose: "Longitudinal pilot to estimate TCCC skill-retention trajectories and feasibility/fidelity of frequency-based and deliberate-practice reinforcement compared with standard CMRP training.",
  timepoints: [
    { id: "baseline", label: "Baseline" },
    { id: "month3", label: "3-month follow-up" },
    { id: "month6", label: "6-month follow-up" }
  ],
  studyArms: [
    { id: "control", label: "Control: Standard CMRP" },
    { id: "frequency", label: "Frequency-Based Reinforcement" },
    { id: "deliberate", label: "Deliberate Practice" }
  ],
  assessments: ["cmc_tta", "tourniquet", "airway_npa", "respiration_ndc", "blood_admin"],
  failureModes: [
    { id: "not_performed_incomplete", label: "Not performed / incomplete", help: "Required action was omitted, never initiated, or only partly completed." },
    { id: "incorrect_technique", label: "Incorrect technique", help: "Action was attempted, but method, placement, equipment use, or procedural technique did not meet criterion." },
    { id: "timing_sequence", label: "Timing / sequence", help: "Action was delayed, out of required clinical/tactical order, or exceeded an explicit timing standard." },
    { id: "unsafe_action", label: "Unsafe action", help: "Action created unacceptable patient, provider, or mission risk or violated a safety-critical requirement." },
    { id: "other_unclear", label: "Other / unclear", help: "Observed failure does not fit the four categories above; objective comment required." }
  ],
  contributors: [
    { id: "knowledge_cue", label: "Knowledge / cue recognition", help: "Required knowledge was absent or the participant missed the clinical/tactical cue." },
    { id: "judgment_priority", label: "Judgment / prioritization", help: "Cue was recognized but wrong intervention, priority, or sequence was chosen." },
    { id: "psychomotor", label: "Psychomotor execution", help: "Participant appeared to know what to do but could not execute to standard." },
    { id: "communication_teamwork", label: "Communication / teamwork", help: "Communication, delegation, coordination, role clarity, or closed-loop teamwork contributed." },
    { id: "system_context", label: "System / performance context", help: "Equipment, resource, workload/stress, scenario, or environmental context materially contributed." }
  ],
  ntRule: "NT is permitted only for noncritical criteria not elicited by the approved scenario. Critical criteria cannot be NT and remain unresolved until PASS or FAIL is selected.",
  passRule: "PASS percentage = PASS / (PASS + FAIL). NT excluded. N/O blocks finalization. Any failed critical criterion produces overall FAIL.",
  demographics: ["clinicalYears", "afsc", "workSection", "deploymentCount", "priorTcccExposure"]
};
