import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
import {countAssessment} from './targeted-assessments.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const www=path.join(root,'www');
const must=(v,m)=>{if(!v)throw new Error('VERIFY FAILED: '+m);};
for(const f of ['app.js','tiers.js','index.html','study-config.js','version.js'])must(fs.existsSync(path.join(www,f)),`missing generated ${f}; run npm run prepare:study first`);
const config=JSON.parse(fs.readFileSync(path.join(root,'study-config.json'),'utf8'));
must(config.failureModes.length===5,'failure mode taxonomy must contain exactly 5 choices');
must(config.failureContributors.length===5,'primary contributor taxonomy must contain exactly 5 choices');
must(new Set(config.failureModes.map(x=>x[0])).size===5,'failure mode IDs must be unique');
must(new Set(config.failureContributors.map(x=>x[0])).size===5,'contributor IDs must be unique');
must(!config.failureContributors.some(x=>x[0]==='evaluator'),'evaluator/admin cannot be a participant contributor category');
must(config.ntReason?.[0]==='scenario-not-elicited','NT must be scenario-not-elicited only');

const tierCtx={window:{}};vm.runInNewContext(fs.readFileSync(path.join(www,'tiers.js'),'utf8'),tierCtx,{filename:'tiers.js'});const tiers=tierCtx.window.TCCC_TIERS;
must(JSON.stringify(Object.keys(tiers))===JSON.stringify(['CMC','TQ','NPA','NDC','BLOOD']),'only five approved study assessment modules may be present');
const expected={CMC:[124,28,7],TQ:[15,11,2],NPA:[13,7,0],NDC:[15,12,1],BLOOD:[26,11,0]};
for(const [k,[criteria,critical,timers]] of Object.entries(expected)){
  const a=tiers[k],items=a.sections.flatMap(s=>s.items);must(items.length===criteria,`${k} criteria ${items.length} != ${criteria}`);must(items.filter(i=>i.critical).length===critical,`${k} critical count mismatch`);must((a.timers||[]).length===timers,`${k} timer count mismatch`);
}
must(tiers.CMC.source.includes('TCCC-CMC-TTA-05-02')&&tiers.CMC.source.includes('30 MAY 26'),'CMC source lock mismatch');
must(tiers.CMC.sections.length===16,'CMC must retain 16 sections');
must(tiers.CMC.sections.some(s=>s.code==='CUF')&&tiers.CMC.sections.some(s=>s.code==='TFC'),'CMC must retain CUF and TFC');
must(tiers.TQ.sections[0].items[9].text.includes('within 1 minute'),'TQ 1-minute source criterion missing');
must(tiers.NDC.sections[0].items[7].text.includes('5–10 seconds'),'NDC 5–10 second criterion missing');
must(tiers.BLOOD.sections[0].items.length===26,'blood administration must be source pages 6–7 / 26 criteria');

const app=fs.readFileSync(path.join(www,'app.js'),'utf8'),index=fs.readFileSync(path.join(www,'index.html'),'utf8');
new vm.Script(app,{filename:'app.js'});new vm.Script(fs.readFileSync(path.join(www,'tiers.js'),'utf8'),{filename:'tiers.js'});new vm.Script(fs.readFileSync(path.join(www,'study-config.js'),'utf8'),{filename:'study-config.js'});
must(app.includes('const FAILURE_MODES=STUDY.failureModes;'),'runtime failure modes must come only from locked study config');
must(app.includes('const FAILURE_CONTRIBUTORS=STUDY.failureContributors;'),'runtime contributors must come only from locked study config');
must(app.includes("if(rating==='fail')return requestFailureClassification(itemId,true);"),'all FAIL selections must open required classification');
must(app.includes("mode==='other-unclear'&&!comment"),'Other / unclear must require objective comment');
must(app.includes('classificationMissing=items.filter'),'all unclassified FAILs must block finalization');
must(app.includes("const NT_REASONS=[STUDY.ntReason"),'NT must be locked to study-config reason');
must(!app.includes('Unclassified / review later'),'legacy unclassified choice must be absent');
must(!app.includes('<span>Contributing factor</span>'),'secondary contributing-factor UI must be absent');
must(!index.includes('Primary Root Causes'),'causal root-cause label must be absent');
must(index.includes('Evaluator-Attributed Primary Contributors'),'study analytics contributor label missing');
must(index.includes('studyDatasetCsvBtn'),'criterion-level study dataset export button missing');
must(index.indexOf('study-config.js')<index.indexOf('app.js'),'study-config.js must load before app.js');
console.log('VERIFY PASS');
console.log('  5 failure modes / 5 primary contributors / 0 legacy unclassified choice');
console.log('  Every FAIL requires both classifications; Other / unclear requires objective comment');
console.log('  NT restricted to noncritical approved-scenario-not-elicited');
console.log('  CMC 124/28/7 with CUF+TFC retained; TQ 15/11; NPA 13/7; NDC 15/12; BLOOD 26/11');
