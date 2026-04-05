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

// ── HOME BUTTON — inject into both navs on every subpage ─────────────────────
// Uses absolute paths (/index.html?view=...) so depth of page doesn't matter.
// Guards against double-injection. Skips homepage itself.
// ─────────────────────────────────────────────────────────────────────────────
(function () {
  var path = window.location.pathname;
  if (path === '/' || path === '/index.html') return;

  // ── CSS (visual nav home button + editorial home link via nav-editorial.css)
  var s = document.createElement('style');
  s.textContent = [
    /* Visual nav: dark pill so it reads as "origin", not just another page */
    '#td-nav .n-home-link {',
    '  background: #151515 !important; color: #fbbf0e !important;',
    '  border-color: #151515 !important; box-shadow: none !important;',
    '  font-weight: 700; letter-spacing: -0.01em;',
    '}',
    '#td-nav .n-home-link:hover { opacity: 0.82; transform: none !important; }',
    /* Mobile drawer home link */
    '#td-drawer .td-home-link { font-weight: 700; }',
  ].join('\n');
  document.head.appendChild(s);

  function inject() {
    // ── VISUAL NAV: AT. logo → visual home
    var tdLogo = document.querySelector('#td-nav .n-logo');
    if (tdLogo) tdLogo.href = '/index.html?view=visual';

    // ── VISUAL NAV: Home pill (desktop)
    var tdLinks = document.querySelector('#td-nav .n-links');
    if (tdLinks && !tdLinks.querySelector('.n-home-link')) {
      var li = document.createElement('li');
      li.innerHTML = '<a href="/index.html?view=visual" class="n-home-link">← Home</a>';
      tdLinks.insertBefore(li, tdLinks.firstChild);
    }

    // ── VISUAL NAV: Home link (mobile drawer)
    var tdDrawer = document.getElementById('td-drawer');
    if (tdDrawer && !tdDrawer.querySelector('.td-home-link')) {
      var dli = document.createElement('li');
      dli.innerHTML = '<a href="/index.html?view=visual" class="td-home-link">← Home</a>';
      tdDrawer.insertBefore(dli, tdDrawer.firstChild);
    }

    // ── EDITORIAL NAV: AT. logo → editorial home
    var atLogo = document.querySelector('#at-nav .nav-logo');
    if (atLogo) atLogo.href = '/index.html?view=editorial';

    // ── EDITORIAL NAV: Home link (styled via nav-editorial.css .at-home-link)
    var atLinks = document.getElementById('at-nav-links');
    if (atLinks && !atLinks.querySelector('.at-home-link')) {
      var ali = document.createElement('li');
      ali.innerHTML = '<a href="/index.html?view=editorial" class="at-home-link">Home</a>';
      atLinks.insertBefore(ali, atLinks.firstChild);
    }
  }

  if (document.body) {
    inject();
  } else {
    document.addEventListener('DOMContentLoaded', inject);
  }
})();
