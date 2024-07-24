player.lines = 0;
player.defaultUpdateScore = player.updateScore;
player.updateScore = (countLines) => {
    player.defaultUpdateScore(countLines);
    player.lines += countLines;
}
GAME.startTime = new Date();
GAME.defaultPlay = GAME.play;
GAME.play = (player) => {
    if (player.lines >= 40 && player.isActive) {
        player.isActive = false;
        player.gameEnd = true;
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
            mode: 2,
            time: new Date() - GAME.startTime,
            score: player.score,
            tetris_count: player.countTetris,
            figure_count: player.figureCount,
            filled_rows: player.countClearLines,
            field_mode: player.fieldMode,
            is_won: true
        }
        gameEnd(result);
    }
    GAME.defaultPlay(player)
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
