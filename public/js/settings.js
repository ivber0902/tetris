const langArr = {
    "login__title" : {
        "ru": "добро пожаловать в славянский тетрис!",
        "en": "welcome to Slavic Tetris!"
    },
    "login-input__username-input": {
        "ru": "логин",
        "en": "login"
    },
    "login-input__password-input": {
        "ru": "пароль",
        "en": "password"
    },
    "login-input__password-again": {
        "ru": "повторите пароль",
        "en": "repeat the password"
    },
    "login-button": {
        "ru": "вход",
        "en": "log in",
    },
    "register": {
        "ru": "регистрация",
        "en": "registration"
    },
    "back__button": {
        "ru": "назад",
        "en": "back"
    },
    "link__title.solo__title": {
        "ru": "однопользовательский режим",
        "en": "singleplayer mode"
    },
    "link__subtitle.solo__subtitle": {
        "ru": "превзойди себя и поставь новый рекорд",
        "en": "surpass yourself and set a new record"
    },
    "link__title.multiplayer__title": {
        "ru": "многопользовательский режим",
        "en": "multiplayer mode"
    },
    "link__subtitle.multiplayer__subtitle": {
        "ru": "играйте онлайн с друзьями",
        "en": "play online with your friends"
    },
    "link__title.about__title": {
        "ru": "про нас",
        "en": "about us"
    },
    "link__subtitle.about__subtitle": {
        "ru": "узнавайте все с славянах",
        "en": "learn all about the Slavs"
    },
    "link__title.zen__title": {
        "ru": "классический режим",
        "en": "classic mode"
    },
    "link__subtitle.zen__subtitle": {
        "ru": "попробуй свои силы в классическом тетрисе без ограничений",
        "en": "Try your hand at classic tetris without limits"
    },
    "link__title.blitz__title": {
        "ru": "блитц",
        "en": "blitz"
    },
    "link__subtitle.blitz__subtitle": {
        "ru": "двухминутная битва против времени",
        "en": "a two-minute battle against time"
    },
    "link__title.l40__title": {
        "ru": "40 линий",
        "en": "40 lines"
    },
    "link__subtitle.l40__subtitle": {
        "ru": "собери 40 линий как можно быстрее",
        "en": "collect 40 lines as fast as possible"
    },

    "link__title.bot__title": {
        "ru": "битва с боссом",
        "en": "battle with the boss"
    },
    "link__subtitle.bot__subtitle": {
        "ru": "сможешь справиться с искусственным интеллектом?",
        "en": "can you handle artificial intelligence?"
    },
    "link__title.koop__title": {
        "ru": "кооперативный режим",
        "en": "cooperative mode"
    },
    "link__subtitle.koop__subtitle": {
        "ru": "играй с другом на одном поле и соберите тетрис вместе",
        "en": "Play with a friend on the same field and collect tetris together"
    },
    "link__title.small": {
        "ru": "Холоп",
        "en": "lackey"
    },
    "link__subtitle.small": {
        "ru": "маленький размер поля",
        "en": "small field size"
    },
    "link__title.medium": {
        "ru": "крестьянин",
        "en": "the peasant"
    },
    "link__subtitle.medium": {
        "ru": "классический размер поля",
        "en": "classic field size"
    },
    "link__title.large": {
        "ru": "боярин",
        "en": "boyar"
    },
    "link__subtitle.large": {
        "ru": "большой размер поля",
        "en": "large field size"
    },
    "link__title.custom__title": {
        "ru": "создать лобби",
        "en": "create a lobby"
    }, 
    "link__subtitle.custom__subtitle": {
        "ru": "кастомизируй игру и сразись с друзьями",
        "en": "customize the game and challenge your friends"
    },
    "link__title.listing__title": {
        "ru": "войти в лобби",
        "en": "enter the lobby"
    },
    "link__subtitle.listing__subtitle": {
        "ru": "сразись с друзьями на их правилах",
        "en": "challenge your friends on their rules"
    },
    "settings__text.size": {
        "ru": "размер поля",
        "en": "field size"
    },
    "settings__text.music": {
        "ru": "музыка",
        "en": "music"
    },
    "settings__text.complexity": {
        "ru": "сложность",
        "en": "complexity"
    },
    "settings__text.background": {
        "ru": "задний фон",
        "en": "background"
    },
    "start-game": {
        "ru": "начать игру",
        "en": "start"
    },
    "title-score": {
        "ru": "счет",
        "en": "score"
    },
    "title-level": {
        "ru": "уровень",
        "en": "level"
    },
    "title.buffer": {
        "ru": "буфер",
        "en": "buffer"
    },
    "title.next-figures": {
        "ru": "следующие",
        "en": "next"
    },
    "instruction-title": {
        "ru": "инструкция",
        "en": "instruction"
    },
    "instruction__text.horizontal": {
        "ru": `движения по сторонам - соответствующие стрелочки или клавиши "Ф" и "В"`,
        "en": `movements on the sides - the corresponding arrows or the "A" and "D" keys`
    },
    "instruction__text.nitro": {
        "ru": `ускорение падения - стрелочка вниз или кнопка "Ы"`,
        "en": `acceleration of the fall - down arrow or "S" button`
    },
    "instruction__text.drop": {
        "ru": `моментальная установка - пробел`,
        "en": `instant installation - space bar`
    },
    "instruction__text.rotate": {
        "ru": `поворот фигуры по часовой стрелке - клавиша "Ц"`,
        "en": `clockwise rotation of the figure - the "W" key`
    },
    "instruction__text.buffer": {
        "ru": `использование буффера - левый шифт (фигуры поменяются местами, обратно можно будет поменять только следующую фигуру)`,
        "en": `using the buffer is a left shift (the shapes will change places, only the next shape can be changed back)`
    },
    "instruction__text.pause": {
        "ru": `пауза - клавиша "З"`,
        "en": `pause - the "P" key`
    },
    "result-title": {
        "ru": "финальный счет",
        "en": "final score"
    },
    "result-title": {
        "ru": "финальный счет",
        "en": "final score"
    },
    "result-title.max": {
        "ru": "личный счет",
        "en": "personal score"
    },
    "result-title.description": {
        "ru": "молодец! ещё немного! держи мотивирующее видео!",
        "en": "well done! A little more! Here's a motivational video!"
    },
    "link__header.again": {
        "ru": "сыграть заново",
        "en": "to play again"
    },
    "link__header.menu": {
        "ru": "вернуться в меню",
        "en": "return to the menu"
    },
    "statistics__text.score": {
        "ru": "максимум очков",
        "en": "maximum score"
    },
    "statistics__text.vincount": {
        "ru": "всего побед",
        "en": "total wins"
    },
    "statistics__text.countgame": {
        "ru": "всего игр",
        "en": "total games"
    },
    "exit": {
        "ru": "закрыть",
        "en": "close"
    },
    "full-profile": {
        "ru": "Профиль",
        "en": "Profile"
    },
    "link_back": {
        "ru": "Назад",
        "en": "Back"
    },
    "count-solo-game.count-game": {
        "ru": "Всего одиночных игр :",
        "en": "Total singles :"
    },
    "count-multiplayer-game.count-online-game": {
        "ru": "Всего онлайн игр :",
        "en": "Total online games :"
    },
    "count-win-game.title": {
        "ru": "↪ выиграно из них",
        "en": "↪ won from them"
    },
    "login.error": {
        "ru": "вход",
        "en": "log in",
    },
    "menu.error": {
        "ru": "меню",
        "en": "menu",
    },
    "error-links": {
        "ru": "Вы можете посетить:",
        "en": "You can visit:",
    },
    "login-input__username-error": {
        "ru": "неверный логин или пароль",
        "en": "invalid username or password",
    },
    "login-input__username-validation": {
        "ru": "неправильный формат логина",
        "en": "incorrect login format",
    },
    "login-input__username-require": {
        "ru": "введите логин",
        "en": "enter your username",
    },
    "login-input__password-require": {
        "ru": "введите пароль",
        "en": "enter your password",
    },
    "login-input__again-require": {
        "ru": "введите пароль",
        "en": "enter your password",
    },
    "login-input__password-validation": {
        "ru": "пароль должен содержать не менее 8 символов",
        "en": "the password must contain at least 8 characters",
    },
    "login-input__again-validation": {
        "ru": "пароль должен содержать не менее 8 символов",
        "en": "the password must contain at least 8 characters",
    },
    "login-input__again-identical": {
        "ru": "пароли должны должны быть одинаковыми",
        "en": "passwords must be the same",
    },
    "time__text": {
        "ru": "Количество Очков",
        "en": "Number of Points",
    },
    "item__title.language": {
        "ru": "Выбор языка",
        "en": "language selection",
    },
    "item__description.language": {
        "ru": "Выбери нужный язык из предложенных",
        "en": "Choose the desired language from the suggested ones",
    },
    "item__title.bg": {
        "ru": "Выбор фона",
        "en": "background selection",
    },
    "item__description.bg": {
        "ru": "Выбери фон, который понравится именно тебе",
        "en": "Choose a background that you will like.",
    },
    "title-time": {
        "ru": "время",
        "en": "time",
    },
    "title-lines": {
        "ru": "количество линий",
        "en": "number of lines",
    },
    
}
if((localStorage.lang === undefined) || (!localStorage.lang)){
    localStorage.lang = 'ru';
}
if((localStorage.bg === undefined) || (!localStorage.bg)){
    localStorage.bg = '/images/bg.png';
  }

addEventListener("DOMContentLoaded", (event) => {
    document.body.style.backgroundImage = `url(${localStorage.bg})`;
    for(let key in langArr){
        let elem = document.querySelector(`.${key}`);
        if(elem){
            if(elem.tagName === 'INPUT')
                elem.placeholder = langArr[key][localStorage.lang]
            else
                elem.textContent = langArr[key][localStorage.lang]
        }
    }
});


