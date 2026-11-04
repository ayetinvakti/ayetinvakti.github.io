/* Ayetin Vakti - ortak sol menü (tek kaynak, TR / EN / AR)
 * Kullanım (her sayfada):
 *   1) <head> içine:  <script src="https://ayetinvakti.github.io/menu.js" defer></script>
 *   2) Üst çubuğa buton: <button class="icon-btn" data-drawer-toggle aria-label="Menü">☰</button>
 * Dil: localStorage 'user_lang' (tr / en / ar), Ayarlar sayfasıyla aynı anahtar. Arapçada menü sağdan açılır.
 * Menüye yeni sayfa eklemek için yalnızca MENU listesi ve T sözlüğü değişir.
 * Tema: sayfadaki --drawer-bg, --card-bg, --text-color, --text-muted, --accent-color değişkenlerini kullanır. */
(function () {
  if (window.__avMenuLoaded) return;
  window.__avMenuLoaded = true;

  var BASE = 'https://ayetinvakti.github.io/';
  // [çeviri anahtarı, simge, yol]  (yol: repo klasörü ya da dosya; ana sayfa için boş)
  var MENU = [
    { items: [['home', '🏠', '']] },
    { title: 'cat_worship', items: [
      ['menu_prayer', '🕌', 'Namaz-vakitleri'],
      ['menu_kaza', '⏳', 'kaza-namazi'],
      ['menu_55', '🤲🏻', '5-5-namaz'],
      ['menu_imsakiye', '🌙', 'Ramazan-ozel-imsakiye'],
      ['menu_qibla', '🧭', 'kible-pusulasi'],
      ['menu_mosques', '📍', 'Yakindaki-Camiler'],
      ['menu_zekat', '💰', 'zekat-hesaplama'],
      ['menu_dhikr', '📿', 'Zikirmatik']
    ] },
    { title: 'cat_learn', items: [
      ['menu_quran', '📖', 'kuran-oku'],
      ['menu_verse', '✨', 'gunun-ayeti'],
      ['menu_esma', '☪️', 'esma.html'],
      ['menu_catechism', '📚', 'Ilmihal'],
      ['menu_prayers', '🤲', 'gunluk-dualar'],
      ['menu_days', '📅', 'dini-gunler'],
      ['menu_sermon', '📜', 'Haftanin-Hutbesi'],
      ['menu_teacher', '🧎', 'namaz-ogretmeni'],
      ['menu_biography_of_the_Prophet', '📗', 'Siyer-i-Nebi']
    ] },
    { title: 'cat_interact', items: [
      ['menu_assistant', '💬', 'ayet-asistan'],
      ['menu_taboo', '🤫', 'Islami-Tabu']
    ] }
  ];
  var YOUTUBE = 'https://www.youtube.com/@AyetinVakti';

  // tr/en/ar: menü anahtarları ana sayfadaki sözlükle aynıdır.
  var T = {
    tr: { title: 'Ayetin Vakti', close: 'Menüyü kapat', home: 'Ana Sayfa', cat_worship: 'İbadet & Vakitler', cat_learn: 'Okuma & Öğrenme', cat_interact: 'Etkileşim',
      menu_prayer: 'Namaz Vakitleri', menu_kaza: 'Kaza Namazı', menu_55: '5-5 Namaz', menu_imsakiye: 'Ramazan İmsakiyesi', menu_qibla: 'Kıble Pusulası', menu_mosques: 'Yakındaki Camiler', menu_zekat: 'Zekat Hesaplama', menu_dhikr: 'Zikirmatik',
      menu_quran: "Kur'an-ı Kerim Oku", menu_verse: 'Günün Ayeti', menu_esma: 'Esmaül Hüsna', menu_catechism: 'İlmihal', menu_prayers: 'Günlük Dualar', menu_days: 'Dini Günler', menu_sermon: 'Haftanın Hutbesi', menu_teacher: 'Namaz Öğretmeni', menu_biography_of_the_Prophet: 'Siyer-i Nebi',
      menu_assistant: 'Ayet Asistan', menu_taboo: 'İslami Tabu', menu_youtube: 'YouTube Kanalı', menu_settings: 'Ayarlar' },
    en: { title: 'Ayetin Vakti', close: 'Close menu', home: 'Home', cat_worship: 'Worship & Times', cat_learn: 'Reading & Learning', cat_interact: 'Interactive',
      menu_prayer: 'Prayer Times', menu_kaza: 'Missed Prayers', menu_55: '5-5 Namaz', menu_imsakiye: 'Ramadan Timetable', menu_qibla: 'Qibla Compass', menu_mosques: 'Nearby Mosques', menu_zekat: 'Zakat Calculator', menu_dhikr: 'Tasbih Counter',
      menu_quran: 'Read Holy Quran', menu_verse: 'Verse of the Day', menu_esma: 'Asmaul Husna', menu_catechism: 'Ilmihal (Islamic Catechism)', menu_prayers: 'Daily Supplications', menu_days: 'Religious Days', menu_sermon: 'Weekly Sermon', menu_teacher: 'Prayer Teacher', menu_biography_of_the_Prophet: 'Life of the Prophet',
      menu_assistant: 'Verse Assistant', menu_taboo: 'Islamic Taboo', menu_youtube: 'YouTube Channel', menu_settings: 'Settings' },
    ar: { title: 'Ayetin Vakti', close: 'إغلاق القائمة', home: 'الرئيسية', cat_worship: 'العبادة والأوقات', cat_learn: 'القراءة والتعلّم', cat_interact: 'تفاعلي',
      menu_prayer: 'أوقات الصلاة', menu_kaza: 'الصلوات الفائتة', menu_55: '5-5 Namaz', menu_imsakiye: 'إمساكية رمضان', menu_qibla: 'بوصلة القبلة', menu_mosques: 'المساجد القريبة', menu_zekat: 'حساب الزكاة', menu_dhikr: 'مسبحة إلكترونية',
      menu_quran: 'قراءة القرآن الكريم', menu_verse: 'آية اليوم', menu_esma: 'أسماء الله الحسنى', menu_catechism: 'الفقه الميسر (العلمحال)', menu_prayers: 'الأدعية اليومية', menu_days: 'الأيام الدينية', menu_sermon: 'خطبة الأسبوع', menu_teacher: 'معلّم الصلاة', menu_biography_of_the_Prophet: 'السيرة النبوية',
      menu_assistant: 'مساعد الآيات', menu_taboo: 'تابو إسلامي', menu_youtube: 'قناة يوتيوب', menu_settings: 'الإعدادات' }
  };

  var CSS = '' +
    '.avm-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.6);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);z-index:100;opacity:0;visibility:hidden;transition:opacity .3s,visibility .3s}' +
    '.avm-overlay.avm-open{opacity:1;visibility:visible}' +
    '.avm-drawer{position:fixed;top:0;left:0;bottom:0;width:300px;max-width:85vw;background:var(--drawer-bg,#1e293b);color:var(--text-color,#f8fafc);z-index:101;box-shadow:5px 0 25px rgba(0,0,0,.3);display:flex;flex-direction:column;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px);transform:translateX(-105%);visibility:hidden;transition:transform .3s cubic-bezier(.4,0,.2,1),visibility .3s;touch-action:manipulation}' +
    'html[dir="rtl"] .avm-drawer{left:auto;right:0;transform:translateX(105%);box-shadow:-5px 0 25px rgba(0,0,0,.3)}' +
    'html.light-mode .avm-drawer{background:var(--drawer-bg,#ffffff)}' +
    '.avm-drawer.avm-open,html[dir="rtl"] .avm-drawer.avm-open{transform:none;visibility:visible}' +
    '.avm-head{display:flex;justify-content:space-between;align-items:center;padding:20px;border-bottom:1px solid rgba(128,128,128,.15)}' +
    '.avm-title{font-size:19px;line-height:1.2;font-weight:800;color:var(--accent-color,#00bcd4)}' +
    '.avm-close{background:none;border:none;color:var(--text-color,#f8fafc);cursor:pointer;padding:6px;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-family:inherit}'+
    '.avm-close svg{width:20px;height:20px;display:block}' +
    '.avm-links{display:flex;flex-direction:column;gap:4px;padding:16px;overflow-y:auto;flex:1;overscroll-behavior:contain;-webkit-overflow-scrolling:touch}' +
    '.avm-cat{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:var(--text-muted,#94a3b8);padding:12px 12px 6px;margin-top:4px}' +
    '.avm-item{box-sizing:border-box;line-height:1.3;display:flex;align-items:center;gap:12px;padding:12px;color:var(--text-color,#f8fafc);text-decoration:none;border-radius:10px;font-size:14px;font-weight:500;transition:background .2s}' +
    '.avm-item[aria-current="page"]{background:color-mix(in srgb,var(--accent-color,#00bcd4) 16%,transparent);font-weight:700}' +
    '.avm-ico{width:32px;height:32px;border-radius:8px;background:color-mix(in srgb,var(--accent-color,#00bcd4) 10%,transparent);display:flex;align-items:center;justify-content:center;font-size:16px;flex:none}' +
    '.avm-div{height:1px;background:rgba(128,128,128,.15);margin:12px 0}' +
    '@media (hover:hover){.avm-item:hover{background:color-mix(in srgb,var(--accent-color,#00bcd4) 8%,transparent)}}';

  function lang() {
    var l = '';
    try { l = localStorage.getItem('user_lang') || ''; } catch (e) {}
    return T[l] ? l : 'tr';
  }

  function currentSeg() {
    var seg = (location.pathname.split('/').filter(Boolean)[0] || '').toLowerCase();
    return seg === 'index.html' ? '' : seg;
  }

  function item(label, icon, path, cur) {
    var active = path.toLowerCase() === cur ? ' aria-current="page"' : '';
    return '<a class="avm-item" href="' + BASE + (path ? path + (path.indexOf('.') > -1 ? '' : '/') : '') + '"' + active + '>' +
      '<span class="avm-ico">' + icon + '</span><span>' + label + '</span></a>';
  }

  var overlay, drawer, closeBtn, linksEl, lastFocus;

  // Dile göre menü içeriğini (yeniden) çizer
  function render() {
    if (!drawer) return;
    var tr = T[lang()], cur = currentSeg(), html = '';
    MENU.forEach(function (g, gi) {
      if (gi > 0) html += '<div class="avm-div"></div>';
      if (g.title) html += '<div class="avm-cat">' + tr[g.title] + '</div>';
      g.items.forEach(function (it) { html += item(tr[it[0]], it[1], it[2], cur); });
    });
    html += '<div class="avm-div"></div>' +
      '<a class="avm-item" href="' + YOUTUBE + '" target="_blank" rel="noopener"><span class="avm-ico" style="background:rgba(255,0,0,.1)">' +
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="#ff0000" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>' +
      '</span><span>' + tr.menu_youtube + '</span></a>' +
      item(tr.menu_settings, '⚙️', 'ayarlar', cur);
    linksEl.innerHTML = html;
    drawer.setAttribute('aria-label', tr.title);
    closeBtn.setAttribute('aria-label', tr.close);
  }

  function build() {
    if (document.getElementById('avmDrawer')) return;
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
    drawer.setAttribute('aria-hidden', 'true');
    drawer.innerHTML = '<div class="avm-head"><div class="avm-title">Ayetin Vakti</div>' +
      '<button type="button" class="avm-close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg></button></div><nav class="avm-links"></nav>';
    closeBtn = drawer.querySelector('.avm-close');
    linksEl = drawer.querySelector('.avm-links');
    closeBtn.addEventListener('click', close);
    // Menüden sayfaya geçerken (aynı sekmede) menü kapanır
    drawer.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a.avm-item');
      if (a && a.target !== '_blank') close();
    });

    document.body.appendChild(overlay);
    document.body.appendChild(drawer);
    render();

    // Sayfa dili değişince (html lang) menü de yeni dile geçer
    if (window.MutationObserver) {
      new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    }
  }

  function isOpen() { return !!drawer && drawer.classList.contains('avm-open'); }

  function open() {
    build();
    render();
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

  window.avMenu = { open: open, close: close, toggle: toggle, refresh: render };
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
