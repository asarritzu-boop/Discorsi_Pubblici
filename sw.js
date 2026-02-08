const CACHE_NAME = 'discorsi-v2'; // Incrementato la versione
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icona-192.png',
  './icona-512.png',
  './style.css', // Assicurati di includere CSS e JS se hanno nomi specifici
  './script.js'
];

// Installazione e caching dei file statici
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting(); // Forza l'attivazione immediata
});

// Pulizia vecchie cache
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

// Strategia: Stale-While-Revalidate
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(e.request).then((cachedResponse) => {
        const fetchPromise = fetch(e.request).then((networkResponse) => {
          // Se la rete risponde, salva una copia aggiornata in cache
          if (networkResponse.ok) {
            cache.put(e.request, networkResponse.clone());
          }
          return networkResponse;
        });

        // Restituisce la versione in cache se esiste, altrimenti aspetta la rete
        return cachedResponse || fetchPromise;
      });
    })
  );
});
