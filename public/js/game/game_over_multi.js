const host = window.location.hostname;
let params = new URLSearchParams(document.location.search);
let players = document.querySelectorAll(".player")
let playerId = document.querySelector(".player_id").value;
let playersCount = 0

async function getResults(){
    let response = await fetch("http://" + host + ":8080/game/results?lobby=" + params.get('lobby'), {
        method: 'GET'
    });
    return await response.json()
}

async function foundUser(id) {
    let response = await fetch('/api/player/' + id + '/user', {
        method: 'GET'
    });
    return await response.json();
}

function createPlayerBlock(elem, user, frag){
    const player = document.createElement('div');
    player.classList.add('player');

    const playerSymbole = document.createElement('p');
    playerSymbole.classList.add('player__simbol');
    playerSymbole.textContent = '№'

    const playerPlace = document.createElement('p');
    playerPlace.classList.add('player__place');
    playerPlace.textContent = playersCount + 1

    const playerNumber = document.createElement('div');
    playerNumber.classList.add('player__number');
    playerNumber.appendChild(playerSymbole);
    playerNumber.appendChild(playerPlace);

    const playerName = document.createElement('p');
    playerName.classList.add('player__name');
    playerName.textContent = user.login

    const playerScore = document.createElement('p');
    playerScore.classList.add('player__time');
    playerScore.textContent = elem.score

    const playerInfo = document.createElement('div');
    playerInfo.classList.add('player__info');
    playerInfo.appendChild(playerName);
    playerInfo.appendChild(playerScore);

    player.appendChild(playerNumber);
    player.appendChild(playerInfo);
    document.querySelector('.players').appendChild(player);
}

function printResults(data){
    data.forEach((elem)=>{
        foundUser(elem.player_id).then((user) => {       
            createPlayerBlock(elem, user)
            if (playerId == elem.player_id){
                document.querySelector('.results__title').innerHTML = `№` + (playersCount + 1) + ' ' + user.login
                document.querySelector('.time__value').innerHTML = elem.score
            }
            playersCount += 1
        }) 
    })
}

document.querySelector(".back__link").href = '/lobby?lobby=' + params.get('lobby');

getResults().then((results) => {
    console.log(results)
    printResults(results)
})