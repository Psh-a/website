
/* Back-to-top badge.

   The badge also exists as markup in the page (the visual editor keeps its own
   copy of it), so this script never mints one blindly: it wires up the .back-top
   element the page ships, and only creates a badge when there is none.

   It waits for the DOM to finish parsing before doing so. The script tag sits
   above the markup it needs, so running immediately would find nothing, create a
   second badge, and leave the markup copy - which paints on top - without a
   handler. That is exactly the "the button does nothing" failure.

   Leftover copies from earlier saves are dropped, which also stops the editor
   from baking another one into the file on its next save.

   Both floating badges (.back-top, and .back-home on the subpages) also refuse
   to ride over the footer band: a scroll handler lifts their `bottom` by
   however much of the footer they would otherwise cover, so at the very
   bottom of the page they come to rest just above the red rule instead of
   sitting on the dark strip. The lifted amount is recomputed every scroll
   frame, so they slide back down to their normal spot as soon as the footer
   leaves the viewport. */
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

  /* Keep the badges off the footer. The base offset (28px, or 16px on small
     screens) is read from the computed style while no inline `bottom` is set,
     and refreshed on resize; the overlap is applied as an inline `bottom`, so
     the hover transforms in CSS keep working untouched. */
  function initDocking() {
    var badges = Array.prototype.slice.call(
      document.querySelectorAll(".back-top, .back-home")
    );
    var footer = document.querySelector(".site-footer");
    if (!badges.length || !footer) return;

    var GAP = 16; /* rest this far above the footer's top edge */

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
      /* rAF is the throttle, the timeout is the fallback: in headless or
         background tabs the callback may never fire, and a stuck lock would
         swallow every later scroll event. */
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
    /* Late-loading images grow the document after the last scroll event, which
       would leave a stale docking offset; repaint whenever any resource lands. */
    document.addEventListener("load", onScroll, true);
    /* Belt and braces: a slow interval repaint, so the docking settles even
       when scroll events themselves are missed (a heavy PDF iframe can starve
       them in headless/background rendering). */
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
