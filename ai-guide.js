/**
 * AI Guide — abhishektrivedi.com
 * Drop-in feature: floating tooltip tour for the homepage.
 *
 * Usage: add these two lines just before </body> in index.html
 *   <link rel="stylesheet" href="ai-guide.css">
 *   <script src="ai-guide.js" defer></script>
 */

(function () {
  /* ── 1. IDs of existing sections on the page ── */
  const STOPS = [
    {
      targetSelector: 'nav',
      position: 'bottom-right',
      eyebrow: 'Navigation',
      title: 'Sparse nav, strong hierarchy',
      body: 'Just 4 links. The monospaced "AT." logo doubles as a home button and a personal brand mark. The terracotta CTA is the only coloured element here — drawing the eye exactly where it needs to go.',
    },
    {
      targetSelector: '.hero, #hero, section:first-of-type',
      position: 'bottom-left',
      eyebrow: 'Hero',
      title: 'The 3-second value pitch',
      body: 'DM Serif Display italic in terracotta on "think." does the heavy lifting — one word in the brand accent signals what makes this portfolio different from every other L&D CV.',
    },
    {
      targetSelector: '.marquee-wrap, .marquee',
      position: 'top-left',
      eyebrow: 'Skills Ticker',
      title: 'Full-bleed ink as a divider',
      body: 'The ink-black strip creates a hard visual break between sections. JetBrains Mono reads like a terminal readout — reinforcing the developer-hybrid identity without saying a word.',
    },
    {
      targetSelector: '#what, .what-section, .disciplines',
      position: 'top-right',
      eyebrow: 'Disciplines',
      title: '3 columns, 3 identities in one',
      body: 'Each card positions Abhishek as a triple-threat: designer, developer, and AI integrator. The 1 px rule-coloured grid gap creates column dividers without drawing a border.',
    },
    {
      targetSelector: '#work, .work-section, .case-studies',
      position: 'top-right',
      eyebrow: 'Selected Work',
      title: 'Titles that carry the concept',
      body: '"When the Course Knows Your Name" tells a story before you click. DM Serif gives the titles editorial weight while mono category tags maintain the technical register.',
    },
    {
      targetSelector: '#accessibility, .accessibility-section',
      position: 'top-left',
      eyebrow: 'Accessibility Practice',
      title: 'Show don\'t tell — interactive proof',
      body: 'Toggle interactions let visitors feel the difference between accessible and inaccessible Storyline builds. This turns a résumé claim into lived experience.',
    },
    {
      targetSelector: '#demos, .demos-section, .interactive-demos',
      position: 'top-left',
      eyebrow: 'Interactive Demos',
      title: 'No PDFs. No screenshots.',
      body: 'Every demo is live in the browser. This is the differentiator — most L&D portfolios show slide decks; this one lets you actually run the work.',
    },
    {
      targetSelector: '.cta-strip, #contact-cta',
      position: 'top-right',
      eyebrow: 'CTA Strip',
      title: 'Ink section = intentional contrast',
      body: 'The dark full-width block mirrors the skills marquee and creates a visual bookend. The single call-to-action reduces decision fatigue — there\'s only one thing to do here.',
    },
  ];

  /* ── 2. Inject CSS ── */
  const style = document.createElement('style');
  style.textContent = `
    /* === AI GUIDE === */
    #ag-btn {
      position: fixed;
      bottom: 28px;
      right: 28px;
      z-index: 9998;
      display: flex;
      align-items: center;
      gap: 0.55rem;
      padding: 0.65rem 1.2rem 0.65rem 0.9rem;
      background: var(--ink, #0f0f0f);
      color: var(--paper, #f5f2eb);
      border: none;
      cursor: pointer;
      font-family: var(--mono, 'JetBrains Mono', monospace);
      font-size: 0.68rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      border-radius: 2px;
      box-shadow: 0 4px 24px rgba(15,15,15,0.18);
      transition: background 0.2s;
    }
    #ag-btn:hover { background: var(--accent, #c84b2f); }
    #ag-btn .ag-dot {
      width: 7px; height: 7px;
      border-radius: 50%;
      background: var(--accent, #c84b2f);
      animation: ag-pulse 2s infinite;
      flex-shrink: 0;
    }
    @keyframes ag-pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }

    #ag-bar {
      position: fixed;
      top: 0; left: 0; right: 0;
      z-index: 9999;
      display: none;
      align-items: center;
      justify-content: space-between;
      padding: 0.65rem 2rem;
      background: var(--ink, #0f0f0f);
      border-bottom: 2px solid var(--accent, #c84b2f);
    }
    #ag-bar.ag-on { display: flex; }
    .ag-bar-left {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-family: var(--mono, 'JetBrains Mono', monospace);
      font-size: 0.65rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: rgba(245,242,235,0.6);
    }
    .ag-bar-title { color: var(--paper, #f5f2eb); font-weight: 500; }
    .ag-pips { display: flex; gap: 4px; align-items: center; }
    .ag-pip {
      height: 3px; width: 16px;
      background: rgba(255,255,255,0.15);
      border-radius: 2px;
      transition: all 0.25s;
    }
    .ag-pip.ag-done  { background: rgba(200,75,47,0.55); }
    .ag-pip.ag-now   { background: var(--accent, #c84b2f); width: 26px; }
    #ag-close {
      font-family: var(--mono, 'JetBrains Mono', monospace);
      font-size: 0.62rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: rgba(245,242,235,0.45);
      background: none;
      border: 1px solid rgba(245,242,235,0.15);
      padding: 0.28rem 0.75rem;
      cursor: pointer;
      border-radius: 2px;
      transition: color 0.15s, border-color 0.15s;
    }
    #ag-close:hover { color: var(--paper, #f5f2eb); border-color: rgba(245,242,235,0.4); }

    .ag-hs {
      position: fixed;
      z-index: 9997;
      width: 30px; height: 30px;
      transform: translate(-50%, -50%);
      cursor: pointer;
      display: none;
    }
    .ag-hs.ag-visible { display: block; }
    .ag-hs-ring {
      width: 30px; height: 30px;
      border-radius: 50%;
      background: var(--accent, #c84b2f);
      border: 2.5px solid var(--paper, #f5f2eb);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--mono, 'JetBrains Mono', monospace);
      font-size: 0.6rem;
      font-weight: 500;
      color: #fff;
      box-shadow: 0 0 0 0 rgba(200,75,47,0.5);
      animation: ag-ring 2.4s ease-out infinite;
      transition: transform 0.15s;
    }
    .ag-hs:hover .ag-hs-ring,
    .ag-hs.ag-active .ag-hs-ring { transform: scale(1.2); animation-play-state: paused; }
    @keyframes ag-ring {
      0%  { box-shadow: 0 0 0 0   rgba(200,75,47,0.55); }
      70% { box-shadow: 0 0 0 12px rgba(200,75,47,0);   }
      100%{ box-shadow: 0 0 0 0   rgba(200,75,47,0);    }
    }

    .ag-tooltip {
      position: fixed;
      z-index: 10000;
      width: 260px;
      background: var(--paper, #f5f2eb);
      border: 1px solid var(--rule, #d4cfc6);
      border-top: 3px solid var(--accent, #c84b2f);
      padding: 1.1rem 1.2rem 0.9rem;
      box-shadow: 0 8px 32px rgba(15,15,15,0.13);
      display: none;
      pointer-events: none;
    }
    .ag-tooltip::before {
      content: '';
      position: absolute;
      width: 9px; height: 9px;
      background: var(--paper, #f5f2eb);
      border: 1px solid var(--rule, #d4cfc6);
      transform: rotate(45deg);
    }
    .ag-tooltip.ag-arr-left::before   { top: 12px; left: -5px; border-top: none; border-left: none; }
    .ag-tooltip.ag-arr-right::before  { top: 12px; right: -5px; border-bottom: none; border-right: none; }
    .ag-tooltip.ag-arr-top::before    { top: -5px; left: 18px; border-bottom: none; border-right: none; border-top: 1px solid var(--accent,#c84b2f); border-left: 1px solid var(--accent,#c84b2f); }
    .ag-tooltip.ag-arr-bottom::before { bottom: -5px; left: 18px; border-top: none; border-left: none; }
    .ag-hs.ag-active .ag-tooltip { display: block; pointer-events: auto; }

    .ag-eyebrow {
      font-family: var(--mono, 'JetBrains Mono', monospace);
      font-size: 0.6rem;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: var(--accent, #c84b2f);
      margin-bottom: 0.4rem;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }
    .ag-eyebrow::before {
      content: '';
      display: block;
      width: 0.8rem;
      height: 1px;
      background: var(--accent, #c84b2f);
      flex-shrink: 0;
    }
    .ag-title {
      font-family: var(--serif, 'DM Serif Display', serif);
      font-size: 1.05rem;
      line-height: 1.22;
      color: var(--ink, #0f0f0f);
      margin-bottom: 0.5rem;
    }
    .ag-body {
      font-family: var(--sans, 'DM Sans', sans-serif);
      font-size: 0.76rem;
      font-weight: 300;
      color: var(--mid, #6b6459);
      line-height: 1.6;
      margin-bottom: 0.85rem;
      padding-bottom: 0.8rem;
      border-bottom: 1px solid var(--rule, #d4cfc6);
    }
    .ag-foot {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .ag-count {
      font-family: var(--mono, 'JetBrains Mono', monospace);
      font-size: 0.6rem;
      letter-spacing: 0.08em;
      color: var(--mid, #6b6459);
    }
    .ag-navrow { display: flex; gap: 5px; }
    .ag-nav-btn {
      width: 26px; height: 26px;
      border-radius: 2px;
      border: 1px solid var(--rule, #d4cfc6);
      background: var(--paper, #f5f2eb);
      color: var(--mid, #6b6459);
      font-family: var(--mono, 'JetBrains Mono', monospace);
      font-size: 0.75rem;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: border-color 0.15s, color 0.15s, background 0.15s;
    }
    .ag-nav-btn:hover {
      border-color: var(--accent, #c84b2f);
      color: var(--accent, #c84b2f);
      background: #fdf0ed;
    }
  `;
  document.head.appendChild(style);

  /* ── 3. Build DOM ── */

  // Launch button
  const btn = document.createElement('button');
  btn.id = 'ag-btn';
  btn.setAttribute('aria-label', 'Start AI Guide tour');
  btn.innerHTML = '<span class="ag-dot"></span>AI Guide — Tour this page';
  document.body.appendChild(btn);

  // Guide bar
  const bar = document.createElement('div');
  bar.id = 'ag-bar';
  bar.innerHTML = `
    <div class="ag-bar-left">
      <span class="ag-bar-title">AI Guide</span>
      <span>·</span>
      <div class="ag-pips" id="ag-pips"></div>
    </div>
    <button id="ag-close">Exit ✕</button>
  `;
  document.body.appendChild(bar);

  // Hotspots + tooltips
  const hsEls = [];

  STOPS.forEach((stop, i) => {
    const hs = document.createElement('div');
    hs.className = 'ag-hs';
    hs.id = `ag-hs-${i}`;
    hs.setAttribute('aria-label', `Guide stop ${i + 1}: ${stop.eyebrow}`);
    hs.innerHTML = `
      <div class="ag-hs-ring">${i + 1}</div>
      <div class="ag-tooltip" id="ag-tt-${i}">
        <div class="ag-eyebrow">${stop.eyebrow}</div>
        <div class="ag-title">${stop.title}</div>
        <div class="ag-body">${stop.body}</div>
        <div class="ag-foot">
          <span class="ag-count">${String(i + 1).padStart(2,'0')} / ${String(STOPS.length).padStart(2,'0')}</span>
          <div class="ag-navrow">
            <button class="ag-nav-btn ag-prev-btn" aria-label="Previous">←</button>
            <button class="ag-nav-btn ag-next-btn" aria-label="Next">${i === STOPS.length - 1 ? '✕' : '→'}</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(hs);
    hsEls.push(hs);
  });

  /* ── 4. State ── */
  let cur = 0;
  let running = false;

  /* ── 5. Helpers ── */
  function resolveTarget(selector) {
    const parts = selector.split(',').map(s => s.trim());
    for (const s of parts) {
      const el = document.querySelector(s);
      if (el) return el;
    }
    return null;
  }

  function positionHotspot(hsEl, target, position) {
    const rect = target.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;

    // anchor point on the target element
    let anchorX, anchorY;
    switch (position) {
      case 'top-left':
        anchorX = rect.left + 32;
        anchorY = rect.top + scrollY + 32;
        break;
      case 'top-right':
        anchorX = rect.right - 32;
        anchorY = rect.top + scrollY + 32;
        break;
      case 'bottom-left':
        anchorX = rect.left + 32;
        anchorY = rect.bottom + scrollY - 32;
        break;
      case 'bottom-right':
      default:
        anchorX = rect.right - 32;
        anchorY = rect.bottom + scrollY - 32;
        break;
    }

    hsEl.style.left = anchorX + 'px';
    hsEl.style.top  = anchorY + 'px';

    // tooltip placement
    const tt = hsEl.querySelector('.ag-tooltip');
    tt.classList.remove('ag-arr-left','ag-arr-right','ag-arr-top','ag-arr-bottom');

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const ttW = 260, ttH = 200;
    const hsFixed = { x: anchorX, y: anchorY - scrollY };

    if (hsFixed.x + 20 + ttW < vw) {
      // place to the right
      tt.style.left = '20px';
      tt.style.right = 'auto';
      tt.style.top = '-6px';
      tt.style.bottom = 'auto';
      tt.classList.add('ag-arr-left');
    } else {
      // place to the left
      tt.style.right = '20px';
      tt.style.left = 'auto';
      tt.style.top = '-6px';
      tt.style.bottom = 'auto';
      tt.classList.add('ag-arr-right');
    }

    // flip vertically if too close to bottom
    if (hsFixed.y + ttH > vh - 40) {
      tt.style.top = 'auto';
      tt.style.bottom = '20px';
    }
  }

  function placeAll() {
    STOPS.forEach((stop, i) => {
      const target = resolveTarget(stop.targetSelector);
      if (target) positionHotspot(hsEls[i], target, stop.position);
    });
  }

  function buildPips() {
    const container = document.getElementById('ag-pips');
    if (!container) return;
    container.innerHTML = STOPS.map((_, i) =>
      `<div class="ag-pip" id="ag-pip-${i}"></div>`
    ).join('');
  }

  function updatePips() {
    STOPS.forEach((_, i) => {
      const pip = document.getElementById(`ag-pip-${i}`);
      if (!pip) return;
      pip.className = 'ag-pip' +
        (i < cur ? ' ag-done' : i === cur ? ' ag-now' : '');
    });
  }

  function setStep(i) {
    if (i < 0 || i >= STOPS.length) return;
    hsEls.forEach((hs, idx) => hs.classList.toggle('ag-active', idx === i));
    cur = i;
    updatePips();

    // scroll target into view
    const target = resolveTarget(STOPS[i].targetSelector);
    if (target) {
      const rect = target.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset;
      const offset = rect.top + scrollY - 100;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  }

  function startGuide() {
    running = true;
    placeAll();
    buildPips();
    hsEls.forEach(hs => hs.classList.add('ag-visible'));
    bar.classList.add('ag-on');
    btn.style.display = 'none';
    setStep(0);
  }

  function endGuide() {
    running = false;
    hsEls.forEach(hs => {
      hs.classList.remove('ag-visible', 'ag-active');
    });
    bar.classList.remove('ag-on');
    btn.style.display = '';
  }

  /* ── 6. Events ── */
  btn.addEventListener('click', startGuide);
  document.getElementById('ag-close').addEventListener('click', endGuide);

  // Hotspot clicks
  hsEls.forEach((hs, i) => {
    hs.addEventListener('click', () => setStep(i));
  });

  // Tooltip nav buttons (prev / next)
  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('ag-prev-btn')) {
      e.stopPropagation();
      if (cur > 0) setStep(cur - 1);
    }
    if (e.target.classList.contains('ag-next-btn')) {
      e.stopPropagation();
      if (cur < STOPS.length - 1) setStep(cur + 1);
      else endGuide();
    }
  });

  // Keyboard support
  document.addEventListener('keydown', function (e) {
    if (!running) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      if (cur < STOPS.length - 1) setStep(cur + 1); else endGuide();
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      if (cur > 0) setStep(cur - 1);
    }
    if (e.key === 'Escape') endGuide();
  });

  // Reposition on resize / scroll
  window.addEventListener('resize', () => { if (running) placeAll(); });
  window.addEventListener('scroll', () => { if (running) placeAll(); }, { passive: true });

})();
