var socketio= require('socket.io');
var io;
var guestNumber = 1;
var nickNames= {};
var namesUsed= [];
var currentRoom= {};

exports.lisen =function(server){
  io = socketio.listen(server);
  io.set('Log level',1);

  io.sockets.on('connection',function(sockets){
    guestNumber = assignGuestName(socket,guestNumber,nickNames,namesUsed);
    joinRoom(socket,'Lobby');

    handleMessageBroadcasting(socket,nickNames);
    handleNameChangeAttempts(socket,nickNames,namesUsed);
    handeRoomJonining(socket);

    socket.om('rooms', function(){
      socket.emit('rooms',io.sockets.manager.rooms);
    });
    handleClientDisconnection(socket,nickNames,namesUsed);
  });
};
