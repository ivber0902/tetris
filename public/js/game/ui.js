class UI {
    constructor(blockSize, buffer, viewNextFigures, game, score, level, time) {
        this.blockSize = blockSize;
        this.buffer = buffer;
        this.viewNextFigures = viewNextFigures;
        this.field = {
            width: game.width * this.blockSize,
            height: game.height * this.blockSize,
        }
        this._score = score;
        this._level = level;
        this._time = time;
        this.music = new Audio("/audio/Korobeiniki.wav");
    }
    initMusic() {
        this.music.oncanplaythrough = function () {
            document.addEventListener('click', function () {
                ui.music.playbackRate = 0.7;
                ui.music.play();
            }, 1)
        }
        this.music.addEventListener('ended', function () {
            this.currentTime = 0;
            this.play();
        }, false);
    }
    updateSize(game) {
        this.field = {
            width: game.width * this.blockSize,
            height: game.height * this.blockSize,
        }
    }

    set score(val) {
        if (val !== undefined) {
            this._score.textContent = val;
        }
    }

    set level(val) {
        if (val !== undefined) {
            this._level.textContent = val;
        }
    }

    set time(val) {
        if (val !== undefined) {
            this._time.textContent =
                + 1-Math.floor(val / 1000 / 60)
                + ':' + '0'.repeat(2 - (59 - Math.floor(val / 1000 % 60)).toString().length)
                + (59 - Math.floor(val / 1000) % 60)
        }
    }
}
