const host = window.location.hostname;

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

    return playerWrapper
}

function createTotalScoreBlock(){
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

    return playerWrapper
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

    return playerWrapper
}

function maxScoreResults(data){ 
    console.log(data)
    for(let i = 0; i < data.length; i++){
        let playerWrapper = createMaxScoreBlock()
        document.querySelector('.max__score').appendChild(playerWrapper)
        foundUser(data[i].id).then((user) => {
            playerWrapper.querySelector('.player-name').textContent = user.login
            playerWrapper.querySelector('.player-score').textContent = user.statistics.max_score
            playerWrapper.querySelector('.player-position').textContent = '№' + (i + 1)
        })
    }
}

function totalScoreResults(data){ 
    console.log(data)
    for(let i = 0; i < data.length; i++){
        let playerWrapper = createTotalScoreBlock()
        document.querySelector('.max__total').appendChild(playerWrapper)
        foundUser(data[i].id).then((user) => {
            playerWrapper.querySelector('.player-name').textContent = user.login
            playerWrapper.querySelector('.player-score').textContent = user.statistics.total_score
            playerWrapper.querySelector('.player-position').textContent = '№' + (i + 1)
        })
    }
}

function winCountResults(data){ 
    console.log(data)
    for(let i = 0; i < data.length; i++){
        let playerWrapper = createMaxWinBlock()
        document.querySelector('.max__win').appendChild(playerWrapper)
        foundUser(data[i].id).then((user) => {
            playerWrapper.querySelector('.player-name').textContent = user.login
            playerWrapper.querySelector('.player-score').textContent = user.statistics.win_count
            playerWrapper.querySelector('.player-position').textContent = '№' + (i + 1)
        })
    }
}



async function foundLeaders(sortKey, count)
{
    let response = await fetch(`/api/player/rating?sortKey=${sortKey}&count=${count}`, {
        method: 'GET'
    });
    return await response.json();
}

async function foundUser(id) {
    let response = await fetch('/api/player/' + id, {
        method: 'GET'
    });
    return await response.json();
}

foundLeaders('maxScore', 10).then((results) => {
    maxScoreResults(results) 
})

foundLeaders('winCount', 10).then((results) => {
    winCountResults(results) 
})

foundLeaders('totalScore', 10).then((results) => {
    totalScoreResults(results) 
})