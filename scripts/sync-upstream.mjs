import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {makeStudyTiers,patchApp,patchIndex,patchVersion,patchManifest,renderStudyTiers,studyConfigScript} from './lib/patcher.mjs';

const __dirname=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(__dirname,'..');
const www=path.join(root,'www');
const lock=JSON.parse(fs.readFileSync(path.join(root,'upstream-lock.json'),'utf8'));
const config=JSON.parse(fs.readFileSync(path.join(root,'study-config.json'),'utf8'));
const zipPath=path.join(root,'_upstream.zip');
const extractRoot=path.join(root,'_upstream');

const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const fail=(m)=>{throw new Error(m);};

async function download(url,dest){
  const r=await fetch(url,{redirect:'follow'});if(!r.ok)fail(`Upstream download failed: HTTP ${r.status}`);fs.writeFileSync(dest,Buffer.from(await r.arrayBuffer()));
}
function copyWebTree(src,dst){
  fs.mkdirSync(dst,{recursive:true});
  for(const ent of fs.readdirSync(src,{withFileTypes:true})){
    if(['.git','.github','android','node_modules','docs'].includes(ent.name))continue;
    if(ent.name.toLowerCase().endsWith('.md'))continue;
    if(ent.name==='package.json'||ent.name==='package-lock.json')continue;
    const a=path.join(src,ent.name),b=path.join(dst,ent.name);
    if(ent.isDirectory())copyWebTree(a,b);else fs.copyFileSync(a,b);
  }
}

console.log(`Downloading locked upstream ${lock.repository}@${lock.branch} ...`);
fs.rmSync(extractRoot,{recursive:true,force:true});fs.rmSync(zipPath,{force:true});
await download(lock.archiveUrl,zipPath);
fs.mkdirSync(extractRoot,{recursive:true});
const uz=spawnSync('unzip',['-q',zipPath,'-d',extractRoot],{stdio:'inherit'});if(uz.status!==0)fail('Unable to unzip upstream archive. GitHub Actions ubuntu-latest includes unzip.');
const dirs=fs.readdirSync(extractRoot,{withFileTypes:true}).filter(x=>x.isDirectory());if(dirs.length!==1)fail('Unexpected upstream archive structure.');
const upstream=path.join(extractRoot,dirs[0].name);
for(const [file,expected] of Object.entries(lock.requiredSha256)){
  const p=path.join(upstream,file);if(!fs.existsSync(p))fail(`Locked upstream file missing: ${file}`);const actual=sha(p);if(actual!==expected)fail(`SOURCE LOCK FAILURE for ${file}\nExpected ${expected}\nActual   ${actual}\nUpstream changed. Review changes before updating upstream-lock.json.`);console.log(`Verified ${file}: ${actual}`);
}

fs.rmSync(www,{recursive:true,force:true});fs.mkdirSync(www,{recursive:true});copyWebTree(upstream,www);

const tiersSource=fs.readFileSync(path.join(upstream,'tiers.js'),'utf8');const context={window:{}};vm.runInNewContext(tiersSource,context,{filename:'tiers.js'});const studyTiers=makeStudyTiers(context.window.TCCC_TIERS);
fs.writeFileSync(path.join(www,'tiers.js'),renderStudyTiers(studyTiers));
fs.writeFileSync(path.join(www,'study-config.js'),studyConfigScript(config));

const appPath=path.join(www,'app.js');fs.writeFileSync(appPath,patchApp(fs.readFileSync(appPath,'utf8'),config));
const indexPath=path.join(www,'index.html');fs.writeFileSync(indexPath,patchIndex(fs.readFileSync(indexPath,'utf8')));
fs.writeFileSync(path.join(www,'version.js'),patchVersion());
const manifestPath=path.join(www,'manifest.webmanifest');if(fs.existsSync(manifestPath))fs.writeFileSync(manifestPath,patchManifest(fs.readFileSync(manifestPath,'utf8')));
if(fs.existsSync(path.join(www,'sw.js'))){let sw=fs.readFileSync(path.join(www,'sw.js'),'utf8');sw=sw.replace(/const CACHE_NAME = '[^']+';/,"const CACHE_NAME = 'fieldready-study-v3-0-0-research';").replace(/const VERSION = '[^']+';/,"const VERSION = '3.0.0-research';");if(!sw.includes('study-config.js'))sw=sw.replace("  `./tiers.js?v=${VERSION}`,","  `./tiers.js?v=${VERSION}`,\n  `./study-config.js?v=${VERSION}`,");fs.writeFileSync(path.join(www,'sw.js'),sw);}

const provenance={generatedAt:new Date().toISOString(),appVersion:config.appVersion,upstreamRepository:lock.repository,upstreamBranch:lock.branch,verifiedSha256:lock.requiredSha256,modules:Object.fromEntries(Object.entries(studyTiers).map(([k,v])=>[k,{source:v.source,criteria:v.sections.flatMap(s=>s.items).length,critical:v.sections.flatMap(s=>s.items).filter(i=>i.critical).length,timers:(v.timers||[]).length}]))};
fs.writeFileSync(path.join(www,'build-provenance.json'),JSON.stringify(provenance,null,2)+'\n');
fs.writeFileSync(path.join(www,'README-GENERATED.txt'),'Generated from the SHA-256 locked DAF-TCCC-RaPS-WEB baseline. Do not hand-edit during active study collection.\n');
fs.rmSync(extractRoot,{recursive:true,force:true});fs.rmSync(zipPath,{force:true});
console.log('FieldReady study web source generated in www/.');
