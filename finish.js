/* Ayetin Vakti: yüzey görünümü (mat / parlak)
   Ayarlar sayfasında seçilen "custom_finish" kaydını okur. Kayıt "glossy" değilse hiçbir şey yapmaz (mat = mevcut düz görünüm).
   Sayfada parlamasını istemediğiniz bir öğeye "no-gloss" sınıfı ekleyin. */
(function () {
    var glossy = false;
    try { glossy = localStorage.getItem('custom_finish') === 'glossy'; } catch (e) {}
    if (!glossy) return;

    var root = document.documentElement;
    root.classList.add('finish-glossy');

    var cards = ':is([class*="card"], [class*="navbar"]):not(.no-gloss)';
    var btns = '[class*="btn"]:not(.back-btn):not(.modal-close):not(.no-gloss)';

    var css = [
        'html.finish-glossy ' + cards + ' {',
        '  background-image: linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.04) 40%, rgba(255,255,255,0) 62%);',
        '  box-shadow: inset 0 1px 0 rgba(255,255,255,0.4), 0 6px 18px rgba(0,0,0,0.25);',
        '}',
        'html.finish-glossy ' + btns + ' {',
        '  background-image: linear-gradient(180deg, rgba(255,255,255,0.3), rgba(255,255,255,0) 62%);',
        '  box-shadow: inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 6px rgba(0,0,0,0.22);',
        '}',
        'html.light-mode.finish-glossy ' + cards + ' {',
        '  background-image: linear-gradient(180deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0) 55%), linear-gradient(0deg, rgba(15,23,42,0.06) 0%, rgba(15,23,42,0) 40%);',
        '  box-shadow: inset 0 1px 0 rgba(255,255,255,0.9), 0 6px 18px rgba(15,23,42,0.12);',
        '}',
        'html.light-mode.finish-glossy ' + btns + ' {',
        '  box-shadow: inset 0 1px 0 rgba(255,255,255,0.8), 0 2px 6px rgba(15,23,42,0.15);',
        '}'
    ].join('\n');

    var st = document.createElement('style');
    st.id = 'finish-style';
    st.textContent = css;
    (document.head || root).appendChild(st);
})();
