const CACHE_NAME = 'ayetim-vakti-v5';
const assetsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icon.png',
    '/esma.html'
    // Projendeki diğer HTML veya JS/CSS dosyalarını buraya ekleyebilirsin:
    // '/zaman.html', 
    // '/kible.html'
];

// Kurulum aşaması: Dosyaları önbelleğe al
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
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
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch stratejisi: Önce internetten dene, başarılı olursa önbelleği güncelle; internet yoksa önbellekten sun
self.addEventListener('fetch', (event) => {
    // Sadece GET isteklerini önbellekle
    if (event.request.method !== 'GET') return;

    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                // Eğer yanıt geçerliyse klonlayıp önbelleğe at
                if (networkResponse && networkResponse.status === 200) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return networkResponse;
            })
            .catch(() => {
                // İnternet yoksa önbellekten bulmaya çalış
                return caches.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    // İsteğe bağlı: Önbellekte de yoksa özel bir offline sayfası döndürebilirsin
                });
            })
    );
});
