const host = window.location.hostname;
let params = new URLSearchParams(document.location.search);
let lobbyId = params.get('lobby');
let playerField = document.querySelector('.wrapper-main-field');
let otherPlayers =  document.querySelectorAll('.player__username')
let player;
let otherField;
const canvas = document.getElementById('game');
const field = canvas.getContext('2d');

let wsUrl = "ws://" + host + ":8080/lobby";
if (lobbyId) {
    wsUrl += "?lobby=" + lobbyId;
}

let ws = new WebSocket(wsUrl);

ws.onopen = () => {
    ws.send(JSON.stringify({
        "type": "get",
    }));
}


const ui = new UI(
    34,
    document.querySelector(".buffer__figure"),
    document.querySelectorAll(".figure"),
    GAME,
    document.querySelector(".game__score"),
    document.querySelector(".game__level"),
);

ws.onmessage = (msg) => {
    let data = JSON.parse(msg.data);
    let players = data.players;
    players.forEach((id)=>{
        foundUser(id).then((player)=>{
            if(id === playerField.id){
                playerField.querySelector('.player_name').textContent = player.login
            }else{
                otherPlayers[0].textContent = player.login
            }          
        })

    })
    document.querySelector('.main').style.backgroundImage = `url(${data.settings.background})`
    GAME.width = data.settings.play_field.width;
    GAME.height = data.settings.play_field.height;
    ui.music = new Audio(data.settings.music)
    player = new Player(ui, GAME.figuresQueueSize);
    player.lvl = data.settings.difficulty;
    otherField = document.querySelectorAll('.other-field');
    canvas.width = ui.field.width;
    canvas.height = ui.field.height;
    field.fillStyle = 'black';
    field.fillRect(0, 0, ui.field.width, ui.field.height);
    otherField.forEach((elem) => {
        elem.width = ui.field.width;
        elem.height = ui.field.height;
        switch (ui.field.width / ui.blockSize) {
            case 7:
                elem.style.maxHeight = "480px";
                document.querySelector('.palyers-list').style.paddingRight = '100px'
                break
            case 10:
                elem.style.maxHeight = "400px";
                break
            case 15:
                elem.style.maxHeight = "320px";
                break
        }
    })
    GAME.init(player, ui)
    GAME.start(player, field, ui)
}

async function foundUser(id)
{
    let response = await fetch('/api/player/' + id + '/user', {
        method: 'GET'
    });
    let user = await response.json();
    return user
}