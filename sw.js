const CACHE_NAME = 'ayetim-vakti-v2';
const assetsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icon.png'
];

// Yükleme aşaması - Dosyaları hafızaya al
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Dosyalar önbelleğe alınıyor');
            return cache.addAll(assetsToCache);
        })
    );
    self.skipWaiting();
});

// Eski önbellekleri temizleme
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        console.log('[Service Worker] Eski önbellek siliniyor:', key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Çevrimdışı istekleri yakalama
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Önbellekte varsa onu döndür, yoksa internetten çek
            return response || fetch(event.request);
        }).catch(() => {
            // İkisi de olmazsa (internetsiz ve önbelleksiz durum) istenirse yedek sayfa gösterilebilir
        })
    );
});
