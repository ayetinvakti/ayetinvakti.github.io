/* Ayetin Vakti - ortak sol menü (tek kaynak)
 * Kullanım (her sayfada):
 *   1) <head> içine:  <script src="https://ayetinvakti.github.io/menu.js" defer></script>
 *   2) Üst çubuğa buton: <button class="icon-btn" data-drawer-toggle aria-label="Menü">☰</button>
 * Menüye yeni sayfa eklemek için yalnızca bu dosyadaki MENU listesi değişir.
 * Tema: sayfadaki --drawer-bg, --card-bg, --text-color, --text-muted, --accent-color değişkenlerini kullanır. */
(function () {
  if (window.__avMenuLoaded) return;
  window.__avMenuLoaded = true;

  var BASE = 'https://ayetinvakti.github.io/';
  // [başlık, simge, yol]  (yol: repo klasörü ya da dosya; ana sayfa için boş)
  var MENU = [
    { items: [['Ana Sayfa', '🏠', '']] },
    { title: 'İbadet & Vakitler', items: [
      ['Namaz Vakitleri', '🕌', 'Namaz-vakitleri'],
      ['Kaza Namazı', '⏳', 'kaza-namazi'],
      ['5-5 Namaz', '🤲🏻', '5-5-namaz'],
      ['Ramazan İmsakiyesi', '🌙', 'Ramazan-ozel-imsakiye'],
      ['Kıble Pusulası', '🧭', 'kible-pusulasi'],
      ['Yakındaki Camiler', '📍', 'Yakindaki-Camiler'],
      ['Zekat Hesaplama', '💰', 'zekat-hesaplama'],
      ['Zikirmatik', '📿', 'Zikirmatik']
    ] },
    { title: 'Okuma & Öğrenme', items: [
      ['Kur\u2019an-ı Kerim Oku', '📖', 'kuran-oku'],
      ['Günün Ayeti', '✨', 'gunun-ayeti'],
      ['Esmaül Hüsna', '☪️', 'esma.html'],
      ['İlmihal', '📚', 'Ilmihal'],
      ['Günlük Dualar', '🤲', 'gunluk-dualar'],
      ['Dini Günler', '📅', 'dini-gunler'],
      ['Haftanın Hutbesi', '📜', 'Haftanin-Hutbesi'],
      ['Namaz Öğretmeni', '🧎', 'namaz-ogretmeni'],
      ['Siyer-i Nebi', '🕊️', 'Siyer-i-Nebi']
    ] },
    { title: 'Etkileşim', items: [
      ['Ayet Asistan', '💬', 'ayet-asistan'],
      ['Dini Tabu', '🎲', 'Islami-Tabu']
    ] }
  ];
  var YOUTUBE = 'https://www.youtube.com/@AyetinVakti';
  var SETTINGS = ['Ayarlar', '⚙️', 'ayarlar'];

  var CSS = '' +
    '.avm-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.6);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);z-index:100;opacity:0;visibility:hidden;transition:opacity .3s,visibility .3s}' +
    '.avm-overlay.avm-open{opacity:1;visibility:visible}' +
    '.avm-drawer{position:fixed;top:0;left:0;bottom:0;width:300px;max-width:85vw;background:var(--drawer-bg,var(--card-bg,#162032));color:var(--text-color,#f8fafc);z-index:101;box-shadow:5px 0 25px rgba(0,0,0,.3);display:flex;flex-direction:column;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px);transform:translateX(-105%);visibility:hidden;transition:transform .3s cubic-bezier(.4,0,.2,1),visibility .3s;touch-action:manipulation}' +
    '.avm-drawer.avm-open{transform:none;visibility:visible}' +
    '.avm-head{display:flex;justify-content:space-between;align-items:center;padding:20px;border-bottom:1px solid rgba(128,128,128,.15)}' +
    '.avm-title{font-size:1.2rem;font-weight:800;color:var(--accent-color,#00bcd4)}' +
    '.avm-close{background:none;border:none;color:var(--text-color,#f8fafc);font-size:20px;cursor:pointer;padding:6px;font-family:inherit}' +
    '.avm-links{display:flex;flex-direction:column;gap:4px;padding:16px;overflow-y:auto;flex:1;overscroll-behavior:contain;-webkit-overflow-scrolling:touch}' +
    '.avm-cat{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:var(--text-muted,#94a3b8);padding:12px 12px 6px;margin-top:4px}' +
    '.avm-item{display:flex;align-items:center;gap:12px;padding:12px;color:var(--text-color,#f8fafc);text-decoration:none;border-radius:10px;font-size:14px;font-weight:500;transition:background .2s}' +
    '.avm-item[aria-current="page"]{background:color-mix(in srgb,var(--accent-color,#00bcd4) 16%,transparent);font-weight:700}' +
    '.avm-ico{width:32px;height:32px;border-radius:8px;background:color-mix(in srgb,var(--accent-color,#00bcd4) 10%,transparent);display:flex;align-items:center;justify-content:center;font-size:16px;flex:none}' +
    '.avm-div{height:1px;background:rgba(128,128,128,.15);margin:12px 0}' +
    '@media (hover:hover){.avm-item:hover{background:color-mix(in srgb,var(--accent-color,#00bcd4) 8%,transparent)}}';

  function currentSeg() {
    var seg = (location.pathname.split('/').filter(Boolean)[0] || '').toLowerCase();
    return seg === 'index.html' ? '' : seg;
  }

  function item(t, icon, path, cur) {
    var active = path.toLowerCase() === cur ? ' aria-current="page"' : '';
    return '<a class="avm-item" href="' + BASE + (path ? path + (path.indexOf('.') > -1 ? '' : '/') : '') + '"' + active + '>' +
      '<span class="avm-ico">' + icon + '</span><span>' + t + '</span></a>';
  }

  var overlay, drawer, closeBtn, lastFocus;

  function build() {
    if (document.getElementById('avmDrawer')) return;
    var cur = currentSeg();
    var html = '';
    MENU.forEach(function (g, gi) {
      if (gi > 0) html += '<div class="avm-div"></div>';
      if (g.title) html += '<div class="avm-cat">' + g.title + '</div>';
      g.items.forEach(function (it) { html += item(it[0], it[1], it[2], cur); });
    });
    html += '<div class="avm-div"></div>' +
      '<a class="avm-item" href="' + YOUTUBE + '" target="_blank" rel="noopener"><span class="avm-ico" style="background:rgba(255,0,0,.1)">' +
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="#ff0000" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>' +
      '</span><span>YouTube Kanalı</span></a>' +
      item(SETTINGS[0], SETTINGS[1], SETTINGS[2], cur);

    var style = document.createElement('style');
    style.id = 'avmStyle';
    style.textContent = CSS;
    document.head.appendChild(style);

    overlay = document.createElement('div');
    overlay.className = 'avm-overlay';
    overlay.addEventListener('click', close);

    drawer = document.createElement('div');
    drawer.id = 'avmDrawer';
    drawer.className = 'avm-drawer';
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-modal', 'true');
    drawer.setAttribute('aria-label', 'Ayetin Vakti menüsü');
    drawer.setAttribute('aria-hidden', 'true');
    drawer.innerHTML = '<div class="avm-head"><div class="avm-title">Ayetin Vakti</div>' +
      '<button type="button" class="avm-close" aria-label="Menüyü kapat">✕</button></div>' +
      '<nav class="avm-links">' + html + '</nav>';
    closeBtn = drawer.querySelector('.avm-close');
    closeBtn.addEventListener('click', close);
    // Menüden sayfaya geçerken (aynı sekmede) menü kapanır
    drawer.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a.avm-item');
      if (a && a.target !== '_blank') close();
    });

    document.body.appendChild(overlay);
    document.body.appendChild(drawer);
  }

  function isOpen() { return !!drawer && drawer.classList.contains('avm-open'); }

  function open() {
    build();
    lastFocus = document.activeElement;
    overlay.classList.add('avm-open');
    drawer.classList.add('avm-open');
    drawer.setAttribute('aria-hidden', 'false');
    if (closeBtn) closeBtn.focus({ preventScroll: true });
  }

  function close() {
    if (!drawer) return;
    overlay.classList.remove('avm-open');
    drawer.classList.remove('avm-open');
    drawer.setAttribute('aria-hidden', 'true');
    if (lastFocus && lastFocus.focus) { try { lastFocus.focus({ preventScroll: true }); } catch (e) {} }
  }

  function toggle() { isOpen() ? close() : open(); }

  window.avMenu = { open: open, close: close, toggle: toggle };
  window.toggleDrawer = toggle; // eski onclick="toggleDrawer()" kullanan sayfalarla uyumluluk

  // ☰ düğmesi: data-drawer-toggle özniteliği olan her öğe menüyü açar/kapatır
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-drawer-toggle]');
    if (t) { e.preventDefault(); toggle(); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen()) close();
  });

  if (document.body) build();
  else document.addEventListener('DOMContentLoaded', build);
})();
