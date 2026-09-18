
(function () {
  const items = document.querySelectorAll("[data-href]");
  if (!items.length) return;

  Array.prototype.forEach.call(items, function (item) {
    const href = item.getAttribute("data-href");
    if (!href) return;
    item.classList.add("is-clickable");
    item.setAttribute("role", "link");
    item.setAttribute("tabindex", "0");

    function go() {
      window.location.href = href;
    }

    item.addEventListener("click", function (event) {
      const t = event.target;
      if (t && t.closest && t.closest("a, button, input, select, textarea")) return;
      go();
    });

    item.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        go();
      }
    });
  });
})();
