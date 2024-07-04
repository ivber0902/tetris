let ws = new WebSocket("ws://127.0.0.1:8080/lobby");
let playerId = parseInt(document.querySelector('.player_id').value);



ws.onmessage = (msg) => {
    console.log(JSON.parse(msg.data));
}

ws.onopen = () => {
    ws.send(JSON.stringify({
        "type": "connect",
        "connection": {
            "player_id": playerId
    }}));
};


