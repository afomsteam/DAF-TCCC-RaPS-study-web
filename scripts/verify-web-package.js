const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const required = [
  'index.html','styles.css','app.js','tiers.js','branding.js','installations.js','version.js',
  'web-platform.js','sw.js','manifest.webmanifest','assets/app-icon.png','assets/icon-192.png','assets/icon-512.png'
];
let ok = true;
for (const rel of required) {
  if (!fs.existsSync(path.join(root, rel))) {
    console.error(`MISSING: ${rel}`);
    ok = false;
  }
}
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
for (const token of ['web-platform.js','manifest.webmanifest','installWebAppBtn','Web/PWA']) {
  if (!html.includes(token)) { console.error(`index.html missing token: ${token}`); ok = false; }
}
const sw = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
if (!sw.includes('fieldready-web-0.1.2')) { console.error('Unexpected service-worker cache version'); ok = false; }
if (!ok) process.exit(1);
console.log('Web package validation PASS');
