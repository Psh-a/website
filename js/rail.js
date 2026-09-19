
(function () {
  const rails = Array.from(document.querySelectorAll(".side-rail"));
  if (!rails.length) return;

  const counter = document.querySelector(".side-rail-right .rail-num");
  const live = document.querySelector(".side-rail-right .rail-live");
  const dots = Array.from(document.querySelectorAll(".side-rail-right .rail-idx i"));

  /* Two flavours of right rail:
     - the index page lists the sections as numbered links (.rail-index a), so
       the items are whatever those links point at;
     - project sub-pages keep the decorative dot strip, driven by the four
       project rows of the index grid.
     Reading the links first means adding or renaming a section needs no edit
     here - the rail and the rail script stay in step automatically. */
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

  /* 装饰栏放在文档流中（position:absolute）：进入页面时按"浅色区域"（hero 底边 → footer 顶边）
     一次性定位并完整显示，之后随页面内容一起滚动，不再跟随视口。
     RAIL_TOP_GAP：浅色区顶部再往下留一点空隙，装饰内容从 hero 底边下方开始。 */
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

    /* Reading line at 35% of the viewport: the section whose top has passed it
       owns the highlight. Scrolling page-by-page this feels steadier than a
       midpoint test, which flips late on tall sections. */
    const line = window.scrollY + window.innerHeight * 0.35;

    let current = 0;
    sections.forEach(function (section, i) {
      if (section && docTop(section) <= line) current = i + 1;
    });
    /* Entering the page highlights the first entry right away, matching how
       the header nav behaves (nav-spy.js does the same). */
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

  /* requestAnimationFrame is the throttle, never the trigger: if the callback
     never arrives (headless rendering does this, and a background tab can too)
     the lock would stay set and every later scroll would be swallowed. The
     timeout is the fallback that keeps the highlight honest. */
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
