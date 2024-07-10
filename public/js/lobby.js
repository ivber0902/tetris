
let settings = {
    music: [
        {
        title: "Корабейники",
        description: "мистическая и загадочная композиция, в которой звуки эха на фоне темноты создают атмосферу напряжения и тайны.",
        value: "/audio/Korobeiniki.wav"
        },
        {
        title: "Калинка",
        description: "Романтичная и нежная мелодия, напоминающая танец под лунным светом. Идеальный трек для вечернего романтического настроения.",
        value: "/audio/kalinka.mp3"
        },
        {
        title: "Stop narcotics",
        description: "эпическая и кинематографичная музыка, создающая ощущение путешествия сквозь временные измерения и пространство.",
        value: "/audio/stop_narcotics.mp3"
        },
    ],
    size: [
        {
            title: "холоп",
            description: "маленький размер поля",
            value:
            {
                width: 5,
                height: 20
            }
        },
        {
            title: "крестьянин",
            description: "классические размер поля",
            value:
            {
                width: 10,
                height: 20
            }
        },
        {
            title: "боярин",
            description: "большой размер поля",
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
            description: "игра для холопов",
            value: 1
        },
        {
            title: "средний",
            description: "ты уже что-то можешь",
            value: 5
        },
        {
            title: "имбоссссибл",
            description: "ты просто гений тетриса",
            value: 10
        }
    ],
    bg: [
        {
            title: "ISPRING",
            description: "Фон компании Ispting",
            value: "/images/bg.png"
        },
        {
            title: "Йошкар-Ола",
            description: "Фон Йошкар-Олы",
            value: "/images/backgrounds/io.jpg"
        },
        {
            title: "Тетрис",
            description: "Кубики тетриса",
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
    titleItme.textContent = title;

    let subtitleItem = document.createElement('p');
    subtitleItem.classList.add('item__subtitle');
    subtitleItem.textContent = subtitle;

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
        playerButton.textContent = 'ВЫГНАТЬ'; 
        avatarContainer.appendChild(playerButton);
    }
    return player;
}