const host = window.location.hostname;
let params = new URLSearchParams(document.location.search);
let wsUrl = "ws://" + host + ":8080/game?lobby=" + params.get('lobby');
let ws = new WebSocket(wsUrl);
let otherPlayers;
let addRows = false;
let playerField = document.querySelector('.wrapper-main-field');
let ListPlayers = document.querySelector('.palyers-list');
player.field.moveDownDefault = player.field.moveDown;
player.field.updateHorizontalPositionDefault = player.field.updateHorizontalPosition;
player.onBufferKeyUpDefault = player.onBufferKeyUp;
player.onPositionKeyDownDefault = player.onPositionKeyDown;
player.field.defaultFix = player.field.fixFigure;
player.field.defaultClearRow = player.field.clearRow;
GAME.defaultInit = GAME.init;

GAME.start = (player) => {
    player.isActive = true; 
    GAME.play(player)
}

player.field.clearRow = () => {
    let clearLines = player.field.defaultClearRow();
    if (player.countAddLines > clearLines) {
        let addLines = player.countAddLines - clearLines;
        let newField = [];
        for(let i = addLines; i < player.field.matrix.length; i++){
            newField.push(player.field.matrix[i])
        }
        let newLine = Array(player.field.matrix[0].length).fill(12);
        newLine[player.emptyCell] = 0;
        for(let i = 0; i < addLines; i++){
            newField.push(newLine)
        }
        player.field.matrix = newField;
    } else if (clearLines !== 0) {
        ws.send(JSON.stringify({
            "type": "clear_rows",
            "info": clearLines - player.countAddLines
        }));
    }
    player.countAddLines = 0;
    return clearLines
}

player.field.moveDown = (figure) => {
    let moving = player.field.moveDownDefault(figure);
    sendField()
    return moving;
}

player.nextFigure = () => {
}

player.onPositionKeyDown = (e) => {
    player.onPositionKeyDownDefault(e);
    sendField();
}

player.onBufferKeyUp = (e) => {
    player.onBufferKeyUpDefault(e);
    sendField();
}

player.field.fixFigure = (figure) => {
    player.field.defaultFix(figure);
    player.field.drawField(player.field.field, player.field.matrix);
    player.playTime = new Date;
    player.isShifter = true;
    player.figuresPos += 1;
    updateNextFigures(player);
    player.currentFigure = getFigure(player.figuresAll[player.figuresPos]);
    player.currentFigure.setY(0);
    player.currentFigure.setX(player.field.getStartX(player.currentFigure));
    ws.send(JSON.stringify({
        "type": "set"
    }));
}



function addLines(player, countLines, positionEmpty) {
    let newFiled;
    if(player.field.matrix[countLines - 1].every((elem) => elem === 0)){
        let newLine = [];
        for (let i = 0; i < player.field.matrix.length; i++){
            if(i !== emptyCell)
                newLine.push(12)
            else
                newLine.push(0)
        }
        for (let i = countLines; i < player.field.matrix.length; i++) {
            newFiled.push(player.field.matrix[i])
        }
        for (let i = 0; i < countLines; i++){
            newFiled.push(newLine)
        }
    }else{
        player.gameEnd(player.score);
    }
}


function updateNextFigures(player) {
    for(let i = 0; i < 4; i++){
        player.nextFigures[i] = getFigure(player.figuresAll[player.figuresPos + 1 + i]);
        player.ui.viewNextFigures[i].src = player.nextFigures[i].image.src;
    }
}

function initOtherFields(players) {
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
    updateSize()
}

function updateSize() {
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
    if(data.type === 'state'){
        if (data.state.id === parseInt(playerField.id)) {
            initOtherFields(otherPlayers);
            GAME.init
            (
                player,
                data.state.buffer,
                player.figuresAll[player.figuresPos],
                [
                    player.figuresAll[player.figuresPos + 1],
                    player.figuresAll[player.figuresPos + 2],
                    player.figuresAll[player.figuresPos + 3],
                    player.figuresAll[player.figuresPos + 4]
                ]
            )    
            if(data.state.current_figure && (data.state.id === parseInt(playerField.id))){
                player.field.matrix = data.state.play_field;
                player.figuresPos = data.state.figure_count;
                player.currentFigure = getFigure(player.figuresAll[player.figuresPos]);
                player.currentFigure.matrix = data.state.current_figure.matrix;
                player.currentFigure.setX(data.state.current_figure.pos.x);
                player.currentFigure.setY(data.state.current_figure.pos.y);
                updateNextFigures(player);
                GAME.start(player)
            }
        }
        
    }
    if (data.type === 'start'){
        GAME.start(player)
    }    
    if (data.type === 'update') {
            if (data.state.id === parseInt(playerField.id)) {
                player.buffer = getFigure(data.state.buffer);
                player.ui.buffer.src = player.buffer.image.src;

            } else {
                player.field.drawField(document.getElementById(data.state.id).querySelector('.other-field').getContext('2d'), data.state.play_field)
            }
        
    }
    if (data.type === 'add_rows')
        {
            player.countAddLines = data.info.count;
            player.emptyCell = data.info.empty_column;
        }
}


function sendField() {
    let state = {
        id: parseInt(playerField.id),
        play_field: player.field.matrix,
        buffer: player.buffer.id,
        score: player.score,
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
        "update": state
    }));
}

function initMultiplayerGame(data) {
    if(parseInt(playerField.id) === data.config.players[0]){
        playerField.appendChild(createStartGameButton());
    }
    document.querySelector('.main').style.backgroundImage = `url(${data.config.settings.background})`;
    player.lvl = data.config.settings.difficulty;
    player.ui.music = new Audio(data.config.settings.music)
    initPlayertField(data.config.settings.play_field);
    initPlayers(data.config.players);
    player.figuresAll = data.figures;
    player.figuresPos = 0;
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

function createStartGameButton() {
    const button = document.createElement("button");
    button.textContent = 'начать';
    button.onclick = () => { 
        ws.send(JSON.stringify({
            "type": "start"
        }));
      };
      
    return button;
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
    player.field.width = fieldParam.width;
    player.field.height = fieldParam.height;
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