class Player {
    constructor(ui, field) {
        this.score = 0;
        this.nitro = 1;
        this.lvl = 0;
        this.field = field;
        this.tickTime = 0;
        this.playTime = new Date(),
            this.figureCount = 0;
        this.move = {
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
        this.isActive = false;
        this.startNewLevelTimer = new Date();
        this.isStartNewLevelTimer = false;
        this.countTetris = 0;
        this.countClearLines = 0;
        this.fieldMode = 0;
    }

    initFigures(currentFigureIndex, bufferFigureIndex, NextFiguresIndex) {
        this.currentFigure = getFigure(currentFigureIndex);
        this.currentFigure.x = this.field.getStartX(this.currentFigure);
        this.buffer = getFigure(bufferFigureIndex);
        this.ui.buffer.src = this.buffer.image.src;
        this.nextFigures = [];
        for (let i = 0; i < this.figuresQueueSize; i++) {
            this.nextFigures[i] = getFigure(NextFiguresIndex[i]);
        }
        this.ui.updateNextFigures(this.nextFigures);
    }

    nextFigure() {
        this.playTime = new Date;
        let randomIndex = Math.floor(Math.random() * figures.length);
        this.currentFigure = this.nextFigures[0];
        this.currentFigure.setY(0);
        this.currentFigure.setX(this.field.getStartX(this.currentFigure));
        for (let i = 0; i < this.figuresQueueSize - 1; i++) {
            this.nextFigures[i] = this.nextFigures[i + 1];
        }
        this.isShifter = true;
        this.nextFigures[this.figuresQueueSize - 1] = getFigure(randomIndex)
        this.ui.updateNextFigures(this.nextFigures);
    }

    updateScore(countLines) {
        if (countLines === 4)
            this.countTetris += 1
        this.countClearLines += countLines;

        switch (countLines) {
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
    }

    updateLvl() {
        if (this.figureCount >= 20) {
            this.lvl += Math.floor(this.figureCount / 20);
            this.figureCount = this.figureCount % 20;
            this.isStartNewLevelTimer = true;
            this.startNewLevelTimer = new Date();
            this.updateSpeed();
        }
    }

    updateSpeed() {
        switch (this.lvl) {
            case 0: this.tickTime = 15974 / this.field.height; break;
            case 1: this.tickTime = 14310 / this.field.height; break;
            case 2: this.tickTime = 12646 / this.field.height; break;
            case 3: this.tickTime = 10982 / this.field.height; break;
            case 4: this.tickTime = 9318 / this.field.height; break;
            case 5: this.tickTime = 7654 / this.field.height; break;
            case 6: this.tickTime = 5990 / this.field.height; break;
            case 7: this.tickTime = 4326 / this.field.height; break;
            case 8: this.tickTime = 2662 / this.field.height; break;
            case 9: this.tickTime = 1997 / this.field.height; break;
            case 10:
            case 11:
            case 12: this.tickTime = 1664 / this.field.height; break;
            case 13:
            case 14:
            case 15: this.tickTime = 1331 / this.field.height; break;
            case 16:
            case 17:
            case 18: this.tickTime = 998 / this.field.height; break;
            case 19:
            case 20:
            case 21:
            case 22:
            case 23:
            case 24:
            case 25:
            case 26:
            case 27:
            case 28: this.tickTime = 666 / this.field.height; break;
        }
        if (this.lvl >= 29) {
            this.tickTime = 333 / this.field.height;
        }
        this.ui.music.playbackRate = 0.7 + this.lvl * 0.05;
    }


    update() {
        if (this.isActive) {
            this.field.clearField();
            this.field.drawField(this.field.field, this.field.matrix);
            this.field.updateHorizontalPosition(this.currentFigure, this.move);
            if (this.move.drop) {
                this.field.clearShadow(this.currentFigure);
                this.field.clearFigure(this.currentFigure);
                this.field.dropFigure(this.currentFigure);
                this.field.fixFigure(this.currentFigure);
                this.updateResults();
                this.nextFigure();
                if (!this.field.checkPosition(this.currentFigure.x, this.currentFigure.y, this.currentFigure.matrix)) {
                    this.isActive = false;
                    switch (localStorage.Gamewidth) {
                        case '7':
                            this.fieldMode = 0
                            break;
                        case '10':
                            this.fieldMode = 1
                            break;
                        case '15':
                            this.fieldMode = 2
                            break;
                        case '20':
                            this.fieldMode = 3
                            break;
                        default:
                            break;
                    }
                    let result = {
                        mode: parseInt(localStorage.mode),
                        score: this.score,
                        tetris_count: this.countTetris,
                        figure_count: this.figureCount,
                        filled_rows: this.countClearLines,
                        field_mode: this.fieldMode,
                        is_won: false
                    }
                    gameEnd(result);
                }
                this.update();
            }
            if ((new Date() - this.playTime) * this.nitro >= this.tickTime) {
                this.playTime = new Date;
                if (!this.field.moveDown(this.currentFigure)) {
                    this.field.fixFigure(this.currentFigure);
                    this.updateResults();
                    this.nextFigure();
                    if (this.field.checkPosition(this.currentFigure.x, this.currentFigure.y, this.currentFigure.matrix)) {
                        this.update();
                    } else {
                        this.isActive = false;
                        switch (localStorage.Gamewidth) {
                            case '7':
                                this.fieldMode = 0
                                break;
                            case '10':
                                this.fieldMode = 1
                                break;
                            case '15':
                                this.fieldMode = 2
                                break;
                            case '20':
                                this.fieldMode = 3
                                break;
                            default:
                                break;
                        }
                        let result = {
                            mode: parseInt(localStorage.mode),
                            score: this.score,
                            tetris_count: this.countTetris,
                            figure_count: this.figureCount,
                            filled_rows: this.countClearLines,
                            field_mode: this.fieldMode,
                            is_won: false
                        }
                        gameEnd(result);
                    }
                }
            }
            if (this.isStartNewLevelTimer) {
                if (new Date() - this.startNewLevelTimer > 3 * 1000) {
                    this.isStartNewLevelTimer = false;
                } else {
                    this.field.field.fillStyle = "white";
                    this.field.field.font = "48px Russo One";
                    this.field.field.fillText('НОВЫЙ', this.field.width * this.field.blockSize / 2 - 100, this.field.height * this.field.blockSize / 2 - 25);
                    this.field.field.fillText('УРОВЕНЬ', this.field.width * this.field.blockSize / 2 - 120, this.field.height * this.field.blockSize / 2 + 25);
                }
            }
        }
    }

    updateResults() {
        this.move.drop = 0;
        this.move.left = 0;
        this.move.right = 0;
        this.figureCount++;
        this.updateScore(this.field.clearRow());
        this.updateLvl();
    }
    onPositionKeyDown(e) {
        if (this.isActive)
            switch (e.code) {
                case 'ArrowLeft':
                case 'KeyA':
                    this.move.left = this.field.checkPosition(this.currentFigure.x - 1, this.currentFigure.y, this.currentFigure.matrix) ? 1 : 0;
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    this.move.right = this.field.checkPosition(this.currentFigure.x + 1, this.currentFigure.y, this.currentFigure.matrix) ? 1 : 0;
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
    }
    addPositionListeners() {
        document.addEventListener('keydown', (e) => {
            this.onPositionKeyDown(e);
            this.update();
        });
        document.addEventListener('keyup', (e) => {
            switch (e.code) {
                case 'ArrowDown':
                case 'KeyS':
                    this.nitro = 1;
            }
        });
    }
    initEventListeners() {
        this.addBufferListener();
        this.addPositionListeners();
    }
    onBufferKeyUp(e) {
        if (this.isActive && e.code === 'ShiftLeft' && this.isShifter) {
            this.field.clearFigure(this.currentFigure);
            this.field.clearShadow(this.currentFigure);
            let figure = this.currentFigure;
            this.currentFigure = this.buffer;
            this.buffer = figure;
            this.ui.buffer.src = this.buffer.image.src;
            this.currentFigure.matrix = figures[this.currentFigure.id].matrix;
            this.currentFigure.x = this.field.getStartX(this.currentFigure);
            this.currentFigure.y = 0;
            this.isShifter = false;
        }
    }
    addBufferListener() {
        document.addEventListener('keyup', (e) => {
            this.onBufferKeyUp(e);
        });
    }
}