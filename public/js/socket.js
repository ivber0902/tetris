let ws = new WebSocket("ws://127.0.0.1:8080/lobby");
let playerId = parseInt(document.querySelector('.player_id').value);
let listPlayers = document.querySelector('.list-players');


ws.onmessage = (msg) => {
    
    console.log(JSON.parse(msg.data));
    let data = JSON.parse(msg.data);
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


