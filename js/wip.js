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

// ── HOME BUTTON — sits next to AT. logo in both navs, all subpages ───────────
// AT. logo keeps its original href (view selector). The Home link is a
// secondary label placed immediately after the logo with a thin separator.
// Does NOT add to nav-links (avoids crowding). Guards against double-inject.
// ─────────────────────────────────────────────────────────────────────────────
(function () {
  var path = window.location.pathname;
  if (path === '/' || path === '/index.html') return;

  var s = document.createElement('style');
  s.textContent = [
    /* Both navs: allow logo + home to sit flush on the left */
    '#td-nav { justify-content: flex-start !important; }',
    '#td-nav .n-links { margin-left: auto !important; }',
    '#td-nav .n-ham  { flex-shrink: 0; }',
    '#at-nav { justify-content: flex-start !important; }',
    '#at-nav .nav-links { margin-left: auto !important; }',
    '#at-nav .hamburger { flex-shrink: 0; }',

    /* Visual nav home label */
    '#td-nav .n-home {',
    '  font-family:"Outfit",sans-serif; font-size:0.72rem; font-weight:700;',
    '  color:rgba(21,21,21,0.5); text-decoration:none; white-space:nowrap;',
    '  border-left:1.5px solid rgba(21,21,21,0.2);',
    '  padding-left:0.6rem; margin-left:0.5rem; align-self:center;',
    '}',
    '#td-nav .n-home:hover { color:#151515; }',

    /* Editorial nav home label — terracotta, matches editorial accent */
    '#at-nav .n-home-ed {',
    '  font-family:inherit; font-size:0.82rem; font-weight:600;',
    '  letter-spacing:0.08em; text-transform:uppercase;',
    '  color:#c84b2f; text-decoration:none; white-space:nowrap;',
    '  border-left:1px solid #d4cfc6;',
    '  padding-left:1rem; margin-left:0.75rem; align-self:center;',
    '}',
    '#at-nav .n-home-ed:hover { color:#a33825; }',

    /* Mobile drawer home entry (visual) */
    '#td-drawer .td-home-link { font-weight:700; }',
  ].join('\n');
  document.head.appendChild(s);

  function inject() {
    // VISUAL NAV — home label after AT. logo
    var tdNav  = document.getElementById('td-nav');
    var tdLogo = tdNav && tdNav.querySelector('.n-logo');
    if (tdLogo && !tdNav.querySelector('.n-home')) {
      var vh = document.createElement('a');
      vh.href = '/index.html?view=visual';
      vh.className = 'n-home';
      vh.textContent = 'Home';
      tdLogo.insertAdjacentElement('afterend', vh);
    }

    // VISUAL DRAWER — first item on mobile
    var tdDrawer = document.getElementById('td-drawer');
    if (tdDrawer && !tdDrawer.querySelector('.td-home-link')) {
      var dli = document.createElement('li');
      dli.innerHTML = '<a href="/index.html?view=visual" class="td-home-link">Home</a>';
      tdDrawer.insertBefore(dli, tdDrawer.firstChild);
    }

    // EDITORIAL NAV — home label after AT. logo
    var atNav  = document.getElementById('at-nav');
    var atLogo = atNav && atNav.querySelector('.nav-logo');
    if (atLogo && !atNav.querySelector('.n-home-ed')) {
      var eh = document.createElement('a');
      eh.href = '/index.html?view=editorial';
      eh.className = 'n-home-ed';
      eh.textContent = 'Home';
      atLogo.insertAdjacentElement('afterend', eh);
    }
  }

  if (document.body) inject();
  else document.addEventListener('DOMContentLoaded', inject);
})();
