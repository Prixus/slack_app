// const express = require('express');
// const app = express();
// const socketio = require('socket.io');

let namespaces = require('./data/namespaces');
app.use(express.static(__dirname + '/public'));
const express = require('express');
const app = express();
const socketio = require('socket.io');
const expressServer = app.listen(9000);
const io = socketio(expressServer);

// io.on = io.of('/').on = io.sockets.on
// io.emit = io.of('/').emit = io.sockets.emit
io.on('connection', (socket) => {
    let nsData = namespaces.map((ns) => {
       return {
           img      : ns.img,
           endpoint : ns.endpoint
       }
    });

    // send the nsData back to the client. We need to use socket, Not io, because we want it to
    // got to just this client
    socket.emit('nsList', nsData);
});

// loop through each namespaces and listen for a connection
namespaces.forEach((namespace) => {
    io.of(namespace.endpoint).on('connection', (nsSocket) => {
        const username = nsSocket.handshake.query.username;

        // a socket has connected to one of our chatgroup namespaces.
        // send that ns group info back
        nsSocket.emit('nsRoomLoad', namespace.rooms);

        nsSocket.on('joinRoom', (roomToJoin, roomToLeave, numberOfUsersCallback) => {
            // This will make the client leave their existing room before joining into a new one
            // const roomToLeave = Object.keys(nsSocket.rooms)[1];
            // console.log(Object.keys(nsSocket.rooms));
            nsSocket.leave(roomToLeave);

            // This will make the client to join a new room
            nsSocket.join(roomToJoin);
            const nsRoom = namespace.rooms.find((room) => {
                return room.roomTitle === roomToJoin;
            });
            // This will update the chat history of the clients
            nsSocket.emit('historyCatchUp', nsRoom.history);
            updateUsersInRoom(namespace, roomToJoin, nsSocket);
        });

        nsSocket.on('newMessageToServer', (msg, currentRoom) => {
            const fullMsg = {
                text     : msg.text,
                time     : Date.now(),
                username : username,
                avatar   : 'https://via.placeholder.com/30'
            };

            // Sends this message to ALL the sockets that are in the room that this socket is in.
            // how can we find out what rooms this socket is in?
            // console.log(nsSocket.rooms)
            // the user will be in the 2nd room in the object list
            // this is because the socket always joins its own room on connection
            // const roomTitle = Object.keys(nsSocket.rooms)[1];
            // we need to find the room object for this room
            const nsRoom = namespace.rooms.find((room) => {
               return room.roomTitle === currentRoom;
            });
            nsRoom.addMessage(fullMsg);
            io.of(namespace.endpoint).to(currentRoom).emit('messageToClients', fullMsg);
        });
    });
});

const updateUsersInRoom = (namespace, roomToJoin, nsSocket) => {
    const room = socket.adapter.rooms.get(roomToJoin);
    io.of(namespace.endpoint).in(roomToJoin).emit('updateMembers', room.size);
};