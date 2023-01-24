function joinRoom(roomName) {
    const prevRoom = document.querySelector('.curr-room-text').innerText;
    nsSocket.emit('joinRoom', roomName, prevRoom);

    nsSocket.on('historyCatchUp', (history) => {
        const messagesUI = document.querySelector('#messages');
        messagesUI.innerHTML = '';
        history.forEach((msg) => {
            messagesUI.innerHTML += buildHTML(msg);
        });
        messagesUI.scrollTo(0, messagesUI.scrollHeight);
    });

    nsSocket.on('updateMembers', (numMembers) => {
        document.querySelector('.curr-room-num-users').innerHTML = `${numMembers} <span class="glyphicon glyphicon-user"></span>`;
        document.querySelector('.curr-room-text').innerText = `${roomName}`;
    });

    let searchBox = document.querySelector('#search-box');
    searchBox.addEventListener('input',(e)=>{
        let messages = Array.from(document.getElementsByClassName('message-text'));
        messages.forEach((msg)=>{
            if(msg.innerText.toLowerCase().indexOf(e.target.value.toLowerCase()) === -1){
                // the msg does not contain the user search term!
                msg.style.display = "none";
            } else{
                msg.style.display = "block"
            }
        });
    });
};