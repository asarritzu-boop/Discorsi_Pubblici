const CACHE_NAME = 'discorsi-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icona-192.png',
  './icona-512.png'
];

// Installazione e caching dei file
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Strategia: Network first, fallback on cache
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
