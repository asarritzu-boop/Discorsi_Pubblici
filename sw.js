const CACHE_NAME = 'discorsi-v3';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icona-192.png',
  './icona-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.25/jspdf.plugin.autotable.min.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const url = e.request.url;

  // Ignora richieste non cachabilii
  if (
    e.request.method !== 'GET' ||
    url.startsWith('chrome-extension') ||
    url.startsWith('blob:') ||
    url.startsWith('data:')
  ) {
    e.respondWith(fetch(e.request));
    return;
  }

  // Cache first, fallback su rete
  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;
      return fetch(e.request).then((response) => {
        // Cacha solo risposte valide
        if (!response || response.status !== 200 || response.type === 'opaque') {
          return response;
        }
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, response.clone());
          return response;
        });
      });
    }).catch(() => caches.match('./index.html'))
  );
});          cache.put(e.request, response.clone());
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
