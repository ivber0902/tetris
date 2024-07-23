function createMaxScoreBlock(){
    const player = document.createElement('div');
    player.classList.add('player');

    const playerPosition = document.createElement('p');
    playerPosition.classList.add('player-position');
    playerPosition.textContent = '№1'

    const playerName = document.createElement('p');
    playerName.classList.add('player-name');
    playerName.textContent = 'Тверь'

    const playerInfo = document.createElement('div');
    playerInfo.classList.add('player-info');
    playerInfo.appendChild(playerPosition);
    playerInfo.appendChild(playerName);


    const playerScore = document.createElement('p');
    playerScore.classList.add('player-score');
    playerScore.textContent = '123456789'

    player.appendChild(playerInfo);
    player.appendChild(playerScore);

    const playerWrapper = document.createElement('div')
    playerWrapper.classList.add('menu-wrapper')
    playerWrapper.appendChild(player)

    document.querySelector('.max__score').appendChild(playerWrapper)
}

function createAverageScoreBlock(){
    const player = document.createElement('div');
    player.classList.add('player');

    const playerPosition = document.createElement('p');
    playerPosition.classList.add('player-position');
    playerPosition.textContent = '№1'

    const playerName = document.createElement('p');
    playerName.classList.add('player-name');
    playerName.textContent = 'Тверь'

    const playerInfo = document.createElement('div');
    playerInfo.classList.add('player-info');
    playerInfo.appendChild(playerPosition);
    playerInfo.appendChild(playerName);


    const playerScore = document.createElement('p');
    playerScore.classList.add('player-score');
    playerScore.textContent = 'average'

    player.appendChild(playerInfo);
    player.appendChild(playerScore);

    const playerWrapper = document.createElement('div')
    playerWrapper.classList.add('menu-wrapper')
    playerWrapper.appendChild(player)

    document.querySelector('.max__average').appendChild(playerWrapper)
}

function createMaxWinBlock(){
    const player = document.createElement('div');
    player.classList.add('player');

    const playerPosition = document.createElement('p');
    playerPosition.classList.add('player-position');
    playerPosition.textContent = '№1'

    const playerName = document.createElement('p');
    playerName.classList.add('player-name');
    playerName.textContent = 'Тверь'

    const playerInfo = document.createElement('div');
    playerInfo.classList.add('player-info');
    playerInfo.appendChild(playerPosition);
    playerInfo.appendChild(playerName);


    const playerScore = document.createElement('p');
    playerScore.classList.add('player-score');
    playerScore.textContent = 'win'

    player.appendChild(playerInfo);
    player.appendChild(playerScore);

    const playerWrapper = document.createElement('div')
    playerWrapper.classList.add('menu-wrapper')
    playerWrapper.appendChild(player)

    document.querySelector('.max__win').appendChild(playerWrapper)
}

createMaxScoreBlock()
createAverageScoreBlock()
createMaxWinBlock()