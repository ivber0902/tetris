let id = document.querySelector('.player-id').value;
let gameMode = 'неизвестно'
let gameField =  'неизвестно'
let gameTime = 'без времени'

async function foundGames()
{
    let response = await fetch(`/api/game/rating?playerId=${id}`, {
        method: 'GET'
    });
    return await response.json();
}

function createGameBlock(){
    const gameBlock = document.createElement('div');
    gameBlock.classList.add('game-block');

    const game = document.createElement('div');
    game.classList.add('game');

    const gameInfo = document.createElement('div');
    gameInfo.classList.add('game-info');

    const gamePosition = document.createElement('p');
    gamePosition.classList.add('game-position');
    gamePosition.textContent = ''

    const gameMode = document.createElement('p');
    gameMode.classList.add('game-mode');
    gameMode.textContent = ''

    const gameScore = document.createElement('p');
    gameScore.classList.add('game-score');
    gameScore.textContent = ''

    gameInfo.appendChild(gamePosition)
    gameInfo.appendChild(gameMode)
    game.appendChild(gameInfo)
    game.appendChild(gameScore)

    const gameMore = document.createElement('div');
    gameMore.classList.add('game-more_info');

    const gameField = document.createElement('p');
    gameField.classList.add('game-field');
    gameField.textContent = ''

    const gameTime = document.createElement('p');
    gameTime.classList.add('game-time');
    gameTime.textContent = ''

    const gameTetris = document.createElement('p');
    gameTetris.classList.add('game-tetris');
    gameTetris.textContent = ''

    const gameRows = document.createElement('p');
    gameRows.classList.add('game-rows');
    gameRows.textContent = ''

    const gameFigures = document.createElement('p');
    gameFigures.classList.add('game-figures');
    gameFigures.textContent = ''

    gameMore.appendChild(gameField)
    gameMore.appendChild(gameTime)
    gameMore.appendChild(gameTetris)
    gameMore.appendChild(gameRows)
    gameMore.appendChild(gameFigures)

    gameBlock.appendChild(game)
    gameBlock.appendChild(gameMore)

    return gameBlock
}

function createGame(data){
    for(let i = 0; i < data.length; i++){
        let gameBlock = createGameBlock()
        document.querySelector('.games_list').appendChild(gameBlock)
        gameBlock.querySelector('.game-position').textContent = '№' + (i+1)
        switch (data[i].mode) {
            case 0:
                gameMode = 'классика'
                break;
            case 1:
                gameMode = 'блиц'
                break;
            case 2:
                gameMode = '40 линий'
                break;
            case 3:
                gameMode = 'бот'
                break;
            case 4:
                gameMode = 'кооператив'
                break;
        }
        gameBlock.querySelector('.game-mode').textContent = gameMode
        gameBlock.querySelector('.game-score').textContent = 'score: ' + data[i].score

        switch (data[i].field_mode) {
            case 0:
                gameField = 'холоп'
                break;
            case 1:
                gameField = 'крестьянин'
                break;
            case 2:
                gameField = 'боярин'
                break;
        }
        gameBlock.querySelector('.game-field').textContent = 'размер: ' + gameField
        if (data[i].time !== 0)
            gameTime = data[i].time
        gameBlock.querySelector('.game-time').textContent = 'время:' + gameTime
        gameBlock.querySelector('.game-tetris').textContent = 'тетрисов:' + data[i].tetris_count
        gameBlock.querySelector('.game-rows').textContent = 'линий:' + data[i].filled_rows
        gameBlock.querySelector('.game-figures').textContent = 'фигур:' + data[i].figure_count
    }
}

foundGames().then((results) => {
    createGame(results)
    if(results.length === 0)
        document.querySelector('.zero-games').style.display = 'inline'
    else
        document.querySelector('.zero-games').style.display = 'none'
})

