
(function () {
  const items = document.querySelectorAll("[data-href]");
  if (!items.length) return;

  Array.prototype.forEach.call(items, function (item) {
    const href = item.getAttribute("data-href");
    if (!href) return;

    // Only the "See more" pill opens the sub-page. The photo and the copy
    // stay inert, so a stray click no longer navigates away.
    const trigger = item.querySelector(".see-more");
    if (!trigger) return;
    trigger.classList.add("is-clickable");
    trigger.setAttribute("role", "link");
    trigger.setAttribute("tabindex", "0");

    function go() {
      window.location.href = href;
    }

    trigger.addEventListener("click", function (event) {
      const t = event.target;
      if (t && t.closest && t.closest("a, button, input, select, textarea")) return;
      go();
    });

    trigger.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        go();
      }
    });
  });
})();
