const urlParams = new URLSearchParams(window.location.search);
const host = window.location.hostname;
const lobbyId = urlParams.get("lobby");
const baseLink = "http://" + window.location.host + "/lobby";

let viewInputSize = document.getElementById("size")
let viewInputMusic = document.getElementById("music");
let viewInputBg = document.getElementById("bg");
let viewInputDifficulty = document.getElementById("difficulty");
let userId = document.querySelector(".player_id").value;
let listPlayers = document.querySelector(".list-players");
let triangle = document.querySelectorAll(".triangle");
let startGame = document.querySelector(".start-game");
let runGame = false;

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

let wsUrl = "ws://" + host + ":8080/lobby";
if (lobbyId) {
    wsUrl += "?lobby=" + lobbyId;
}

let ws = new WebSocket(wsUrl);


startGame.addEventListener('click', () => {
    ws.send(JSON.stringify({
        "type": "run",
    }));
})

function sendLobbySettings(settingLobby) {
    ws.send(JSON.stringify({
        "type": "update",
        "update": settingLobby
    }));
}

function updateView(newData) {
    viewInputSize.innerHTML = settings.size.find(item => item.value.width === newData.settings.play_field.width).title[localStorage.lang]
    viewInputMusic.innerHTML = settings.music.find(item => item.value === newData.settings.music).title[localStorage.lang]
    viewInputBg.innerHTML = settings.bg.find(item => item.value === newData.settings.background).title[localStorage.lang]
    viewInputDifficulty.innerHTML = settings.difficulty.find(item => item.value === newData.settings.difficulty).title[localStorage.lang]
}

function disconnectPlayer(kickId){
    ws.send(JSON.stringify({
        "type": "disconnect",
        "connection": {
            "player_id": kickId       
    }}));  
}

async function foundUser(id)
{
    let response = await fetch('/api/player/' + id, {
        method: 'GET'
    });
    let user = await response.json();
    return user
}

function giveHostRole(){
    document.querySelector('body').classList.add('host');
}

function initKickButtons(){
    let buttons = listPlayers.querySelectorAll('.kick__button');
    buttons.forEach((btn)=>{
        btn.addEventListener('click', ()=>{
            document.getElementById(btn.value).remove()
            disconnectPlayer(btn.value)
        })
    })
}

ws.onopen = () => {
    ws.send(JSON.stringify({
        "type": "connect",
        "connection": {
            "player_id": userId
        }
    }));
}

function updatePlayers(data){
    let lobbyMembers = listPlayers.querySelectorAll('.player')
    lobbyMembers.forEach((elem)=>{
        if(data.players.indexOf(elem.id) === -1)
            document.getElementById(elem.id).remove()
    })
}

ws.onmessage = (msg) => {
    let data = JSON.parse(msg.data);
    console.log(data)
    if (data.game_run)
        {
            runGame = true;
            window.location.href = "/multiplayer?lobby=" + data.id;
        }
    updateView(data);
    updatePlayers(data);
    if(userId === data.players[0])
        giveHostRole()
    settingLobby.id = data.id;
    if (window.location.href === baseLink)
        history.pushState(null, null, "?lobby=" + data.id)
    data.players.forEach((joinPlayerId)=>{
        let found = false;
        let lobbyMembers = listPlayers.querySelectorAll(".player__hidden-id");     
        lobbyMembers.forEach((elem)=>{
            if(elem.value === joinPlayerId)
                found = true;
        })
        let newPlayer;
        if(!found){
            let createKickButton = false
            settingLobby.players.push(joinPlayerId)
             if(userId === data.players[0] && data.players.indexOf(joinPlayerId) !== 0)
                createKickButton = true;
            newPlayer = createPlayer(joinPlayerId, createKickButton);
            listPlayers.appendChild(newPlayer);
        }
        foundUser(joinPlayerId).then((user)=>{
            if(newPlayer)
                newPlayer.querySelector('.player__name').textContent = user.login
        })
    })
    initKickButtons()
}

ws.onclose = () => {
    let reason = "kicked"
    if(!runGame)
         window.location.href = `/menu?reason=${reason}`
}