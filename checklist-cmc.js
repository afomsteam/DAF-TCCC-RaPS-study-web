window.FIELDREADY_ASSESSMENTS = {
  cmc_tta: {
    id: "cmc_tta",
    label: "CMC Tactical Trauma Assessment",
    source: "PI-approved CMC Tactical Trauma Assessment source checklist; source-lock before study activation",
    version: "source-map-2026.09.review",
    note: "This file is the source-map layer. Replace or expand criteria only by PI-approved change control, then recalibrate evaluators before active data collection.",
    timers: [
      { id: "cmc_overall", label: "Overall TTA", section: "GLOBAL", mode: "max", seconds: 1800, standard: "≤ 30:00", requiredForPass: true },
      { id: "cmc_cuf_tq", label: "CUF Tourniquet", section: "CUF", mode: "max", seconds: 60, standard: "≤ 1:00", linkedItemId: "CMC-005", requiredForPass: true },
      { id: "cmc_wound_pressure", label: "Wound Packing Pressure", section: "M", mode: "min", seconds: 180, standard: "≥ 3:00", linkedItemId: "CMC-014", requiredForPass: true },
      { id: "cmc_ndc_hold", label: "NDC Catheter Hold", section: "R", mode: "range", minSeconds: 5, maxSeconds: 10, standard: "5–10 sec", linkedItemId: "CMC-034", requiredForPass: true }
    ],
    sections: [
      { code: "CUF", title: "Care Under Fire", items: [
        { id: "CMC-001", text: "Returned fire/took cover or directed tactical response as appropriate.", critical: true },
        { id: "CMC-002", text: "Directed casualty to move to cover and apply self-aid when able.", critical: false },
        { id: "CMC-003", text: "Moved casualty to cover as tactical situation permitted.", critical: false },
        { id: "CMC-004", text: "Identified life-threatening extremity hemorrhage during CUF.", critical: true },
        { id: "CMC-005", text: "Applied CoTCCC-recommended limb tourniquet in CUF and controlled bleeding within 1 minute.", critical: true }
      ]},
      { code: "TFC", title: "Tactical Field Care", items: [
        { id: "CMC-006", text: "Established security and maintained tactical situational awareness.", critical: false },
        { id: "CMC-007", text: "Performed triage and initiated TFC sequence when tactical situation permitted.", critical: true },
        { id: "CMC-008", text: "Used MARCH-PAWS sequence to structure assessment and treatment priorities.", critical: true }
      ]},
      { code: "M", title: "Massive Hemorrhage", items: [
        { id: "CMC-009", text: "Assessed effectiveness of tourniquets placed in CUF.", critical: true },
        { id: "CMC-010", text: "Applied deliberate tourniquet directly to skin 2–3 inches above bleed site when indicated.", critical: true },
        { id: "CMC-011", text: "Applied second tourniquet side-by-side if bleeding was not controlled.", critical: false },
        { id: "CMC-014", text: "Packed wounds not amenable to tourniquet use with hemostatic dressing, held pressure for 3 minutes, and applied pressure bandage.", critical: true },
        { id: "CMC-016", text: "Performed initial hemorrhagic shock assessment.", critical: true }
      ]},
      { code: "A", title: "Airway", items: [
        { id: "CMC-020", text: "Assessed for unobstructed airway.", critical: true },
        { id: "CMC-021", text: "Identified traumatic airway obstruction or impending obstruction.", critical: true },
        { id: "CMC-022", text: "Placed unconscious casualty in recovery position when appropriate.", critical: false },
        { id: "CMC-023", text: "Inserted NPA when indicated and not contraindicated.", critical: true }
      ]},
      { code: "R", title: "Respiration", items: [
        { id: "CMC-030", text: "Exposed chest, assessed anterior/posterior torso, and treated open chest wounds.", critical: true },
        { id: "CMC-031", text: "Applied vented chest seals or appropriate occlusive dressing.", critical: true },
        { id: "CMC-034", text: "Performed needle decompression when indicated and maintained catheter hold for required standard.", critical: true }
      ]},
      { code: "C", title: "Circulation / Blood", items: [
        { id: "CMC-050", text: "Established IV/IO access when indicated.", critical: true },
        { id: "CMC-051", text: "Selected blood product / fluid resuscitation strategy according to protocol and casualty status.", critical: true },
        { id: "CMC-052", text: "Monitored for response to resuscitation and reassessed perfusion.", critical: false }
      ]},
      { code: "H2", title: "Head Injury / Hypothermia", items: [
        { id: "CMC-070", text: "Prevented hypothermia using active/passive warming measures.", critical: true },
        { id: "CMC-075", text: "Administered MACE2 assessment when head injury was indicated by scenario.", critical: false }
      ]},
      { code: "P", title: "Pain", items: [
        { id: "CMC-097", text: "Administered analgesia appropriate to casualty status when indicated.", critical: true },
        { id: "CMC-098", text: "Monitored airway, breathing, circulation, mentation, and pain response after potent analgesics.", critical: false }
      ]},
      { code: "ABX", title: "Antibiotics", items: [
        { id: "CMC-100", text: "Checked drug allergies before medication administration.", critical: true },
        { id: "CMC-101", text: "Administered antibiotics for open combat wounds/invasive procedures when indicated.", critical: true }
      ]},
      { code: "COMMS", title: "Communication", items: [
        { id: "CMC-117", text: "Communicated with tactical leadership and reported evacuation request elements.", critical: false },
        { id: "CMC-118", text: "Relayed MIST report to evacuation/receiving medical personnel.", critical: true }
      ]},
      { code: "DOC", title: "Documentation", items: [
        { id: "CMC-119", text: "Documented findings and treatments on DD Form 1380/TCCC card and attached it to casualty.", critical: true }
      ]},
      { code: "EVAC", title: "Evacuation", items: [
        { id: "CMC-121", text: "Secured casualty, bandages, equipment, hypothermia wrap, and litter straps for evacuation.", critical: true },
        { id: "CMC-123", text: "Maintained security/safety at evacuation point.", critical: false }
      ]}
    ]
  },
  tourniquet: {
    id: "tourniquet", label: "Targeted Skill: Tourniquet", source: "Study source pages 1–2", version: "source-map-2026.09.review",
    timers: [{ id: "tq_under_60", label: "Tourniquet application", section: "TQ", mode: "max", seconds: 60, standard: "≤ 1:00", linkedItemId: "TQ-004", requiredForPass: true }],
    sections: [{ code: "TQ", title: "Tourniquet", items: [
      { id: "TQ-001", text: "Identified life-threatening extremity hemorrhage.", critical: true },
      { id: "TQ-002", text: "Placed tourniquet high/tight or 2–3 inches above wound as required by scenario.", critical: true },
      { id: "TQ-003", text: "Tightened windlass until bleeding stopped and distal pulse was absent.", critical: true },
      { id: "TQ-004", text: "Completed effective tourniquet application within 1 minute.", critical: true },
      { id: "TQ-005", text: "Secured windlass and documented application time.", critical: false }
    ]}]
  },
  airway_npa: {
    id: "airway_npa", label: "Targeted Skill: Airway / NPA", source: "Study source page 4", version: "source-map-2026.09.review", timers: [],
    sections: [{ code: "AIR", title: "Airway", items: [
      { id: "AIR-001", text: "Assessed airway patency and casualty responsiveness.", critical: true },
      { id: "AIR-002", text: "Selected NPA when indicated and screened for contraindication.", critical: true },
      { id: "AIR-003", text: "Measured and lubricated NPA correctly.", critical: false },
      { id: "AIR-004", text: "Inserted NPA with correct technique and reassessed airway.", critical: true }
    ]}]
  },
  respiration_ndc: {
    id: "respiration_ndc", label: "Targeted Skill: Respiration / NDC", source: "Study source pages 3–4", version: "source-map-2026.09.review",
    timers: [{ id: "ndc_hold", label: "NDC hold", section: "RESP", mode: "range", minSeconds: 5, maxSeconds: 10, standard: "5–10 sec", linkedItemId: "RESP-004", requiredForPass: true }],
    sections: [{ code: "RESP", title: "Respiration / NDC", items: [
      { id: "RESP-001", text: "Assessed chest/respirations and recognized tension pneumothorax indicators.", critical: true },
      { id: "RESP-002", text: "Selected approved decompression site and landmarked correctly.", critical: true },
      { id: "RESP-003", text: "Prepared catheter and inserted perpendicular to chest wall with correct technique.", critical: true },
      { id: "RESP-004", text: "Held catheter in place for required time standard and reassessed casualty.", critical: true }
    ]}]
  },
  blood_admin: {
    id: "blood_admin", label: "Targeted Skill: Blood Administration", source: "Study source pages 6–7", version: "source-map-2026.09.review", timers: [],
    sections: [{ code: "BLOOD", title: "Blood Administration", items: [
      { id: "BLD-001", text: "Recognized hemorrhagic shock and selected appropriate resuscitation pathway.", critical: true },
      { id: "BLD-002", text: "Verified blood product, compatibility requirements, and expiration/storage conditions.", critical: true },
      { id: "BLD-003", text: "Established/confirmed vascular access and primed administration set correctly.", critical: true },
      { id: "BLD-004", text: "Administered blood product safely while monitoring for response/adverse reaction.", critical: true },
      { id: "BLD-005", text: "Documented product, volume, time, and reassessment findings.", critical: false }
    ]}]
  }
};
