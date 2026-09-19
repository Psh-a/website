
/* Anchor landing fix.
   Two ways an anchor can end up in the wrong place:

   1. Opening a page that already carries a fragment (index.html ->
      creative-expressions.html#drama). The browser drops the initial fragment
      scroll while the page is still busy loading, and the target drifts on
      while images and fonts finish laying out.

   2. Clicking a link to a fragment on the page you are already on - the table
      of contents in a project hero, or the section names in the header. The
      browser scrolls to the offset it computes AT THAT MOMENT, and a picture
      above the target that has not arrived yet counts as zero height, so the
      jump lands short. On the-awakening.html the 03 entry used to land about
      1.5k pixels early, i.e. inside section 02.

   Both are handled the same way: put the target in place now, then re-align a
   few times over the next three seconds so late-arriving images cannot leave
   the reader somewhere else. Any user interaction cancels the correction, so
   scrolling away is never fought over. */
(function () {
  var cancelled = false;
  var timers = [];
  var activeUntil = 0;

  function target() {
    var hash = window.location.hash;
    return hash && hash.length > 1 ? document.getElementById(hash.slice(1)) : null;
  }

  /* The page might ask for a specific gap via scroll-margin-top, but a header
     that wrapped onto a second line is taller than that value, so never land
     under it. */
  function gapAboveTarget(el) {
    var gap = parseFloat(window.getComputedStyle(el).scrollMarginTop) || 0;
    var header = document.querySelector(".site-header");
    var needed = (header ? header.getBoundingClientRect().height : 0) + 20;
    return Math.max(gap, needed);
  }

  function clearTimers() {
    timers.forEach(window.clearTimeout);
    timers = [];
  }

  function cancel() {
    cancelled = true;
    clearTimers();
  }

  /* Run only while a jump is still settling: an image that finally arrives ten
     seconds later, when the reader has scrolled off on their own, must not
     yank the page back. */
  function align(force) {
    if (cancelled) return;
    if (!force && activeUntil && Date.now() > activeUntil) return;

    var el = target();
    if (!el) return;

    var scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
    var top = el.getBoundingClientRect().top + scrollTop - gapAboveTarget(el);
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

  function armCancel() {
    ["wheel", "touchstart", "pointerdown", "keydown"].forEach(function (evt) {
      window.addEventListener(evt, cancel, { passive: true, once: true });
    });
  }

  function schedule() {
    cancelled = false;
    clearTimers();
    activeUntil = Date.now() + 3200;
    align(true);
    [150, 400, 900, 1800, 3000].forEach(function (delay) {
      timers.push(window.setTimeout(function () {
        align(false);
      }, delay));
    });
  }

  if (target()) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", schedule);
    } else {
      schedule();
    }
    window.addEventListener("load", function () {
      align(false);
    });
    armCancel();
  }

  /* In-page navigation: the hero table of contents and the header section
     links. The gesture that triggered it is already over by the time
     hashchange fires, so it is safe to arm the cancel listeners here. */
  window.addEventListener("hashchange", function () {
    schedule();
    window.setTimeout(armCancel, 0);
  });

  /* A picture that lands a moment later changes the height of everything below
     it; fold that in while the jump is still settling. */
  document.addEventListener("load", function (event) {
    var el = event.target;
    if (el && el.tagName === "IMG" && Date.now() < activeUntil) align(false);
  }, true);

  window.addEventListener("pageshow", function (event) {
    if (event.persisted) schedule();
  });
})();
