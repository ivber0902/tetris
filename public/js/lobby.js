let settings = {
    music: [
        {
        title: "эхо во тьме",
        description: "мистическая и загадочная композиция, в которой звуки эха на фоне темноты создают атмосферу напряжения и тайны.",
        value: "https://example.com/track1"
        },
        {
        title: "лунный вальс",
        description: "Романтичная и нежная мелодия, напоминающая танец под лунным светом. Идеальный трек для вечернего романтического настроения.",
        value: "https://example.com/track2"
        },
        {
        title: "путешествие во времени",
        description: "эпическая и кинематографичная музыка, создающая ощущение путешествия сквозь временные измерения и пространство.",
        value: "https://example.com/track3"
        },
    ],
    size: [
        {
            title: "холоп",
            description: "маленький размер поля и медленная игра",
            value:
            {
                width: 5,
                height: 20
            }
        },
        {
            title: "крестьянин",
            description: "классические размер поля и скорость игры",
            value:
            {
                width: 10,
                height: 20
            }
        },
        {
            title: "боярин",
            description: "большой размер поля и быстрая игра",
            value:
            {
                width: 15,
                height: 20
            }
        }
    ],
    difficulty: [
        {
            title: "легко",
            description: "игра для нубов",
            value: 1
        },
        {
            title: "средний",
            description: "ты уже что-то можешь",
            value: 2
        },
        {
            title: "имбоссссибл",
            description: "ты просто гений тетриса",
            value: 3
        }
    ],
    bg: [
        {
            title: "ISPRING",
            description: "Фон компании Ispting",
            value: "https://example.com/track1"
        },
        {
            title: "Pолитех",
            description: "Фон первого корпуса",
            value: "https://example.com/track1"
        },
        {
            title: "IOошкар-Ола",
            description: "йон йошкар-олы",
            value: "https://example.com/track1"
        }
    ],
}

let settingLobby = {
    id: "",
    players: [],
    settings: {
      music: "/audio/Korobeiniki.wav",
      background: "/images/bg.png",
      difficulty: 1,
      play_field: {
        width: 10,
        height: 20
      }
    }
}

addEventListener("DOMContentLoaded", (event) => {
    document.querySelector(".exit").addEventListener("click", (e) => close(e));
    document.querySelector(".profile__avatar").addEventListener("click", (e) => open(e));
    let selectSize = document.querySelector(".settings__size")
    let selectMusic = document.querySelector(".settings__music")
    let selectDifficulty = document.querySelector(".settings__complexity")
    let selectBg = document.querySelector(".settings__background")
    let listSettings = document.querySelector('.list-settings');
    let menu = document.querySelector('.menu');
    let inputSize = document.getElementById('size');
    let inputMusic = document.getElementById('music');
    let inputBg = document.getElementById('bg');
    let inputDifficulty = document.getElementById('difficulty');

    listSettings.addEventListener('click', ()=>{
        listSettings.style.display = "none";
        deleteMenuItem(menu)
    })

    selectSize.addEventListener('click', (e)=>{
        listSettings.style.display = "flex"
        settings.size.forEach((size)=>{
            menu.appendChild(createMenuItem(size.title, size.description));
        })
        ChoiseSetting(settings.size, inputSize, "play_field");
    })
    selectMusic.addEventListener('click', (e)=>{
        listSettings.style.display = "flex"
        settings.music.forEach((sound)=>{
            menu.appendChild(createMenuItem(sound.title, sound.description));
        })
        ChoiseSetting(settings.music, inputMusic, "music");
    })
    selectDifficulty.addEventListener('click', (e)=>{
        listSettings.style.display = "flex"
        settings.difficulty.forEach((difficulty)=>{
            menu.appendChild(createMenuItem(difficulty.title, difficulty.description));
        })
        ChoiseSetting(settings.difficulty, inputDifficulty, "difficulty");
    })
    selectBg.addEventListener('click', (e)=>{
        listSettings.style.display = "flex"
        settings.bg.forEach((bg)=>{
            menu.appendChild(createMenuItem(bg.title, bg.description));
        })
        ChoiseSetting(settings.bg, inputBg, 'background');
    })

    function ChoiseSetting(elem, input, param)
    {
        let settings = document.querySelectorAll('.menu__item');
        settings.forEach((btn, index)=>{
            btn.addEventListener('click', ()=>{
                listSettings.style.display = "none"
                input.innerHTML = elem[index].title   
                inputForm = elem[index].value
                settingLobby.settings[param] = inputForm;
                sendLobbySettings(settingLobby)
            })
        })
    }

});


function deleteMenuItem(menu) {
    while (menu.firstChild) {
        menu.removeChild(menu.firstChild);
      }
}

function createMenuItem(title, subtitle) {

    let div = document.createElement('div');
    div.classList.add('menu__item');

    let titleItme = document.createElement('p');
    titleItme.classList.add('item__title');
    titleItme.textContent = title;

    let subtitleItem = document.createElement('p');
    subtitleItem.classList.add('item__subtitle');
    subtitleItem.textContent = subtitle;

    div.appendChild(titleItme);
    div.appendChild(subtitleItem);

    return div;
}

function close(e)
{
    const profile = document.querySelector('.user-profile');
    profile.style.display = 'none';
}

function open(e)
{
    const profile = document.querySelector('.user-profile');
    profile.style.display = 'inline';
}

function createPlayer(name) {
    const player = document.createElement('div');
    player.classList.add('player');

    const playerName = document.createElement('p');
    playerName.classList.add('player__name');
    playerName.textContent = name;

    const playerAvatar = document.createElement('img');
    playerAvatar.src = "/images/avatar-placeholder.png";
    playerAvatar.alt = "avatar";
    playerAvatar.classList.add('profile__avatar');
    const playerButton = document.createElement('button');
    playerButton.type = 'button';
    playerButton.classList.add('player__button');
    playerButton.textContent = 'KILL'; 

    const avatarContainer = document.createElement('div');
    avatarContainer.classList.add('avatar__container');
    avatarContainer.appendChild(playerAvatar);
    avatarContainer.appendChild(playerButton);

    player.appendChild(playerName);
    player.appendChild(avatarContainer);

    return player;
}