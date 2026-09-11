(() => {
  const CFG = window.FIELDREADY_CONFIG;
  const ASSESS = window.FIELDREADY_ASSESSMENTS;
  const KEY = "fieldready_research_records_v030";
  const ACK = "fieldready_research_ack";
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  const app = $("#app");
  let db = load();
  let view = "dashboard";
  let activeId = null;
  let ticker = null;

  function load(){ try { return JSON.parse(localStorage.getItem(KEY)) || { records: [], calibrations: [] }; } catch { return { records: [], calibrations: [] }; } }
  function save(){ localStorage.setItem(KEY, JSON.stringify(db)); }
  function uid(prefix="rec"){ return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2,8)}`; }
  function now(){ return new Date().toISOString(); }
  function fmt(s){ return s ? new Date(s).toLocaleString() : "—"; }
  function assessment(id){ return ASSESS[id || "cmc_tta"]; }
  function allItems(a){ return a.sections.flatMap(sec => sec.items.map(item => ({...item, section: sec.code, sectionTitle: sec.title}))); }
  function active(){ return db.records.find(r => r.id === activeId); }
  function byId(id){ return document.getElementById(id); }
  function esc(s=""){ return String(s).replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;","\"":"&quot;"}[c])); }
  function toast(msg){ const el=document.createElement("div"); el.className="toast"; el.textContent=msg; document.body.appendChild(el); setTimeout(()=>el.remove(),3200); }

  document.addEventListener("click", e => {
    const nav = e.target.closest("[data-nav]");
    if(nav){ view = nav.dataset.nav; activeId = null; render(); }
  });

  function boot(){
    if(!sessionStorage.getItem(ACK)) return renderSplash();
    render();
  }
  function renderSplash(){
    app.innerHTML = $("#splash-template").innerHTML;
    const ack = $("#ack"), enter = $("#enterApp");
    ack.addEventListener("change", () => enter.disabled = !ack.checked);
    enter.addEventListener("click", () => { sessionStorage.setItem(ACK,"1"); render(); });
  }
  function render(){
    clearInterval(ticker); ticker = null;
    if(view === "new") return renderNew();
    if(view === "calibration") return renderCalibration();
    if(view === "exports") return renderExports();
    if(view === "about") return renderAbout();
    if(activeId) return renderEncounter();
    renderDashboard();
  }

  function renderDashboard(){
    const records = db.records.slice().sort((a,b)=> (b.createdAt||"").localeCompare(a.createdAt||""));
    const finalized = records.filter(r=>r.status === "finalized");
    const total = finalized.length;
    const fail = finalized.filter(r=>score(r).overall === "FAIL").length;
    const missing = records.reduce((n,r)=>n+validation(r).errors.length,0);
    app.innerHTML = `
      <section class="grid two">
        <div class="card">
          <p class="eyebrow">Study dashboard</p>
          <h1>Research-ready execution, not generic training management.</h1>
          <p class="muted">Build: ${CFG.buildId}. Records stay local until exported into approved study storage.</p>
          <div class="scorebar">
            <div class="scoretile"><b>${records.length}</b><span>records</span></div>
            <div class="scoretile"><b>${total}</b><span>finalized</span></div>
            <div class="scoretile"><b>${fail}</b><span>overall fail</span></div>
            <div class="scoretile"><b>${missing}</b><span>open blockers</span></div>
            <div class="scoretile"><b>${new Set(finalized.map(r=>r.participantId)).size}</b><span>participants</span></div>
          </div>
          <div class="toolbar"><button class="primary" data-nav="new">New Encounter</button><button id="demo">Load Demo Set</button><button class="danger" id="reset">Reset Local Data</button></div>
        </div>
        <div class="card">
          <h2>Final-stage correction logic</h2>
          <div class="diagram">
            <div class="step"><b>1</b>Source-locked checklist</div>
            <div class="step"><b>2</b>Participant/timepoint metadata</div>
            <div class="step"><b>3</b>Criterion + timer scoring</div>
            <div class="step"><b>4</b>5×5 failure pattern capture</div>
            <div class="step"><b>5</b>Locked export + audit trail</div>
          </div>
        </div>
      </section>
      <section class="card">
        <h2>Encounters</h2>
        ${records.length ? tableRecords(records) : `<p class="muted">No encounters yet. Create a baseline, 3-month, or 6-month study encounter.</p>`}
      </section>
      <section class="grid two">
        <div class="card"><h3>Retention matrix</h3>${retentionTable(finalized)}</div>
        <div class="card"><h3>Observed failure patterns</h3>${failurePatterns(finalized)}</div>
      </section>`;
    $$("[data-open]").forEach(b=>b.onclick=()=>{activeId=b.dataset.open; renderEncounter();});
    $("#reset")?.addEventListener("click", () => { if(confirm("Delete all local study records on this device/browser?")){ db={records:[],calibrations:[]}; save(); render(); }});
    $("#demo")?.addEventListener("click", loadDemo);
  }

  function tableRecords(records){
    return `<table class="table"><thead><tr><th>Participant</th><th>Timepoint</th><th>Assessment</th><th>Status</th><th>Score</th><th>Created</th><th></th></tr></thead><tbody>${records.map(r=>{
      const s=score(r), a=assessment(r.assessmentId);
      return `<tr><td>${esc(r.participantId)}</td><td>${label(CFG.timepoints,r.timepoint)}</td><td>${a.label}</td><td>${r.status||"draft"}</td><td>${s.percent}% / ${s.overall}</td><td>${fmt(r.createdAt)}</td><td><button data-open="${r.id}">Open</button></td></tr>`;
    }).join("")}</tbody></table>`;
  }
  function label(list,id){ return (list.find(x=>x.id===id)||{}).label || id || "—"; }

  function retentionTable(records){
    const rows = CFG.studyArms.map(arm => {
      const cells = CFG.timepoints.map(tp => {
        const group = records.filter(r=>r.studyArm===arm.id && r.timepoint===tp.id);
        if(!group.length) return `<td>—</td>`;
        const avg = Math.round(group.reduce((a,r)=>a+score(r).percent,0)/group.length);
        return `<td><b>${avg}%</b><br><span class="muted small">n=${group.length}</span></td>`;
      }).join("");
      return `<tr><td>${arm.label}</td>${cells}</tr>`;
    }).join("");
    return `<table class="table"><thead><tr><th>Arm</th>${CFG.timepoints.map(t=>`<th>${t.label}</th>`).join("")}</tr></thead><tbody>${rows}</tbody></table><p class="footerNote">Use this only as local descriptive review. Primary analysis belongs in the locked research dataset.</p>`;
  }
  function failurePatterns(records){
    const counts = {};
    records.forEach(r => Object.values(r.ratings||{}).forEach(v => { if(v.rating === "fail" && v.failureMode) counts[v.failureMode]=(counts[v.failureMode]||0)+1; }));
    const total = Object.values(counts).reduce((a,b)=>a+b,0);
    if(!total) return `<p class="muted">No failed criteria classified yet.</p>`;
    return CFG.failureModes.map(f => `<div class="metric"><b>${counts[f.id]||0}</b><span>${f.label}</span></div>`).join("");
  }

  function renderNew(){
    app.innerHTML = `<section class="card"><p class="eyebrow">New research encounter</p><h1>Create source-locked measurement event</h1><div class="grid two">
      ${field("Participant ID","participantId","text","Use coded research ID only")}
      ${selectField("Timepoint","timepoint",CFG.timepoints)}
      ${selectField("Assessment","assessmentId",CFG.assessments.map(id=>({id,label:ASSESS[id].label})))}
      ${selectField("Study arm", "studyArm", CFG.studyArms)}
      ${field("Clinical years experience","clinicalYears","number","0")}
      ${field("AFSC","afsc","text","46N / 46F / etc.")}
      ${field("Current work section","workSection","text","ED, ICU, Med-Surg, AE, etc.")}
      ${field("Deployment count","deploymentCount","number","0")}
      ${selectField("Prior TCCC exposure","priorTcccExposure",[{id:"none",label:"None/unknown"},{id:"initial",label:"Initial only"},{id:"refresh",label:"Recent refresh"},{id:"instructor",label:"Instructor/cadre"}])}
      ${field("Evaluator ID","evaluatorId","text","Cadre code")}
      ${field("Scenario version","scenarioVersion","text","e.g., JBSA-HFS-01-v1")}
      ${field("Assessment ID","assessmentInstanceId","text","Unique encounter/run ID")}
      </div><div class="field"><label>Protocol notes / approved exceptions</label><textarea id="protocolNotes" rows="3"></textarea></div><div class="toolbar"><button class="primary" id="create">Create Encounter</button><button data-nav="dashboard">Cancel</button></div></section>`;
    $("#create").onclick = () => {
      const form = ["participantId","timepoint","assessmentId","studyArm","clinicalYears","afsc","workSection","deploymentCount","priorTcccExposure","evaluatorId","scenarioVersion","assessmentInstanceId","protocolNotes"].reduce((o,id)=>(o[id]=byId(id).value.trim(),o),{});
      if(!form.participantId || !form.timepoint || !form.assessmentId || !form.evaluatorId || !form.scenarioVersion){ toast("Participant ID, timepoint, assessment, evaluator, and scenario version are required."); return; }
      const a = assessment(form.assessmentId);
      const rec = { ...form, id: uid(), status:"draft", createdAt: now(), updatedAt: now(), appBuild: CFG.buildId, schemaVersion: CFG.schemaVersion, checklistVersion: a.version, ratings:{}, timers:{}, events:[{at:now(),type:"created"}], remediationLocked:true };
      allItems(a).forEach(item => rec.ratings[item.id] = { rating:"no" });
      db.records.push(rec); save(); activeId = rec.id; view="dashboard"; renderEncounter();
    };
  }
  function field(labelText,id,type="text",placeholder=""){ return `<div class="field"><label for="${id}">${labelText}</label><input id="${id}" type="${type}" placeholder="${placeholder}"></div>`; }
  function selectField(labelText,id,opts){ return `<div class="field"><label for="${id}">${labelText}</label><select id="${id}"><option value="">Select...</option>${opts.map(o=>`<option value="${o.id}">${o.label}</option>`).join("")}</select></div>`; }

  function renderEncounter(){
    const r=active(), a=assessment(r.assessmentId), s=score(r), v=validation(r), locked=r.status==="finalized";
    app.innerHTML = `<section class="card ${locked ? (s.overall==="PASS"?"lock":"failLock") : ""}">
      <div class="toolbar"><button data-nav="dashboard">← Dashboard</button><span class="pill">${a.label}</span><span class="pill">${label(CFG.timepoints,r.timepoint)}</span><span class="pill">Build ${r.appBuild}</span><span class="pill">Scenario ${esc(r.scenarioVersion)}</span></div>
      <h1>${esc(r.participantId)} — ${locked ? "Finalized" : "Draft measurement"}</h1>
      <p class="muted">Study arm is stored for analysis but should not influence evaluator scoring. Formal measurement must remain separate from any remediation/coaching.</p>
      <div class="scorebar"><div class="scoretile"><b>${s.percent}%</b><span>score</span></div><div class="scoretile"><b>${s.pass}</b><span>pass</span></div><div class="scoretile"><b>${s.fail}</b><span>fail</span></div><div class="scoretile"><b>${s.criticalFail}</b><span>critical fail</span></div><div class="scoretile"><b>${v.errors.length}</b><span>blockers</span></div></div>
      ${v.errors.length ? `<div class="card"><h3>Finalization blockers</h3><ul>${v.errors.map(e=>`<li>${esc(e)}</li>`).join("")}</ul></div>` : `<p><span class="pill green">Ready for review/finalization</span></p>`}
      <div class="toolbar"><button id="nextUnresolved">Next unresolved</button><button id="exportJson">Export JSON</button><button id="exportCsv">Export CSV</button><button id="finalize" class="primary" ${locked||v.errors.length?"disabled":""}>Finalize / Lock</button><button id="void" class="danger" ${locked?"disabled":""}>Void draft</button></div>
    </section>
    ${timerPanel(r,a,locked)}
    <section>${a.sections.map(sec=>sectionHtml(r,sec,locked)).join("")}</section>`;
    wireEncounter(r,a,locked);
  }

  function timerPanel(r,a,locked){
    if(!a.timers?.length) return "";
    return `<section class="card"><h2>Timers</h2>${a.timers.map(t=>{
      const state=r.timers[t.id]||{}; const elapsed=state.elapsed||0; const running=!!state.startedAt;
      return `<div class="timer"><div><b>${t.label}</b><br><span class="muted small">${t.standard} · ${t.section}${t.requiredForPass?" · required":""}</span></div><div class="time" id="time_${t.id}">${clock(elapsed + (running?Date.now()-state.startedAt:0))}</div><div class="toolbar"><button data-timer-start="${t.id}" ${locked||running?"disabled":""}>Start</button><button data-timer-stop="${t.id}" ${locked||!running?"disabled":""}>Stop</button><button data-timer-reset="${t.id}" ${locked?"disabled":""}>Reset</button></div></div>`;
    }).join("")}</section>`;
  }
  function sectionHtml(r,sec,locked){
    return `<div class="section-title"><h2>${sec.code} — ${sec.title}</h2></div>${sec.items.map(item=>itemHtml(r,item,locked)).join("")}`;
  }
  function itemHtml(r,item,locked){
    const val = r.ratings[item.id] || {rating:"no"}; const fail = val.rating === "fail";
    return `<article class="item" id="item_${item.id}"><div class="item-head"><div><b>${item.id}</b> ${item.critical?`<span class="crit">CRITICAL</span>`:""}<p>${esc(item.text)}</p></div><span class="pill ${val.rating==='pass'?'green':val.rating==='fail'?'red':val.rating==='nt'?'yellow':''}">${(val.rating||"no").toUpperCase()}</span></div>
      <div class="rating">
        ${["pass","fail","nt","no"].map(k=>`<button class="${k} ${val.rating===k?'selected':''}" data-rate="${item.id}:${k}" ${locked || (k==='nt'&&item.critical)?"disabled":""}>${k.toUpperCase()}</button>`).join("")}
      </div>
      <div class="classify ${fail?'visible':''}">
        <div class="field"><label>Failure mode</label><select data-failure-mode="${item.id}" ${locked?"disabled":""}><option value="">Select one</option>${CFG.failureModes.map(f=>`<option value="${f.id}" ${val.failureMode===f.id?'selected':''}>${f.label}</option>`).join("")}</select><span class="muted small">${CFG.failureModes.find(f=>f.id===val.failureMode)?.help||"Classify after the PASS/FAIL decision. Classification does not change score."}</span></div>
        <div class="field"><label>Primary contributor</label><select data-contributor="${item.id}" ${locked?"disabled":""}><option value="">Select one</option>${CFG.contributors.map(c=>`<option value="${c.id}" ${val.contributor===c.id?'selected':''}>${c.label}</option>`).join("")}</select><span class="muted small">${CFG.contributors.find(c=>c.id===val.contributor)?.help||"Choose the best-supported proximal contributor only."}</span></div>
        <div class="field"><label>Objective comment ${val.failureMode==='other_unclear'?'(required)':'(optional)'}</label><textarea data-comment="${item.id}" rows="2" ${locked?"disabled":""}>${esc(val.comment||"")}</textarea></div>
      </div>
      ${val.rating==='nt'?`<p class="muted small">NT applied under rule: ${CFG.ntRule}</p>`:""}
    </article>`;
  }
  function wireEncounter(r,a,locked){
    $$("[data-rate]").forEach(b=>b.onclick=()=>{ const [itemId,k]=b.dataset.rate.split(":"); const item=allItems(a).find(x=>x.id===itemId); if(k==="nt" && item.critical){toast("Critical criteria cannot be NT."); return;} const current=r.ratings[itemId]||{}; r.ratings[itemId]={rating:k}; if(k==="fail"){ r.ratings[itemId].failureMode=current.failureMode||""; r.ratings[itemId].contributor=current.contributor||""; r.ratings[itemId].comment=current.comment||"";} r.updatedAt=now(); r.events.push({at:now(),type:"rating",itemId,rating:k}); save(); renderEncounter(); });
    $$("[data-failure-mode]").forEach(s=>s.onchange=()=>{ const id=s.dataset.failureMode; r.ratings[id].failureMode=s.value; r.updatedAt=now(); save(); renderEncounter(); });
    $$("[data-contributor]").forEach(s=>s.onchange=()=>{ const id=s.dataset.contributor; r.ratings[id].contributor=s.value; r.updatedAt=now(); save(); renderEncounter(); });
    $$("[data-comment]").forEach(t=>t.onchange=()=>{ const id=t.dataset.comment; r.ratings[id].comment=t.value.trim(); r.updatedAt=now(); save(); });
    $$("[data-timer-start]").forEach(b=>b.onclick=()=>{ const id=b.dataset.timerStart; r.timers[id]=r.timers[id]||{elapsed:0}; r.timers[id].startedAt=Date.now(); r.events.push({at:now(),type:"timer_start",timerId:id}); save(); renderEncounter(); });
    $$("[data-timer-stop]").forEach(b=>b.onclick=()=>{ const id=b.dataset.timerStop; const st=r.timers[id]; if(st?.startedAt){st.elapsed=(st.elapsed||0)+(Date.now()-st.startedAt); delete st.startedAt; st.stoppedAt=now(); r.events.push({at:now(),type:"timer_stop",timerId:id,elapsedMs:st.elapsed}); save(); renderEncounter(); }});
    $$("[data-timer-reset]").forEach(b=>b.onclick=()=>{ r.timers[b.dataset.timerReset]={elapsed:0, resetAt:now()}; save(); renderEncounter(); });
    $("#finalize").onclick=()=>{ r.status="finalized"; r.finalizedAt=now(); r.events.push({at:now(),type:"finalized",score:score(r)}); save(); renderEncounter(); };
    $("#void").onclick=()=>{ if(confirm("Void this draft encounter?")){ db.records=db.records.filter(x=>x.id!==r.id); save(); activeId=null; renderDashboard(); }};
    $("#nextUnresolved").onclick=()=>{ const unresolved=allItems(a).find(i=>["no",undefined].includes(r.ratings[i.id]?.rating)); if(unresolved) byId(`item_${unresolved.id}`).scrollIntoView({behavior:"smooth",block:"center"}); else toast("No unresolved criteria."); };
    $("#exportJson").onclick=()=>download(`${r.participantId}_${r.timepoint}_${r.assessmentId}.json`, JSON.stringify(r,null,2), "application/json");
    $("#exportCsv").onclick=()=>download(`${r.participantId}_${r.timepoint}_${r.assessmentId}.csv`, recordCsv(r), "text/csv");
    ticker=setInterval(()=>{ a.timers?.forEach(t=>{ const el=byId(`time_${t.id}`), st=r.timers[t.id]; if(el&&st?.startedAt) el.textContent=clock((st.elapsed||0)+Date.now()-st.startedAt); }); },500);
  }
  function clock(ms){ const sec=Math.floor(ms/1000), m=Math.floor(sec/60), s=sec%60; return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`; }

  function score(r){
    const a=assessment(r.assessmentId), items=allItems(a); let pass=0, fail=0, nt=0, no=0, criticalFail=0;
    items.forEach(i=>{ const k=r.ratings[i.id]?.rating; if(k==="pass") pass++; else if(k==="fail"){ fail++; if(i.critical) criticalFail++; } else if(k==="nt") nt++; else no++; });
    const denom=pass+fail; const percent=denom?Math.round(pass/denom*100):0; const overall=(no>0||criticalFail>0||percent<75||timerFailures(r,a).length)?"FAIL":"PASS";
    return {pass,fail,nt,no,criticalFail,denom,percent,overall};
  }
  function timerFailures(r,a){
    return (a.timers||[]).filter(t=>t.requiredForPass).filter(t=>{ const st=r.timers[t.id]; if(!st || st.startedAt || !st.elapsed) return true; const sec=st.elapsed/1000; if(t.mode==="max") return sec>t.seconds; if(t.mode==="min") return sec<t.seconds; if(t.mode==="range") return sec<t.minSeconds || sec>t.maxSeconds; return false; });
  }
  function validation(r){
    const errors=[], a=assessment(r.assessmentId); const items=allItems(a);
    items.forEach(i=>{ const v=r.ratings[i.id]||{}; if(!v.rating || v.rating==="no") errors.push(`${i.id}: unresolved N/O`); if(i.critical && v.rating==="nt") errors.push(`${i.id}: critical criterion cannot be NT`); if(v.rating==="fail"){ if(!v.failureMode) errors.push(`${i.id}: failed criterion missing failure mode`); if(!v.contributor) errors.push(`${i.id}: failed criterion missing primary contributor`); if(v.failureMode==="other_unclear" && !v.comment) errors.push(`${i.id}: Other/unclear requires objective comment`); } });
    (a.timers||[]).filter(t=>t.requiredForPass).forEach(t=>{ const st=r.timers[t.id]; if(!st || st.startedAt || !st.elapsed) errors.push(`${t.label}: required timer not completed`); });
    return {errors};
  }

  function recordCsv(r){
    const a=assessment(r.assessmentId); const rows=[["recordId","participantId","studyArm","timepoint","assessmentId","scenarioVersion","evaluatorId","appBuild","checklistVersion","itemId","section","critical","rating","failureMode","contributor","comment"]];
    allItems(a).forEach(i=>{ const v=r.ratings[i.id]||{}; rows.push([r.id,r.participantId,r.studyArm,r.timepoint,r.assessmentId,r.scenarioVersion,r.evaluatorId,r.appBuild,r.checklistVersion,i.id,i.section,i.critical,v.rating||"",v.failureMode||"",v.contributor||"",v.comment||""]); });
    return rows.map(row=>row.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(",")).join("\n");
  }
  function download(name, content, type){ const blob=new Blob([content],{type}); const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download=name; a.click(); URL.revokeObjectURL(a.href); }

  function renderExports(){
    app.innerHTML = `<section class="card"><p class="eyebrow">Data governance</p><h1>Exports and audit controls</h1><p class="muted">Export from this local device/browser and import into the approved study repository. Do not treat browser storage as the research database.</p><div class="toolbar"><button id="allJson">All Records JSON</button><button id="allCsv">Criterion-Level CSV</button><button id="timerCsv">Timer CSV</button><button id="dictionary">Data Dictionary CSV</button></div><pre class="card small">${esc(JSON.stringify({buildId:CFG.buildId,schemaVersion:CFG.schemaVersion,records:db.records.length,finalized:db.records.filter(r=>r.status==='finalized').length},null,2))}</pre></section>`;
    $("#allJson").onclick=()=>download(`fieldready_all_records_${dateSlug()}.json`, JSON.stringify(db,null,2), "application/json");
    $("#allCsv").onclick=()=>download(`fieldready_criterion_export_${dateSlug()}.csv`, db.records.map(recordCsv).join("\n").replace(/\nrecordId,.*?\n/g,"\n"), "text/csv");
    $("#timerCsv").onclick=()=>download(`fieldready_timer_export_${dateSlug()}.csv`, timerCsv(), "text/csv");
    $("#dictionary").onclick=()=>download(`fieldready_data_dictionary.csv`, dataDict(), "text/csv");
  }
  function dateSlug(){ return new Date().toISOString().slice(0,10); }
  function timerCsv(){ const rows=[["recordId","participantId","timepoint","assessmentId","timerId","elapsedMs","standard","complete"]]; db.records.forEach(r=>{ const a=assessment(r.assessmentId); (a.timers||[]).forEach(t=>{ const st=r.timers[t.id]||{}; rows.push([r.id,r.participantId,r.timepoint,r.assessmentId,t.id,st.elapsed||0,t.standard,!!st.elapsed&&!st.startedAt]); }); }); return rows.map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(",")).join("\n"); }
  function dataDict(){ return [["field","definition"],["failureMode","One of five protocol-approved failure modes."],["contributor","One of five evaluator-attributed primary contributors."],["nt","Noncritical criterion not elicited by approved scenario; excluded from denominator."],["no","Not observed/unresolved; blocks finalization."],["appBuild","Version identifier for measurement provenance."],["checklistVersion","Source map/checklist version."],["scenarioVersion","Approved scenario version used for encounter."]].map(r=>r.map(c=>`"${c}"`).join(",")).join("\n"); }

  function renderCalibration(){
    app.innerHTML = `<section class="card"><p class="eyebrow">Evaluator calibration</p><h1>Gold-standard scenario scoring</h1><p class="muted">Run calibration before study activation, every six months, and after any checklist/timer/scenario/taxonomy change. This module logs calibration events separately from participant data.</p><div class="grid two">${field("Evaluator ID","calEval","text","Cadre code")}${field("Scenario ID","calScenario","text","GS-01")}${field("Gold-standard set version","calVersion","text","CAL-v1")}${selectField("Assessment","calAssessment",CFG.assessments.map(id=>({id,label:ASSESS[id].label})))}</div><div class="toolbar"><button class="primary" id="startCal">Create Calibration Encounter</button><button id="exportCal">Export Calibration Log</button></div>${db.calibrations.length?`<h2>Calibration log</h2><table class="table"><tr><th>Evaluator</th><th>Scenario</th><th>Assessment</th><th>Created</th></tr>${db.calibrations.map(c=>`<tr><td>${esc(c.evaluatorId)}</td><td>${esc(c.scenarioId)}</td><td>${esc(c.assessmentId)}</td><td>${fmt(c.createdAt)}</td></tr>`).join("")}</table>`:""}</section>`;
    $("#startCal").onclick=()=>{ const evaluatorId=byId("calEval").value.trim(), scenarioId=byId("calScenario").value.trim(), version=byId("calVersion").value.trim(), assessmentId=byId("calAssessment").value; if(!evaluatorId||!scenarioId||!assessmentId){toast("Evaluator, scenario, and assessment are required.");return;} const c={id:uid("cal"),evaluatorId,scenarioId,version,assessmentId,createdAt:now(),appBuild:CFG.buildId}; db.calibrations.push(c); save(); toast("Calibration shell created. Use standard encounter workflow to score gold-standard scenario if needed."); renderCalibration(); };
    $("#exportCal").onclick=()=>download(`fieldready_calibration_log_${dateSlug()}.json`, JSON.stringify(db.calibrations,null,2), "application/json");
  }
  function renderAbout(){
    app.innerHTML = `<section class="card"><p class="eyebrow">About</p><h1>${CFG.appName}</h1><p>${CFG.studyPurpose}</p><div class="grid two"><div class="card"><h2>Protocol controls</h2><ul><li>${CFG.ntRule}</li><li>${CFG.passRule}</li><li>Every failed criterion requires one failure mode and one primary contributor before finalization.</li><li>Clinical content changes require PI approval, version control, and evaluator recalibration.</li></ul></div><div class="card"><h2>Build metadata</h2><pre class="small">${esc(JSON.stringify({buildId:CFG.buildId,buildDate:CFG.buildDate,schemaVersion:CFG.schemaVersion},null,2))}</pre></div></div></section>`;
  }
  function loadDemo(){
    const a=assessment("tourniquet");
    const r={id:uid(),participantId:"PILOT-001",timepoint:"baseline",assessmentId:"tourniquet",studyArm:"deliberate",clinicalYears:"4",afsc:"46N",workSection:"ED",deploymentCount:"0",priorTcccExposure:"initial",evaluatorId:"EV-01",scenarioVersion:"DEMO-v1",assessmentInstanceId:"DEMO-001",status:"draft",createdAt:now(),updatedAt:now(),appBuild:CFG.buildId,schemaVersion:CFG.schemaVersion,checklistVersion:a.version,ratings:{},timers:{tq_under_60:{elapsed:52000,stoppedAt:now()}},events:[]};
    allItems(a).forEach((item,idx)=>r.ratings[item.id]={rating:idx===2?"fail":"pass",failureMode:idx===2?"incorrect_technique":"",contributor:idx===2?"psychomotor":"",comment:idx===2?"Windlass not tightened until distal pulse absent":""});
    db.records.push(r); save(); renderDashboard();
  }

  window.addEventListener("beforeunload", () => clearInterval(ticker));
  boot();
})();
