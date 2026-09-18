
(function () {
  function videoId(value) {
    const url = (value || "").trim();
    if (/^[A-Za-z0-9_-]{11}$/.test(url)) return url;
    const match = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/);
    return match ? match[1] : "";
  }

  function watchUrl(value) {
    const id = videoId(value);
    if (id) return "https://www.youtube.com/watch?v=" + id;
    return (value || "").trim();
  }

  function embedUrl(value) {
    const id = videoId(value);
    if (!id) return "";
    return "https://www.youtube.com/embed/" + id + "?autoplay=1&rel=0";
  }

  function openInTab(url) {
    window.open(url, "_blank", "noopener");
  }

  function bindFrame(item, url, embed) {
    const frame = item.querySelector(".video-frame");
    if (!frame) return;

    frame.addEventListener("click", function () {
      if (frame.classList.contains("is-playing")) return;
      if (!embed) {
        openInTab(url);
        return;
      }
      const iframe = document.createElement("iframe");
      iframe.setAttribute("src", embed);
      iframe.setAttribute("title", "Video player");
      iframe.setAttribute(
        "allow",
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      );
      iframe.setAttribute("allowfullscreen", "true");
      frame.classList.add("is-playing");
      frame.innerHTML = "";
      frame.appendChild(iframe);
    });
  }

  Array.prototype.forEach.call(document.querySelectorAll("[data-video]"), function (item) {
    const url = watchUrl(item.getAttribute("data-video"));
    if (!url) return;

    const link = item.querySelector(".video-link");
    if (link) link.setAttribute("href", url);

    if (item.querySelector(".video-frame")) {
      bindFrame(item, url, embedUrl(item.getAttribute("data-video")));
      return;
    }

    item.classList.add("is-linked");
    item.setAttribute("role", "link");
    item.setAttribute("tabindex", "0");
    item.addEventListener("click", function () {
      openInTab(url);
    });
    item.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openInTab(url);
      }
    });
  });
})();
