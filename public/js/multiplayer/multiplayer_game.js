const host = window.location.hostname;
let params = new URLSearchParams(document.location.search);
let wsUrl = "ws://" + host + ":8080/game?lobby=" + params.get('lobby');
let ws = new WebSocket(wsUrl);
let otherPlayersFields = [];
let otherPlayers;
let playerField = document.querySelector('.wrapper-main-field');
let startGame = true;
let init = false;
let ListPlayers = document.querySelector('.palyers-list');
let newFigureId;
gameEnd = () => { };
function multiplayerGameEnd(score) {
    localStorage.Gamewidth = 10;
    localStorage.Gameheight = 20;
    sendResult(score).then(() => { });
}
player.field.moveDownDefault = player.field.moveDown;
player.field.updateHorizontalPositionDefault = player.field.updateHorizontalPosition

player.field.moveDown = (figure) => {
    let r = player.field.moveDownDefault(figure);
    sendField()
    return r;
}

player.nextFigure = () => {
}
player.onPositionKeyDownDefault = player.onPositionKeyDown;
player.onPositionKeyDown = (e) => {
    player.onPositionKeyDownDefault(e);
    sendField();
}
player.onBufferKeyUpDefault = player.onBufferKeyUp;
player.onBufferKeyUp = (e) => {
    player.onBufferKeyUpDefault(e);
    sendField();
}
player.field.defaultFix = player.field.fixFigure;
player.field.fixFigure = (figure) => {
    player.field.defaultFix(figure);
    player.field.drawField(player.field.field, player.field.matrix);
    player.isActive = false;
    console.log('otmena')
    ws.send(JSON.stringify({
        "type": "set"
    }));
}

GAME.defaultInit = GAME.init;
player.field.initOtherFields = (players) => {
    players.forEach((item) => {
        let field = item.querySelector('.other-field').getContext('2d')
        let canvas = item.querySelector('.other-field');
        canvas.width = player.field.width * player.field.blockSize;
        canvas.height = player.field.height * player.field.blockSize;
        field.width = player.field.width * player.field.blockSize;
        field.height = player.field.height * player.field.blockSize;
        field.fillStyle = 'black';
        field.fillRect(0, 0, player.field.width * player.field.blockSize, player.field.height * player.field.blockSize);
    })
    document.querySelectorAll('.other-field').forEach((elem) => {
        switch (player.field.width) {
            case 7:
                elem.maxHeight = "480px";
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
}

ws.onopen = () => {
    ws.send(JSON.stringify({
        "type": "config"
    }));
}

ws.onmessage = (msg) => {
    let data = JSON.parse(msg.data);
    if (data.type === 'config')
        initMultiplayerGame(data);
    if (data.type === 'set') {
        player.buffer = getFigure(data.state.buffer);
        player.ui.buffer.src = player.buffer.image.src;
        player.nextFigures[0] = getFigure(data.state.figures[1]);
        player.isActive = true;
        player.playTime = new Date;
        player.isShifter = true;
        player.currentFigure = getFigure(data.state.figures[0]);
        player.nextFigures[0] = getFigure(data.state.figures[1]);
        player.nextFigures[1] = getFigure(data.state.figures[2]);
        player.nextFigures[2] = getFigure(data.state.figures[3]);
        player.nextFigures[3] = getFigure(data.state.figures[4]);
        player.ui.viewNextFigures[0].src = player.nextFigures[0].image.src;
        player.ui.viewNextFigures[1].src = player.nextFigures[1].image.src;
        player.ui.viewNextFigures[2].src = player.nextFigures[2].image.src;
        player.ui.viewNextFigures[3].src = player.nextFigures[3].image.src;
        player.currentFigure.setY(0);
        player.currentFigure.setX(player.field.getStartX(player.currentFigure));
        if (player.isGameOver) {
            if (player.field.checkPosition(player.currentFigure.x, player.currentFigure.y, player.currentFigure.matrix)) {

                player.isGameOver = false;
            } else {
                multiplayerGameEnd(score);
            }
        }
    }
    if (data.type === 'update') {
        if (init) {
            if (startGame) {
                startGame = false;
                GAME.init(player, data.state.buffer, data.state.figures[0], data.state.figures.slice(1))
                player.field.initOtherFields(otherPlayers)
                GAME.start(player)
            }
            if (data.state.id === parseInt(playerField.id)) {
                player.buffer = getFigure(data.state.buffer);
                player.ui.buffer.src = player.buffer.image.src;

            } else {
                player.field.drawField(document.getElementById(data.state.id).querySelector('.other-field').getContext('2d'), data.state.play_field
                )
            }
        }
    }
}

function sendField() {
    let state = {
        id: parseInt(playerField.id),
        play_field: player.field.matrix,
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

function initMultiplayerGame(data) {
    init = true;
    document.querySelector('.main').style.backgroundImage = `url(${data.config.settings.background})`;
    initPlayertField(data.config.settings.play_field);
    initPlayers(data.config.players);
    otherPlayers = document.querySelectorAll('.other-player');
    ws.send(JSON.stringify({
        "type": "all"
    }));
}

function initPlayers(players) {
    players.forEach((id) => {
        createField(id)
        if (id !== parseInt(playerField.id)) {
            let newField = createField(id);
            ListPlayers.appendChild(newField)
            foundUser(id).then((player) => newField.querySelector('.player__username').textContent = player.login)
        }
    })
}

async function foundUser(id) {
    let response = await fetch('/api/player/' + id + '/user', {
        method: 'GET'
    });
    let user = await response.json();
    return user
}

function initPlayertField(fieldParam) {
    GAME.width = fieldParam.width;
    GAME.height = fieldParam.height;
}

function createField(id) {
    const wrappperField = document.createElement('div');
    wrappperField.setAttribute('class', 'other-player');
    wrappperField.setAttribute('id', id);
    const playerName = document.createElement('p');
    playerName.setAttribute('class', 'player__username');
    const field = document.createElement('canvas');
    field.setAttribute('class', 'other-field');
    const gameScore = document.createElement('p');
    gameScore.setAttribute('class', 'game__score');
    wrappperField.appendChild(playerName);
    wrappperField.appendChild(field);
    wrappperField.appendChild(gameScore);
    return wrappperField
}