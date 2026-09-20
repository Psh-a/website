
(function () {
  var SAVE_KEY = "cwIndexY";
  var FLAG_KEY = "cwReturnNow";
  var isHome = document.body.classList.contains("home");

  /* ---- index: remember where the reader is, restore on return ---- */
  if (isHome) {
    /* Read the return request BEFORE the first save() runs - saving first
       would overwrite the stored spot with 0 and nothing to restore. */
    var pending = null;
    try {
      if (sessionStorage.getItem(FLAG_KEY) === "1") {
        sessionStorage.removeItem(FLAG_KEY);
        var v = parseInt(sessionStorage.getItem(SAVE_KEY), 10);
        if (!isNaN(v) && v > 0) pending = v;
      }
    } catch (e) {}

    var save = function () {
      if (pending !== null) return; /* keep the spot while we are restoring it */
      try { sessionStorage.setItem(SAVE_KEY, String(Math.round(window.pageYOffset))); } catch (e) {}
    };
    save();
    window.addEventListener("scroll", save, { passive: true });
    window.addEventListener("beforeunload", save);

    if (pending !== null) {
      var targetY = pending;
      function restore() {
        window.scrollTo(0, targetY);
      }
      function giveUp() {
        targetY = null;
        pending = null; /* resume normal saving */
      }
      function scheduleRestore() {
        /* Images without reserved height grow the document late, so re-seat
           the position a few times; any user gesture cancels immediately. */
        [0, 300, 800, 1500, 2500, 3500].forEach(function (ms) {
          setTimeout(function () {
            if (targetY === null) return;
            if (ms > 0 && Math.round(window.pageYOffset) === targetY) return;
            restore();
          }, ms);
        });
        setTimeout(giveUp, 3600);
        ["pointerdown", "wheel", "touchstart"].forEach(function (evt) {
          window.addEventListener(evt, giveUp, { passive: true, once: true });
        });
        window.addEventListener("keydown", function (e) {
          if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].indexOf(e.key) >= 0) giveUp();
        }, { once: true });
        document.addEventListener("load", restore, true); /* any late image re-seats */
      }
      document.documentElement.style.scrollBehavior = "auto";
      scheduleRestore();
    }
    return;
  }

  /* ---- subpages: the floating back badge marks the return request ---- */
  function bindBadge() {
    var badge = document.querySelector(".back-home");
    if (!badge) return;
    badge.addEventListener("click", function () {
      try { sessionStorage.setItem(FLAG_KEY, "1"); } catch (e) {}
      /* no preventDefault - the href (index.html) still navigates */
    });
  }
  /* The script tag sits before the badge markup in the document, so the
     badge may not exist yet - wait for the DOM when still loading. */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindBadge);
  } else {
    bindBadge();
  }
})();
