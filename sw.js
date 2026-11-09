/**
 * Service Worker — Ximbal PWA
 * Cachea todos los recursos para funcionamiento offline completo.
 */

const CACHE_NAME = 'ximbal-v1';

const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './manifest.json',
    './icons/logo.png',
    // Biblioteca QR
    'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js',
    // Imágenes QR
    './qr/1.png',
    './qr/2.png',
    './qr/3.png',
    './qr/4.png',
    './qr/5.png',
    './qr/6.png',
    './qr/7.png',
    './qr/8.png',
    './qr/9.png',
    './qr/10.png',
    // Imágenes de resultado
    './resultado/1.png',
    './resultado/2.png',
    './resultado/3.png',
    './resultado/4.png',
    './resultado/5.png',
    './resultado/6.png',
    './resultado/7.png',
    './resultado/8.png'
];

// Instalar: cachear todos los recursos
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS_TO_CACHE))
            .then(() => self.skipWaiting())
    );
});

// Activar: limpiar caches antiguos
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(names =>
            Promise.all(
                names
                    .filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            )
        ).then(() => self.clients.claim())
    );
});

// Fetch: cache-first, luego red
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(cached => {
            if (cached) return cached;

            return fetch(event.request).then(response => {
                // Cachear recursos nuevos dinámicamente
                if (response.ok && event.request.method === 'GET') {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, clone);
                    });
                }
                return response;
            }).catch(() => {
                // Offline y no en cache: devolver página principal
                if (event.request.mode === 'navigate') {
                    return caches.match('./index.html');
                }
            });
        })
    );
});

