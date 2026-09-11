import {targetedAssessments} from '../targeted-assessments.mjs';

const RATING_SET=[
  {key:'pass',label:'PASS'},{key:'fail',label:'FAIL'},{key:'nt',label:'NT'},{key:'no',label:'N/O'}
];

function need(s,n,label=n){if(!s.includes(n))throw new Error(`Patch anchor not found: ${label}`);}
function once(s,n,r,label=n){need(s,n,label);return s.replace(n,r);}
function between(s,a,b,r){const i=s.indexOf(a),j=s.indexOf(b,i+a.length);if(i<0||j<0)throw new Error(`Patch range not found: ${a} ... ${b}`);return s.slice(0,i)+r+s.slice(j);}
function regexOnce(s,re,r,label=String(re)){if(!re.test(s))throw new Error(`Patch regex not found: ${label}`);return s.replace(re,r);}

export function makeStudyTiers(upstreamTiers){
  const base=upstreamTiers?.['3'];
  if(!base)throw new Error('Pinned upstream Tier 3 / CMC object was not found.');
  const cmc=structuredClone(base);
  cmc.id='CMC';cmc.shortName='CMC';cmc.name='Combat Medic / Corpsman';cmc.subtitle='Tactical Trauma Assessment — Abbreviated';cmc.studyModule=true;cmc.studySourceLock='Pinned upstream Tier 3';
  const out={CMC:cmc};
  for(const [key,raw] of Object.entries(targetedAssessments)){
    const v=structuredClone(raw);v.ratings=structuredClone(RATING_SET);v.passRule='75_percent_no_failed_critical_no_unresolved_no_required_timer_met';v.proficiencyLabel='Demonstrated Study Skill Proficiency';v.attempts=['1st','2nd'];v.instantEvents=[];v.sourceItemCount=v.sections.flatMap(x=>x.items).length;v.dafItemCount=0;v.studyModule=true;out[key]=v;
  }
  return out;
}

export function studyConfigScript(config){return `window.FIELDREADY_STUDY=${JSON.stringify(config,null,2)};\n`;}
export function renderStudyTiers(tiers){return `window.TCCC_TIERS=${JSON.stringify(tiers,null,2)};\n`;}
export function patchVersion(){return "window.TCCC_BUILD={versionName:'3.0.0-research',versionCode:30000,buildLabel:'FieldReady Competency Study — research locked'};\n";}

const failureRatingBlock=String.raw`const NT_REASONS=[STUDY.ntReason||['scenario-not-elicited','Approved scenario did not elicit this noncritical criterion']];
function applyRating(itemId,rating,method='explicit',ntReason=null,failureDetail=null){
  const st=evalState(),i=itemById(itemId);if(!st||!i||st.finalizedAt)return;
  st.ratings[itemId]=rating;st.methods[itemId]=method;st.stamps[itemId]=now();
  st.ntReasons=st.ntReasons||{};st.failureDetails=st.failureDetails||{};
  if(rating==='nt'&&ntReason)st.ntReasons[itemId]={...ntReason,at:st.stamps[itemId]};else if(rating!=='nt')delete st.ntReasons[itemId];
  if(rating==='fail'&&failureDetail)st.failureDetails[itemId]=failureDetail;else if(rating!=='fail')delete st.failureDetails[itemId];
  const fd=st.failureDetails[itemId];
  event(i.id+' → '+rating.toUpperCase(),(i.critical?'Critical':'Noncritical')+' · '+method+(ntReason?' · '+ntReason.label+(ntReason.detail?': '+ntReason.detail:''):'')+(rating==='fail'&&fd?' · '+fd.modeLabel+' · '+fd.contributorLabel:''));saveDb();renderEval();
}
function requestNtReason(itemId){
  const i=itemById(itemId);if(!i||i.critical){alert('Critical criteria cannot be NT. NT is restricted to noncritical criteria not elicited by the approved scenario.');return;}
  const [code,label]=NT_REASONS[0];
  $('formModalTitle').textContent='NT — '+i.id;
  $('formModalBody').innerHTML='<p class="helper noPad"><b>Allowed NT reason:</b> '+esc(label)+'. NT removes this noncritical criterion from the scoring denominator.</p><form id="ntReasonForm"><div class="formGrid"><label class="full"><span>Objective scenario note (optional)</span><textarea id="ntReasonDetail" rows="3" placeholder="Brief context if useful"></textarea></label></div><div class="formActions"><button class="action primary" type="submit">Apply NT</button></div></form>';
  $('ntReasonForm').onsubmit=e=>{e.preventDefault();const detail=$('ntReasonDetail').value.trim();closeModal('formModal');applyRating(itemId,'nt','explicit-nt',{code,label,detail});};openModal('formModal');
}
const FAILURE_MODES=STUDY.failureModes;
const FAILURE_CONTRIBUTORS=STUDY.failureContributors;
function requestFailureClassification(itemId,required=true){
  const i=itemById(itemId),st=evalState();if(!i||!st||st.finalizedAt)return;
  const prior=st.failureDetails?.[itemId]||{};
  $('formModalTitle').textContent='Failure Classification — '+i.id;
  const modeOptions=FAILURE_MODES.map(([v,l])=>'<option value="'+esc(v)+'" '+(prior.mode===v?'selected':'')+'>'+esc(l)+'</option>').join('');
  const contributorOptions=FAILURE_CONTRIBUTORS.map(([v,l])=>'<option value="'+esc(v)+'" '+(prior.contributor===v?'selected':'')+'>'+esc(l)+'</option>').join('');
  $('formModalBody').innerHTML='<p class="helper noPad">Every failed criterion requires exactly one <b>observed failure pattern</b> and one <b>evaluator-attributed primary contributor</b>. These fields support descriptive competency-gap analysis; they do not prove causation.</p><form id="failureReasonForm"><div class="formGrid"><label><span>Failure mode *</span><select id="failureMode" required><option value="">Select</option>'+modeOptions+'</select></label><label><span>Primary contributor *</span><select id="failureContributor" required><option value="">Select</option>'+contributorOptions+'</select></label><label class="full"><span>Objective evaluator comment</span><textarea id="failureComment" rows="3" placeholder="Required for Other / unclear; otherwise optional concise observable context">'+esc(prior.comment||'')+'</textarea></label></div><div class="formActions"><button class="action primary" type="submit">'+(st.ratings[itemId]==='fail'?'Save Classification':'Record FAIL')+'</button></div></form>';
  $('failureReasonForm').onsubmit=e=>{e.preventDefault();const mode=$('failureMode').value,contributor=$('failureContributor').value,comment=$('failureComment').value.trim();if(!mode||!contributor){alert('Every FAIL requires both a failure mode and a primary contributor.');return;}if(mode==='other-unclear'&&!comment){alert('Other / unclear requires a brief objective evaluator comment.');return;}const modeLabel=FAILURE_MODES.find(x=>x[0]===mode)?.[1]||'',contributorLabel=FAILURE_CONTRIBUTORS.find(x=>x[0]===contributor)?.[1]||'';const detail={mode,modeLabel,contributor,contributorLabel,comment,at:now()};closeModal('formModal');applyRating(itemId,'fail','explicit-fail-classified',null,detail);};openModal('formModal');
}
function setRating(itemId,rating,method='explicit'){
  const st=evalState(),i=itemById(itemId); if(!st||!i||st.finalizedAt)return;
  if(st.timerForced[itemId]&&rating!=='fail'){alert('A triggered timing standard was not met. This criterion must be graded FAIL unless the erroneous timer instance is voided with an audit reason.');return;}
  if(rating==='nt'&&timersForItem(itemId).some(d=>timerHasStarted(d.id))){alert('NT is unavailable because a linked timed intervention was initiated.');return;}
  if(rating==='nt')return requestNtReason(itemId);
  if(rating==='fail')return requestFailureClassification(itemId,true);
  applyRating(itemId,rating,method);
}
function failureClassificationMissing(i,st=evalState()){if(st?.ratings?.[i.id]!=='fail')return false;const d=st.failureDetails?.[i.id];return !d||!d.mode||!d.contributor||(d.mode==='other-unclear'&&!String(d.comment||'').trim());}
`;

const timerForcedBlock=String.raw`function recalcTimerForced(itemId){
  if(!itemId)return;const st=evalState();const fail=timersForItem(itemId).some(d=>timerAggregateStatus(d)==='notmet');
  if(fail){st.timerForced[itemId]=true;st.ratings[itemId]='fail';st.methods[itemId]='timer';st.stamps[itemId]=now();st.failureDetails=st.failureDetails||{};const prior=st.failureDetails[itemId]||{};st.failureDetails[itemId]={mode:'timing-sequence',modeLabel:'Timing / sequence',contributor:prior.contributor||'',contributorLabel:prior.contributorLabel||'',comment:prior.comment||'Timer standard not met',at:st.stamps[itemId]};}
  else delete st.timerForced[itemId];
}
`;

const proficiencyBlock=String.raw`function proficiency(t=tier(),st=evalState()){
  const items=t.sections.flatMap(s=>s.items),score=scoreStats(t,st);
  const criticalFail=items.filter(i=>i.critical&&st.ratings[i.id]==='fail');
  const classificationMissing=items.filter(i=>st.ratings[i.id]==='fail'&&failureClassificationMissing(i,st));
  const criticalUnresolved=items.filter(i=>i.critical&&(!st.ratings[i.id]||st.ratings[i.id]==='nt'||st.ratings[i.id]==='no'));
  const otherUnresolved=items.filter(i=>!i.critical&&(!st.ratings[i.id]||st.ratings[i.id]==='no'));
  const timerPassMissing=[];(t.timers||[]).filter(d=>d.linkedItemId).forEach(d=>{const r=st.ratings[d.linkedItemId],ts=timerAggregateStatus(d);if(r==='pass'&&ts!=='met')timerPassMissing.push(d);});
  const activeTimers=activeTimerDefs(t);const gd=(t.timers||[]).find(d=>d.section==='GLOBAL');const globalStatus=gd?timerAggregateStatus(gd):'met';
  const incomplete=criticalUnresolved.length||classificationMissing.length||otherUnresolved.length||timerPassMissing.length||activeTimers.length||(gd&&globalStatus==='incomplete')||(gd&&globalStatus==='live-met');
  let result='INCOMPLETE';if(!incomplete){if(criticalFail.length||globalStatus==='notmet'||score.percent<0.75)result='FAIL';else result='PASS';}
  return {result,score,criticalFail,classificationMissing,criticalUnresolved,otherUnresolved,timerPassMissing,activeTimers,globalStatus};
}
`;

const normalizeFailureFn=String.raw`function normalizeFailureDetail(d){
  if(!d||typeof d!=='object')return {};
  const modeMap={omitted:'not-performed-incomplete',incomplete:'not-performed-incomplete','incorrect-technique':'incorrect-technique',delayed:'timing-sequence','wrong-sequence':'timing-sequence',timing:'timing-sequence',unsafe:'unsafe-action',other:'other-unclear'};
  const contributorMap={knowledge:'knowledge-cue','cue-recognition':'knowledge-cue',judgment:'judgment-prioritization',prioritization:'judgment-prioritization',psychomotor:'psychomotor-execution',communication:'communication-teamwork',equipment:'system-context',stress:'system-context',scenario:'system-context',training:'system-context',other:'system-context'};
  const modes=STUDY.failureModes||[],contributors=STUDY.failureContributors||[];
  const mode=modeMap[d.mode]||(modes.some(x=>x[0]===d.mode)?d.mode:'');const contributor=contributorMap[d.contributor]||(contributors.some(x=>x[0]===d.contributor)?d.contributor:'');const evaluatorLegacy=d.contributor==='evaluator';
  return {mode:mode||'',modeLabel:modes.find(x=>x[0]===mode)?.[1]||'',contributor:evaluatorLegacy?'':(contributor||''),contributorLabel:evaluatorLegacy?'':(contributors.find(x=>x[0]===contributor)?.[1]||''),comment:String(d.comment||d.contributingFactor||'').trim(),at:d.at||null,migrationNeedsReview:!mode||!contributor||evaluatorLegacy};
}
`;

const addParticipantBlock=String.raw`function addStudentForm(){
  if(isClassClosed()){alert('Closed encounters are permanently locked.');return;}
  $('formModalTitle').textContent='Add Study Participant';
  const armOptions=(STUDY.studyArms||[]).map(([v,l])=>'<option value="'+esc(v)+'">'+esc(l)+'</option>').join('');
  $('formModalBody').innerHTML='<form id="studentForm"><div class="formGrid"><label><span>Participant ID *</span><input name="trainingId" required autocomplete="off"></label><label><span>Study arm *</span><select name="studyArm" required><option value="">Select</option>'+armOptions+'</select></label><label><span>Clinical years experience</span><input name="clinicalYears" type="number" min="0" step="0.1"></label><label><span>AFSC</span><input name="afsc" placeholder="e.g., 46N3"></label><label><span>Current work section / clinical area</span><input name="workSection"></label><label><span>Deployments</span><input name="deployments" type="number" min="0" step="1"></label><label class="full"><span>Prior TCCC exposure</span><input name="priorTcccExposure" placeholder="Optional coded/brief description"></label></div><p class="helper">Use a privacy-safe Participant ID. Do not enter SSN, DoD ID, PHI, CUI, or patient information.</p><div class="formActions"><button class="action primary" type="submit">Add Participant</button></div></form>';
  $('studentForm').onsubmit=e=>{e.preventDefault();const f=new FormData(e.currentTarget),c=cls(),pid=String(f.get('trainingId')||'').trim();if(!pid)return;c.students.push({id:uuid(),name:pid,rank:'',trainingId:pid,studyArm:String(f.get('studyArm')||''),clinicalYears:String(f.get('clinicalYears')||''),afsc:String(f.get('afsc')||'').trim(),workSection:String(f.get('workSection')||'').trim(),deployments:String(f.get('deployments')||''),priorTcccExposure:String(f.get('priorTcccExposure')||'').trim(),attempts:{}});saveDb();closeModal('formModal');renderClass();};openModal('formModal');
}
`;

const studyExportBlock=String.raw`async function exportStudyDatasetCsv(){
  const c=cls(),t=tier(),lv=classLocationExportValues(c);const rows=[['participant_id','study_arm','timepoint','clinical_years','afsc','work_section','deployments','prior_tccc_exposure','encounter_id','encounter_label','cohort_roster','module','module_source','scenario','scenario_version','evaluator_id','attempt','final_result','finalized_at','criterion_id','section','critical','grade','grading_method','graded_at','failure_mode','failure_mode_label','primary_contributor','primary_contributor_label','failure_comment','nt_reason','nt_detail','timer_forced','app_version',...CLASS_LOCATION_HEADERS]];
  (c.students||[]).forEach(stu=>Object.values(stu.attempts||{}).filter(Boolean).forEach(a=>t.sections.forEach(sec=>sec.items.forEach(i=>{const fd=a.failureDetails?.[i.id]||{},nr=a.ntReasons?.[i.id]||{};rows.push([stu.trainingId||stu.name,stu.studyArm||a.studyArm||'',c.timepoint||a.timepoint||'',stu.clinicalYears??a.clinicalYears??'',stu.afsc||a.afsc||'',stu.workSection||a.workSection||'',stu.deployments??a.deployments??'',stu.priorTcccExposure||a.priorTcccExposure||'',c.id,c.name,c.roster||'',t.id,t.source,c.scenario||'',c.scenarioVersion||'',a.evaluatorId||c.evaluatorId||c.leadEvaluator||'',a.attemptNo,a.finalResult||'',iso(a.finalizedAt),i.id,sec.code,i.critical?'YES':'NO',a.ratings?.[i.id]||'',a.methods?.[i.id]||'',iso(a.stamps?.[i.id]),fd.mode||'',fd.modeLabel||'',fd.contributor||'',fd.contributorLabel||'',fd.comment||'',nr.code||'',nr.detail||'',a.timerForced?.[i.id]?'YES':'NO',a.appVersion||APP_VERSION,...lv]);}))));
  await saveFile('FieldReady_'+safe(c.name)+'_Study_Dataset.csv',bytes(csv(rows)),'text/csv');
}
`;

export function patchApp(src,config){
  let s=src;
  s=once(s,"const TIERS = window.TCCC_TIERS;","const TIERS = window.TCCC_TIERS;\nconst STUDY = window.FIELDREADY_STUDY || {};",'TIERS declaration');
  s=regexOnce(s,/const ANALYTICS_SCHEMA_VERSION = '[^']+';/,"const ANALYTICS_SCHEMA_VERSION = 'FIELDREADY_STUDY_ANALYTICS_3.0';",'analytics schema');
  s=regexOnce(s,/const DB_KEY = '[^']+';/,`const DB_KEY = '${config.dbKey}';`,'DB key');
  s=once(s,'function normalizeDb(x){',normalizeFailureFn+'function normalizeDb(x){','normalizeDb');
  s=s.replaceAll('x.schemaVersion=4;','x.schemaVersion=6;').replaceAll('schemaVersion:4,appVersion:APP_VERSION','schemaVersion:6,appVersion:APP_VERSION').replaceAll('db.schemaVersion=4;','db.schemaVersion=6;');
  s=once(s,"    c.courseType=c.courseType||'initial';","    c.courseType=c.courseType||'initial';\n    c.timepoint=c.timepoint||'baseline';",'class timepoint normalization');
  s=once(s,'      a.failureDetails=a.failureDetails||{};','      a.failureDetails=a.failureDetails||{};Object.keys(a.failureDetails).forEach(id=>a.failureDetails[id]=normalizeFailureDetail(a.failureDetails[id]));','failure migration');
  s=once(s,"    (c.students||[]).forEach(st=>Object.values(st.attempts||{}).filter(Boolean).forEach(a=>{","    (c.students||[]).forEach(st=>{st.studyArm=st.studyArm||'';st.clinicalYears=st.clinicalYears??'';st.afsc=st.afsc||'';st.workSection=st.workSection||'';st.deployments=st.deployments??'';st.priorTcccExposure=st.priorTcccExposure||'';Object.values(st.attempts||{}).filter(Boolean).forEach(a=>{",'student metadata normalization');
  s=once(s,'    }));\n    if(c.closedAt)c.status=', '    });});\n    if(c.closedAt)c.status=','student normalization close');
  s=once(s,"    curriculumId:c.curriculumId||`TCCC-TIER${c.tierId}`,contentVersion:c.contentVersion,scenarioVersion:c.scenarioVersion||'1',remediation:null","    curriculumId:c.curriculumId||`FIELDREADY-${c.tierId}`,contentVersion:c.contentVersion,scenarioVersion:c.scenarioVersion||'1',timepoint:c.timepoint||'baseline',studyArm:s.studyArm||'',participantId:s.trainingId||s.name||'',clinicalYears:s.clinicalYears??'',afsc:s.afsc||'',workSection:s.workSection||'',deployments:s.deployments??'',priorTcccExposure:s.priorTcccExposure||'',remediation:null",'attempt metadata');
  s=s.replace(/curriculumId:`TCCC-TIER\$\{data\.tierId\}`/g,"curriculumId:`FIELDREADY-${data.tierId}`");
  s=once(s,"scenarioProfile:String(data.scenarioProfile||'').trim(),leadEvaluator:","scenarioProfile:String(data.scenarioProfile||'').trim(),timepoint:String(data.timepoint||'baseline'),leadEvaluator:",'create class timepoint');

  // Encounter form: module + timepoint.
  s=once(s,"const tOpts=Object.values(TIERS).map(t=>`<option value=\"${t.id}\" ${(existing?.tierId||'1')===t.id?'selected':''}>Tier ${t.id} — ${esc(t.name)}</option>`).join('');","const tOpts=Object.values(TIERS).map(t=>`<option value=\"${t.id}\" ${(existing?.tierId||'CMC')===t.id?'selected':''}>${esc(t.shortName)} — ${esc(t.name)}</option>`).join('');",'module options');
  s=s.replace("$('formModalTitle').textContent=existing?'Edit Class':'New TCCC Class';","$('formModalTitle').textContent=existing?'Edit Study Encounter':'New Study Encounter';");
  s=s.replace('<label><span>Class name *</span>','<label><span>Encounter / cohort label *</span>').replace('<label><span>Tier *</span>','<label><span>Assessment module *</span>');
  s=s.replace('<label><span>Roster / course #</span><input name="roster" value="${esc(existing?.roster||\'\')}"></label><label><span>Course type</span><select name="courseType">${courseOpts}</select></label>', '<label><span>Cohort / roster #</span><input name="roster" value="${esc(existing?.roster||\'\')}"></label><label><span>Study timepoint *</span><select name="timepoint" required>${(STUDY.timepoints||[]).map(([v,l])=>`<option value="${v}" ${(existing?.timepoint||\'baseline\')===v?\'selected\':\'\'}>${esc(l)}</option>`).join(\'\')}</select></label>');
  s=s.replace("['name','roster','date','scenario','scenarioVersion','siteCode','courseType','scenarioDifficulty','scenarioProfile','leadEvaluator','evaluatorId']","['name','roster','date','scenario','scenarioVersion','siteCode','courseType','timepoint','scenarioDifficulty','scenarioProfile','leadEvaluator','evaluatorId']");

  s=between(s,'function addStudentForm(){','function scenarioForm(){',addParticipantBlock);
  s=between(s,'const NT_REASONS=[','function reviewRemainingItems(items){',failureRatingBlock);
  s=s.replaceAll('criticalFailureCauseMissing','failureClassificationMissing');
  s=s.replace("!(i.critical&&st.ratings[i.id]==='fail'&&failureClassificationMissing(i,st))","!(st.ratings[i.id]==='fail'&&failureClassificationMissing(i,st))");

  // Failure card text.
  s=regexOnce(s,/const failSummary=r==='fail'\?[\s\S]*?;\n  const noteOpen=/,String.raw`const failSummary=r==='fail'?'<div class="failureSummary '+(failureClassificationMissing(item,st)?'unclassified':'')+'"><span>'+esc(fd?.modeLabel||'Classification required')+'</span>'+(fd?.contributorLabel?'<b>'+esc(fd.contributorLabel)+'</b>':'')+'<button class="ghost small" data-failure="'+item.id+'">'+(failureClassificationMissing(item,st)?'Classify FAIL':'Edit Classification')+'</button></div>':'';
  const noteOpen=`,'failure summary');

  s=between(s,'function recalcTimerForced(itemId){','function timerAction(id,act){',timerForcedBlock);
  s=between(s,'function proficiency(t=tier(),st=evalState()){','function renderKpis(){',proficiencyBlock);
  s=between(s,'function renderKpis(){','function renderTimeline(){',String.raw`function renderKpis(){
  const st=evalState();if(!st)return;const p=proficiency();$('elapsedTop').textContent=fmt(sessionElapsed(st));$('criticalTop').textContent=p.criticalFail.length;$('gradedTop').textContent=p.score.percentText;$('unresolvedTop').textContent=p.criticalUnresolved.length+p.classificationMissing.length+p.otherUnresolved.length+p.timerPassMissing.length+p.activeTimers.length;
}
`);
  s=s.replaceAll('p.criticalCauseMissing','p.classificationMissing').replaceAll('Critical failure classifications missing:','Failure classifications missing:');
  s=s.replaceAll('${d.contributingFactor?` | Factor: ${d.contributingFactor}`:\'\'}','');

  // Visible descriptive, not causal, language.
  s=s.replaceAll("d?.contributorLabel||d?.contributor||'Unclassified'","d?.contributorLabel||d?.contributor||'Missing classification'")
    .replaceAll("d?.modeLabel||d?.mode||'Unclassified'","d?.modeLabel||d?.mode||'Missing classification'")
    .replaceAll('Classified root cause:','Classification complete:')
    .replaceAll('No root-cause classifications yet.','No failure classifications yet.')
    .replaceAll('Top RCA','Top contributor')
    .replaceAll('failed observations missing RCA','failed observations missing classification')
    .replaceAll('Location and RCA completeness','Location and classification completeness')
    .replaceAll("['ROOT_CAUSE'","['PRIMARY_CONTRIBUTOR'")
    .replaceAll("'root_cause'","'primary_contributor'")
    .replaceAll("'root_cause_count'","'primary_contributor_count'")
    .replaceAll("'root_cause_percent'","'primary_contributor_percent'");

  // Module naming instead of tier naming.
  s=s.replaceAll('Tier / criterion','Module / criterion').replaceAll('<b>T${esc(g.tierId)} · ${esc(g.itemId)}</b>','<b>${esc(g.tierId)} · ${esc(g.itemId)}</b>');
  s=s.replace("$('tierTitle').textContent=`Tier ${t.id} — ${t.shortName}`;","$('tierTitle').textContent=`${t.shortName} — ${t.name}`;");
  s=s.replaceAll('${c.name} | Tier ${t.id} ${t.shortName} | ${t.source}','${c.name} | ${t.shortName} | ${t.source}');

  // Research dataset export.
  s=once(s,'async function backupClass(){',studyExportBlock+'async function backupClass(){','study CSV export');
  s=once(s,"$('classPdfBtn').onclick=exportClassPdf;","if($('studyDatasetCsvBtn'))$('studyDatasetCsvBtn').onclick=exportStudyDatasetCsv;$('classPdfBtn').onclick=exportClassPdf;",'study CSV binding');

  s=s.replaceAll('TCCC EVALUATION REVIEW','FIELDREADY STUDY EVALUATION REVIEW').replaceAll('TCCC Evaluation Suite v${APP_VERSION}','FieldReady Competency Study v${APP_VERSION}');
  return s;
}

export function patchIndex(src){
  let s=src;
  s=s.replaceAll('<title>TCCC Evaluation Suite</title>','<title>FieldReady Competency Study</title>')
    .replaceAll('Welcome to TCCC Evaluation Suite','Welcome to FieldReady Competency Study')
    .replaceAll('DAF TCCC TRAINING &amp; EVALUATION','FIELDREADY · TCCC COMPETENCY STUDY')
    .replaceAll('Training Gaps &amp; Root Causes','Observed Failure Patterns &amp; Contributors')
    .replaceAll('Primary Root Causes','Evaluator-Attributed Primary Contributors')
    .replaceAll('+ Add Student','+ Add Participant')
    .replaceAll('Search student, rank, or training ID','Search Participant ID')
    .replaceAll('Class Export','Study Encounter Export')
    .replaceAll('Course completion','Research dataset &amp; audit outputs')
    .replaceAll('Class / Scenario','Study Encounter / Scenario')
    .replaceAll('Class Performance Intelligence','Study Performance Intelligence')
    .replaceAll('Create class &amp; scenario','Create encounter &amp; scenario')
    .replaceAll('Load/import roster','Load participants')
    .replaceAll('Grade student attempt','Grade participant attempt')
    .replaceAll('Export class PDF/CSV','Export study data');
  s=once(s,'<button id="classPdfBtn" class="action primary">Visual Class Summary PDF</button>','<button id="studyDatasetCsvBtn" class="action primary">Study Dataset CSV</button>\n        <button id="classPdfBtn" class="action">Visual Encounter Summary PDF</button>','study export button');
  s=s.replaceAll('2.21.0-web.1','3.0.0-research');
  need(s,'<script src="tiers.js','tiers script');
  s=s.replace(/<script src="tiers\.js([^>]*)><\/script>/,'<script src="tiers.js$1></script>\n<script src="study-config.js?v=3.0.0-research"></script>');
  return s;
}

export function patchManifest(src){
  try{const x=JSON.parse(src);x.name='FieldReady Competency Study';x.short_name='FieldReady';x.description='Source-locked longitudinal TCCC competency study evaluator.';return JSON.stringify(x,null,2)+'\n';}catch{return src;}
}
