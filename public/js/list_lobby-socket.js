const host = window.location.hostname;
let wsUrl = "ws://" + host + ":8080/lobby/list";
let ws = new WebSocket(wsUrl);
let listLobby = document.querySelector('.menu')
let login

ws.onopen = () => {
    ws.send("get");
}

ws.onmessage = (msg) => {
    let data = JSON.parse(msg.data);
    console.log(data)
    async function foundUser(id, link) {        
        let response = await fetch('/api/player/' + id + '/user', {
            method: 'GET'
        });
        let user = await response.json();
        login = user.login;
        if(link){
            let title = link.querySelector('.item__title');
            let subtitle = link.querySelector('.item__subtitle');
            title.innerHTML = `Лобби пользователя "${login}"`
            subtitle.innerHTML = `Участников ${data.lobby.players.length}/4`;
        }
        else{
            listLobby.appendChild(createLobbyLink(login, data.lobby.players.length, data.lobby.id))
        }     
    }
    if (data.type === "new"){
        listLobby.appendChild(createLobbyLink('her', '5', data.lobby.id))
    }
    if (data.type ==="update"){
        let link = document.querySelector(`a[href^="/lobby?lobby=${data.lobby.id}"]`);
        if(!link){
            if(data.lobby.players){
                //отображение лобби после перезагрузки, все данные загружены, берутся из бд
                foundUser(data.lobby.players[0], link);  
            }
            else{
                //лобби только создали, игроков пока нет, закидываем пустые значения
                listLobby.appendChild(createLobbyLink('Славянин', '0', data.lobby.id))
            }
        }
        else{
            let title = link.querySelector('.item__title');
            let subtitle = link.querySelector('.item__subtitle');
            if(data.lobby.players){
                //лобби сформировалось окончательно (пришел последний апдейт), игроки загружены, данные из бд
                foundUser(data.lobby.players[0], link);  
            }
            else{
                //лобби есть, но пока подгружаются данные, на время кидаем пустые значения
                title.innerHTML = `Лобби пользователя Славянин`
                subtitle.innerHTML = `Участников 0/4`;
            }
        }
    }
}