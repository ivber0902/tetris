class UI {
    constructor(blockSize, buffer, viewNextFigures, game, score, level) {
        this.blockSize = blockSize;
        this.buffer = buffer;
        this.viewNextFigures = viewNextFigures;
        this.field = {
            width: game.width * this.blockSize,
            height: game.height * this.blockSize,
        }
        this._score = score;
        this._level = level;
        this.music = new Audio("/audio/Korobeiniki.wav");
    }
    initMusic() {
        this.music.playbackRate = 0.7;
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
}
