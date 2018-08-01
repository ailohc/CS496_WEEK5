module.exports = function(io){
    var app = require('express');
    var router = app.Router();

    io.sockets.on('connection', function (socket) {

      socket.on('join:room', function(data) {
        socket.join('room' + data.roomId);
      });
      socket.on('leave:room', function(data) {
        socket.leave('room' + data.roomId);
      });
      socket.on('send:message', function (data) {
        io.sockets.in('room' + data.roomId).emit('send:message', data.message);
      });
      socket.on('disconnect', function(){
      })
    });
    return router;
}
