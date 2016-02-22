'use strict';
const express = require('express')
const http = require('http');
const path = require('path')
const port = process.env.PORT || 8080
const host = process.env.HOST || 'localhost';
const saveM3U = require('../node-twitch-clipper/');
const app = express()
const server = http.createServer(app);
const io = require('socket.io').listen(server);

// Begin HTTP section
// serve static assets normally
app.use(express.static(__dirname))

// handle every other route with index.html, which will contain
// a script tag to your application's JavaScript file(s).
app.get('*', function (request, response){
  response.sendFile(path.resolve(__dirname, 'index.html'))
})

app.listen(port, host)
console.log('HTTP server started on ' + host + ':' + port)
// End HTTP section
// //
// Begin WebSocket section
server.listen(3000);
let service = {
  handshake: function() { console.log('Got Handshake'); return true },
  saveM3U: saveM3U
}
let addSocketHandler = (method, socket) => {
  return function(...args) {
    let result = service[method](...args);
    socket.emit(`${method}-resp`, result);
  } 
}
function handleSaveM3U(socket) {
  return function(...args) {
    let promiseToSave = saveM3U(...args);
    socket.emit('saveM3U-resp', {
      message: 'Trying to save video... this could take a long time'
    });
    promiseToSave
      .then((filename) => {
        socket.emit('saveM3U-resp', {
          success: true,
          filename: filename
        });
      })
      .catch((error) => {
        socket.emit('saveM3U-resp', {
          failure: true
        });
        console.error('handleSaveM3U ERR: ', error);
      })
  }
}
io.sockets.on('connection', function (socket) {
  socket.on('handshake', addSocketHandler('handshake', socket))
  socket.on('saveM3U', handleSaveM3U(socket))
});

console.log('WebSocket Listening on port 3000');
// End WebSocket section
server.listen(3000);
