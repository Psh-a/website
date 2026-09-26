
(function () {
  const rails = Array.from(document.querySelectorAll(".side-rail"));
  if (!rails.length) return;

  const indexLinks = Array.from(document.querySelectorAll(".side-rail-right .rail-index a"));
  const sections = indexLinks.length
    ? indexLinks.map(function (a) { return document.querySelector(a.getAttribute("href")); })
    : Array.from(document.querySelectorAll("#part1, #part2, #part3, #part4"));

  const topZone = document.querySelector(".hero, .page-hero");
  const footer = document.querySelector(".site-footer");
  let ticking = false;

  function docTop(el) {
    let y = 0;
    while (el) {
      y += el.offsetTop;
      el = el.offsetParent;
    }
    return y;
  }

  const RAIL_TOP_GAP = 60;
  function placeRail() {
    const lightTop = topZone ? docTop(topZone) + topZone.offsetHeight + RAIL_TOP_GAP : 0;
    const lightBottom = footer ? docTop(footer) : document.documentElement.scrollHeight;
    const h = Math.max(0, lightBottom - lightTop);
    rails.forEach(function (rail) {
      rail.style.top = lightTop + "px";
      rail.style.height = h + "px";
    });
  }

  function update() {
    placeRail();

    if (!sections.length) return;

    const line = window.scrollY + window.innerHeight * 0.35;

    let current = 0;
    sections.forEach(function (section, i) {
      if (section && docTop(section) <= line) current = i + 1;
    });

    if (!current && sections.length) current = 1;

    indexLinks.forEach(function (a, i) {
      a.classList.toggle("is-on", i === current - 1);
    });
  }

  function paint() {
    update();
    ticking = false;
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(paint);
    window.setTimeout(paint, 120);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  window.addEventListener("hashchange", onScroll);
  window.addEventListener("load", onScroll);
  update();
})();
