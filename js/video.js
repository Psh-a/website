
(function () {
  function videoId(value) {
    const url = (value || "").trim();
    if (/^[A-Za-z0-9_-]{11}$/.test(url)) return url;
    const match = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/);
    return match ? match[1] : "";
  }

  function embedUrl(id) {
    return "https://www.youtube.com/embed/" + id + "?autoplay=1&rel=0";
  }

  function setCover(id, img) {
    if (!img || !id) return;
    const sources = [
      "https://i.ytimg.com/vi/" + id + "/maxresdefault.jpg",
      "https://i.ytimg.com/vi/" + id + "/hqdefault.jpg"
    ];
    let step = 0;
    img.addEventListener("error", function () {
      step += 1;
      if (step < sources.length) {
        img.src = sources[step];
      } else {
        img.style.display = "none";
      }
    });
    img.src = sources[0];
  }

  Array.prototype.forEach.call(document.querySelectorAll("[data-video]"), function (item) {
    const id = videoId(item.getAttribute("data-video"));
    if (!id) return;

    setCover(id, item.querySelector(".video-frame img"));

    const frame = item.querySelector(".video-frame");
    if (!frame) return;

    frame.addEventListener("click", function () {
      if (frame.classList.contains("is-playing")) return;
      const iframe = document.createElement("iframe");
      iframe.setAttribute("src", embedUrl(id));
      iframe.setAttribute("title", "Video player");
      iframe.setAttribute(
        "allow",
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      );
      iframe.setAttribute("allowfullscreen", "true");
      frame.classList.add("is-playing");
      frame.style.backgroundImage = "none";
      frame.innerHTML = "";
      frame.appendChild(iframe);
    });
  });
})();
