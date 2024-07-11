const host = window.location.hostname;
let params = new URLSearchParams(document.location.search);
let lobbyId = params.get('lobby');
let playerField = document.querySelector('.wrapper-main-field');
let otherPlayers = document.querySelectorAll('.player__username')
let player;
let otherField;
let ui;
let state;
const canvas = document.getElementById('game');
const field = canvas.getContext('2d');

let wsUrl = "ws://" + host + ":8080/game";
if (lobbyId) {
    wsUrl += "?lobby=" + lobbyId;
}

let ws = new WebSocket(wsUrl);

ws.onopen = () => {
    ws.send(JSON.stringify({
        "type": "config"
    }));
}

function initGame(data){
    console.log(data)
    
   


    
        player.moveDownDefault = player.moveDown;
        player.moveFigureDefault = player.moveFigure;

        

        otherField.forEach((elem) => {
            elem.width = ui.field.width;
            elem.height = ui.field.height;
            switch (ui.field.width / ui.blockSize) {
                case 7:
                    elem.style.maxHeight = "480px";
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
}

ws.onmessage = (msg) => {
    let data = JSON.parse(msg.data);
    if (data.type === "config") {
        initGame(data)
        ws.send(JSON.stringify({
            "type": "all"
        }));
    }


    if (data.type === "update") {
        console.log(data)
        // player.moveFigure = () => {
        //     player.moveFigureDefault();
        //     state = {
        //         id: data.state.id,
        //         play_field: player.field,
        //         figures: [player.currentFigure.id, player.nextFigures[0].id, player.nextFigures[1].id, player.nextFigures[2].id, player.nextFigures[3].id],
        //         buffer: player.buffer.id,
        //         score: 12345,
        //         figure_count: 234
        //     }
        //     // ws.send(JSON.stringify({
        //     //     "type": "update",
        //     //     "updates": state
        //     // }));
        //     console.log(player.moveFigureDefault)
        // }

        player.moveDown = () => {
            player.moveDownDefault();
            state = {
                id: data.state.id,
                play_field: player.field,
                figures: [player.currentFigure.id, player.nextFigures[0].id, player.nextFigures[1].id, player.nextFigures[2].id, player.nextFigures[3].id],
                buffer: player.buffer.id,
                score: 12345,
                figure_count: 234
            }
            // ws.send(JSON.stringify({
            //     "type": "update",
            //     "updates": state
            // }));
            console.log(player.moveFigureDefault)
        }

        

        player.buffer = player.getFigure(data.state.buffer);
        player.ui.buffer.src = player.buffer.image.src;
        player.currentFigure = player.getFigure(data.state.figures[0]);
        player.currentFigure.x = player.getStartX(player.currentFigure);
        player.nextFigures = [];
        for (let i = 0; i < player.figuresQueueSize; i++) {
            player.nextFigures[i] = player.getFigure(data.state.figures[i]);
            player.ui.viewNextFigures[i].src = player.nextFigures[i].image.src;
        }      
    }

    GAME.start(player, field, ui)
}

async function foundUser(id) {
    let response = await fetch('/api/player/' + id + '/user', {
        method: 'GET'
    });
    let user = await response.json();
    return user
}