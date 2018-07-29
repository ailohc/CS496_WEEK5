module.exports = function(io){
    var app = require('express');
    var router = app.Router();

    io.sockets.on('connection', function (socket) {
      socket.on('join:room', function(data){
        console.log(data.roomId);
        socket.join('room' + data.roomId);
      });
      socket.on('send:message', function (data) {
        console.log(data.message);
        io.sockets.in('room' + data.roomId).emit('send:message', data.message);
      });
    });
    return router;
}
