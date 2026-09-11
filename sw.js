const CACHE = "fieldready-research-v0.3.0";
const FILES = ["./","./index.html","./styles.css","./app.js","./study-config.js","./checklist-cmc.js","./manifest.webmanifest"];
self.addEventListener("install", e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))));
self.addEventListener("fetch", e => e.respondWith(caches.match(e.request).then(r => r || fetch(e.request))));
