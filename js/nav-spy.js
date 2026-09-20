

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

    var headerBottom = header ? header.getBoundingClientRect().bottom : 0;
    var line = Math.max(headerBottom + 24, window.innerHeight * 0.25);
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
    var atBottom =
      scrollTop + window.innerHeight >= document.documentElement.scrollHeight - 4;

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

    if (window.requestAnimationFrame) window.requestAnimationFrame(run);
    window.setTimeout(run, 120);
  }

  window.addEventListener("scroll", request, { passive: true });
  window.addEventListener("resize", request);
  window.addEventListener("hashchange", request);
  window.addEventListener("load", request);

  if (window.ResizeObserver) {
    new ResizeObserver(request).observe(document.body);
  }

  update();
  [120, 400, 900, 1800, 3000].forEach(function (delay) {
    window.setTimeout(request, delay);
  });
})();
