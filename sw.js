const CACHE_NAME = 'ayetin-vakti-v6';
const assetsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icon.png',
    '/esma.html'
    // Projendeki diğer HTML veya JS/CSS dosyalarını buraya ekleyebilirsin
];

// Kurulum: dosyaları tek tek önbelleğe al (biri bulunamazsa kurulum yarıda kalmasın)
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) =>
            Promise.allSettled(assetsToCache.map((url) => cache.add(url)))
        )
    );
    self.skipWaiting();
});

// Eski önbellekleri temizle
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.map((key) => (key !== CACHE_NAME ? caches.delete(key) : undefined)))
        )
    );
    self.clients.claim();
});

// "?ts=..." gibi her istekte değişen parametreyi önbellek anahtarından çıkarır (önbellek şişmesin, çevrimdışı eşleşsin)
function cacheKeyFor(request) {
    const url = new URL(request.url);
    if (url.searchParams.has('ts')) {
        url.searchParams.delete('ts');
        return url.toString();
    }
    return request;
}

// Fetch stratejisi: önce internetten dene, başarılıysa önbelleği güncelle; internet yoksa önbellekten sun
self.addEventListener('fetch', (event) => {
    const request = event.request;
    if (request.method !== 'GET') return;

    const url = new URL(request.url);
    // Ses dosyaları (hafız tilaveti vb.) önbelleğe alınmaz
    if (url.pathname.endsWith('.mp3')) return;

    event.respondWith(
        fetch(request)
            .then((networkResponse) => {
                if (networkResponse && networkResponse.status === 200) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(cacheKeyFor(request), responseClone));
                }
                return networkResponse;
            })
            .catch(() =>
                caches.match(cacheKeyFor(request)).then((cachedResponse) => {
                    if (cachedResponse) return cachedResponse;
                    // Sayfa isteğiyse çevrimdışıyken ana sayfayı göster
                    if (request.mode === 'navigate') return caches.match('/');
                    return Response.error();
                })
            )
    );
});
