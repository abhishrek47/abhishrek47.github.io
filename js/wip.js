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

// ── HOME PILL — fixed bottom-left, all subpages ───────────────────────────────
// A small "← Back to Home" pill in the bottom-left corner. Completely separate
// from the nav so AT. logo retains full visual dominance. Arrow makes the
// action self-evident. Styled per active view (editorial cream / visual dark).
// Coexists with the WIP badge at bottom-right. Guards against double-inject.
// ─────────────────────────────────────────────────────────────────────────────
(function () {
  var path = window.location.pathname;
  if (path === '/' || path === '/index.html') return;

  // Detect active view: URL param > sessionStorage > default editorial
  var params = new URLSearchParams(window.location.search);
  var view = params.get('view');
  if (!view) {
    try { view = sessionStorage.getItem('at-style-choice'); } catch(e) {}
  }
  if (view !== 'visual') view = 'editorial';

  var isVisual = view === 'visual';

  var s = document.createElement('style');
  s.textContent = [
    '#wip-home-pill {',
    '  position: fixed;',
    '  bottom: 1.4rem;',
    '  left: 1.4rem;',
    '  z-index: 9998;',
    '  display: flex;',
    '  align-items: center;',
    '  gap: 0.3rem;',
    '  padding: 0.38rem 0.85rem;',
    '  border-radius: 2px;',
    '  font-size: 0.62rem;',
    '  font-weight: 600;',
    '  letter-spacing: 0.1em;',
    '  text-transform: uppercase;',
    '  text-decoration: none;',
    '  white-space: nowrap;',
    '  cursor: pointer;',
    '  opacity: 0;',
    '  transform: translateY(4px);',
    '  transition: opacity 0.4s ease, transform 0.4s ease, color 0.18s, background 0.18s, border-color 0.18s;',
    '}',
    '#wip-home-pill.wip-pill-in { opacity: 1; transform: translateY(0); }',

    /* Editorial: cream pill, terracotta on hover */
    '#wip-home-pill.wip-ed {',
    '  background: rgba(245,242,235,0.96);',
    '  backdrop-filter: blur(8px);',
    '  -webkit-backdrop-filter: blur(8px);',
    '  border: 1px solid #d4cfc6;',
    '  color: #9b8e80;',
    '  font-family: inherit;',
    '}',
    '#wip-home-pill.wip-ed:hover { color: #c84b2f; border-color: #c84b2f; }',

    /* Visual: dark pill, yellow text; inverts on hover */
    '#wip-home-pill.wip-vis {',
    '  background: rgba(21,21,21,0.88);',
    '  backdrop-filter: blur(8px);',
    '  -webkit-backdrop-filter: blur(8px);',
    '  border: 1.5px solid rgba(21,21,21,0.9);',
    '  color: #fbbf0e;',
    '  font-family: "Outfit", sans-serif;',
    '}',
    '#wip-home-pill.wip-vis:hover {',
    '  background: #fbbf0e;',
    '  border-color: #fbbf0e;',
    '  color: #151515;',
    '}',

    /* On mobile bump it up so it clears any bottom chrome */
    '@media (max-width: 640px) {',
    '  #wip-home-pill { bottom: 1rem; left: 1rem; }',
    '}',
  ].join('\n');
  document.head.appendChild(s);

  function mount() {
    if (document.getElementById('wip-home-pill')) return;
    var pill = document.createElement('a');
    pill.id = 'wip-home-pill';
    pill.className = isVisual ? 'wip-vis' : 'wip-ed';
    pill.href = '/index.html?view=' + view;
    pill.setAttribute('aria-label', 'Back to ' + view + ' home page');
    pill.innerHTML = '&#8592;&nbsp;Back to Home';
    document.body.appendChild(pill);
    // Fade in after paint
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        pill.classList.add('wip-pill-in');
      });
    });
  }

  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount);
})();
