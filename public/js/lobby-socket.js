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
let buttons;
let functionKickPlayer;

addEventListener("DOMContentLoaded", (event) => {   
    functionKickPlayer = function KickPlayer(players){ 
        for (let i = 1; i < players.length; i++) { 
            if (buttons[i]){
                buttons[i].addEventListener('click', ()=>{
                    console.log('playerId = ' + players[i])
                })  
            }
        }
    }
})



function changeSetting(inSet, outSet){
    outSet = inSet
}

ws.onmessage = (msg) => {  
    let data = JSON.parse(msg.data);
    console.log('настройки поля', data)
    
    if (data.id) {
        console.log(lobbyLink + '?lobby=' + data.id)
        document.querySelector('.lobby-link').innerHTML = '';
        settingLobby.id = data.id;
    }
    deleteMenuItem(listPlayers);

    async function foundUser(id) {
        let response = await fetch('/api/player/' + id + '/user', {
            method: 'GET'
        });
        let user = await response.json();
        let login = user.login;
        listPlayers.appendChild(createPlayer(login));
    }

    async function processPlayers(data) {
        const playerPromises = data.players.map(async (id) => {
            if (!settingLobby.players.includes(id)) {
                settingLobby.players.push(id);
            }
            await foundUser(id);
        });

        await Promise.all(playerPromises);
    }
    (async () => {
        await processPlayers(data);
        buttons = document.querySelectorAll('.player__button');      
        functionKickPlayer(data.players);
        if (playerId === data.players[0]) {
            console.log(buttons);
            console.log('you are host');
            selectSize.style.pointerEvents = 'auto';
            selectMusic.style.pointerEvents = 'auto';
            selectDifficulty.style.pointerEvents = 'auto';
            selectBg.style.pointerEvents = 'auto';
            startGame.style.display = 'flex';
            buttons[0].style.display = 'none'
        } else {
            selectSize.style.pointerEvents = 'none';
            selectMusic.style.pointerEvents = 'none';
            selectDifficulty.style.pointerEvents = 'none';
            selectBg.style.pointerEvents = 'none';
            startGame.style.display = 'none';
            for (let i = 0; i < triangle.length; i++) {
                triangle[i].style.display = 'none';
            }
            for (let i = 0; i < buttons.length; i++) {
                buttons[i].style.display = 'none';
            }
        }        
    })();
}

ws.onopen = () => {
    ws.send(JSON.stringify({
        "type": "connect",
        "connection": {
            "player_id": playerId
    }}));
};

function sendLobbySettings(settingLobby){
    ws.send(JSON.stringify({
        "type": "update",
        "updates": settingLobby
    }));
} 