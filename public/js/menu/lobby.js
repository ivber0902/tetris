localStorage.mode = 'm';
let settings = {
    music: [
        {
        title: {
            "ru": "Корoбейники",
            "en": "Peddlers"
        },
        description:{
            "ru": "Классическая песня для тетриса",
            "en": "A classic song for tetris"
        }, 
        value: "/audio/Korobeiniki.wav"
        },
        {
        title: {
            "ru": "Калинка",
            "en": "Kalinka"
        },
        description:{
            "ru": "Русская народная песня",
            "en": "Russian folk song"
        }, 
        value: "/audio/kalinka.mp3"
        },
        {
        title: {
            "ru": "Долой искушение",
            "en": "Stop narcotics"
        },
        description:{
            "ru": "Поучительная песня",
            "en": "An instructive song"
        }, 
        value: "/audio/stop_narcotics.mp3"
        },
    ],
    size: [
        {
            title: {
                "ru": "Холоп",
                "en": "lackey"
            },
            description:{
                "ru": "маленький размер поля",
                "en": "small field size"
            }, 
            value:
            {
                width: 5,
                height: 20
            }
        },
        {
            title: {
                "ru": "крестьянин",
                "en": "the peasant"
            },
            description:{
                "ru": "классический размер поля",
                "en": "classic field size"
            }, 
            value:
            {
                width: 10,
                height: 20
            }
        },
        {
            title: {
                "ru": "боярин",
                "en": "boyar"
            },
            description:{
                "ru": "большой размер поля",
                "en": "large field size"
            }, 
            value:
            {
                width: 15,
                height: 20
            }
        }
    ],
    difficulty: [
        {
            title: {
                "ru": "Легко",
                "en": "Easy"
            },
            description:{
                "ru": "Игра для новичков",
                "en": "A game for beginners"
            }, 
            value: 1
        },
        {
            title: {
                "ru": "Средний",
                "en": "Medium"
            },
            description:{
                "ru": "Игра для любителей",
                "en": "A game for fans"
            }, 
            value: 5
        },
        {
            title: {
                "ru": "Сложный",
                "en": "Difficult"
            },
            description:{
                "ru": "Игра для профессионалов",
                "en": "A game for professionals"
            }, 
            value: 10
        }
    ],
    bg: [
        {
            title: {
                "ru": "Ispring",
                "en": "Ispring"
            },
            description:{
                "ru": "Играй на фоне компании Ispring",
                "en": "Play against the background of the Ispring company"
            }, 
            value: "/images/bg.png"
        },
        {
            title: {
                "ru": "Йошкар-Ола",
                "en": "Yoshkar-Ola"
            },
            description:{
                "ru": "При игре на фоне находится город Йошкар-Ола",
                "en": "When playing, the city of Yoshkar-Ola is located in the background"
            }, 
            value: "/images/backgrounds/io.png"
        },
        {
            title: {
                "ru": "Мир тетриса",
                "en": "The world of Tetris"
            },
            description:{
                "ru": "Кубики тетриса на фоне",
                "en": "Tetris cubes on the background"
            }, 
            value: "/images/backgrounds/square.jpg"
        }
    ],
}

    let selectSize = document.querySelector(".settings__size")
    let selectMusic = document.querySelector(".settings__music")
    let selectDifficulty = document.querySelector(".settings__complexity")
    let selectBg = document.querySelector(".settings__background")
    let listSettings = document.querySelector('.list-settings');

addEventListener("DOMContentLoaded", () => {
    document.querySelector(".exit").addEventListener("click", (e) => close(e));
    document.querySelector(".profile__avatar").addEventListener("click", (e) => open(e));
    let menu = document.querySelector('.menu');
    listSettings.addEventListener('click', ()=>{
        listSettings.style.display = "none";
        deleteMenuItem(menu)
    })

    selectSize.addEventListener('click', ()=>{
        listSettings.style.display = "flex"
        settings.size.forEach((size) => {
            menu.appendChild(createMenuItem(size.title, size.description));
        })
        ChoiseSetting(settings.size, viewInputSize, "play_field");
    })
    selectMusic.addEventListener('click', ()=>{
        listSettings.style.display = "flex"
        settings.music.forEach((sound) => {
            menu.appendChild(createMenuItem(sound.title, sound.description));
        })
        ChoiseSetting(settings.music, viewInputMusic, "music");
    })
    selectDifficulty.addEventListener('click', ()=>{
        listSettings.style.display = "flex"
        settings.difficulty.forEach((difficulty) => {
            menu.appendChild(createMenuItem(difficulty.title, difficulty.description));
        })
        ChoiseSetting(settings.difficulty, viewInputDifficulty, "difficulty");
    })
    selectBg.addEventListener('click', ()=>{
        listSettings.style.display = "flex"
        settings.bg.forEach((bg) => {
            menu.appendChild(createMenuItem(bg.title, bg.description));
        })
        ChoiseSetting(settings.bg, viewInputBg, 'background');
    })

    function ChoiseSetting(elem, input, param) {
        let settings = document.querySelectorAll('.menu__item');
        settings.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                listSettings.style.display = "none"
                settingLobby.settings[param] = elem[index].value;
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
    titleItme.textContent = title[localStorage.lang];

    let subtitleItem = document.createElement('p');
    subtitleItem.classList.add('item__subtitle');
    subtitleItem.textContent = subtitle[localStorage.lang];

    div.appendChild(titleItme);
    div.appendChild(subtitleItem);

    return div;
}

function close()
{
    const profile = document.querySelector('.user-profile');
    profile.style.display = 'none';
}

function open()
{
    const profile = document.querySelector('.user-profile');
    profile.style.display = 'inline';
}

function createPlayer(hiddenValue, createKickButton) {
    const player = document.createElement('div');
    player.classList.add('player');
    player.setAttribute('id', hiddenValue)

    const playerName = document.createElement('p');
    playerName.classList.add('player__name');

    const playerAvatar = document.createElement('img');
    playerAvatar.src = "/images/avatar-placeholder.png";
    playerAvatar.alt = "avatar";
    playerAvatar.classList.add('profile__avatar');

    const avatarContainer = document.createElement('div');
    avatarContainer.classList.add('avatar__container');
    avatarContainer.appendChild(playerAvatar);

    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.value = hiddenValue;
    hiddenInput.classList.add('player__hidden-id');

    player.appendChild(playerName);
    player.appendChild(avatarContainer);
    player.appendChild(hiddenInput);

    if(createKickButton){
        const playerButton = document.createElement('button');
        playerButton.type = 'button';
        playerButton.value = hiddenValue;
        playerButton.classList.add('kick__button');
        playerButton.textContent = 'kick'; 
        avatarContainer.appendChild(playerButton);
    }
    return player;
}