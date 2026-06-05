const CACHE_NAME = 'cheezies-v3';

// Never cache JS/CSS chunks or Vite/dev assets
const NEVER_CACHE = [
  '/src/',
  '/node_modules/.vite',
  '/@vite',
  '/@react-refresh',
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  '.css',
];

function shouldSkipCache(url) {
  return NEVER_CACHE.some(pattern => url.includes(pattern));
}

// Assets safe to cache (images, fonts, manifest)
const PRECACHE_ASSETS = [
  '/',
  '/manifest.json',
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_ASSETS).catch(() => {}))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const url = event.request.url;

  // Never intercept non-GET or JS/CSS chunks
  if (event.request.method !== 'GET' || shouldSkipCache(url)) {
    return;
  }

  // Network-first for HTML navigation
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/'))
    );
    return;
  }

  // Cache-first for static assets (images, fonts, manifest)
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response.ok) {
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, response.clone()));
        }
        return response;
      });
    })
  );
});
