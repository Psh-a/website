
(function () {
  var frames = Array.prototype.slice.call(document.querySelectorAll('iframe[src*="youtube.com/embed"]'));
  if (!frames.length) return;

  frames.forEach(function (f, i) {
    if (!f.id) f.id = 'ytsp-' + i;
  });

  var players = [];
  window.__ytSinglePlay = players;

  window.onYouTubeIframeAPIReady = function () {
    frames.forEach(function (f) {
      var p;
      try { p = new YT.Player(f.id); } catch (err) { return; }
      players.push(p);
      p.addEventListener('onStateChange', function (e) {
        if (e.data !== YT.PlayerState.PLAYING) return;
        players.forEach(function (o) {
          if (o === p || typeof o.getPlayerState !== 'function') return;
          try {
            if (o.getPlayerState() === YT.PlayerState.PLAYING) o.pauseVideo();
          } catch (err) {  }
        });
      });
    });
  };
})();
