let settings = {
    music: [
        {
        title: "эхо во тьме",
        description: "мистическая и загадочная композиция, в которой звуки эха на фоне темноты создают атмосферу напряжения и тайны.",
        link: "https://example.com/track1"
        },
        {
        title: "лунный вальс",
        description: "Романтичная и нежная мелодия, напоминающая танец под лунным светом. Идеальный трек для вечернего романтического настроения.",
        link: "https://example.com/track2"
        },
        {
        title: "путешествие во времени",
        description: "эпическая и кинематографичная музыка, создающая ощущение путешествия сквозь временные измерения и пространство.",
        link: "https://example.com/track3"
        },
    ],
    size: [
        {
            title: "холоп",
            description: "маленький размер поля и медленная игра"
        },
        {
            title: "крестьянин",
            description: "классические размер поля и скорость игры"
        },
        {
            title: "боярин",
            description: "большой размер поля и быстрая игра"
        }
    ],
    difficulty: [
        {
            title: "легко",
            description: "игра для нубов"
        },
        {
            title: "средний",
            description: "ты уже что-то можешь"
        },
        {
            title: "имбоссссибл",
            description: "ты просто гений тетриса"
        }
    ],
    bg: [
        {
            title: "ispring",
            description: "Фон компании Ispting"
        },
        {
            title: "политех",
            description: "Фон первого корпуса"
        },
        {
            title: "йошкар-Ола",
            description: "йон йошкар-олы"
        }
    ],
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
        ChoiseSetting(settings.size, inputSize);
    })
    selectMusic.addEventListener('click', (e)=>{
        listSettings.style.display = "flex"
        settings.music.forEach((sound)=>{
            menu.appendChild(createMenuItem(sound.title, sound.description));
        })
        ChoiseSetting(settings.music, inputMusic);
    })
    selectDifficulty.addEventListener('click', (e)=>{
        listSettings.style.display = "flex"
        settings.difficulty.forEach((difficulty)=>{
            menu.appendChild(createMenuItem(difficulty.title, difficulty.description));
        })
        ChoiseSetting(settings.difficulty, inputDifficulty);
    })
    selectBg.addEventListener('click', (e)=>{
        listSettings.style.display = "flex"
        settings.bg.forEach((bg)=>{
            menu.appendChild(createMenuItem(bg.title, bg.description));
        })
        ChoiseSetting(settings.bg, inputBg);
    })

    function ChoiseSetting(elem, input)
{
    let settings = document.querySelectorAll('.menu__item');
    settings.forEach((btn, index)=>{
        btn.addEventListener('click', ()=>{
            listSettings.style.display = "none"
            input.innerHTML = elem[index].title
            deleteMenuItem(menu)
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