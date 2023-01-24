function joinNs(endpoint) {
    if (nsSocket) {
        // check to see if nsSocket is actually a socket
        nsSocket.close();
        // remove the eventListener before it's added again
        document.querySelector('#user-input').removeEventListener('submit', formSubmission)
    }

    nsSocket = io(`http://localhost:9000${endpoint}`);
    nsSocket.on('nsRoomLoad', (nsRooms) => {
        let roomList = document.querySelector('.room-list');
        roomList.innerHTML = '';
        nsRooms.forEach((room) => {
           let glyph;
           if (room.privateRoom) {
               glyph = 'lock';
           } else {
               glyph = 'globe';
           }
           roomList.innerHTML += `<li class="room"><span class="glyphicon glyphicon-${glyph}"></span>${room.roomTitle}`;

           let roomNodes = document.getElementsByClassName('room');
           Array.from(roomNodes).forEach((elem) => {
               elem.addEventListener('click', (e) => {
                   joinRoom(e.target.innerText);
               });
           });

           // Add room automatically at the top room
           const topRoom = document.querySelector('.room');
           const topRoomName = topRoom.innerText;

           joinRoom(topRoomName);
        });

        nsSocket.on('messageToClients', (msg) => {
            document.querySelector('#messages').innerHTML +=  buildHTML(msg);
        });

        document.querySelector('#user-input').addEventListener('submit', formSubmission)
    });
}

function formSubmission(event) {
    event.preventDefault();
    const newMessage = document.querySelector('#user-message').value;
    const currentRoom = document.querySelector('.curr-room-text').innerText;
    nsSocket.emit('newMessageToServer', { text : newMessage }, currentRoom);
}

function buildHTML(msg) {
    const convertedDate = new Date(msg.time).toLocaleDateString();
    return `
    <li>
        <div class="user-image">
            <img src="${msg.avatar}" />
        </div>
        <div class="user-message">
            <div class="user-name-time">${msg.username} <span>${convertedDate}</span></div>
            <div class="message-text">${msg.text}</div>
        </div>
    </li>    
    `;
};