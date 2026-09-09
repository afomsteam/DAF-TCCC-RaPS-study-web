const vm = require('vm');
const fs = require('fs');
const crypto = require('crypto');
const tiersPath = fs.existsSync('tiers.js') ? 'tiers.js' : 'www/tiers.js';
const appPath = fs.existsSync('app.js') ? 'app.js' : 'www/app.js';
const code = fs.readFileSync(tiersPath,'utf8');
const appCode = fs.readFileSync(appPath,'utf8');
const ctx = {window:{}};
vm.createContext(ctx); vm.runInContext(code, ctx);
const A = ctx.window.TCCC_TIERS;
const expected = {
  '1': ['CMC',124,28],
  '2': ['TQ',15,11],
  '3': ['NPA',13,7],
  '4': ['NDC',15,12],
  '5': ['BLOOD',26,11]
};
let ok = true;
for (const [id,[shortName,total,critical]] of Object.entries(expected)) {
  const a=A[id];
  const items=a?.sections?.flatMap(s=>s.items)||[];
  const c=items.filter(i=>i.critical).length;
  if(!a || a.shortName!==shortName || items.length!==total || c!==critical){
    console.error(`FAIL ${id}: expected ${shortName} ${total}/${critical}; got ${a?.shortName} ${items.length}/${c}`);ok=false;
  } else console.log(`PASS ${shortName}: ${total} items, ${critical} critical`);
}
if(Object.keys(A).length!==5){console.error(`FAIL expected 5 assessments, got ${Object.keys(A).length}`);ok=false;}

// The CMC module is intentionally frozen to the Tier 3 CMC object carried in
// the uploaded v2.21.0 baseline. Only the top-level assessment id is normalized
// from 3 to 1 so it occupies the first study-module slot. This hash detects any
// accidental trimming or rewriting of CUF/TFC/MARCH-PAWS/CPR/comms/evac content.
const CMC_BASELINE_SHA256='31cc13b8a5219d03c4c03f6d64064fa8b60cb01962b505c086d7052e80cc6f9b';
const cmc=A['1'];
const cmcHash=crypto.createHash('sha256').update(JSON.stringify(cmc)).digest('hex');
if(cmcHash!==CMC_BASELINE_SHA256){
  console.error(`FAIL CMC baseline hash mismatch: ${cmcHash}`);ok=false;
}else console.log('PASS CMC exact baseline hash');

const cmcSections=(cmc.sections||[]).map(s=>s.code);
const requiredCmcSections=['CUF','TFC','M','A','R','C','H','H2','P','ABX','W','S','CPR','COMMS','DOC','EVAC'];
if(JSON.stringify(cmcSections)!==JSON.stringify(requiredCmcSections)){
  console.error(`FAIL CMC section sequence: ${cmcSections.join(',')}`);ok=false;
}else console.log('PASS CMC section sequence: CUF → TFC → MARCH-PAWS → CPR → COMMS → DOC → EVAC');
if((cmc.timers||[]).length!==7){console.error(`FAIL CMC expected 7 timers, got ${(cmc.timers||[]).length}`);ok=false;}
else console.log('PASS CMC timers restored: 7');

const tq=A['2'];
const tqTimer=(tq.timers||[]).find(x=>x.id==='tq_one_min');
if(!tqTimer || tqTimer.seconds!==60 || !tqTimer.exclusiveMax || tqTimer.standard!=='< 1:00' || tqTimer.displayMode!=='count-up' || !tqTimer.pinToSectionTop || tqTimer.stopLabel!=='STEP 7 COMPLETE' || tqTimer.pausePolicy!=='admin-only'){
  console.error('FAIL TQ <1:00 count-up timer configuration');ok=false;
} else console.log('PASS TQ count-up timer: <1:00, pinned, Step 7 completion stop');
for(const field of ['clinicalYearsExperience','afsc','currentWorkSection']){
  if(!appCode.includes(field)){console.error(`FAIL missing participant field ${field}`);ok=false;}
  else console.log(`PASS participant field: ${field}`);
}
process.exit(ok?0:1);
