
document.addEventListener("DOMContentLoaded", function(e) {
  var socket = io.connect('http://hearthdraft.net:3000');
  socket.emit('handshake');
  socket.on('handshake-resp', function(result) {
    console.log('result: '+result);
  });
  socket.on('saveM3U-resp', function(resp) {
    document.getElementById('saveStatus').innerHTML = resp;
    console.log(resp);
  });
  document.getElementById('videoForm').addEventListener('submit', getFormAndSave);
  function getFormAndSave(e) {
    e.preventDefault();
    var inputs = document.getElementsByTagName('input');
    var vodIdStr = inputs[0].value;
    var filename = inputs[1].value;
    var startTime = inputs[2].value;
    var duration = inputs[3].value;
    serverSaveM3U(vodIdStr, filename, startTime, duration)
  }
  function serverSaveM3U(vodIdStr, filename, startTime, duration) {
    socket.emit('saveM3U', vodIdStr, filename, startTime, duration);
  }
});
