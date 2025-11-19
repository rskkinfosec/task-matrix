// TaskMatrix Service Worker
// Version 1.0.4
// ⚠️ IMPORTANT: Increment this version number when you make changes!
const CACHE_NAME = 'taskmatrix-v1.0.5';
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
  // Only handle GET requests for caching; avoid caching PATCH/PUT/POST that might be blocked or unsupported
  if (event.request.method !== 'GET') {
    return event.respondWith(fetch(event.request));
  }
  // Ignore cross-origin requests (like Google APIs) to avoid caching and CORS complications
  try {
    const requestUrl = new URL(event.request.url);
    if (requestUrl.origin !== self.location.origin) {
      return event.respondWith(fetch(event.request));
    }
  } catch (e) {
    // If URL parsing failed, fallback to network
    return event.respondWith(fetch(event.request));
  }

  event.respondWith(
    caches.match(event.request)
            .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request)
          .then((fetchResponse) => {
                    // Cache only successful responses (status 200) to avoid caching errors
                    if (fetchResponse && fetchResponse.ok) {
                      // Only cache if the request method is GET and same-origin to avoid 'PATCH' unsupported error
                      try {
                        if (event.request.method === 'GET') {
                          return caches.open(CACHE_NAME)
                            .then((cache) => {
                              cache.put(event.request, fetchResponse.clone());
                              return fetchResponse;
                            });
                        }
                      } catch (e) {
                        console.warn('Service Worker: cache.put guard failed', e);
                      }
                    }
            return fetchResponse;
          });
      })
      .catch(() => {
        // Offline fallback
        console.log('Service Worker: Fetch failed, using offline mode');
        return caches.match('./index.html');
      })
  );
});
