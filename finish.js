/* Ayetin Vakti - ortak yüzey görünümü (Mat / Parlak) - finish.js
   Sayfaların <head> kısmında, diğer scriptlerden ÖNCE yüklenir. Sayfa kodunda değişiklik gerektirmez.
   Yaptıkları:
   1) Kayıtlı 'custom_finish' = 'glossy' ise <html> üzerine .finish-glossy ekler (mat = sınıf yok).
   2) Yüzeyin (kart/buton zemini) açık mı koyu mu olduğunu bulur: özel arka plan varsa onun açıklığına,
      yoksa temaya göre. <html> üzerine .surf-light / .surf-dark koyar. Parlama bu sınıfa göre çalışır;
      böylece "açık mod + koyu özel zemin" gibi karışık durumlarda bozulmaz.
   3) Özel arka plan varken tema değişkenlerinden zemine bağlı olanları (--btn-bg, --btn-hover, --bead-inactive,
      --shadow; yazı rengi seçildiyse --text-muted ve --border-color) zeminden türetir. Özel zemin yoksa bunları
      kaldırır, temanın kendi değerleri geçerli olur.
   4) Tema/renk değişince (html'in class/style'ı değişince) ve sayfa geri gelince yeniden hesaplar.
   Parlama yalnızca gerçek kart/butonlara uygulanır; şeffaf üst çubuğa (.navbar) ve liste kapsayıcılarına UYGULANMAZ. */
(function () {
    'use strict';
    var d = document.documentElement;
    var busy = false;

    function ls(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }

    function hex(v) {
        var m = /^#([0-9a-f]{6})$/i.exec((v || '').trim());
        return m ? m[1] : null;
    }
    function lum(h) {
        var n = parseInt(h, 16);
        function lin(c) { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
        return 0.2126 * lin(n >> 16) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255);
    }
    function themeIsLight() {
        var t = ls('theme');
        if (t === 'light') return true;
        if (t === 'dark') return false;
        return !(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    function setCls(name, on) {
        if (d.classList.contains(name) !== on) d.classList.toggle(name, on);
    }
    function setVar(name, val) {
        if (d.style.getPropertyValue(name) !== val) d.style.setProperty(name, val);
    }
    function delVar(name) {
        if (d.style.getPropertyValue(name)) d.style.removeProperty(name);
    }

    var DERIVED = ['--btn-bg', '--btn-hover', '--bead-inactive', '--shadow'];
    var hadCustomBg = false;

    function sync() {
        if (busy) return;
        busy = true;
        try {
            // Tema sınıfı sayfanın kendi scripti tarafından konur; henüz yoksa kayıttan/sistemden hesaplanır
            var isLightTheme = d.classList.contains('light-mode') || themeIsLight();

            setCls('finish-glossy', ls('custom_finish') === 'glossy');

            var bg = hex(ls('custom_bg'));
            var txt = hex(ls('custom_text'));
            var surfLight;

            if (bg) {
                var bgLight = lum(bg) > 0.18;
                surfLight = bgLight;
                hadCustomBg = true;
                if (bgLight) {
                    setVar('--btn-bg', 'rgba(15,23,42,0.06)');
                    setVar('--btn-hover', 'rgba(15,23,42,0.12)');
                    setVar('--shadow', '0 10px 25px rgba(15,23,42,0.10)');
                } else {
                    setVar('--btn-bg', 'rgba(255,255,255,0.07)');
                    setVar('--btn-hover', 'rgba(255,255,255,0.13)');
                    setVar('--shadow', '0 10px 25px rgba(0,0,0,0.40)');
                }
                setVar('--bead-inactive', 'color-mix(in srgb, var(--text-color) 28%, var(--bg-color))');
                // Yazı rengi kullanıcı tarafından seçildiyse ikincil yazı/kenarlık ondan türetilir
                // (seçilmediyse sayfanın kendi scripti zemine göre belirler)
                if (txt) {
                    setVar('--text-muted', 'color-mix(in srgb, var(--text-color) 68%, transparent)');
                    setVar('--border-color', 'color-mix(in srgb, var(--text-color) 24%, transparent)');
                }
            } else {
                surfLight = isLightTheme;
                if (hadCustomBg) {
                    DERIVED.forEach(delVar);
                    hadCustomBg = false;
                }
            }
            setCls('surf-light', surfLight);
            setCls('surf-dark', !surfLight);
        } finally {
            busy = false;
        }
    }

    // Sayfa çizilmeden önce hızlı uygulama (tema sınıfı henüz yoksa kayıttan)
    sync();

    // Sayfanın scripti tema sınıfını / özel renkleri sonradan koyar veya değiştirir: değişince yeniden hesapla
    if (window.MutationObserver) {
        var mo = new MutationObserver(function () { sync(); mo.takeRecords(); });
        mo.observe(d, { attributes: true, attributeFilter: ['class', 'style'] });
    }
    window.addEventListener('pageshow', sync);
    window.addEventListener('storage', sync);
    document.addEventListener('DOMContentLoaded', sync);

    // ---- Parlak görünüm CSS'i (yalnızca gerçek kart ve butonlar) ----
    var CARDS = '.vakit-card:not(.active), .sweet-dhikr-bar, .mode-bar, .modal-card, .ios-modal-content, .settings-card';
    var BTNS = '.avm-ico, .avm-item[aria-current="page"], .btn, .tool-btn, .notification-btn, .home-btn, .theme-icon-btn, .menu-btn, .back-btn, .btn-ui, .target-opt-btn:not(.active), .sweet-dhikr-item.active, .mode-item.active';
    function pre(list, extra) {
        return list.split(',').map(function (s) { return 'html.finish-glossy ' + s.trim() + (extra || ''); }).join(',\n');
    }
    function preL(list) {
        return list.split(',').map(function (s) { return 'html.finish-glossy.surf-light ' + s.trim(); }).join(',\n');
    }
    var css = [
        '/* Koyu yüzey */',
        pre(CARDS) + ' {',
        '  background-origin: border-box; background-repeat: no-repeat;',
        '  background-image: linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.04) 40%, rgba(255,255,255,0) 62%);',
        '  box-shadow: inset 0 1px 0 rgba(255,255,255,0.4), 0 6px 18px rgba(0,0,0,0.25);',
        '}',
        pre(BTNS) + ' {',
        '  background-origin: border-box; background-repeat: no-repeat;',
        '  background-image: linear-gradient(180deg, rgba(255,255,255,0.3), rgba(255,255,255,0) 62%);',
        '  box-shadow: inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 6px rgba(0,0,0,0.22);',
        '}',
        /* Aktif vakit kartı: parıltı korunur, üstüne parlama eklenir */
        'html.finish-glossy .vakit-card.active {',
        '  background-origin: border-box; background-repeat: no-repeat;',
        '  background-image: linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 60%);',
        '  box-shadow: inset 0 1px 0 rgba(255,255,255,0.4), 0 0 10px color-mix(in srgb, var(--accent-color) 30%, transparent);',
        '}',
        /* Açık yüzey: beyaz parlama görünmez, üstte parlama + altta hafif gölgelenme */
        '/* Açık yüzey */',
        preL(CARDS) + ' {',
        '  background-origin: border-box; background-repeat: no-repeat;',
        '  background-image: linear-gradient(180deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0) 55%), linear-gradient(0deg, rgba(15,23,42,0.06) 0%, rgba(15,23,42,0) 40%);',
        '  box-shadow: inset 0 1px 0 rgba(255,255,255,0.9), 0 6px 18px rgba(15,23,42,0.12);',
        '}',
        preL(BTNS) + ' {',
        '  background-origin: border-box; background-repeat: no-repeat;',
        '  background-image: linear-gradient(180deg, rgba(255,255,255,0.7), rgba(255,255,255,0) 62%);',
        '  box-shadow: inset 0 1px 0 rgba(255,255,255,0.8), 0 2px 6px rgba(15,23,42,0.15);',
        '}',
        'html.finish-glossy.surf-light .vakit-card.active {',
        '  background-origin: border-box; background-repeat: no-repeat;',
        '  background-image: linear-gradient(180deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0) 60%);',
        '  box-shadow: inset 0 1px 0 rgba(255,255,255,0.9), 0 0 10px color-mix(in srgb, var(--accent-color) 30%, transparent);',
        '}',
        /* Sol menü (menu.js çekmecesi): zemini --card-bg'den gelir; parlama burada eklenir */
        'html.finish-glossy .avm-drawer {',
        '  background-origin: border-box; background-repeat: no-repeat;',
        '  background-image: linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 28%, rgba(255,255,255,0) 50%);',
        '  box-shadow: inset 0 1px 0 rgba(255,255,255,0.35), 5px 0 25px rgba(0,0,0,0.3);',
        '}',
        'html[dir="rtl"].finish-glossy .avm-drawer { box-shadow: inset 0 1px 0 rgba(255,255,255,0.35), -5px 0 25px rgba(0,0,0,0.3); }',
        'html.finish-glossy.surf-light .avm-drawer {',
        '  background-image: linear-gradient(180deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0) 40%), linear-gradient(0deg, rgba(15,23,42,0.05) 0%, rgba(15,23,42,0) 35%);',
        '  box-shadow: inset 0 1px 0 rgba(255,255,255,0.9), 5px 0 25px rgba(15,23,42,0.18);',
        '}',
        'html[dir="rtl"].finish-glossy.surf-light .avm-drawer { box-shadow: inset 0 1px 0 rgba(255,255,255,0.9), -5px 0 25px rgba(15,23,42,0.18); }',
        /* Sistem kontrolleri (seçim listesi vb.) yüzey açıklığına uysun; sayfanın html.light-mode kuralını geçsin diye :root ile güçlendirildi */
        'html:root.surf-dark { color-scheme: dark; }',
        'html:root.surf-light { color-scheme: light; }'
    ].join('\n');

    var st = document.createElement('style');
    st.id = 'finish-css';
    st.textContent = css;
    (document.head || d).appendChild(st);
})();
