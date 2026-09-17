
(function () {
  const btn = document.createElement("button");
  btn.className = "back-top";
  btn.setAttribute("aria-label", "Back to top");
  btn.innerHTML = "&#8593;";
  btn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  document.body.appendChild(btn);
})();
