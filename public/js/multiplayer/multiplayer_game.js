const host = window.location.hostname;
let params = new URLSearchParams(document.location.search);
let wsUrl = "ws://" + host + ":8080/game?lobby=" + params.get('lobby');
let ws = new WebSocket(wsUrl);
let otherPlayers;
let playerField = document.querySelector('.wrapper-main-field');
let ListPlayers = document.querySelector('.players-list');
player.field.moveDownDefault = player.field.moveDown;
player.field.updateHorizontalPositionDefault = player.field.updateHorizontalPosition;
player.onBufferKeyUpDefault = player.onBufferKeyUp;
player.onPositionKeyDownDefault = player.onPositionKeyDown;
player.field.defaultFix = player.field.fixFigure;
player.field.defaultClearRow = player.field.clearRow;
GAME.defaultInit = GAME.init;

player.countAddLines = [];
player.emptyCell = [];

GAME.start = (player) => {
    player.ui.music.play();
    player.isActive = true;
    GAME.play(player)
}

function sumArr(array){
    let sum = 0;
    if(array)
    {
        array.forEach((elem)=>{
            sum = sum + elem
        })
    }
    return sum
}

player.field.clearRow = () => {
    let needClearLines = player.field.defaultClearRow();
    let clearLines = needClearLines;
    let newField = player.field.matrix;
    if(sumArr(player.countAddLines) >= needClearLines){
        player.countAddLines.forEach((countLine, index)=>{
            if(countLine - needClearLines > 0) {
                countLine = countLine - needClearLines;
                needClearLines = 0;
                for(i = 0; i < newField.length - countLine; i++){
                    newField[i] = newField[i + countLine]
                }
                let newLine = Array(player.field.matrix[0].length).fill(19);
                newLine[player.emptyCell[index]] = 0;
                for(let i = newField.length - countLine; i < newField.length ; i++){
                    newField[i] = Array(...newLine)
                }
            }else{
                needClearLines = needClearLines - countLine;
            }
        })
        player.countAddLines = [];
        player.emptyCell = [];
    }else{
        ws.send(JSON.stringify({
            "type": "clear_rows",
            "info": clearLines - sumArr(player.countAddLines)
        }));
    }
    return clearLines
}

player.field.moveDown = (figure) => {
    let moving = player.field.moveDownDefault(figure);
    sendField()
    return moving;
}
gameEnd = () => {
    localStorage.Gamewidth = 10;
    localStorage.Gameheight = 20;
    player.update = () => {
    }
    player.onBufferKeyUp = () => {
    }
    player.onPositionKeyDown = () => {
    }
    playerField.style.display = 'none'
    ListPlayers.style.width = '100%'
    ws.send(JSON.stringify({
        "type": "game_over",
    }));
};
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
    updateSize(players.length)
}

function updateSize(countPlayers) {
    if(countPlayers > 6){
        document.querySelectorAll('.player__username').forEach((elem) => {
            elem.style.cssText = 'font: 800 14px/14px "Russo One", sans-serif'
        });
        document.querySelectorAll('.game__score-other').forEach((elem) => {
            elem.style.cssText = 'font: 800 14px/14px "Russo One", sans-serif'
        });
        document.querySelectorAll('.other-field').forEach((elem) => {
            elem.style.marginTop = '2px';
            elem.style.marginBottom = '2px'
        });
        
    }
    let length = Math.ceil(Math.sqrt(countPlayers))
    let height = Math.round(Math.sqrt(countPlayers));

    ListPlayers.style.gridTemplateColumns = `repeat(${length}, ${100 / (length)}%)`
    ListPlayers.style.gridTemplateRows = `repeat(${length}, ${100 / (height)}%)`
    document.querySelectorAll('.other-player').forEach((elem) => {
        elem.style.maxHeight = `${100 / length}%`;
    });
    document.querySelectorAll('.other-field').forEach((elem) => {
        elem.style.maxHeight = `${80}%`;
        console.log('hahah')
    })

    let width = document.querySelector('.other-field').offsetWidth;
    document.querySelectorAll('.wrapper-name').forEach((elem)=>{
        elem.style.width = `${width}px`
    })

}

ws.onopen = () => {
    ws.send(JSON.stringify({
        "type": "config"
    }));
}

ws.onmessage = (msg) => {
    let data = JSON.parse(msg.data);
    if (data.type === 'game_over'){
        console.log('game_over')
        ListPlayers.style.display = 'none'
        playerField.style.display = 'none'
        window.location.href = '/game_over_multi?lobby='  + params.get('lobby');
    }
    if (data.type === 'config')
        initMultiplayerGame(data);
    if(data.type === 'state'){
        if (data.state.id === playerField.id) {
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
            if(data.state.current_figure && (data.state.id === playerField.id)){
                player.score = data.state.score;
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
            if (data.state.id === playerField.id) {
                player.buffer = getFigure(data.state.buffer);
                player.ui.buffer.src = player.buffer.image.src;

            } else {
                if(data.state.game_over === false){
                    player.field.drawField(document.getElementById(data.state.id).querySelector('.other-field').getContext('2d'), data.state.play_field)
                    document.getElementById(data.state.id).querySelector('.game__score-other').textContent = data.state.score
                }
                else{
                    document.getElementById(data.state.id).style.display = 'none'
                }
            }

    }
    if (data.type === 'add_rows')
        {
            player.countAddLines.push(data.info.count);
            player.emptyCell.push(data.info.empty_column)
        }
}


function sendField() {
    let state = {
        id: playerField.id,
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
    if(playerField.id === data.config.players[0]){
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
        if (id !== playerField.id) {
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
    const gameScore = document.createElement('p');
    gameScore.textContent = '0';
    gameScore.setAttribute('class', 'game__score-other');


    const field = document.createElement('canvas');
    field.setAttribute('class', 'other-field');
    
    wrappperField.appendChild(playerName);
    wrappperField.appendChild(field);
    wrappperField.appendChild(gameScore);
    return wrappperField
}