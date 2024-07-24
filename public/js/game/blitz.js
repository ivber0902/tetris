GAME.startTime = new Date();
GAME.stopTimer = false;
GAME.defdrawNumber = GAME.drawNumber;
GAME.drawNumber = (player, field, num) => {
    GAME.defdrawNumber(player, field, num);
    GAME.num -= 1;
}
GAME.defaultPlay = GAME.play;
GAME.play = (player) => {
    GAME.defaultPlay(player)
    player.ui.time = new Date() - GAME.startTime;
    if ((!GAME.stopTimer) && ((new Date() - GAME.startTime) >= ((2 * 60 - 11) * 1000))) {
        GAME.stopTimer = true;
        GAME.num = 10;
        GAME.drawDowncount(player, player.field.field, 10, 1, () => {
            player.isActive = false;
            player.isGameOver = true;
            switch (localStorage.Gamewidth) {
                case '7':
                    player.fieldMode = 0
                    break;
                case '10':
                    player.fieldMode = 1
                    break;
                case '15':
                    player.fieldMode = 2
                    break;
                case '20':
                    player.fieldMode = 3
                    break;
                default:
                    break;
            } 
            let result = {
                mode: 1,
                time: 0,
                score: player.score,
                tetris_count: player.countTetris,
                figure_count: player.figureCount,
                filled_rows: player.countClearLines,
                field_mode: player.fieldMode,
                is_won: true
            }
            gameEnd(result);
        })
    }
    if (GAME.stopTimer) {
        GAME.defdrawNumber(player, player.field.field, GAME.num)
    }
}
GAME.start = (player) => {
    GAME.onLoadImages(() => {
        GAME.drawDowncount(player, player.field.field, 3, 1, () => { GAME.startTime = new Date(); player.isActive = true; GAME.play(player); })
    });
}


GAME.init
    (
        player,
        Math.floor(Math.random() * figures.length),
        Math.floor(Math.random() * figures.length),
        [
            Math.floor(Math.random() * figures.length),
            Math.floor(Math.random() * figures.length),
            Math.floor(Math.random() * figures.length),
            Math.floor(Math.random() * figures.length)
        ]
    )
GAME.start(player)