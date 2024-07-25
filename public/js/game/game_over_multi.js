let params = new URLSearchParams(document.location.search);
let players = document.querySelector('.players');
let playerId = document.querySelector(".player_id").value;

async function getResults(){
    let response = await fetch("http://" + window.location.hostname + ":8080/game/results?lobby=" + params.get('lobby'), {
        method: 'GET'
    });
    return await response.json()
}

async function foundUser(id) {
    let response = await fetch('/api/player/' + id, {
        method: 'GET'
    });
    return await response.json();
}

function printResults(data){ 
    for (let i = 0; i < data.length; i++){
        let player = createPlayerBlock(data[i], i);
        players.appendChild(player);
        foundUser(data[i].player_id).then((user) => { 
            player.querySelector('.player__name').textContent = user.login;
        if (playerId == data[i].player_id){
            document.querySelector('.results__title').innerHTML = `№` + (i + 1) + ' ' + user.login
            document.querySelector('.time__value').innerHTML = elem.score
        }   
        })
    }
}

document.querySelector(".back__link").href = '/lobby?lobby=' + params.get('lobby');

getResults().then((results) => {
    printResults(results)
})

function createPlayerBlock(elem, position){
    const player = document.createElement('div');
    player.classList.add('player');

    const playerSymbole = document.createElement('p');
    playerSymbole.classList.add('player__simbol');
    playerSymbole.textContent = '№'

    const playerPlace = document.createElement('p');
    playerPlace.classList.add('player__place');
    playerPlace.textContent = position + 1
    playerPlace.textContent = position + 1

    const playerNumber = document.createElement('div');
    playerNumber.classList.add('player__number');
    playerNumber.appendChild(playerSymbole);
    playerNumber.appendChild(playerPlace);

    const playerName = document.createElement('p');
    playerName.classList.add('player__name');

    const playerScore = document.createElement('p');
    playerScore.classList.add('player__time');
    playerScore.textContent = elem.score

    const playerInfo = document.createElement('div');
    playerInfo.classList.add('player__info');
    playerInfo.appendChild(playerName);
    playerInfo.appendChild(playerScore);

    player.appendChild(playerNumber);
    player.appendChild(playerInfo);
    return player
}
