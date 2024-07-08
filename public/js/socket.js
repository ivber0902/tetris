const urlParams = new URLSearchParams(window.location.search);
const lobbyId = urlParams.get('lobby');

let wsUrl = "ws://127.0.0.1:8080/lobby";
if (lobbyId) {
    wsUrl += "?lobby=" + lobbyId;
}
let ws = new WebSocket(wsUrl);
let playerId = parseInt(document.querySelector('.player_id').value);
let listPlayers = document.querySelector('.list-players');
let lobbyLink = document.querySelector('.lobby-link').innerHTML;
let selectSize = document.querySelector(".settings__size");
let selectMusic = document.querySelector(".settings__music")
let selectDifficulty = document.querySelector(".settings__complexity")
let selectBg = document.querySelector(".settings__background");
let triangle = document.querySelectorAll(".triangle");
let startGame = document.querySelector(".start-game");

function changeSetting(inSet, outSet){
    outSet = inSet
}

ws.onmessage = (msg) => {  
    let data = JSON.parse(msg.data);
    console.log('настройки поля', data)
    if (data.id) {
        document.querySelector('.lobby-link').innerHTML = lobbyLink + '?lobby=' + data.id;
        settingLobby.id = data.id;
    }
    deleteMenuItem(listPlayers);
    for (let i = 0; i < data.players.length; i++) {
        let id = data.players[i];
        if(!settingLobby.players.includes(id)){
            settingLobby.players.push(id)
        }
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
    if (playerId === data.players[0])
    {
        console.log('you are host');
        selectSize.style.pointerEvents = 'auto';
        selectMusic.style.pointerEvents = 'auto';
        selectDifficulty.style.pointerEvents = 'auto';
        selectBg.style.pointerEvents = 'auto';
        startGame.style.display = 'flex';
    }
    else
    {
        selectSize.style.pointerEvents = 'none';
        selectMusic.style.pointerEvents = 'none';
        selectDifficulty.style.pointerEvents = 'none';
        selectBg.style.pointerEvents = 'none';
        startGame.style.display = 'none';
        for (let i = 0; i < triangle.length ; i++) 
        {
            triangle[i].style.display = 'none'
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

function sendLobbySettings(settingLobby){
    console.log(settingLobby, 'her')
    ws.send(JSON.stringify({
        "type": "update",
        "updates": settingLobby
    }));
} 
