const urlParams = new URLSearchParams(window.location.search);
const lobbyId = urlParams.get('lobby');

// Создайте WebSocket-соединение с параметром lobby
let wsUrl = "ws://127.0.0.1:8080/lobby";
if (lobbyId) {
    wsUrl += "?lobby=" + lobbyId;
}
let ws = new WebSocket(wsUrl);
let playerId = parseInt(document.querySelector('.player_id').value);
let listPlayers = document.querySelector('.list-players');
let lobbyLink = document.querySelector('.lobby-link').innerHTML;
let player = document.querySelector('.profile__playerId');


ws.onmessage = (msg) => {  
    
    console.log(JSON.parse(msg.data));
    let data = JSON.parse(msg.data);
    if (data.id) {
        document.querySelector('.lobby-link').innerHTML = lobbyLink + '?lobby=' + data.id;
    }
    if (playerId === data.players[0])
    {
        console.log('you are host');
        player.style.display = 'none';
    }
    for (let i = 0; i < data.players.length ; i++) {
        let id = data.players[i];
        foundUser(id).then(() => {});
        async function foundUser(id) {
            let response = await fetch('/api/player/' + id + '/user', {
                method: 'GET'
            });
            let user = await response.json();
            let login = user.login;
            listPlayers.appendChild(createPlayer(login))
        }
    }
    
}

ws.onopen = () => {
    ws.send(JSON.stringify({
        "type": "connect",
        "connection": {
            "player_id": playerId
    }}));
};