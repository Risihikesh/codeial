// module.exports.chatSockets= function(socketServer){
//     let io= require('socket.io')(socketServer);
//     io.sockets.on('connection', function(socket){
//         console.log('new connection recieved', socket.id);

//         socket.on('disconnect', function(){
//             console.log('sockets disconnected')
//         })

//         socket.on('join_room', function(data){
//             console.log('joining request rec.', data);
//             socket.join(data.chatroom);

//             io.in(data.chatroom).emit('user_joined', data)
//         })
//          //detect send message and broadcast to everyone in the room
//          socket.on('send_message', function(data){
//             io.in(data.chatroom).emit('receive_message', data);
//         });
//     })

// }


module.exports.chatSockets = function(socketServer) {
    const io = require('socket.io')(socketServer, {
      cors: {
        origin: 'http://localhost:8000', // Replace with your front-end application URL
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
        credentials: true
      }
    });
  
    io.on('connection', function(socket) {
      console.log('New connection received', socket.id);
  
      socket.on('disconnect', function() {
        console.log('Socket disconnected');
      });
  
      socket.on('join_room', function(data) {
        console.log('Joining request received', data);
        socket.join(data.chatroom);
  
        io.in(data.chatroom).emit('user_joined', data);
      });
  
      socket.on('send_message', function(data) {
        io.in(data.chatroom).emit('receive_message', data);
      });
    });
  };
  