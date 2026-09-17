
(function () {
  function reveal(img) {
    img.style.display = "";
    var parent = img.parentElement;
    if (!parent) return;
    var placeholders = parent.querySelectorAll(".photo-placeholder, .slide-placeholder");
    for (var i = 0; i < placeholders.length; i++) {
      placeholders[i].style.display = "none";
    }
  }

  function init() {
    var imgs = document.querySelectorAll("img");
    for (var i = 0; i < imgs.length; i++) {
      (function (img) {
        if (img.complete && img.naturalWidth > 0) {
          reveal(img);
        } else {
          img.addEventListener("load", function () { reveal(img); });
        }
      })(imgs[i]);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
