self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open('kp-detailing-v1');
    await cache.addAll([
      '/',
      '/manifest.json',
      '/logo.webp',
      '/logo.png',
      '/icon-192.png',
      '/icon-512.png'
    ]);
    self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  event.respondWith((async () => {
    try {
      const networkResponse = await fetch(event.request);
      const cache = await caches.open('kp-detailing-v1');
      cache.put(event.request, networkResponse.clone());
      return networkResponse;
    } catch (err) {
      const cachedResponse = await caches.match(event.request);
      return cachedResponse || Response.error();
    }
  })());
});