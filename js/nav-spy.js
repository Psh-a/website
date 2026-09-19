
/* Nav scroll-spy: mark the nav item of the section currently being read.
   Only in-page links ("#id") inside .site-nav take part. */
(function () {
  var nav = document.querySelector(".site-nav");
  if (!nav) return;

  var pairs = [];
  Array.prototype.forEach.call(nav.querySelectorAll('a[href^="#"]'), function (link) {
    var id = link.getAttribute("href").slice(1);
    if (!id) return;
    var section = document.getElementById(id);
    if (section) pairs.push({ link: link, section: section });
  });
  if (!pairs.length) return;

  var header = document.querySelector(".site-header");
  var current = null;
  var ticking = false;

  function setActive(link) {
    if (link === current) return;
    pairs.forEach(function (pair) {
      if (pair.link === link) pair.link.classList.add("active");
      else pair.link.classList.remove("active");
    });
    current = link;
  }

  function update() {
    /* reading line: below the sticky header, but never above a quarter of
       the viewport — otherwise a section that has just been jumped to
       (its top sits at the scroll-margin offset) would not light up yet. */
    var headerBottom = header ? header.getBoundingClientRect().bottom : 0;
    var line = Math.max(headerBottom + 24, window.innerHeight * 0.25);
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
    var atBottom =
      scrollTop + window.innerHeight >= document.documentElement.scrollHeight - 4;
    /* Default to the first section: on entry the hero fills the viewport and
       no section has reached the reading line yet — the nav should still
       show one marker instead of staying blank. */
    var active = pairs[0].link;

    pairs.forEach(function (pair) {
      if (pair.section.getBoundingClientRect().top <= line) active = pair.link;
    });

    if (atBottom) active = pairs[pairs.length - 1].link;
    setActive(active);
  }

  function request() {
    if (ticking) return;
    ticking = true;
    var run = function () {
      if (!ticking) return;
      ticking = false;
      update();
    };
    /* Coalesce bursts of scroll events onto one frame, with a timer as a
       safety net: if the frame callback is delayed, the flag would stay
       set and every later event would be swallowed. */
    if (window.requestAnimationFrame) window.requestAnimationFrame(run);
    window.setTimeout(run, 120);
  }

  window.addEventListener("scroll", request, { passive: true });
  window.addEventListener("resize", request);
  window.addEventListener("hashchange", request);
  window.addEventListener("load", request);
  /* Images that finish loading after the first paint can reflow the page
     without firing a scroll event; watch the body box so the marker keeps
     following the section that is actually on screen. */
  if (window.ResizeObserver) {
    new ResizeObserver(request).observe(document.body);
  }

  /* Lazy images delay the load event, so update on a few early passes too. */
  update();
  [120, 400, 900, 1800, 3000].forEach(function (delay) {
    window.setTimeout(request, delay);
  });
})();
