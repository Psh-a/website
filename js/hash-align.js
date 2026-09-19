
/* Cross-page anchor landing fix.
   Opening a page with a fragment (index.html -> creative-expressions.html#drama)
   can leave the viewport at the top: the browser drops the initial fragment
   scroll when the page is still busy loading, and the target also drifts while
   images and fonts finish laying out. Re-align the target a few times during
   the first seconds. Any user interaction cancels the correction. */
(function () {
  var hash = window.location.hash;
  if (!hash || hash.length < 2) return;

  var target = document.getElementById(hash.slice(1));
  if (!target) return;

  var cancelled = false;

  function cancel() {
    cancelled = true;
  }

  ["wheel", "touchstart", "pointerdown", "keydown"].forEach(function (evt) {
    window.addEventListener(evt, cancel, { passive: true, once: true });
  });

  function gapAboveTarget() {
    /* The page might ask for a specific gap via scroll-margin-top, but a
       header that wrapped onto a second line is taller than that value, so
       never land under it. */
    var gap = parseFloat(window.getComputedStyle(target).scrollMarginTop) || 0;
    var header = document.querySelector(".site-header");
    var needed = (header ? header.getBoundingClientRect().height : 0) + 20;
    return Math.max(gap, needed);
  }

  function align() {
    if (cancelled) return;

    var scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
    var top = target.getBoundingClientRect().top + scrollTop - gapAboveTarget();
    if (top < 0) top = 0;

    /* scroll-behavior: smooth must be bypassed so the jump is instant. */
    var root = document.documentElement;
    var previous = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    window.scrollTo(0, top);
    root.style.scrollBehavior = previous;

    if (Math.abs(window.pageYOffset - top) > 2) {
      window.scrollTo(0, top); /* retry once for engines that ignore the first call */
    }
  }

  function schedule() {
    align();
    [150, 400, 900, 1800, 3000].forEach(function (delay) {
      window.setTimeout(align, delay);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", schedule);
  } else {
    schedule();
  }

  window.addEventListener("load", align);

  window.addEventListener("pageshow", function (event) {
    if (event.persisted) {
      cancelled = false;
      schedule();
    }
  });
})();
