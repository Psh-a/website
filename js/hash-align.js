

(function () {
  var cancelled = false;
  var timers = [];
  var activeUntil = 0;

  function target() {
    var hash = window.location.hash;
    return hash && hash.length > 1 ? document.getElementById(hash.slice(1)) : null;
  }

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

  function align(force) {
    if (cancelled) return;
    if (!force && activeUntil && Date.now() > activeUntil) return;

    var el = target();
    if (!el) return;

    var scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
    var top = el.getBoundingClientRect().top + scrollTop - gapAboveTarget(el);
    if (top < 0) top = 0;

    var root = document.documentElement;
    var previous = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    window.scrollTo(0, top);
    root.style.scrollBehavior = previous;

    if (Math.abs(window.pageYOffset - top) > 2) {
      window.scrollTo(0, top); 
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

  window.addEventListener("hashchange", function () {
    schedule();
    window.setTimeout(armCancel, 0);
  });

  document.addEventListener("load", function (event) {
    var el = event.target;
    if (el && el.tagName === "IMG" && Date.now() < activeUntil) align(false);
  }, true);

  window.addEventListener("pageshow", function (event) {
    if (event.persisted) schedule();
  });
})();
