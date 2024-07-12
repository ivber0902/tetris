const host = window.location.hostname;
let params = new URLSearchParams(document.location.search);
let wsUrl = "ws://" + host + ":8080/game?lobby=" + params.get('lobby');
let ws = new WebSocket(wsUrl);
let otherPlayersFields = []

let player;
let ui;
let playerField = document.querySelector('.wrapper-main-field');
let otherPlayers = document.querySelectorAll('.player__username')

let started = false;
const canvas = document.getElementById('game');
const field = canvas.getContext('2d');

ws.onopen = () => {
    ws.send(JSON.stringify({
        "type": "config"
    }));
}

ws.onmessage = (msg) => {
    let data = JSON.parse(msg.data);
    if(data.type === "config")
        {
            initMultiplayer(data);
            
            ws.send(JSON.stringify({
                "type": "all"
            }));
        }
        
    if(data.type === "update")
        {   
            if (data.state.id === parseInt(playerField.id))
                {
                    if(started){
                        player.field = data.state.play_field;
                        started = false
                    }   
                    player.buffer = player.getFigure(data.state.buffer);
                    player.ui.buffer.src = player.buffer.image.src;
                    if(Object.keys(data.state.current_figure).length === 0)
                        {
                            player.currentFigure = player.getFigure(data.state.figures[0]);
                            player.currentFigure.x = player.getStartX(player.currentFigure);
                        }   
                    for (let i = 0; i < data.state.figures.length - 1 ; i++) {
                        player.nextFigures[i] = player.getFigure(data.state.figures[i + 1]);
                        player.ui.viewNextFigures[i].src = player.nextFigures[i].image.src;
                    }    
                }
                else{
                    otherPlayersFields[0] = data.state.play_field;
                }
        }
  
}


function sendField(){
    state = {
        id: parseInt(playerField.id),
        play_field: player.field,
        figures: [player.currentFigure.id, player.nextFigures[0].id, player.nextFigures[1].id, player.nextFigures[2].id, player.nextFigures[3].id],
        buffer: player.buffer.id,
        score: 12345,
        figure_count: 234,
        current_figure: {
          matrix: player.currentFigure.matrix,
          pos: {
            x: player.currentFigure.x,
            y: player.currentFigure.y
          }
        },
        game_over: false
      }
    ws.send(JSON.stringify({
        "type": "update",
        "updates": state
    }));
}

function initPlayertField(fieldParam){
    GAME.width = fieldParam.width;
    GAME.height = fieldParam.height;
}

function initAllPlayers(players)
{
    let i = 0;
    players.forEach((id) => {
        foundUser(id).then((player) => {
            if (id === parseInt(playerField.id)) {
                playerField.querySelector('.player_name').textContent = player.login
            } else {
                otherPlayers[i].textContent = player.login
                i++
            }
        })
    })
}

function initUI(settings){
    ui = new UI(
        34,
        document.querySelector(".buffer__figure"),
        document.querySelectorAll(".figure"),
        GAME,
        document.querySelector(".game__score"),
        document.querySelector(".game__level"),
    );
    ui.music = new Audio(settings.music)
}

function initMultiplayer(data){
    document.querySelector('.main').style.backgroundImage = `url(${data.config.settings.background})`;
    otherField = document.querySelectorAll('.other-field');
    initPlayertField(data.config.settings.play_field)
    initUI(data.config.settings)
    initAllPlayers(data.config.players)
    player = new Player(ui, GAME.figuresQueueSize);
    player.lvl = data.config.settings.difficulty;
    player.nextFigures = []; 
    player.moveDownDefault = player.moveDown;
    player.moveDown = () => {
        sendField()
        player.moveDownDefault();
    }  
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
                document.querySelector('.players-list').style.paddingRight = '100px'
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
    GAME.start(player, field, ui, () => {})

}

async function foundUser(id) {
    let response = await fetch('/api/player/' + id + '/user', {
        method: 'GET'
    });
    let user = await response.json();
    return user
}