'use strict';
function socketSetup() {
  function fakeSave(resp) {
    let saveStatusElem = document.getElementById('saveStatus');
    if (resp.success) {
      let filename = resp.filename;
      let fragment = 
        '<p>Video saved to <a href=\"' + filename + '\">' +
          filename + 
        '</a></p>' +
        '<video controls style=\"width: 70%\">' +
          '<source src=\"' + filename + '\" type=\"video/webm\"/>' +
        '</video>';

      saveStatus.innerHTML = fragment;
    } else if (resp.failure) {
      saveStatusElem.innerHTML = 'Sorry, an error occurred';
    } else if (resp.message) {
      saveStatusElem.innerHTML = resp.message;
    }
    console.log(resp);
  }
  function fakeServerSaveM3U(vodIdStr, filename, startTime, duration) {
    fakeSave({
      message: 'Trying to save video... this could take a long time'
    });
    setTimeout(function() {
      fakeSave({
        success: true,
        filename: 'videos/demo-clip.webm'
      });
    }, 5000);
  }
  return function getFormAndSave(e) {
    e.preventDefault();
    var inputs = document.getElementsByTagName('input');
    var vodIdStr = inputs[0].value;
    var filename = inputs[1].value;
    var startTime = inputs[2].value;
    var duration = inputs[3].value;
    fakeServerSaveM3U(vodIdStr, filename, startTime, duration)
  }
}

document.addEventListener("DOMContentLoaded", function(e) {
  var getFormAndSave = socketSetup();
  document.getElementById('videoForm').addEventListener('submit', getFormAndSave);
});
