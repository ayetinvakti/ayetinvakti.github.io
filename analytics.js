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
    function loadScript(src) {
        return new Promise(function (res, rej) {
            var s = document.createElement('script');
            s.src = src; s.async = true; s.onload = res; s.onerror = rej;
            document.head.appendChild(s);
        });
    }
    function ready() {
        if (window.firebase && firebase.database) return Promise.resolve();
        var p = (window.firebase && firebase.initializeApp) ? Promise.resolve() : loadScript(SDK + 'firebase-app-compat.js');
        return p.then(function () { return loadScript(SDK + 'firebase-database-compat.js'); });
    }

    function run() {
        var db;
        try {
            var app = null;
            try { app = firebase.app('av-stats'); } catch (e) { app = firebase.initializeApp(CFG, 'av-stats'); }
            db = app.database();
        } catch (e) { return; }
        function inc(path) {
            try { return db.ref('stats/' + path).transaction(function (v) { return (v || 0) + 1; }, undefined, false).catch(function () {}); }
            catch (e) { return null; }
        }
        var D = today(), P = pageKey();

        if (!ss('av_s')) {                                   // oturumun ilk sayfası = 1 ziyaret
            ss('av_s', '1');
            inc('total/visits');
            inc('days/' + D + '/visits');
            inc('days/' + D + '/lang/' + lang());
            inc('days/' + D + '/mode/' + mode());
            inc('days/' + D + '/os/' + os());
            if (ls('av_day') !== D) { ls('av_day', D); inc('days/' + D + '/devices'); }   // günde 1 benzersiz cihaz
            if (!ls('av_dev')) { ls('av_dev', '1'); inc('total/devices'); }                // ilk kez gelen cihaz
        }
        if (!ss('av_p_' + P)) {                              // aynı oturumda her sayfa 1 kez sayılır
            ss('av_p_' + P, '1');
            inc('pages/' + P);
            inc('days/' + D + '/pages/' + P);
        }
    }

    function start() {
        var go = function () { ready().then(run).catch(function () {}); };
        if ('requestIdleCallback' in window) requestIdleCallback(go, { timeout: 4000 }); else setTimeout(go, 1500);
    }
    if (document.readyState === 'complete') start(); else window.addEventListener('load', start);
})();
