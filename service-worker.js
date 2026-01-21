const CACHE_NAME = 'quickcomms-studio-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Guard clause: ensure caches API is available (fixes 'undefined (reading match)' error)
  if (typeof caches === 'undefined') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((response) => {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        // Clone the response
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          // We can't cache POST requests or opaque responses in some cases, 
          // but for GET requests to CDN assets (scripts, styles, fonts), this helps offline support.
          if (event.request.method === 'GET') {
             try {
                cache.put(event.request, responseToCache);
             } catch (err) {
                // Ignore errors (e.g. quota exceeded or unsupported scheme)
             }
          }
        });

        return response;
      });
    })
  );
});