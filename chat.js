var express = require('express');
var app = express();
var socketio = require('socket.io');
var http = require('http');
var fs = require('fs');

module.exports = function(io){

  io.sockets.on('connection', function (socket) {
    socket.on('message', function (message) {
      io.sockets.emit('message', message);
    });
  });
}
