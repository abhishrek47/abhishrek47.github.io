// ── WIP MODE ─────────────────────────────────────────────────────────────────
// Toggle the flag below. Then run wip-on.sh or wip-off.sh from Terminal.
// ─────────────────────────────────────────────────────────────────────────────
var SITE_WIP = true;
// ─────────────────────────────────────────────────────────────────────────────

(function () {
  if (!SITE_WIP) return;

  var style = document.createElement('style');
  style.textContent = [
    '#at-wip-badge {',
    '  position: fixed; bottom: 1.25rem; right: 1.25rem; z-index: 99999;',
    '  display: flex; align-items: center; gap: 0.45rem;',
    '  padding: 0.38rem 0.8rem 0.38rem 0.55rem;',
    '  background: rgba(10, 5, 24, 0.72);',
    '  backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);',
    '  border: 1px solid rgba(255,255,255,0.1);',
    '  border-radius: 999px;',
    '  box-shadow: 0 2px 16px rgba(0,0,0,0.28), 0 0 0 1px rgba(0,0,0,0.18);',
    '  pointer-events: none; user-select: none;',
    '  opacity: 0; transform: translateY(6px);',
    '  transition: opacity 0.5s ease, transform 0.5s ease;',
    '}',
    '#at-wip-badge.at-wip-in {',
    '  opacity: 1; transform: translateY(0);',
    '}',
    '#at-wip-dot {',
    '  width: 6px; height: 6px; border-radius: 50%;',
    '  background: #fbbf0e; flex-shrink: 0;',
    '  animation: at-wip-pulse 2.4s ease-in-out infinite;',
    '}',
    '#at-wip-label {',
    '  font-family: "DM Sans", "Inter", -apple-system, sans-serif;',
    '  font-size: 0.6rem; font-weight: 600;',
    '  letter-spacing: 0.14em; text-transform: uppercase;',
    '  color: rgba(255,255,255,0.58); line-height: 1;',
    '}',
    '@keyframes at-wip-pulse {',
    '  0%,100% { opacity: 1;   transform: scale(1);   }',
    '  50%      { opacity: 0.4; transform: scale(0.7); }',
    '}',
  ].join('\n');
  document.head.appendChild(style);

  var badge = document.createElement('div');
  badge.id = 'at-wip-badge';
  badge.setAttribute('aria-hidden', 'true');
  badge.innerHTML = '<span id="at-wip-dot"></span><span id="at-wip-label">Portfolio refresh in progress</span>';

  function mount() {
    document.body.appendChild(badge);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        badge.classList.add('at-wip-in');
      });
    });
  }

  if (document.body) {
    mount();
  } else {
    document.addEventListener('DOMContentLoaded', mount);
  }
})();

// ── HOME BUTTON — first <li> in each nav list, all subpages ──────────────────
// Injected inside the <ul> so it shares the same flex row as Work/About/etc.
// Guarantees perfect vertical alignment without any justify-content hacks.
// A right-border separator creates a clear visual break from section items.
// AT. logo keeps its original href (view selector). Guards against double-inject.
// ─────────────────────────────────────────────────────────────────────────────
(function () {
  var path = window.location.pathname;
  if (path === '/' || path === '/index.html') return;

  var s = document.createElement('style');
  s.textContent = [
    /* ── Editorial home item ── */
    '#at-nav .wip-home-li {',
    '  padding-right: 1rem;',
    '  border-right: 1px solid #d4cfc6;',
    '}',
    '#at-nav .wip-home-li a {',
    '  color: #9b8e80 !important;',
    '  font-weight: 500 !important;',
    '  background: transparent !important;',
    '  box-shadow: none !important;',
    '  padding: 0 !important;',
    '  border-radius: 0 !important;',
    '}',
    '#at-nav .wip-home-li a:hover { color: #c84b2f !important; }',
    /* Mobile: vertical dropdown — drop the right border */
    '@media (max-width: 768px) {',
    '  #at-nav .wip-home-li { padding-right: 0; border-right: none; }',
    '}',

    /* ── Visual home item ── */
    '#td-nav .wip-home-li {',
    '  padding-right: 0.6rem;',
    '  border-right: 1.5px solid rgba(21,21,21,0.15);',
    '}',
    '#td-nav .wip-home-li a {',
    '  color: rgba(21,21,21,0.45) !important;',
    '  font-size: 0.7rem !important;',
    '  border: none !important;',
    '  box-shadow: none !important;',
    '  background: transparent !important;',
    '  padding: 0 !important;',
    '}',
    '#td-nav .wip-home-li a:hover {',
    '  color: rgba(21,21,21,0.9) !important;',
    '  box-shadow: none !important;',
    '  transform: none !important;',
    '}',

    /* ── Visual mobile drawer home ── */
    '#td-drawer .wip-td-home a { font-weight: 700; }',
  ].join('\n');
  document.head.appendChild(s);

  function inject() {
    // VISUAL NAV — first li in .n-links
    var tdNav  = document.getElementById('td-nav');
    var nLinks = tdNav && tdNav.querySelector('.n-links');
    if (nLinks && !nLinks.querySelector('.wip-home-li')) {
      var vli = document.createElement('li');
      vli.className = 'wip-home-li';
      vli.innerHTML = '<a href="/index.html?view=visual">Home</a>';
      nLinks.insertBefore(vli, nLinks.firstChild);
    }

    // VISUAL DRAWER — first item on mobile
    var tdDrawer = document.getElementById('td-drawer');
    if (tdDrawer && !tdDrawer.querySelector('.wip-td-home')) {
      var dli = document.createElement('li');
      dli.className = 'wip-td-home';
      dli.innerHTML = '<a href="/index.html?view=visual">Home</a>';
      tdDrawer.insertBefore(dli, tdDrawer.firstChild);
    }

    // EDITORIAL NAV — first li in .nav-links
    var atNav    = document.getElementById('at-nav');
    var navLinks = atNav && atNav.querySelector('.nav-links');
    if (navLinks && !navLinks.querySelector('.wip-home-li')) {
      var eli = document.createElement('li');
      eli.className = 'wip-home-li';
      eli.innerHTML = '<a href="/index.html?view=editorial">Home</a>';
      navLinks.insertBefore(eli, navLinks.firstChild);
    }
  }

  if (document.body) inject();
  else document.addEventListener('DOMContentLoaded', inject);
})();
