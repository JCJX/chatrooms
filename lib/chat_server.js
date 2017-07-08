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

function assignGuestName(socket,guestNumber,nickNames,namesUsed){
  var name ='Guest'+guestNumber;
  nickNames[socket.id] =name;
  socket.emit('nnameResult'.{
    success:true,
    name:name
  })
namesUsed.push(name);
return guestNumber+1;
}

function joinRoom(socket,room)}{
  socket.join(room);
  currentRoom[socket.id] = room;
  socket.emit('joinResult',{room:room});
  socket.broadcast.to(room).emit('message',{text:nickNames[socket.id]+ 'has joined' +room+'.'});

  var usersInRoom =io.sockets.clients(room);
  if(usersInRoom.length>1){
    var usersInRoomSummary = 'Users currently in' + room + ':';
    for (var index in usersInRoom){
      var userSocketId = usersInRoom[index].id;
      if(userSocketId != socket.id){
        if(index > 0){
          usersInRoomSummary += ',';
        }
        usersInRoomSummary += nickNames[userSocketId];
      }
    }
    usersInRoomSummary+='.';
    socket.enit('message',{text:usersInRoomSummary});
  }
}

function handleNameChangeAttempts(socket,nickNames,namesUsed){
  socket.on('nameAttempt',function(name){
    if (name.indexOf('Guest')==0) {
      socket.emit('nameResult',{
        success:false,
        message:'names cannot begin with "Guest".'
      });}else{
        if (namesUsed.indexOf(name)== -1) {
          var previousName =nickNames[socket.id];
          var previousNameIndex = namesUsed.indexOf(previousName);
          namesUsed.push(name);
          nickNames[socket.id] = name;
          delete namesUsed[previousNameIndex];
          socket.emit('nameResult',{
            success:true,
            name:name
          });
          socket.broadcast.to(currentRoom[socket.id]).emit('message'.{
            text:previousName +'is now known as ' + name +'.'
          });
        } else {
          socket.emit('nameResult',{
            siccess:false,
            message:'that name is alreaduy in user.'
          });
        }
      }
  });
}