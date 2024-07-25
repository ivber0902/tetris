const settings = {
    language: [
        {
            title:{
                "ru": "Русский",
                "en": "Русский"
            }, 
            subtitle:{
                "ru": "Использовать этот язык",
                "en": "Use this language"
            }, 
            value: "ru",
        },
        {
            title:{
                "ru": "English",
                "en": "English"
            }, 
            subtitle:{
                "ru": "Использовать этот язык",
                "en": "Use this language"
            }, 
            value: "en",
        },
    ],
    bg: [
        {
            title: {
                "ru": "Ispring",
                "en": "Ispring"
            },
            subtitle:{
                "ru": "Играй на фоне компании Ispring",
                "en": "Play against the background of the Ispring company"
            }, 
            value: "https://i.postimg.cc/1zyHTmtK/bg.png"
        },
        {
            title: {
                "ru": "Йошкар-Ола",
                "en": "Yoshkar-Ola"
            },
            subtitle:{
                "ru": "Фон города Йошкар-Ола",
                "en": "When playing, the city of Yoshkar-Ola is located in the background"
            }, 
            value: "/images/backgrounds/io.png"
        },
        {
            title: {
                "ru": "Мир тетриса",
                "en": "The world of Tetris"
            },
            subtitle:{
                "ru": "Кубики тетриса на фоне",
                "en": "Tetris cubes on the background"
            }, 
            value: "/images/backgrounds/square.jpg"
        }
    ],
}

if((localStorage.lang === undefined) || (!localStorage.lang)){
    localStorage.lang = 'ru';
}
if((localStorage.bg === undefined) || (!localStorage.bg)){
  localStorage.bg = 'https://i.postimg.cc/1zyHTmtK/bg.png';
}

addEventListener("DOMContentLoaded", (event) => {
    let languageButton = document.querySelector('.settings__item-language');
    let bgButton = document.querySelector('.settings__item-bg');
    let PageSettings = document.querySelector('.list-settings');
    let listSettings = document.querySelector('.menu-settings');

    languageButton.addEventListener('click', ()=>{
        PageSettings.style.display = "flex";
        settings.language.forEach(element => {
            listSettings.appendChild(createMenuItem(element.title[localStorage.lang], element.subtitle[localStorage.lang], element.value))
        });
        choiseSettings('lang')
    });

    bgButton.addEventListener('click', ()=>{
        PageSettings.style.display = "flex";
        settings.bg.forEach(element => {
            listSettings.appendChild(createMenuItem(element.title[localStorage.lang], element.subtitle[localStorage.lang], element.value))
        });
        choiseSettings('bg')
    })


    PageSettings.addEventListener('click', ()=>{
        closeSettings()
    })

    function choiseSettings(setting){
        let buttons = document.querySelectorAll('.settings__item');
        buttons.forEach((elem)=>{
            elem.addEventListener('click', ()=>{
                localStorage[setting] = elem.querySelector('.input-setting').value;
                location.reload() 
                closeSettings()
                
            })
        })
    }

    function closeSettings(){
        PageSettings.style.display = "none";
        deleteSettings(listSettings)
    }
});

function deleteSettings(menu) {
    while (menu.firstChild) {
        menu.removeChild(menu.firstChild);
    }
}

function createMenuItem(title, subtitle, value) {

    let div = document.createElement('div');
    div.classList.add('settings__item');

    let titleItme = document.createElement('p');
    titleItme.classList.add('item__title');
    titleItme.textContent = title;

    let inputSetting = document.createElement('input');
    inputSetting.classList.add('input-setting')
    inputSetting.type = "hidden";
    inputSetting.value = value

    let subtitleItem = document.createElement('p');
    subtitleItem.classList.add('item__subtitle');
    subtitleItem.textContent = subtitle;

    div.appendChild(titleItme);
    div.appendChild(subtitleItem);
    div.appendChild(inputSetting);
    return div;
}