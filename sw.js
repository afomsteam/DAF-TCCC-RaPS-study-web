const CACHE_NAME = 'fieldready-web-0.1.2-v2';
const CORE = [
  './',
  './index.html',
  './styles.css',
  './version.js',
  './tiers.js',
  './branding.js',
  './installations.js',
  './app.js',
  './web-platform.js',
  './manifest.webmanifest',
  './assets/app-icon.png',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/splash-background.png',
  './assets/ccatt-background.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type === 'opaque') return response;
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)).catch(() => {});
        return response;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
