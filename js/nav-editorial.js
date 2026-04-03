/* nav-editorial.js — active state + hamburger for editorial nav */
(function () {
  var path = window.location.pathname;

  // Set active link by matching current path
  var links = document.querySelectorAll('#at-nav .nav-links a:not(.nav-cta)');
  links.forEach(function (link) {
    var href = link.getAttribute('href');
    if (!href) return;
    try {
      var linkPath = new URL(href, window.location.href).pathname;
      // Normalize trailing slash
      var normPath = path.replace(/\/$/, '') || '/';
      var normLink = linkPath.replace(/\/$/, '') || '/';
      if (normPath === normLink) {
        link.classList.add('active');
      }
    } catch (e) {}
  });

  // Hamburger toggle
  var ham = document.getElementById('at-ham');
  var navLinks = document.getElementById('at-nav-links');
  if (ham && navLinks) {
    ham.addEventListener('click', function () {
      navLinks.classList.toggle('open');
      ham.classList.toggle('open');
    });
    // Close drawer on any link click
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navLinks.classList.remove('open');
        ham.classList.remove('open');
      });
    });
    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!ham.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
        ham.classList.remove('open');
      }
    });
  }
})();
