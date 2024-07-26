let buttonJoin = document.querySelector('.join-button')
let idLobby = document.querySelector('.join')

// const lobbyId = urlParams.get('lobby');
// let wsUrl = "ws://" + host + ":8080/lobby";

buttonJoin.addEventListener('click', ()=>{
    //window.location.href = '/lobby?lobby=' + idLobby.value
    listLobby.appendChild(createLobbyLink('Ваня', '3', '12345435'))
})



function createLobbyLink(title, countPlayers, idLobby) {

    let linkLobby = document.createElement('a');
    linkLobby.setAttribute('class', 'link-lobby');
    linkLobby.setAttribute('href', '/lobby?lobby=' + idLobby);

    let div = document.createElement('div');
    div.setAttribute('class', 'menu__item');

    let itemTitle = document.createElement('p');
    itemTitle.setAttribute('class', 'item__title');
    itemTitle.textContent = `Лобби пользователя ${title}`;

    let itemDescription = document.createElement('p');
    itemDescription.setAttribute('class', 'item__subtitle');
    itemDescription.textContent = `участников: ${countPlayers}`;

    div.appendChild(itemTitle);
    div.appendChild(itemDescription);

    linkLobby.appendChild(div);

    return linkLobby;
 }