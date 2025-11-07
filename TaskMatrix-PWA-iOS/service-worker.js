// TaskMatrix Service Worker
// Version 1.0.2
// ⚠️ IMPORTANT: Increment this version number when you make changes!
const CACHE_NAME = 'taskmatrix-v1.0.2';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// Install event - cache files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing version', CACHE_NAME);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching files');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting()) // Force activation immediately
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache');
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request)
          .then((fetchResponse) => {
            // Cache new resources
            return caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, fetchResponse.clone());
                return fetchResponse;
              });
          });
      })
      .catch(() => {
        // Offline fallback
        console.log('Service Worker: Fetch failed, using offline mode');
        return caches.match('./index.html');
      })
  );
});
