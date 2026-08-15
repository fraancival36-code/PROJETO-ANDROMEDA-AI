// Service Worker — Andrômeda
// Cache app-shell apenas. NÃO cachear respostas de API/dados dinâmicos.
const CACHE_NAME = 'andromeda-shell-v1';
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/andromeda-inteligente.html',
  '/manifest.json',
  '/andromeda-core.js',
  '/andromeda-config.js',
  '/talento-andromeda.js',
  '/voz.js',
  '/biblioteca/biblioteca.html',
  '/andromeda.jpg'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS).catch(()=>{/* ignore missing assets */}))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  return self.clients.claim();
});

// Strategy: only serve cached app-shell/static assets. Always forward API/dynamic requests to network.
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Never interfere with non-GET
  if (req.method !== 'GET') {
    return event.respondWith(fetch(req));
  }

  // If the request asks for JSON (likely API) — do network only
  const acceptHeader = req.headers.get('accept') || '';
  if (acceptHeader.includes('application/json')) {
    return event.respondWith(fetch(req));
  }

  // Also avoid caching known external API hosts
  const url = new URL(req.url);
  if (url.hostname && (
      url.hostname.includes('generativelanguage.googleapis.com') ||
      url.hostname.includes('googleapis.com') ||
      url.hostname.includes('openai.com')
    )) {
    return event.respondWith(fetch(req));
  }

  // Navigation requests — serve cached shell (network falling back to cache)
  if (req.mode === 'navigate') {
    return event.respondWith(
      fetch(req).then((res) => {
        // update cache with latest index.html
        caches.open(CACHE_NAME).then(cache => cache.put('/index.html', res.clone()));
        return res;
      }).catch(() => caches.match('/index.html'))
    );
  }

  // For static resources (scripts, styles, images, fonts) — try cache first
  if (req.destination === 'script' || req.destination === 'style' || req.destination === 'image' || req.destination === 'font') {
    event.respondWith(
      caches.match(req).then((cached) => cached || fetch(req).then((res) => {
        // Cache a copy for next time (best-effort)
        caches.open(CACHE_NAME).then(cache => {
          // only cache successful responses
          if (res && res.status === 200) cache.put(req, res.clone()).catch(()=>{});
        });
        return res;
      }).catch(() => cached))
    );
    return;
  }

  // Default: network first, fallback to cache
  event.respondWith(
    fetch(req).then((res) => {
      return res;
    }).catch(() => caches.match(req))
  );
});
