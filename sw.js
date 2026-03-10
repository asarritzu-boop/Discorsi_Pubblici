const CACHE_NAME = 'discorsi-v2';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icona-192.png',
  './icona-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.25/jspdf.plugin.autotable.min.js'
];

// Installazione: cacha tutti gli asset incluse le librerie CDN
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Attivazione: elimina cache vecchie
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Strategia: Cache first, fallback su rete
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cached) => {
      return cached || fetch(e.request).then((response) => {
        // Cacha dinamicamente eventuali nuove risorse
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, response.clone());
          return response;
        });
      });
    }).catch(() => {
      // Fallback finale se sia cache che rete falliscono
      return caches.match('./index.html');
    })
  );
});      return cache.match(e.request).then((cachedResponse) => {
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
