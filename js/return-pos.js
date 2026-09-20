
(function () {
  /* Pure browser-history return: when the reader arrived at a subpage from
     index, the back button replays history.back(), so the browser restores
     index from its back/forward cache with the exact scroll position -
     natively, no state stored anywhere. If the previous entry is not our
     index (direct open, cold tab), fall back to the plain href, which goes
     to the top of index. */

  if (document.body.classList.contains("home")) return; /* index needs nothing */

  function prevEntryIsHome() {
    try {
      var nav = window.navigation;
      if (!nav || !nav.currentEntry || nav.currentEntry.index <= 0) return false;
      var prev = nav.entries()[nav.currentEntry.index - 1];
      if (!prev || !prev.url) return false;
      /* matches ".../index.html", also with #hash or ?query, and a bare
         directory URL when the site is hosted without a filename */
      return /index\.html([?#].*)?$/.test(prev.url) || /\/$/.test(prev.url);
    } catch (e) {
      return false;
    }
  }

  function bindBadge() {
    var badge = document.querySelector(".back-home");
    if (!badge) return;
    badge.addEventListener("click", function (e) {
      if (prevEntryIsHome()) {
        e.preventDefault();
        history.back();
      }
      /* otherwise the href (index.html) navigates as usual */
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
