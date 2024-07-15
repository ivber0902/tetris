const host = window.location.hostname;
let params = new URLSearchParams(document.location.search);
let wsUrl = "ws://" + host + ":8080/game?lobby=" + params.get('lobby');
let ws = new WebSocket(wsUrl);
let otherPlayersFields = []
let otherPlayers;
let playerField = document.querySelector('.wrapper-main-field');
let startGame = true;
let init = false;
let ListPlayers = document.querySelector('.palyers-list');
let GAME = {
    width: parseInt(localStorage.Gamewidth),
    height: parseInt(localStorage.Gameheight),
    playTime: new Date(),
    init(player, currentFigureIndex, bufferFigureIndex, NextFiguresIndex, otherPlayers) {
        let i = 0;
        figures.forEach((figure) => {
            figure.image.src = `/images/figures/${images[i]}.png`;
            figure.block.src = `/images/blocks/${images[i]}.png`;
            figure.shadow.src = `/images/shadow/${images[i]}.png`;
            i++
        });
        blockField.src = '/images/blocks/bg.png';
        player.field.initField();
        player.field.initOtherFields(otherPlayers)
        player.field.initFieldMatrix();
        player.tickTime = 15974 / this.height;
        player.initEventListeners();
        player.initFigures(currentFigureIndex, bufferFigureIndex, NextFiguresIndex);
        player.updateSpeed();
        this.addPauseListener(player);
    },
    addPauseListener(player) {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'KeyP') {
                if (!player.isActive) {
                    this.drawDowncount(player, player.field.field, 3, 1, () => { player.isActive = true; this.play(player) })
                } else {
                    player.isActive = false;
                }
            }
        });
    },
    drawDowncount(player, field, fromIndex, toIndex, func) {
        if (fromIndex >= toIndex) {
            setTimeout(() => {
                player.field.clearField();
                player.field.drawField(player.field.field, player.field.matrix);
                field.fillStyle = "white";
                field.font = "96px Russo One";
                field.fillText(fromIndex, player.field.width * player.field.blockSize / 2 - 36, player.field.height * player.field.blockSize / 2);
                this.drawDowncount(player, field, fromIndex - 1, 1, func);
            }, 1000);
        } else {
            setTimeout(() => { func() }, 1000);
        }
    },
    onLoadImages(func) {
        let counter = 0;
        figures.forEach((figure) => {
            figure.image.addEventListener('load', () => {
                counter++;
                if (counter === figures.length * 3 + 1) {
                    func()
                }
            })
            figure.block.addEventListener('load', () => {
                counter++;
                if (counter === figures.length * 3 + 1) {
                    func()
                }
            })
            figure.shadow.addEventListener('load', () => {
                counter++;
                if (counter === figures.length * 3 + 1) {
                    func()
                }
            })
        }
        );
        blockField.addEventListener('load', () => {
            counter++;
            if (counter === figures.length * 3 + 1) {
                func()
            }
        })
    },
    start(player) {
        this.onLoadImages(() => { 
            this.play(player)
            // this.drawDowncount(player, player.field.field, 3, 1, () => { player.isActive = true; this.play(player) }) })
    },)},
    play(player) {
        player.ui.score = player.score;
        player.ui.level = player.lvl;
        player.update();
        document.querySelector('.game__score').innerHTML = player.score;
        document.querySelector('.game__level').innerHTML = player.lvl;
        requestAnimationFrame(() => this.play(player));

    },
}

const ui = new UI(
    document.querySelector(".buffer__figure"),
    document.querySelectorAll(".figure"),
    document.querySelector(".game__score"),
    document.querySelector(".game__level"),
    document.querySelector(".game__time"),
    document.querySelector(".game__lines"),
);

let player = new Player(ui, new Field([], GAME.width, GAME.height));

player.updateDefault = player.update;
player.update = () =>{
    player.updateDefault();
    sendField()
}

ws.onopen = () => {
    ws.send(JSON.stringify({
        "type": "config"
    }));
}

ws.onmessage = (msg) => {
    let data = JSON.parse(msg.data);
    if(data.type === 'config')
        initMultiplayerGame(data)
    if(data.type === 'update')
        {
            if(init){
            if(startGame)
                {
                    startGame = false;
                    GAME.init(player, data.state.buffer, data.state.figures[0], data.state.figures.slice(1), otherPlayers)
                    GAME.start(player)
                }
            if(data.state.id === parseInt(playerField.id)) {
                player.buffer = getFigure(data.state.buffer);
                player.ui.buffer.src = player.buffer.image.src;
                for (let i = 0; i < data.state.figures.length - 1 ; i++) {
                    player.nextFigures[i] = getFigure(data.state.figures[i + 1]);
                    player.ui.viewNextFigures[i].src = player.nextFigures[i].image.src;
                }   
            }else{
                player.field.drawField(document.getElementById(data.state.id).querySelector('.other-field').getContext('2d'), data.state.play_field
            )
            }
        }
        }
}

function sendField(){
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
        if(id !== parseInt(playerField.id)){
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

function initPlayertField(fieldParam){
    GAME.width = fieldParam.width;
    GAME.height = fieldParam.height;
}

/* <div class="other-player">
<p class="player__username"></p>
<canvas class="other-field"></canvas>
<p class="game__score">200</p>
</div> */
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