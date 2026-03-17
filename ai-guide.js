/**
 * AI Guide — abhishektrivedi.com  v2
 * Drop-in: add  <script src="ai-guide.js" defer></script>  before </body>
 */
(function () {
  'use strict';

  /* ── STOP DEFINITIONS ─────────────────────────────────────────────────
   * selectors : tried in order; first match wins
   * textMatch : fallback — finds the nearest block-level ancestor
   *             whose text CONTAINS this string
   * dotSide   : where the numbered dot sits on the element
   *             'tl' top-left | 'tr' top-right | 'bl' | 'br'
   * ------------------------------------------------------------------- */
  var STOPS = [
    {
      selectors: ['nav', 'header', 'body > nav', '.nav'],
      textMatch: null,
      dotSide: 'br',
      eyebrow: 'Navigation',
      title: 'Sparse nav, strong hierarchy',
      body: 'Four links. The monospaced "AT." logo is both home button and personal brand mark. The terracotta CTA is the only coloured element — guiding the eye exactly where it needs to go.'
    },
    {
      selectors: ['#hero', '.hero', '.hero-section', 'main > section:first-child'],
      textMatch: 'I build learning',
      dotSide: 'tl',
      eyebrow: 'Hero',
      title: 'The 3-second value pitch',
      body: 'DM Serif Display italic in terracotta on "think." does the heavy lifting — one brand-accent word signals what makes this portfolio different from every other L&D résumé.'
    },
    {
      selectors: ['.marquee-wrap', '.marquee', '.ticker', '[class*="marquee"]'],
      textMatch: 'Articulate Storyline',
      dotSide: 'tl',
      eyebrow: 'Skills Ticker',
      title: 'Full-bleed ink as a divider',
      body: 'The near-black strip creates a hard visual break. JetBrains Mono reads like terminal output — reinforcing the developer-hybrid identity without ever saying so.'
    },
    {
      selectors: ['#what', '.what-section', '[class*="what"]', '[id*="what"]'],
      textMatch: 'Design thinking meets',
      dotSide: 'tr',
      eyebrow: 'What I Do',
      title: '3 columns, 3 identities in one',
      body: 'Each card positions Abhishek as a triple-threat: designer, developer, and AI integrator. The 1 px rule-coloured gap creates column dividers without a visible border.'
    },
    {
      selectors: ['#competency', '.competency', '[class*="competency"]', '[id*="competency"]'],
      textMatch: 'L&D spectrum',
      dotSide: 'tr',
      eyebrow: 'Competency Map',
      title: 'Honesty as a design strategy',
      body: 'Saying "most L&D professionals are strong in one dimension" reframes the section — it is not a skills list, it is context that makes the radar chart meaningful.'
    },
    {
      selectors: ['#work', '.work-section', '[id*="work"]', '[class*="work"]'],
      textMatch: 'Case studies',
      dotSide: 'tr',
      eyebrow: 'Selected Work',
      title: 'Titles that carry the concept',
      body: '"When the Course Knows Your Name" tells a full story before you click. DM Serif Display gives the titles editorial weight while mono category tags keep the technical register.'
    },
    {
      selectors: ['#accessibility', '[id*="access"]', '[class*="access"]'],
      textMatch: 'architectural decision',
      dotSide: 'tl',
      eyebrow: 'Accessibility Practice',
      title: 'Show, do not tell — live proof',
      body: 'Toggle interactions let visitors feel the gap between accessible and inaccessible Storyline builds. A résumé claim becomes a lived experience the visitor actually remembers.'
    },
    {
      selectors: ['#demos', '.demos', '[id*="demo"]', '[class*="demo"]'],
      textMatch: "Don't just read",
      dotSide: 'tl',
      eyebrow: 'Interactive Demos',
      title: 'No PDFs. No screenshots.',
      body: 'Every demo runs live in the browser. Most L&D portfolios show slide decks — this one lets you operate the work. That gap is impossible to fake and very hard to ignore.'
    }
  ];

  /* ── FIND ELEMENT ───────────────────────────────────────────────────── */
  function findEl(stop) {
    for (var i = 0; i < stop.selectors.length; i++) {
      try {
        var el = document.querySelector(stop.selectors[i]);
        if (el) return el;
      } catch (e) {}
    }
    if (!stop.textMatch) return null;
    // walk block containers smallest-first (reverse querySelectorAll order)
    var all = document.querySelectorAll('section, article, div, header');
    var best = null;
    for (var j = 0; j < all.length; j++) {
      var c = all[j];
      if (c.innerText && c.innerText.indexOf(stop.textMatch) !== -1) {
        if (!best || c.offsetHeight < best.offsetHeight) best = c;
      }
    }
    return best;
  }

  /* ── STYLES ─────────────────────────────────────────────────────────── */
  var style = document.createElement('style');
  style.textContent = [
    '#ag-btn{position:fixed;bottom:24px;right:24px;z-index:99990;display:inline-flex;align-items:center;gap:8px;padding:10px 18px 10px 13px;background:#0f0f0f;color:#f5f2eb;border:none;cursor:pointer;font-family:"JetBrains Mono",monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;border-radius:2px;box-shadow:0 4px 20px rgba(0,0,0,.25);transition:background .2s;}',
    '#ag-btn:hover{background:#c84b2f;}',
    '#ag-btn .ag-d{width:7px;height:7px;border-radius:50%;background:#c84b2f;flex-shrink:0;animation:ag-bl 2s infinite;}',
    '@keyframes ag-bl{0%,100%{opacity:1}50%{opacity:.2}}',

    '#ag-bar{position:fixed;top:0;left:0;right:0;z-index:99995;display:none;align-items:center;justify-content:space-between;padding:9px 24px;background:#0f0f0f;border-bottom:2px solid #c84b2f;}',
    '#ag-bar.on{display:flex;}',
    '.ag-bl{display:flex;align-items:center;gap:14px;font-family:"JetBrains Mono",monospace;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:rgba(245,242,235,.55);}',
    '.ag-bt{color:#f5f2eb;}',
    '.ag-ps{display:flex;gap:3px;align-items:center;}',
    '.ag-p{height:3px;width:14px;border-radius:2px;background:rgba(255,255,255,.14);transition:all .25s;}',
    '.ag-p.dn{background:rgba(200,75,47,.45);}',
    '.ag-p.nw{background:#c84b2f;width:22px;}',
    '#ag-x{font-family:"JetBrains Mono",monospace;font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:rgba(245,242,235,.4);background:none;border:1px solid rgba(245,242,235,.15);padding:4px 10px;cursor:pointer;border-radius:2px;transition:color .15s,border-color .15s;}',
    '#ag-x:hover{color:#f5f2eb;border-color:rgba(245,242,235,.4);}',

    '.ag-hi{outline:2px solid #c84b2f !important;outline-offset:3px;position:relative;}',

    '.ag-hs{position:fixed;z-index:99992;width:28px;height:28px;display:none;cursor:pointer;}',
    '.ag-hs.vis{display:block;}',
    '.ag-rg{width:28px;height:28px;border-radius:50%;background:#c84b2f;border:2.5px solid #f5f2eb;display:flex;align-items:center;justify-content:center;font-family:"JetBrains Mono",monospace;font-size:10px;font-weight:500;color:#fff;box-shadow:0 0 0 0 rgba(200,75,47,.6);animation:ag-rg 2.4s ease-out infinite;transition:transform .15s;}',
    '.ag-hs:hover .ag-rg,.ag-hs.active .ag-rg{transform:scale(1.18);}',
    '@keyframes ag-rg{0%{box-shadow:0 0 0 0 rgba(200,75,47,.55)}70%{box-shadow:0 0 0 11px rgba(200,75,47,0)}100%{box-shadow:0 0 0 0 rgba(200,75,47,0)}}',

    '.ag-tt{position:fixed;z-index:99996;width:264px;background:#f5f2eb;border:1px solid #d4cfc6;border-top:3px solid #c84b2f;padding:14px 16px 12px;box-shadow:0 8px 32px rgba(15,15,15,.14);display:none;}',
    '.ag-tt.show{display:block;}',
    '.ag-tt::before{content:"";position:absolute;width:9px;height:9px;background:#f5f2eb;border:1px solid #d4cfc6;transform:rotate(45deg);}',
    '.ag-tt.al::before{top:12px;left:-5px;border-top:none;border-left:none;}',
    '.ag-tt.ar::before{top:12px;right:-5px;border-bottom:none;border-right:none;}',
    '.ag-tt.at::before{top:-6px;left:18px;border-bottom:none;border-right:none;border-top:1px solid #c84b2f;border-left:1px solid #c84b2f;}',
    '.ag-tt.ab::before{bottom:-5px;left:18px;border-top:none;border-left:none;}',
    '.ag-eb{font-family:"JetBrains Mono",monospace;font-size:9px;letter-spacing:.16em;text-transform:uppercase;color:#c84b2f;margin-bottom:5px;display:flex;align-items:center;gap:6px;}',
    '.ag-eb::before{content:"";display:block;width:12px;height:1px;background:#c84b2f;flex-shrink:0;}',
    '.ag-ti{font-family:"DM Serif Display",serif;font-size:1.02rem;line-height:1.22;color:#0f0f0f;margin-bottom:6px;}',
    '.ag-bo{font-family:"DM Sans",sans-serif;font-size:12px;font-weight:300;color:#6b6459;line-height:1.6;margin-bottom:11px;padding-bottom:10px;border-bottom:1px solid #d4cfc6;}',
    '.ag-ft{display:flex;align-items:center;justify-content:space-between;}',
    '.ag-ct{font-family:"JetBrains Mono",monospace;font-size:9px;letter-spacing:.08em;color:#6b6459;}',
    '.ag-nr{display:flex;gap:4px;}',
    '.ag-nb{width:26px;height:26px;border-radius:2px;border:1px solid #d4cfc6;background:#f5f2eb;color:#6b6459;font-family:"JetBrains Mono",monospace;font-size:12px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:border-color .15s,color .15s,background .15s;}',
    '.ag-nb:hover{border-color:#c84b2f;color:#c84b2f;background:#fdf0ed;}'
  ].join('');
  document.head.appendChild(style);

  /* ── BUILD DOM ──────────────────────────────────────────────────────── */
  var btn = document.createElement('button');
  btn.id = 'ag-btn';
  btn.innerHTML = '<span class="ag-d"></span>AI Guide \u2014 Tour this page';
  document.body.appendChild(btn);

  var bar = document.createElement('div');
  bar.id = 'ag-bar';
  bar.innerHTML =
    '<div class="ag-bl"><span class="ag-bt">AI Guide</span><span>\u00b7</span><div class="ag-ps" id="ag-ps"></div></div>' +
    '<button id="ag-x">Exit \u2715</button>';
  document.body.appendChild(bar);

  var hsEls = [], ttEls = [];

  STOPS.forEach(function (s, i) {
    var hs = document.createElement('div');
    hs.className = 'ag-hs';
    hs.innerHTML = '<div class="ag-rg">' + (i + 1) + '</div>';
    document.body.appendChild(hs);
    hsEls.push(hs);

    var tt = document.createElement('div');
    tt.className = 'ag-tt';
    tt.innerHTML =
      '<div class="ag-eb">' + s.eyebrow + '</div>' +
      '<div class="ag-ti">' + s.title + '</div>' +
      '<div class="ag-bo">' + s.body + '</div>' +
      '<div class="ag-ft">' +
        '<span class="ag-ct">' + p2(i + 1) + ' / ' + p2(STOPS.length) + '</span>' +
        '<div class="ag-nr">' +
          '<button class="ag-nb" data-p="' + i + '">\u2190</button>' +
          '<button class="ag-nb" data-n="' + i + '">' + (i === STOPS.length - 1 ? '\u2715' : '\u2192') + '</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(tt);
    ttEls.push(tt);
  });

  function p2(n) { return n < 10 ? '0' + n : '' + n; }

  /* ── LAYOUT ─────────────────────────────────────────────────────────── */
  var D = 28, GAP = 8, TW = 264, TH = 215;

  function place(i) {
    var el = resolved[i];
    var hs = hsEls[i];
    var tt = ttEls[i];
    if (!el) { hs.style.left = '-999px'; tt.style.left = '-999px'; return; }

    var r = el.getBoundingClientRect();
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var sd = STOPS[i].dotSide;

    // ── dot ──
    var dx = sd === 'tl' || sd === 'bl' ? r.left + 16 : r.right - D - 16;
    var dy = sd === 'tl' || sd === 'tr' ? r.top  + 16 : r.bottom - D - 16;
    dx = Math.max(4, Math.min(dx, vw - D - 4));
    dy = Math.max(54, Math.min(dy, vh - D - 4)); // 54 = clear the guide bar
    hs.style.left = dx + 'px';
    hs.style.top  = dy + 'px';

    // ── tooltip ──
    var cx = dx + D / 2, cy = dy + D / 2;
    tt.classList.remove('al','ar','at','ab');
    var tx, ty;

    if (cx + D / 2 + GAP + TW < vw - 6) {
      tx = cx + D / 2 + GAP; ty = cy - 14; tt.classList.add('al');
    } else if (cx - D / 2 - GAP - TW > 6) {
      tx = cx - D / 2 - GAP - TW; ty = cy - 14; tt.classList.add('ar');
    } else if (cy + D / 2 + GAP + TH < vh - 6) {
      tx = Math.min(cx - 20, vw - TW - 8); ty = cy + D / 2 + GAP; tt.classList.add('at');
    } else {
      tx = Math.min(cx - 20, vw - TW - 8); ty = cy - D / 2 - GAP - TH; tt.classList.add('ab');
    }

    tx = Math.max(6, Math.min(tx, vw - TW - 6));
    ty = Math.max(54, Math.min(ty, vh - TH - 6));
    tt.style.left = tx + 'px';
    tt.style.top  = ty + 'px';
  }

  function placeAll() { for (var i = 0; i < STOPS.length; i++) place(i); }

  /* ── PIPS ───────────────────────────────────────────────────────────── */
  function buildPips() {
    var c = document.getElementById('ag-ps');
    if (!c) return;
    c.innerHTML = STOPS.map(function (_, i) { return '<div class="ag-p" id="agp' + i + '"></div>'; }).join('');
  }
  function updatePips() {
    STOPS.forEach(function (_, i) {
      var p = document.getElementById('agp' + i);
      if (p) p.className = 'ag-p' + (i < cur ? ' dn' : i === cur ? ' nw' : '');
    });
  }

  /* ── STEP ───────────────────────────────────────────────────────────── */
  var cur = 0, running = false, resolved = [], prevHi = null;

  function setStep(i) {
    if (i < 0 || i >= STOPS.length) return;
    cur = i;

    if (prevHi) { prevHi.classList.remove('ag-hi'); prevHi = null; }

    hsEls.forEach(function (h, idx) { h.classList.toggle('active', idx === cur); });
    ttEls.forEach(function (t, idx) { t.classList.toggle('show',   idx === cur); });

    var el = resolved[cur];
    if (el) {
      el.classList.add('ag-hi');
      prevHi = el;
      var r = el.getBoundingClientRect();
      if (r.top < 60 || r.bottom > window.innerHeight - 40) {
        window.scrollTo({ top: Math.max(0, window.pageYOffset + r.top - 90), behavior: 'smooth' });
      }
    }

    setTimeout(placeAll, 350);
    updatePips();
  }

  /* ── START / END ────────────────────────────────────────────────────── */
  function start() {
    resolved = STOPS.map(findEl);
    running  = true;
    placeAll();
    buildPips();
    hsEls.forEach(function (h) { h.classList.add('vis'); });
    bar.classList.add('on');
    btn.style.display = 'none';
    setStep(0);
  }

  function end() {
    running = false;
    if (prevHi) { prevHi.classList.remove('ag-hi'); prevHi = null; }
    hsEls.forEach(function (h) { h.classList.remove('vis','active'); });
    ttEls.forEach(function (t) { t.classList.remove('show'); });
    bar.classList.remove('on');
    btn.style.display = '';
  }

  /* ── EVENTS ─────────────────────────────────────────────────────────── */
  btn.addEventListener('click', start);
  document.getElementById('ag-x').addEventListener('click', end);

  hsEls.forEach(function (h, i) {
    h.addEventListener('click', function (e) { e.stopPropagation(); setStep(i); });
  });

  document.addEventListener('click', function (e) {
    var p = e.target.getAttribute('data-p');
    var n = e.target.getAttribute('data-n');
    if (p !== null) { e.stopPropagation(); if (cur > 0) setStep(cur - 1); }
    if (n !== null) { e.stopPropagation(); if (cur < STOPS.length - 1) setStep(cur + 1); else end(); }
  });

  document.addEventListener('keydown', function (e) {
    if (!running) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { if (cur < STOPS.length - 1) setStep(cur + 1); else end(); }
    if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   { if (cur > 0) setStep(cur - 1); }
    if (e.key === 'Escape') end();
  });

  window.addEventListener('scroll', function () { if (running) placeAll(); }, { passive: true });
  window.addEventListener('resize', function () { if (running) placeAll(); });

})();
