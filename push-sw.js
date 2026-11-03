// Ayetin Vakti - arka plan bildirimi (Web Push) alıcısı.
// sw.js dosyasının EN ÜSTÜNE şu satır eklenir:   importScripts('/push-sw.js');

self.addEventListener('push', function (event) {
  var data = {};
  try { data = event.data ? event.data.json() : {}; } catch (e) { data = {}; }

  var lang = data.lang || 'tr';
  var options = {
    body: data.body || '',
    tag: data.tag || 'ayetin-vakti',
    lang: lang,
    dir: lang === 'ar' ? 'rtl' : 'ltr',
    icon: '/icon.png',
    badge: '/icon.png',
    data: { url: data.url || '/' }
  };
  event.waitUntil(self.registration.showNotification(data.title || 'Ayetin Vakti', options));
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  var target = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
      for (var i = 0; i < list.length; i++) {
        var c = list[i];
        if (c.url.indexOf('/Namaz-vakitleri') !== -1 && 'focus' in c) return c.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(target);
    })
  );
});
