class UI {
    constructor(buffer, viewNextFigures, score, level, time, lines) {
        this.buffer = buffer;
        this.viewNextFigures = viewNextFigures;
        this._score = score;
        this._level = level;
        this._time = time;
        this._lines = lines;
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

    updateNextFigures(nextFigures) {
        for (let i = 0; i < 4; i++) {
            this.viewNextFigures[i].src = nextFigures[i].image.src;
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

    set lines(val) {
        if (val !== undefined) {
            this._lines.textContent = val;
        }
    }
}
