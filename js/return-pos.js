
(function () {


  if (document.body.classList.contains("home")) return;

  function prevEntryIsHome() {
    try {
      var nav = window.navigation;
      if (!nav || !nav.currentEntry || nav.currentEntry.index <= 0) return false;
      var prev = nav.entries()[nav.currentEntry.index - 1];
      if (!prev || !prev.url) return false;

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

    });
  }


  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindBadge);
  } else {
    bindBadge();
  }
})();
