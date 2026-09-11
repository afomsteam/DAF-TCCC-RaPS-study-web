const item=(id,text,critical=false)=>({id,text,critical,provenance:'source',sourceRef:'Study-approved individual skills checklist'});

export const targetedAssessments={
  TQ:{
    id:'TQ',shortName:'TQ',name:'Two-Handed Windlass Tourniquet Application',
    source:'TCCC-CMC-12-01 · 16 NOV 20 · Module 6 · pages 1–2',
    instructions:'Study-targeted individual skill. Source wording and critical-task flags are locked to the approved checklist.',
    sections:[{code:'TQ',title:'Two-Handed (Windlass) Tourniquet Application in Tactical Field Care',items:[
      item('TQ-001','Considered body substance isolation.'),
      item('TQ-002','Exposed the injury and assessed the bleeding site.',true),
      item('TQ-003','Applied direct pressure to control bleeding while preparing to apply tourniquet.',true),
      item('TQ-004','Removed the tourniquet from the casualty’s Joint First Aid Kit (JFAK) and/or carrying pouch.'),
      item('TQ-005','Inserted the wounded extremity in the loop of the self-adhering band (looped) or routed the band around the limb and passed the band tip through the slit of the buckle.',true),
      item('TQ-006','Positioned the tourniquet about 2–3 inches above the wound and directly on the skin.',true),
      item('TQ-007','Pulled self-adhering band until all slack was removed and it was tight around the extremity.',true),
      item('TQ-008','Fastened the band back on itself all the way around the limb (but not over the windlass rod clips).',true),
      item('TQ-009','Twisted the windlass rod until bleeding stopped.',true),
      item('TQ-010','Completed steps 1–7 within 1 minute.',true),
      item('TQ-011','Locked the windlass rod in place with the windlass clip.',true),
      item('TQ-012','Routed the self-adhering band around the rod and between the clips.'),
      item('TQ-013','Secured with the windlass safety strap.'),
      item('TQ-014','Documented the time of tourniquet application on the windlass safety strap (or the casualty’s forehead), completing the process within 3 minutes.',true),
      item('TQ-015','Documented all findings and treatments on a DD Form 1380 TCCC Casualty Card and attached it to the casualty.',true)
    ]}],
    timers:[
      {id:'TQ-1MIN',label:'Tourniquet steps 1–7',section:'TQ',linkedItemId:'TQ-010',mode:'max',seconds:60,standard:'≤ 1:00',gradingClock:'wall',pausePolicy:'admin-only',continuousRequired:true,provenance:'source'},
      {id:'TQ-3MIN',label:'Tourniquet documentation completion',section:'TQ',linkedItemId:'TQ-014',mode:'max',seconds:180,standard:'≤ 3:00',gradingClock:'wall',pausePolicy:'admin-only',continuousRequired:true,provenance:'source'}
    ]
  },
  NPA:{
    id:'NPA',shortName:'NPA',name:'Nasopharyngeal Airway Insertion',
    source:'TCCC-CMC-12-01 · 23 SEP 21 · Module 7 · page 4',
    instructions:'Study-targeted individual skill. Source wording and critical-task flags are locked to the approved checklist.',
    sections:[{code:'NPA',title:'Nasopharyngeal Airway (NPA) Insertion',items:[
      item('NPA-001','Considered body substance isolation.'),
      item('NPA-002','Placed the casualty supine with their head in a neutral position.'),
      item('NPA-003','Inspected the nose and nasal passages for any obstructions that would prevent insertion of an NPA.',true),
      item('NPA-004','Opened the NPA package provided in the casualty’s Joint First Aid Kit (JFAK).'),
      item('NPA-005','Lubricated the end of the NPA device with the sterile water-based lubricating jelly found in the JFAK, with water, or with the casualty’s saliva.',true),
      item('NPA-006','Exposed the opening of the casualty’s right nostril by gently pushing the tip of the nose upward.',true),
      item('NPA-007','Positioned the tube so that the bevel of the device faced toward the septum.',true),
      item('NPA-008','Inserted the NPA device into the right nostril (at a 90-degree angle to the casualty’s face) with the beveled tip pointed toward the middle of the nose.',true),
      item('NPA-009','Advanced the NPA until the flange was flush with the nostril using a fluid movement pushing toward the ground and not toward the top of the head.',true),
      item('NPA-010','If insertion was unsuccessful, pulled the NPA completely out and inserted it in the left nostril, rotating the NPA after it was approximately 2 inches into the casualty’s nose to maintain the downward orientation of the NPA curve.'),
      item('NPA-011','Reassessed breathing and respiration by using the look, listen, and feel technique to assess for air movement after the NPA was inserted.'),
      item('NPA-012','Positioned the casualty: awake casualty in a sitting or recovery position; unconscious casualty in the recovery position to prevent aspiration of blood, mucus, or vomit.'),
      item('NPA-013','Documented all findings and treatments on a DD Form 1380 TCCC Casualty Card and attached it to the casualty.',true)
    ]}],timers:[]
  },
  NDC:{
    id:'NDC',shortName:'NDC',name:'Needle Decompression of the Chest',
    source:'TCCC-CMC-12-01 · 16 NOV 20 · Module 8 · pages 3–4',
    instructions:'Study-targeted individual skill. Source wording and critical-task flags are locked to the approved checklist.',
    sections:[{code:'NDC',title:'Needle Decompression of the Chest (NDC)',items:[
      item('NDC-001','Considered body substance isolation.'),
      item('NDC-002','Assessed the casualty for signs of suspected tension pneumothorax.'),
      item('NDC-003','Burped or removed a previously applied vented chest seal (if improperly applied, replaced the vented chest seal) and reassessed the casualty.',true),
      item('NDC-004','Identified site placement for needle insertion on the side of the injury: fifth intercostal space in the anterior axillary line OR second intercostal space at the midclavicular line.',true),
      item('NDC-005','Secured a 14-gauge or a 10-gauge, 3.25 in needle/catheter unit.',true),
      item('NDC-006','If available, used an antiseptic solution or a pad to clean the site.',true),
      item('NDC-007','Inserted the needle/catheter just over the top of the lower rib at the insertion site, at a 90-degree angle (perpendicular) to the chest wall, advancing it to the hub.',true),
      item('NDC-008','Held the needle/catheter unit in place for 5–10 seconds to allow decompression to occur; then removed the needle, leaving the catheter in place.',true),
      item('NDC-009','Assessed for successful NDC by looking for respiratory distress improvement, obvious hissing as air escaped, or hemoglobin oxygen saturation increased to 90% or greater.',true),
      item('NDC-010','Performed a second NDC on the same side of the chest at whichever of the two recommended sites was not previously used, if the first NDC failed to improve the casualty’s signs/symptoms.',true),
      item('NDC-011','Placed the casualty in a position of comfort or recovery position with the injured side down.'),
      item('NDC-012','Continued reassessing the casualty for reoccurrence of progressive respiratory distress.',true),
      item('NDC-013','If the initial NDC was successful, but symptoms recurred, then performed another NDC at the same site that was previously used with a new 14-gauge or a 10-gauge, 3.25 in needle/catheter unit.',true),
      item('NDC-014','If the second NDC was also not successful, continued onto the Circulation section of the Massive bleeding, Airway, Respiration, Circulation, Hypothermia/Head injury sequence.',true),
      item('NDC-015','Documented all findings and treatments on a DD Form 1380 TCCC Casualty Card and attached it to the casualty.',true)
    ]}],
    timers:[{id:'NDC-HOLD',label:'NDC catheter hold',section:'NDC',linkedItemId:'NDC-008',mode:'range',minSeconds:5,maxSeconds:10,standard:'5–10 seconds',gradingClock:'continuous',pausePolicy:'admin-only',continuousRequired:true,provenance:'source'}]
  },
  BLOOD:{
    id:'BLOOD',shortName:'BLOOD',name:'Administration of Blood Products',
    source:'TCCC-CMC-12-01 · 26 MAY 21 · Module 11 · pages 6–7',
    instructions:'Study-targeted individual skill. Source wording and critical-task flags are locked to the approved checklist.',
    sections:[{code:'BLOOD',title:'Administration of Blood Products',items:[
      item('BLOOD-001','Considered body substance isolation.'),
      item('BLOOD-002','Ensured external hemorrhage was controlled, an IV or IO line was in place and functioning properly, and tranexamic acid had been administered before blood products were administered.',true),
      item('BLOOD-003','Began hypothermia prevention and treatment measures if not already initiated.'),
      item('BLOOD-004','Selected blood products in the preferred order of precedence based on availability: cold-stored low-titer type O whole blood; prescreened low-titer type O fresh whole blood; plasma, RBCs, and platelets in a 1:1:1 ratio; plasma and RBCs in a 1:1 ratio; or reconstituted dried plasma, liquid plasma, or thawed plasma and/or RBCs alone.',true),
      item('BLOOD-005','Secured blood products and blood administration set, ensured blood tubing had a filter, and used an IV fluid warmer at 38°C (100.4°F) if cold-stored whole blood was used.'),
      item('BLOOD-006','Closed off tubing with all clamps.'),
      item('BLOOD-007','Peeled back port opening on the blood product bag and exposed the port.'),
      item('BLOOD-008','Removed the cap from the spike of IV tubing and inserted it into the blood product bag; pushed the spike into the hub.',true),
      item('BLOOD-009','Turned the blood product bag right side up, released clamp(s), and observed blood flow through the line.'),
      item('BLOOD-010','Squeezed drip chamber/filter and ensured it was filled halfway.'),
      item('BLOOD-011','Hung blood bag above the casualty; if Y tubing was used, ensured the line not attached to blood remained clamped off.'),
      item('BLOOD-012','Released the distal clamp, allowed blood flow to the end of the IV line, and clamped the line shut.'),
      item('BLOOD-013','If a blood product warmer was used, connected the IV tubing in accordance with manufacturer’s guidelines.',true),
      item('BLOOD-014','Cleaned the IV or IO port with alcohol or povidone-iodine pad.'),
      item('BLOOD-015','Secured the Luer adapter of the IV blood line into the IV or IO port if a Luer lock set was used, or placed a 16-gauge needle on the end of the IV tubing and inserted into the saline lock if a standard saline lock set was used.',true),
      item('BLOOD-016','Released all clamps on the blood products line and began transfusion.',true),
      item('BLOOD-017','Secured IV tubing to the casualty.'),
      item('BLOOD-018','Assessed for and treated blood transfusion reactions (anaphylactic or acute hemolytic reaction).',true),
      item('BLOOD-019','Stopped the blood infusion and treated according to the symptoms and suspected type of reaction if the casualty appeared to be having a blood transfusion associated reaction.',true),
      item('BLOOD-020','Administered 30 ml of 10% calcium gluconate or 10 ml of 10% calcium chloride IV/IO after the first unit of blood product.',true),
      item('BLOOD-021','Continuously monitored patient throughout administration of blood products.'),
      item('BLOOD-022','Administered another unit of blood product if the post-transfusion systolic blood pressure was less than 100 mmHg and heart rate was greater than 100 bpm.',true),
      item('BLOOD-023','Continued to monitor the casualty for blood transfusion reactions if another unit of blood product was given.'),
      item('BLOOD-024','If infusing through a saline lock, flushed with 10 ml of an appropriate fluid.'),
      item('BLOOD-025','Discontinued blood product(s) and properly disposed of used equipment.'),
      item('BLOOD-026','Documented all findings and treatments on a DD Form 1380 TCCC Casualty Card and attached it to the casualty.',true)
    ]}],timers:[]
  }
};

export function countAssessment(a){
  const items=(a.sections||[]).flatMap(s=>s.items||[]);
  return {criteria:items.length,critical:items.filter(i=>i.critical).length,timers:(a.timers||[]).length};
}
