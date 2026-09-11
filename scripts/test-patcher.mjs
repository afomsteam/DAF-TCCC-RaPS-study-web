import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {makeStudyTiers,studyConfigScript,patchVersion} from './lib/patcher.mjs';
import {countAssessment} from './targeted-assessments.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const cfg=JSON.parse(fs.readFileSync(path.join(root,'study-config.json'),'utf8'));
const must=(x,m)=>{if(!x)throw new Error(m);};
must(cfg.failureModes.length===5,'must have 5 fail modes');must(cfg.failureContributors.length===5,'must have 5 contributors');
const fakeCmc={id:'3',shortName:'CMC',name:'CMC',subtitle:'TTA',source:'TCCC-CMC-TTA-05-02 · 30 MAY 26',instructions:'',ratings:[],sections:[{code:'CUF',title:'CUF',items:Array.from({length:124},(_,i)=>({id:'CMC-'+String(i+1).padStart(3,'0'),text:'x',critical:i<28}))},{code:'TFC',title:'TFC',items:[]}],timers:Array.from({length:7},(_,i)=>({id:'t'+i}))};
const tiers=makeStudyTiers({'3':fakeCmc});must(Object.keys(tiers).join(',')==='CMC,TQ,NPA,NDC,BLOOD','study tiers wrong');
for(const [k,want] of Object.entries({TQ:[15,11],NPA:[13,7],NDC:[15,12],BLOOD:[26,11]})){const c=countAssessment(tiers[k]);must(c.criteria===want[0]&&c.critical===want[1],`${k} count mismatch`);}
must(studyConfigScript(cfg).includes('Not performed / incomplete'),'config script missing taxonomy');must(patchVersion().includes('3.0.0-research'),'version patch bad');
console.log('STATIC TEST PASS');
