const CACHE_NAME = 'ayetim-vakti-v3';
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

// Güncel veriyi önce internetten çekme (Network First)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                // İnternetten taze veri geldiyse bunu önbelleğe de güncelle
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            })
            .catch(() => {
                // İnternet yoksa veya hata alırsak önbellekteki eski/güvenli sürümü göster
                return caches.match(event.request);
            })
    );
});
