const urlParams = new URLSearchParams(window.location.search);
const host = window.location.hostname;
const lobbyId = urlParams.get('lobby');

let inputSize = document.getElementById('size');
let inputMusic = document.getElementById('music');
let inputBg = document.getElementById('bg');
let inputDifficulty = document.getElementById('difficulty');    

let wsUrl = "ws://" + host + ":8080/lobby";
if (lobbyId) {
    wsUrl += "?lobby=" + lobbyId;
}
let ws = new WebSocket(wsUrl);
let playerId = parseInt(document.querySelector('.player_id').value);
let listPlayers = document.querySelector('.list-players');
let lobbyLink = "http://" + window.location.host + "/lobby";
let selectSize = document.querySelector(".settings__size");
let selectMusic = document.querySelector(".settings__music")
let selectDifficulty = document.querySelector(".settings__complexity")
let selectBg = document.querySelector(".settings__background");
let triangle = document.querySelectorAll(".triangle");
let startGame = document.querySelector(".start-game")
let buttons;
let functionKickPlayer;
let players;
let player;
let found;
let playersName;
let settingLobby = {
    id: "",
    players: [],
    settings: {
        music: "/audio/Korobeiniki.wav",
        background: "/images/bg.png",
        difficulty: 1,
        play_field: {
            width: 10,
            height: 20,
        }
    }
}
addEventListener("DOMContentLoaded", () => {
    functionKickPlayer = function KickPlayer(playerId, players){ 
        for (let i = 1; i < players.length; i++) { 
            if (buttons[i]){
                buttons[i].addEventListener('click', ()=>{
                    console.log('playerId = ' + players[i])
                    let kickId = players[i]
                    disconnectPlayer(playerId, kickId)
                })  
            }
        }
    }
})

startGame.addEventListener('click', ()=>{
    ws.send(JSON.stringify({
        "type": "run",
    }));
})

function changeSetting(inSet, outSet){
    outSet = inSet
}

ws.onmessage = (msg) => {
    console.log('hello hello')
    let data = JSON.parse(msg.data);
    if(data.game_run){
        window.location.href = "/multiplayer"
    }
    inputSize.innerHTML = settings.size.find(item => item.value.width === data.settings.play_field.width).title
    inputMusic.innerHTML = settings.music.find(item => item.value === data.settings.music).title
    inputBg.innerHTML = settings.bg.find(item => item.value === data.settings.background).title
    inputDifficulty.innerHTML = settings.difficulty.find(item => item.value === data.settings.difficulty).title

    console.log('настройки поля', data)
    if (data.id) {
        console.log(lobbyLink + '?lobby=' + data.id)
        document.querySelector('.lobby-link').innerHTML = '';
        settingLobby.id = data.id;
    }
    if (window.location.href === lobbyLink) {
        history.pushState(null, null, "?lobby=" + data.id)
    }
    deleteMenuItem(listPlayers);
    async function foundUser(id) {
        let response = await fetch('/api/player/' + id + '/user', {
            method: 'GET'
        });
        let user = await response.json();
        let login = user.login;
        player = createPlayer(login);
        players = listPlayers.querySelectorAll(".player__name");
        found = false
        players.forEach((elem)=>{
            if( elem.textContent === login){
                found = true
            }
        })
        if(!(found)){
            listPlayers.appendChild(player)
        }
        if(players.length === 4){
            window.location.href = '/multiplayer'
        }
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
        functionKickPlayer(playerId, data.players);
        if (playerId === data.players[0]) {
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
}

function sendLobbySettings(settingLobby){
    ws.send(JSON.stringify({
        "type": "update",
        "updates": settingLobby
    }));
}

function disconnectPlayer(playerId, kickId){
    ws.send(JSON.stringify({
        "type": "disconnect",
        "connection": {
            "player_id": kickId       
    }}));  
}

ws.onclose = () => {
    window.location.href = "/menu"
}
