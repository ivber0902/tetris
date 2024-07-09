const host = window.location.hostname;
let wsUrl = "ws://" + host + ":8080/lobby/list";
let ws = new WebSocket(wsUrl);
let listLobby = document.querySelector('.menu')

ws.onopen = () => {
    ws.send("get");
}

ws.onmessage = (msg) => {
    let data = JSON.parse(msg.data);
    console.log(data)
    if(data.id){
        listLobby.appendChild(createLobbyLink('her', '5', data.id))
    }
}