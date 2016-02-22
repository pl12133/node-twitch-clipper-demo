'use strict';
function socketSetup() {
  var socket = io.connect('http://hearthdraft.net:3000');
  socket.emit('handshake');
  socket.on('handshake-resp', function(result) {
    console.log('result: '+ result);
  });
  socket.on('saveM3U-resp', function(resp) {
    let saveStatusElem = document.getElementById('saveStatus');
    if (resp.success) {
      let filename = resp.filename;
      let fragment = `<p>Video saved to <a href=\"${filename}\">${filename}</a></p>
        <video controls style=\"width: 70%\">
          <source src=\"${filename}\" />
        </video>
      `;
      saveStatus.innerHTML = fragment;
    } else if (resp.failure) {
      saveStatusElem.innerHTML = 'Sorry, an error occurred';
    } else if (resp.message) {
      saveStatusElem.innerHTML = resp.message;
    }
    console.log(resp);
  });
  function serverSaveM3U(vodIdStr, filename, startTime, duration) {
    socket.emit('saveM3U', vodIdStr, filename, startTime, duration);
  }
  return function getFormAndSave(e) {
    e.preventDefault();
    var inputs = document.getElementsByTagName('input');
    var vodIdStr = inputs[0].value;
    var filename = inputs[1].value;
    var startTime = inputs[2].value;
    var duration = inputs[3].value;
    serverSaveM3U(vodIdStr, filename, startTime, duration)
  }
}

document.addEventListener("DOMContentLoaded", function(e) {
  var getFormAndSave = socketSetup();
  document.getElementById('videoForm').addEventListener('submit', getFormAndSave);
});
