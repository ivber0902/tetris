class Player {
    constructor(ui, field) {
        this.score = 0;
        this.nitro = 1;
        this.lvl = 0;
        this.field = field;
        this.tickTime = 0;
        this.figureCount = 0;
        this.move = {
            down: 1,
            left: 0,
            right: 0,
            drop: 0,
        }
        this.currentFigure = null;
        this.nextFigures = null;
        this.buffer = null;
        this.ui = ui;
        this.figuresQueueSize = 4;
        this.isShifter = true;
        this.isActive = true;
    }

    initFigures() {
        let randomIndex = Math.floor(Math.random() * figures.length);
        this.currentFigure = getFigure(randomIndex);
        this.currentFigure.x = this.getStartX(this.currentFigure);
        this.buffer = this.getRandomFigure(figures);
        this.ui.buffer.src = this.buffer.image.src;
        this.nextFigures = [];
        for (let i = 0; i < this.figuresQueueSize; i++) {
            this.nextFigures[i] = this.getRandomFigure(figures);
        }
    }

    nextFigure() {
        this.currentFigure = this.nextFigures[0];

        for (let i = 0; i < this.figuresQueueSize - 1; i++) {
            this.nextFigures[i] = this.nextFigures[i + 1];
        }

        this.nextFigures[this.figuresQueueSize - 1] = this.getRandomFigure(figures);

        this.updateUI();

        this.isShifter = true;
    }
    needStop() {
        if (!this.checkPosition(this.currentFigure.x, this.currentFigure.y + 1, this.currentFigure.matrix)) {
            this.insertToField(true);
            this.nextFigure();
            let startX = this.getStartX(this.currentFigure);
            if (this.checkPosition(startX, 0, this.currentFigure.matrix)) {
                this.currentFigure.x = startX;
                this.currentFigure.y = 0;
                this.figureCount += 1;
            } else {
                this.isActive = false;
                gameEnd(this.score);
                return true;
            }

        }
        return false;
    }
    update() {
        this.clearShadow(this.currentFigure);
        if (!this.needStop()) {
            this.moveDown();
        }
        this.clearRow();
    }









    updateUI() {
        for (let i = 0; i < this.figuresQueueSize; i++) {
            this.ui.viewNextFigures[i].src = this.nextFigures[i].image.src;
        }
    }
    clearRow() {
        let cleared = 0;
        let fieldHeight = this.field.length;
        for (let row = fieldHeight - 1; row > 0; row--) {
            if (this.field[row].every(element => element > 10)) {
                cleared++;
                let rowLength = this.field[row].length;
                for (let j = 0; j < rowLength; j++) {
                    for (let i = row; i > 0; i--) {
                        this.field[i][j] = this.field[i - 1][j];
                    }
                }
                row++;
            }
        }
        if (this.figureCount >= 20) {
            this.lvl += Math.floor(this.figureCount / 20);
            this.figureCount = this.figureCount % 20;
            this.updateLvl();
        }
        switch (cleared) {
            case 1:
                this.score += 100 * Math.max(1, this.lvl);
                break;
            case 2:
                this.score += 300 * Math.max(1, this.lvl);
                break;
            case 3:
                this.score += 700 * Math.max(1, this.lvl);
                break;
            case 4:
                this.score += 1500 * Math.max(1, this.lvl);
                break;
            default:
                break;
        }
        return cleared;
    }

    updateLvl() {
        switch (this.lvl) {
            case 0: this.tickTime = 15974 / this.field.length; break;
            case 1: this.tickTime = 14310 / this.field.length; break;
            case 2: this.tickTime = 12646 / this.field.length; break;
            case 3: this.tickTime = 10982 / this.field.length; break;
            case 4: this.tickTime = 9318 / this.field.length; break;
            case 5: this.tickTime = 7654 / this.field.length; break;
            case 6: this.tickTime = 5990 / this.field.length; break;
            case 7: this.tickTime = 4326 / this.field.length; break;
            case 8: this.tickTime = 2662 / this.field.length; break;
            case 9: this.tickTime = 1997 / this.field.length; break;
            case 10:
            case 11:
            case 12: this.tickTime = 1664 / this.field.length; break;
            case 13:
            case 14:
            case 15: this.tickTime = 1331 / this.field.length; break;
            case 16:
            case 17:
            case 18: this.tickTime = 998 / this.field.length; break;
            case 19:
            case 20:
            case 21:
            case 22:
            case 23:
            case 24:
            case 25:
            case 26:
            case 27:
            case 28: this.tickTime = 666 / this.field.length; break;
        }
        if (this.lvl >= 29) {
            this.tickTime = 333 / this.field.length;
        }
        this.ui.music.playbackRate = 0.7 + this.lvl * 0.05;
    }

    initEventListeners() {
        this.addBufferListener();
        this.addPositionListeners();
        this.addPauseListener();
    }

    addPositionListeners() {
        document.addEventListener('keydown', (e) => {
            if (this.isActive)
                switch (e.code) {
                    case 'ArrowLeft':
                    case 'KeyA':
                        this.move.left = this.checkPosition(this.currentFigure.x - 1, this.currentFigure.y, this.currentFigure.matrix) ? 1 : 0;
                        break;
                    case 'ArrowRight':
                    case 'KeyD':
                        this.move.right = this.checkPosition(this.currentFigure.x + 1, this.currentFigure.y, this.currentFigure.matrix) ? 1 : 0;
                        break;
                    case 'Space':
                        this.move.drop = 1;
                        break;
                    case 'ArrowDown':
                    case 'KeyS':
                        this.nitro = 4;
                        break;
                    case 'ArrowUp':
                    case 'KeyW':
                        this.field.rotateFigure(this.currentFigure)
                        break;
                }
        });
        this.moveFigure()
    }

    updateSize(game) {
        this.ui.updateSize(game);
    }
    addPauseListener() {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'KeyP') {
                if (!this.isActive) {
                    GAME.drawDowncount(this, field, this.ui, 3, 1, () => { this.isActive = true; GAME.play(this) })
                } else {
                    this.isActive = false;
                }
            }
        });
    }
    drawNumber() {
        field.clearRect(0, 0, canvas.width, canvas.height);
        this.drawField(this.field[0].length, this.field.length);
        field.fillStyle = "white";
        field.font = "96px Russo One";
        field.fillText(player.num, this.ui.field.width / 2 - 36, this.ui.field.height / 2);
    }
    addBufferListener() {
        document.addEventListener('keyup', (e) => {
            if (this.isActive && e.code === 'ShiftLeft' && this.isShifter) {
                this.clearFigure(this.currentFigure);
                this.clearShadow(this.currentFigure);
                let figure = this.currentFigure;
                this.currentFigure = this.buffer;
                this.buffer = figure;
                this.ui.buffer.src = this.buffer.image.src;
                this.currentFigure.matrix = figures[this.currentFigure.id].matrix;
                this.currentFigure.x = this.getStartX(this.currentFigure);
                this.currentFigure.y = 0;
                this.isShifter = false;
            }
        });
    }
}