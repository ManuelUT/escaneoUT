const CACHE_NAME = 'ximbal-v5-offline';

// Solo archivos que REALMENTE existen en el proyecto
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './jsQR.min.js',
  './manifest.json',
  './icons/logo.png',
  './qr/1.png',
  './qr/2.png',
  './qr/3.png',
  './qr/4.png',
  './qr/5.png',
  './qr/6.png',
  './qr/7.png',
  './qr/8.png',
  './qr/9.png',
  './qr/10.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Usamos addAll para fallar rápido si algún archivo no existe
      // pero con allSettled como fallback por si algún QR no se encuentra
      return cache.addAll(ASSETS_TO_CACHE).catch(() => {
        // Si addAll falla, intentar uno por uno
        return Promise.allSettled(
          ASSETS_TO_CACHE.map((url) => cache.add(url).catch(() => {
            console.warn('SW: No se pudo cachear:', url);
          }))
        );
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Solo interceptar GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request).then((response) => {
        // Solo cachear respuestas exitosas del mismo origen
        if (response.ok && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });
        }
        return response;
      }).catch(() => {
        // Si falla la red y es navegación, devolver index.html
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
        // Para otros recursos devolver respuesta vacía
        return new Response('', { status: 408, statusText: 'Offline' });
      });
    })
  );
});
