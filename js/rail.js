
(function () {
  const rails = Array.from(document.querySelectorAll(".side-rail"));
  if (!rails.length) return;

  const counter = document.querySelector(".side-rail-right .rail-num");
  const live = document.querySelector(".side-rail-right .rail-live");
  const dots = Array.from(document.querySelectorAll(".side-rail-right .rail-idx i"));
  const sections = Array.from(document.querySelectorAll("#part1, #part2, #part3, #part4"));
  const darkZones = [".hero", ".site-header", ".site-footer"]
    .map(function (sel) { return document.querySelector(sel); })
    .filter(Boolean);
  let ticking = false;

  function pad(n) {
    return (n < 10 ? "0" : "") + n;
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

  function update() {
    const mid = window.innerHeight / 2;

    const onDark = darkZones.some(function (el) {
      const r = el.getBoundingClientRect();
      return r.top <= mid && r.bottom >= mid;
    });
    rails.forEach(function (rail) {
      rail.classList.toggle("on-dark", onDark);
    });

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
