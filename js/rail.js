
(function () {
  const rails = Array.from(document.querySelectorAll(".side-rail"));
  if (!rails.length) return;

  const counter = document.querySelector(".side-rail-right .rail-num");
  const live = document.querySelector(".side-rail-right .rail-live");
  const dots = Array.from(document.querySelectorAll(".side-rail-right .rail-idx i"));

  const indexLinks = Array.from(document.querySelectorAll(".side-rail-right .rail-index a"));
  const sections = indexLinks.length
    ? indexLinks.map(function (a) { return document.querySelector(a.getAttribute("href")); })
    : Array.from(document.querySelectorAll("#part1, #part2, #part3, #part4"));

  const topZone = document.querySelector(".hero, .page-hero");
  const footer = document.querySelector(".site-footer");
  let ticking = false;

  function pad(n) {
    return (n < 10 ? "0" : "") + n;
  }

  function docTop(el) {
    let y = 0;
    while (el) {
      y += el.offsetTop;
      el = el.offsetParent;
    }
    return y;
  }

  function labelOf(section) {
    const title = section.querySelector(".row-title");
    if (!title) return "";
    const text = title.textContent
      .replace(/\s+/g, " ")
      .replace(/^\s*\d+\s*\.\s*/, "")
      .trim();
    if (!text) return "";
    return text.length > 12 ? text.split(" ")[0] : text;
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

    if (counter) counter.textContent = pad(current);
    if (live) live.textContent = current ? labelOf(sections[current - 1]) : "Overview";
    dots.forEach(function (dot, i) {
      dot.classList.toggle("is-on", i === current - 1);
    });
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
