
(function () {
  const carousel = document.querySelector(".carousel");
  if (!carousel) return;

  const track = carousel.querySelector(".carousel-track");
  const slides = Array.from(track.children);
  const prevBtn = carousel.querySelector(".carousel-arrow.prev");
  const nextBtn = carousel.querySelector(".carousel-arrow.next");
  const dotsWrap = carousel.querySelector(".carousel-dots");

  let index = 0;
  let timer = null;
  const INTERVAL = 4500;
  dotsWrap.innerHTML = "";
  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.setAttribute("aria-label", "Go to slide " + (i + 1));
    dot.addEventListener("click", function () {
      goTo(i);
      restart();
    });
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function goTo(i) {
    index = (i + slides.length) % slides.length;    track.style.transform = "translateX(-" + index * 100 + "%)";
    dots.forEach(function (d, di) {
      d.classList.toggle("active", di === index);
    });
  }

  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }

  function start() { timer = setInterval(next, INTERVAL); }
  function stop() { clearInterval(timer); }
  function restart() { stop(); start(); }

  nextBtn.addEventListener("click", function () { next(); restart(); });
  prevBtn.addEventListener("click", function () { prev(); restart(); });

  carousel.addEventListener("mouseenter", stop);
  carousel.addEventListener("mouseleave", start);

  goTo(0);
  start();
})();
