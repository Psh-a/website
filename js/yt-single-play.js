/* 同一时间只允许一个 YouTube 视频播放：
   监听 embed iframe 的 infoDelivery 消息，任一视频进入 PLAYING(1) 时，
   向其余 YouTube iframe 发送 pauseVideo 命令。
   纯 postMessage 实现：不插入/替换任何 DOM 元素，依赖 iframe src 带 enablejsapi=1。 */
(function () {
  var YT_MSG_ORIGIN = 'https://www.youtube.com';

  function ytFrames() {
    return Array.prototype.slice.call(document.querySelectorAll('iframe[src*="youtube.com/embed"]'));
  }

  function pauseOthers(current) {
    ytFrames().forEach(function (f) {
      if (f === current || !f.contentWindow) return;
      f.contentWindow.postMessage(JSON.stringify({
        event: 'command',
        func: 'pauseVideo',
        args: []
      }), '*');
    });
  }

  window.addEventListener('message', function (e) {
    if (e.origin !== YT_MSG_ORIGIN) return;
    var data;
    try { data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data; } catch (err) { return; }
    if (!data || data.event !== 'infoDelivery' || !data.info) return;
    if (data.info.playerState === 1) {
      var src = e.source;
      var current = null;
      ytFrames().forEach(function (f) { if (f.contentWindow === src) current = f; });
      if (current) pauseOthers(current);
    }
  });
})();
