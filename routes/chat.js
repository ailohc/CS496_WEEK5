var express = require('express');
var app = express();
var socketio = require('socket.io');
var http = require('http');
var fs = require('fs');

app.set('port', 3000);
var server = http.createServer(app).listen(app.get('port'), function () {
  console.log("express server listening on port" + app.get('port'));
});

var io = socketio.listen(server);

io.sockets.on('connection', function (socket) {
  socket.on('message', function (message) {
    io.sockets.emit('message', message);
  });
});
