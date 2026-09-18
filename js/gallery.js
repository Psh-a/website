
(function () {
  const INTERVAL = 4000;

  function initGallery(media) {
    const gallery = media.querySelector(".sub-gallery");
    const dotsWrap = media.querySelector(".gallery-dots");
    if (!gallery || !dotsWrap) return;

    const slides = Array.from(gallery.querySelectorAll(".gallery-slide"));
    if (slides.length < 2) return;

    let index = 0;
    let timer = null;
    dotsWrap.innerHTML = "";
    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.setAttribute("aria-label", "Go to photo " + (i + 1));
      dot.addEventListener("click", function () {
        goTo(i);
        restart();
      });
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.children);

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      gallery.style.transform = "translateX(-" + index * 100 + "%)";
      dots.forEach(function (d, di) {
        d.classList.toggle("active", di === index);
      });
    }

    function start() {
      timer = setInterval(function () { goTo(index + 1); }, INTERVAL);
    }
    function stop() { clearInterval(timer); }
    function restart() { stop(); start(); }

    media.addEventListener("mouseenter", stop);
    media.addEventListener("mouseleave", start);

    goTo(0);
    start();
  }

  function init() {
    document.querySelectorAll(".sub-media").forEach(initGallery);
  }

  if (document.readyState === "complete") {
    init();
  } else {
    window.addEventListener("load", init);
  }
})();
