
(function () {
  const rails = Array.from(document.querySelectorAll(".side-rail"));
  if (!rails.length) return;

  const counter = document.querySelector(".side-rail-right .rail-num");
  const live = document.querySelector(".side-rail-right .rail-live");
  const dots = Array.from(document.querySelectorAll(".side-rail-right .rail-idx i"));
  const sections = Array.from(document.querySelectorAll("#part1, #part2, #part3, #part4"));
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

  /* 两侧装饰栏只出现在"空白"（浅色）区域：上不进入顶部深色区（hero / page-hero），
     下不进入 footer。滚动时按当前可见的浅色区间实时裁剪。 */
  function clipRail() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const vh = window.innerHeight;
    const lightTop = topZone ? docTop(topZone) + topZone.offsetHeight : 0;
    const lightBottom = footer ? docTop(footer) : document.documentElement.scrollHeight;
    const top = Math.max(scrollY, lightTop);
    const bottom = Math.min(scrollY + vh, lightBottom);
    const h = Math.max(0, bottom - top);
    rails.forEach(function (rail) {
      rail.style.top = top - scrollY + "px";
      rail.style.height = h + "px";
    });
  }

  function update() {
    clipRail();

    const mid = window.innerHeight / 2;

    if (!sections.length) return;

    let current = 0;
    sections.forEach(function (section, i) {
      const r = section.getBoundingClientRect();
      if (r.top <= mid && r.bottom >= mid) current = i + 1;
    });

    if (counter) counter.textContent = pad(current);
    if (live) live.textContent = current ? labelOf(sections[current - 1]) : "Overview";
    dots.forEach(function (dot, i) {
      dot.classList.toggle("is-on", i === current - 1);
    });
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      update();
      ticking = false;
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();
})();
