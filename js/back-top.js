

(function () {
  function toTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function init() {
    var buttons = Array.prototype.slice.call(document.querySelectorAll(".back-top"));

    if (!buttons.length) {
      var btn = document.createElement("button");
      btn.className = "back-top";
      btn.setAttribute("aria-label", "Back to top");
      btn.innerHTML = "&#8593;";
      document.body.appendChild(btn);
      buttons = [btn];
    } else if (buttons.length > 1) {
      buttons.slice(1).forEach(function (extra) {
        extra.remove();
      });
      buttons = buttons.slice(0, 1);
    }

    buttons.forEach(function (btn) {
      btn.addEventListener("click", toTop);
    });
  }

  function initDocking() {
    var badges = Array.prototype.slice.call(
      document.querySelectorAll(".back-top, .back-home")
    );
    var footer = document.querySelector(".site-footer");
    if (!badges.length || !footer) return;

    var GAP = 16; 

    function readBases() {
      return badges.map(function (b) {
        return parseFloat(window.getComputedStyle(b).bottom) || 28;
      });
    }

    var bases = readBases();
    var ticking = false;

    function paint() {
      ticking = false;
      var footerTop = footer.getBoundingClientRect().top + window.pageYOffset;
      badges.forEach(function (b, i) {
        var overlap =
          window.pageYOffset + window.innerHeight - bases[i] - (footerTop - GAP);
        b.style.bottom = overlap > 0 ? bases[i] + overlap + "px" : "";
      });
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;

      window.requestAnimationFrame(paint);
      window.setTimeout(paint, 120);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", function () {
      badges.forEach(function (b) {
        b.style.bottom = "";
      });
      bases = readBases();
      onScroll();
    });
    window.addEventListener("load", onScroll);

    document.addEventListener("load", onScroll, true);

    window.setInterval(paint, 250);
    paint();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      init();
      initDocking();
    });
  } else {
    init();
    initDocking();
  }
})();
