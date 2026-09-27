/* 同一时间只允许一个 YouTube 视频播放（同页面内）。
   官方 IFrame Player API 方案：用页面里已有的 <iframe> 构建播放器（不插入/替换 DOM），
   任一播放器进入 PLAYING 时暂停其余播放器。
   依赖：各页面在标记里先加载 https://www.youtube.com/iframe_api，iframe src 带 enablejsapi=1。 */
(function () {
  var frames = Array.prototype.slice.call(document.querySelectorAll('iframe[src*="youtube.com/embed"]'));
  if (!frames.length) return;

  frames.forEach(function (f, i) {
    if (!f.id) f.id = 'ytsp-' + i;
  });

  var players = [];
  window.__ytSinglePlay = players; /* 调试句柄 */

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
          } catch (err) { /* 跨域或未就绪时忽略 */ }
        });
      });
    });
  };
})();
