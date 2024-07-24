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
    "lose-title": {
        "ru": "к сожалению ты не достиг цели",
        "en": "unfortunately you didn't reach your goal"
    },
    "lose-title.max": {
        "ru": "ты можешь попытаться снова или вернуться в меню",
        "en": "you can try again or go back to the menu"
    },
    "lose-title.description": {
        "ru": "ещё немного! держи мотивирующее видео!",
        "en": "A little more! Here's a motivational video!"
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
    "achievement__title.path-legend": {
        "ru": "путь легенды",
        "en": "The Path of the Legend",
    },
    "item__title.path-legend.easy": {
        "ru": "Сыграй 10 игр",
        "en": "Play 10 games",
    },
    "item__title.path-legend.medium": {
        "ru": "Сыграй 50 игр",
        "en": "Play 50 games",
    },
    "item__title.path-legend.hard": {
        "ru": "Сыграй 100 игр",
        "en": "Play 100 games",
    },
    "item__subtitle.path-legend.easy": {
        "ru": "Ты только на старте своего пути! Пройдя 10 игр, ты сделал первые шаги к новой эре в своем игровом путешествии.",
        "en": "You're just at the start of your journey! After completing 10 games, you have taken the first steps towards a new era in your gaming journey.",
    },
    "item__subtitle.path-legend.medium": {
        "ru": "Твоя настойчивость приносит плоды! С 50 сыгранными играми ты уже формируешь свою игровую судьбу.",
        "en": "Your perseverance is bearing fruit! With 50 games played, you are already shaping your gaming destiny.",
    },
    "item__subtitle.path-legend.hard": {
        "ru": "Поздравляем, легенда! Достигнув 100 игр, ты входишь в ряды мастеров, о которых шепчутся по всему игровому миру.",
        "en": "Congratulations, legend! Having reached 100 games, you join the ranks of the masters, who are whispered about all over the gaming world.",
    },
    "achievement__title.legend-tetris": {
        "ru": "легенда тетриса",
        "en": "The legend of Tetris",
    },
    "item__title.legend-tetris.easy": {
        "ru": "Набери за игру 10000 очков",
        "en": "Score 10,000 points per game",
    },
    "item__title.legend-tetris.medium": {
        "ru": "Набери за игру 10000 очков",
        "en": "Score 50,000 points per game",
    },
    "item__title.legend-tetris.hard": {
        "ru": "Набери за игру 10000 очков",
        "en": "Score 100,000 points per game",
    },
    "item__subtitle.legend-tetris.easy": {
        "ru": "Ты сделал первый шаг к бессмертию! 10000 очков — это начало твоей легенды!",
        "en": "You have taken the first step towards immortality! 10,000 points is the beginning of your legend!",
    },
    "item__subtitle.legend-tetris.medium": {
        "ru": "Ты на пути к небесам! 50000 очков делают тебя не только мастером, но и легендой!",
        "en": "You're on your way to heaven! 50,000 points make you not only a master, but also a legend!",
    },
    "item__subtitle.legend-tetris.hard": {
        "ru": "Ты достиг божественных высот! 100000 очков — это финальный аккорд, который подтверждает твое мастерство!",
        "en": "You have reached divine heights! 100,000 points is the final chord that confirms your skill!",
    },
    "achievement__title.blitz": {
        "ru": "Блиц-мастер",
        "en": "Blitz Master",
    },
    "item__title.blitz.easy": {
        "ru": `Набери в режиме "Блиц" 4000 очков`,
        "en": `Score 4000 points in the "Blitz" mode`,
    },
    "item__title.blitz.medium": {
        "ru": `Набери в режиме "Блиц" 8000 очков`,
        "en": `Score 8000 points in the "Blitz" mode`,
    },
    "item__title.blitz.hard": {
        "ru": `Набери в режиме "Блиц" 12000 очков`,
        "en": `Score 12000 points in the "Blitz" mode`,
    },
    "item__subtitle.blitz.easy": {
        "ru": `Твоя победная серия начинается! 4000 очков — это первый приз, свидетельствующий о твоем таланте.`,
        "en": `Your winning streak begins! 4000 points is the first prize, which testifies to your talent.`,
    },
    "item__subtitle.blitz.medium": {
        "ru": `Ты бьешь рекорды! 8000 очков — это заметный шаг к титулу мастера блица.`,
        "en": `You're breaking records! 8000 points is a significant step towards the title of blitz master.`,
    },
    "item__subtitle.blitz.hard": {
        "ru": `Ты достиг небывалых высот! 12000 очков — это настоящее чудо, подтверждающее твою гениальность в игре.`,
        "en": `You have reached unprecedented heights! 12,000 points is a real miracle, confirming your genius in the game.`,
    },
    "achievement__title.forty-line": {
        "ru": `40 линий взяты`,
        "en": `40 lines are taken`,
    },
    "item__title.forty-line.easy": {
        "ru": `Собери 40 линий за 8 минут`,
        "en": `Collect 40 lines in 8 minutes`,
    },
    "item__title.forty-line.medium": {
        "ru": `Собери 40 линий за 5 минут`,
        "en": `Collect 40 lines in 5 minutes`,
    },
    "item__title.forty-line.hard": {
        "ru": `Собери 40 линий за 3 минут`,
        "en": `Collect 40 lines in 3 minutes`,
    },
    "item__subtitle.forty-line.easy": {
        "ru": `Неизвестные скорости! Завершив 40 линий за 8 минут, ты начал свой путь к скоростным вершинам.`,
        "en": `Unknown speeds! Having completed 40 lines in 8 minutes, you have started your journey to the high-speed peaks.`,
    },
    "item__subtitle.forty-line.medium": {
        "ru": `Смелый преодолитель времени! Зафиксировав 5 минут на 40 линий, ты демонстрируешь настоящую скорость.`,
        "en": `The brave leader of time! By fixing 5 minutes on 40 lines, you demonstrate real speed.`,
    },
    "item__subtitle.forty-line.hard": {
        "ru": `Ты стал мастером скорости! 3 минуты на 40 линий — это живое искусство быстроты и точности.`,
        "en": `You've become a speed master! 3 minutes on 40 lines is a living art of speed and precision.`,
    },
    "achievement__title.royal": {
        "ru": `Королевский дуэт`,
        "en": `The Royal Duo`
    },
    "item__title royal.easy": {
        "ru": "Собери 100 линий",
        "en": "Collect 100 lines"
    },
    "item__title royal.medium": {
        "ru": "Собери 500 линий",
        "en": "Collect 500 lines"
    },
    "item__title royal.hard": {
        "ru": "Собери 1000 линий",
        "en": "Collect 1000 lines"
    },
    "item__subtitle.royal.easy": {
        "ru": "Сила в единстве! Ваша команда собрала 100 линий, и ты уже на пути к настоящей гармонии!",
        "en": "Strength is in unity! Your team has collected 100 lines, and you are already on the way to real harmony!"
    },
    "item__subtitle.royal.medium": {
        "ru": "Ты и твой партнер — истинные чемпионы! 500 линий — это результат вашего единства и слаженности.",
        "en": "You and your partner are true champions! 500 lines is the result of your unity and coherence."
    },
    "item__subtitle.royal.hard": {
        "ru": "Ваше имя будет увековечено! 1000 линий — это легендарное достижение, которое заставит говорить о вас!",
        "en": "Your name will be immortalized! 1000 lines is a legendary achievement that will make people talk about you!"
    },
    "achievement__title.multy": {
        "ru": "Непобедимый мультиплеер",
        "en": "Invincible multiplayer"
    },
    "item__title multy.easy": {
        "ru": "Победи в 3 онлайн играх",
        "en": "Wins in 3 online games"
    },
    "item__title multy.medium": {
        "ru": "Победи в 5 онлайн играх",
        "en": "Wins in 5 online games"
    },
    "item__title multy.hard": {
        "ru": "Победи в 10 онлайн играх",
        "en": "Wins in 10 online games"
    },
    "item__subtitle.multy.easy": {
        "ru": "Ты заручился поддержкой удачи! Три победы — это всего лишь начало великого пути!",
        "en": "You've enlisted the help of luck! Three wins in a row is just the beginning of a great journey!"
    },
    "item__subtitle.multy.medium": {
        "ru": "Никто не может остановить твою волну! Победа в 5 онлайн играх подряд утвердит твой статус!",
        "en": "No one can stop your wave! Winning 5 online games in a row will confirm your status!"
    },
    "item__subtitle.multy.hard": {
        "ru": "Ты — непобедимый! 10 побед устанавливают новый стандарт для всех игроков!",
        "en": "You are invincible! 10 consecutive wins set a new standard for all players!"
    },
    "achievement__title.ai": {
        "ru": "Битва против ИИ",
        "en": "The Battle against AI"
    },
    "item__title.ai.easy": {
        "ru": "Победи ИИ 3 раза",
        "en": "Defeat the AI 3 times"
    },
    "item__title.ai.medium": {
        "ru": "Победи ИИ 5 раз",
        "en": "Defeat the AI 5 times"
    },
    "item__title.ai.hard": {
        "ru": "Победи ИИ 10 раз",
        "en": "Defeat the AI 10 times"
    },
    "item__subtitle.ai.easy": {
        "ru": "Твой первый осколок успеха! Победив 3 искусственных противника, ты показываешь свои шансы на победу!",
        "en": "Your first piece of success! By defeating 3 artificial opponents, you show your chances of winning!"
    },
    "item__subtitle.ai.medium": {
        "ru": "Ты наращиваешь дух и уверенность! 5 побед подряд показывают, что ты готов к большему!",
        "en": "You build up your spirit and confidence! 5 wins in a row show that you are ready for more!"
    },
    "item__subtitle.ai.hard": {
        "ru": "Ты поразил систему! 10 побед подряд — ты стал истинным мастером сражений!",
        "en": "You've hit the system! 10 wins in a row — you have become a true master of battles!"
    },
    "link__title.leader__title": {
        "ru": "таблица лидеров",
        "en": "leaderboard"
    },
    "link__subtitle.leader__subtitle": {
        "ru": "узрите настоящих героев тетриса",
        "en": "see the real tetris heroes"
    }
    
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


