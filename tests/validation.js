const fs = require('fs');
const requiredFiles = ['index.html','app.js','styles.css','study-config.js','checklist-cmc.js'];
let ok = true;
for (const f of requiredFiles) {
  if (!fs.existsSync(f)) { console.error(`Missing ${f}`); ok = false; }
}
const app = fs.readFileSync('app.js','utf8');
const config = fs.readFileSync('study-config.js','utf8');
for (const text of ['failureModes','contributors','Critical criteria cannot be NT','failed criterion missing failure mode','failed criterion missing primary contributor']) {
  if (!app.includes(text) && !config.includes(text)) { console.error(`Missing expected control: ${text}`); ok = false; }
}
if (!ok) process.exit(1);
console.log('FieldReady research app validation passed.');
