/* Ayetin Vakti sayaç - SÜRÜM 4 */
/* Ayetin Vakti - anonim ziyaret sayacı
 * Yalnızca toplu sayaçlar tutar (ziyaret, benzersiz cihaz, sayfa, dil, uygulama/tarayıcı, işletim sistemi).
 * Kişi/cihaz kimliği, IP, konum veya metin SUNUCUYA YAZILMAZ.
 * "Takip etme" (Do Not Track) açıksa ve botlarda hiçbir şey saymaz. */
(function () {
    'use strict';
    if (window.__avStats) return;
    window.__avStats = true;
    try {
        if (navigator.doNotTrack === '1' || window.doNotTrack === '1' || navigator.webdriver) return;
    } catch (e) {}
    var ua = navigator.userAgent || '';
    if (/bot|crawl|spider|slurp|headless|lighthouse|preview/i.test(ua)) return;

    var CFG = {
        apiKey: 'AIzaSyCIsUcRHMcSxKPsWm9pSB5ErTeJM4D6R6Y',
        authDomain: 'ayetinvakti-3eb7f.firebaseapp.com',
        databaseURL: 'https://ayetinvakti-3eb7f-default-rtdb.firebaseio.com',
        projectId: 'ayetinvakti-3eb7f',
        appId: '1:82274501389:web:d1fe62be335b523afee644'
    };
    var SDK = 'https://www.gstatic.com/firebasejs/9.22.1/';
    // Firebase kuralları da yalnızca bu adları kabul eder
    var KNOWN = ['ana-sayfa', '5-5-namaz', 'namaz-ogretmeni', 'zikirmatik', 'gunun-ayeti', 'ayarlar', 'kuran-oku',
        'namaz-vakitleri', 'kible-pusulasi', 'islami-tabu', 'ayet-asistan', 'dini-gunler', 'yakindaki-camiler',
        'zekat-hesaplama', 'ramazan-ozel-imsakiye', 'haftanin-hutbesi', 'gunluk-dualar', 'siyer-i-nebi', 'ilmihal',
        'kaza-namazi', 'esma'];

    function pad(n) { return (n < 10 ? '0' : '') + n; }
    function today() { var d = new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
    function pageKey() {
        var seg = (location.pathname.split('/').filter(Boolean)[0] || '').toLowerCase().replace(/\.html?$/, '');
        if (!seg || seg === 'index') seg = 'ana-sayfa';
        return KNOWN.indexOf(seg) !== -1 ? seg : 'diger';
    }
    function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) {} return null; }
    function ss(k, v) { try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch (e) {} return null; }
    function lang() { var l = ls('user_lang'); return (l === 'en' || l === 'ar') ? l : 'tr'; }
    function os() { return /iPhone|iPad|iPod/i.test(ua) ? 'ios' : /Android/i.test(ua) ? 'android' : 'other'; }
    function mode() {
        var s = false;
        try { s = !!(navigator.standalone || (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches)); } catch (e) {}
        return s ? 'standalone' : 'browser';
    }
    function loadScripts(list) {
        // Hepsi aynı anda indirilir, sırayla çalışır (app önce, database sonra)
        return Promise.all(list.map(function (src) {
            return new Promise(function (res, rej) {
                var s = document.createElement('script');
                s.src = src; s.async = false; s.onload = res; s.onerror = rej;
                document.head.appendChild(s);
            });
        }));
    }
    function ready() {
        if (window.firebase && firebase.database) return Promise.resolve();
        if (window.firebase && firebase.initializeApp) return loadScripts([SDK + 'firebase-database-compat.js']);
        return loadScripts([SDK + 'firebase-app-compat.js', SDK + 'firebase-database-compat.js']);
    }

    var inflight = {};
    function run() {
        var db;
        try {
            var app = null;
            try { app = firebase.app('av-stats'); } catch (e) { app = firebase.initializeApp(CFG, 'av-stats'); }
            db = app.database();
        } catch (e) { return; }

        // Sayım başarıyla sunucuya yazılınca "yapıldı" işareti konur; yazılamazsa sonraki sayfada yeniden denenir.
        function incOnce(path, store, flagKey) {
            if (store(flagKey) || inflight[path]) return;
            inflight[path] = true;
            try {
                db.ref('stats/' + path).transaction(function (v) { return (v || 0) + 1; }, undefined, false)
                    .then(function (r) { if (r && r.committed) store(flagKey, '1'); })
                    .catch(function () {})
                    .then(function () { inflight[path] = false; });
            } catch (e) { inflight[path] = false; }
        }

        var D = today(), P = pageKey();

        // Eski sürümlerin işaretlerini sil (v1-v3 hatalı "sayıldı" işareti bırakabiliyordu) ve eski günleri temizle
        try {
            for (var i = localStorage.length - 1; i >= 0; i--) {
                var k = localStorage.key(i);
                if (!k) continue;
                if (k === 'av_dev' || k === 'av_day' || k.indexOf('av_c_') === 0) { localStorage.removeItem(k); continue; }
                if (k.indexOf('av4_') === 0 && k !== 'av4_dev_total' && k.indexOf(D) === -1) localStorage.removeItem(k);
            }
        } catch (e) {}

        // Açılış (oturum) sayısı: oturum başına bir kez
        incOnce('total/visits', ss, 'av4_visits');
        incOnce('days/' + D + '/visits', ss, 'av4_' + D + '_visits');

        // Kişi (benzersiz cihaz) sayıları: aynı cihaz günde yalnızca 1 kez sayılır
        incOnce('days/' + D + '/devices', ls, 'av4_' + D + '_dev');
        incOnce('total/devices', ls, 'av4_dev_total');
        incOnce('days/' + D + '/lang/' + lang(), ls, 'av4_' + D + '_lang');
        incOnce('days/' + D + '/mode/' + mode(), ls, 'av4_' + D + '_mode');
        incOnce('days/' + D + '/os/' + os(), ls, 'av4_' + D + '_os');

        // Sayfa sayıları: bir cihaz bir sayfayı günde yalnızca 1 kez sayar
        incOnce('pages/' + P, ls, 'av4_' + D + '_pt_' + P);
        incOnce('days/' + D + '/pages/' + P, ls, 'av4_' + D + '_page_' + P);
    }

    function start() {
        ready().then(run).catch(function () {});
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
