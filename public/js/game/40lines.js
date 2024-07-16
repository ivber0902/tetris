player.lines = 0;
player.defaultUpdateScore = player.updateScore;
player.updateScore = (countLines) => {
    player.defaultUpdateScore(countLines);
    player.lines += countLines;
}
GAME.startTime = new Date();
GAME.defaultPlay = GAME.play;
GAME.play = (player) => {
    player.ui.lines = player.lines;
    if (player.lines >= 40) {
        player.isActive = false;
        player.gameEnd = true;
        gameEnd(new Date() - GAME.startTime);
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