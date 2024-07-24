class Player {
    constructor(ui, field) {
        this.score = 0;
        this.nitro = 1;
        this.nitro2 = 1;
        this.lvl = 0;
        this.field = field;
        this.tickTime = 0;
        this.playTime = new Date();
        this.playTime2 = new Date();
        this.figureCount = 0;
        this.move = {
            left: 0,
            right: 0,
            drop: 0,
        }
        this.move2 = {
            left: 0,
            right: 0,
            drop: 0,
        }
        this.currentFigure = null;
        this.currentFigure2 = null;
        this.nextFigures = null;
        this.buffer = null;
        this.ui = ui;
        this.figuresQueueSize = 4;
        this.isShifter = true;
        this.isActive = false;
    }

    initFigures(currentFigureIndex, bufferFigureIndex, NextFiguresIndex) {
        this.currentFigure = getFigure(currentFigureIndex);
        this.currentFigure.x = this.field.getStartX(this.currentFigure) - 5;
        this.currentFigure2 = getFigure(currentFigureIndex);
        this.currentFigure2.x = this.field.getStartX(this.currentFigure2) + 5;
        this.buffer = getFigure(bufferFigureIndex);
        this.ui.buffer.src = this.buffer.image.src;
        this.nextFigures = [];
        for (let i = 0; i < this.figuresQueueSize; i++) {
            this.nextFigures[i] = getFigure(NextFiguresIndex[i]);
        }
        this.ui.updateNextFigures(this.nextFigures);
    }

    nextFigure(playerIndex) {
        this.playTime = new Date;
        let randomIndex = Math.floor(Math.random() * figures.length);
        if (playerIndex === 1) {
            this.currentFigure = this.nextFigures[0];
            this.currentFigure.setY(0);
            this.currentFigure.setX(this.field.getStartX(this.currentFigure) - 5);

        } else {
            this.currentFigure2 = this.nextFigures[0];
            this.currentFigure2.setY(0);
            this.currentFigure2.setX(this.field.getStartX(this.currentFigure2) + 5);

        }
        for (let i = 0; i < this.figuresQueueSize - 1; i++) {
            this.nextFigures[i] = this.nextFigures[i + 1];
        }
        this.isShifter = true;
        this.nextFigures[this.figuresQueueSize - 1] = getFigure(randomIndex)
        this.ui.updateNextFigures(this.nextFigures);
    }

    updateScore(countLines) {
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
        if (this.figureCount >= 30) {
            this.lvl += Math.floor(this.figureCount / 30);
            this.figureCount = this.figureCount % 30;
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
            this.field.insertFigure(this.currentFigure, 1);
            this.field.insertFigure(this.currentFigure2, 2);
            this.field.clearField();
            this.field.drawField(this.field.field, this.field.matrix);
            this.field.clearShadow(this.currentFigure, 1);
            this.field.clearShadow(this.currentFigure2, 2);
            this.field.updateHorizontalPosition(this.currentFigure, this.move, 1);
            this.field.clearShadow(this.currentFigure, 1);
            this.field.clearShadow(this.currentFigure2, 2);
            this.field.updateHorizontalPosition(this.currentFigure2, this.move2, 2);
            this.field.clearShadow(this.currentFigure, 1);
            this.field.clearShadow(this.currentFigure2, 2);
            this.field.createShadow(this.currentFigure, 1);
            this.field.createShadow(this.currentFigure2, 2);
            if (this.move.drop) {
                this.field.clearShadow(this.currentFigure, 1);
                this.field.clearShadow(this.currentFigure2, 2);
                this.field.clearFigure(this.currentFigure);
                this.field.dropFigure(this.currentFigure, 1);
                this.field.fixFigure(this.currentFigure, 1);
                this.updateResults();
                this.nextFigure(1);
                this.field.insertFigure(this.currentFigure, 1);
                this.field.createShadow(this.currentFigure, 1);
                this.field.createShadow(this.currentFigure2, 2);
            }
            if (this.move2.drop) {
                this.field.clearShadow(this.currentFigure, 1);
                this.field.clearShadow(this.currentFigure2, 2);
                this.field.clearFigure(this.currentFigure2);
                this.field.dropFigure(this.currentFigure2, 2);
                this.field.fixFigure(this.currentFigure2, 2);
                this.updateResults();
                this.nextFigure(2);
                this.field.insertFigure(this.currentFigure2, 2);
                this.field.createShadow(this.currentFigure, 1);
                this.field.createShadow(this.currentFigure2, 2);
            }
            if ((new Date() - this.playTime) * this.nitro >= this.tickTime) {
                this.playTime = new Date;
                this.field.clearShadow(this.currentFigure, 1);
                this.field.clearShadow(this.currentFigure2, 2);
                if (!this.field.moveDown(this.currentFigure, 1)) {
                    this.field.fixFigure(this.currentFigure, 1);
                    this.updateResults();
                    this.nextFigure(1);
                    this.field.insertFigure(this.currentFigure, 1);
                    if (!this.field.checkPosition(this.currentFigure.x, this.currentFigure.y, this.currentFigure.matrix, 1)) {
                        this.isActive = false;
                        console.log('sosiska')
                        gameEnd(this.score);
                    }
                }
                this.field.createShadow(this.currentFigure, 1);
                this.field.createShadow(this.currentFigure2, 2);

            }
            if ((new Date() - this.playTime2) * this.nitro2 >= this.tickTime) {
                this.playTime2 = new Date;
                this.field.clearShadow(this.currentFigure, 1);
                this.field.clearShadow(this.currentFigure2, 2);
                if (!this.field.moveDown(this.currentFigure2, 2)) {
                    this.field.fixFigure(this.currentFigure2, 2);
                    this.updateResults();
                    this.nextFigure(2);
                    this.field.insertFigure(this.currentFigure2, 2);
                    if (!this.field.checkPosition(this.currentFigure2.x, this.currentFigure2.y, this.currentFigure2.matrix, 2)) {
                        this.isActive = false;
                        console.log('sosiska2')
                        gameEnd(this.score);
                    }
                }
                this.field.createShadow(this.currentFigure, 1);
                this.field.createShadow(this.currentFigure2, 2);
            }
        }
    }
    updateResults() {
        this.move.drop = 0;
        this.move2.drop = 0;
        this.figureCount++;
        this.updateScore(this.field.clearRow());
        this.updateLvl();
    }
    onPositionKeyDown(e) {
        if (this.isActive)
            switch (e.code) {
                case 'ArrowLeft':
                case 'KeyA':
                    this.move.left = this.field.checkPosition(this.currentFigure.x - 1, this.currentFigure.y, this.currentFigure.matrix, 1) ? 1 : 0;
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    this.move.right = this.field.checkPosition(this.currentFigure.x + 1, this.currentFigure.y, this.currentFigure.matrix, 1) ? 1 : 0;
                    break;
                case 'Space':
                    this.move.drop = 1;
                    break;
                case 'ArrowDown':
                case 'KeyS':
                    this.nitro = 4;
                    break;
                case 'KeyW':
                    this.field.clearShadow(this.currentFigure, 1);
                    this.field.clearShadow(this.currentFigure2, 2);
                    this.field.clearFigure(this.currentFigure);
                    this.field.rotateFigure(this.currentFigure, 1);
                    this.field.insertFigure(this.currentFigure, 1);
                    this.field.insertFigure(this.currentFigure2, 2);
                    this.field.createShadow(this.currentFigure, 1);
                    this.field.createShadow(this.currentFigure2, 2);
                    break;
                case 'KeyJ':
                    this.move2.left = this.field.checkPosition(this.currentFigure2.x - 1, this.currentFigure2.y, this.currentFigure2.matrix, 2) ? 1 : 0;
                    break;
                case 'KeyL':
                    this.move2.right = this.field.checkPosition(this.currentFigure2.x + 1, this.currentFigure2.y, this.currentFigure2.matrix, 2) ? 1 : 0;
                    break;
                case 'KeyM':
                    this.move2.drop = 1;
                    break;
                case 'KeyK':
                    this.nitro2 = 4;
                    break;
                case 'KeyI':

                    this.field.clearShadow(this.currentFigure, 1);
                    this.field.clearShadow(this.currentFigure2, 2);
                    this.field.clearFigure(this.currentFigure2);
                    this.field.rotateFigure(this.currentFigure2, 2);
                    this.field.insertFigure(this.currentFigure2, 2);
                    this.field.createShadow(this.currentFigure, 1);
                    this.field.createShadow(this.currentFigure2, 2);
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
                case 'KeyK':
                    this.nitro2 = 1;
            }
        });
    }



    initEventListeners() {
        this.addBufferListener();
        this.addPositionListeners();
    }
    onBufferKeyUp(e) {
        if (this.isActive && e.code === 'ShiftLeft' && this.isShifter) {

            this.field.clearShadow(this.currentFigure, 1);
            this.field.clearShadow(this.currentFigure2, 2);
            this.field.clearFigure(this.currentFigure);
            this.field.clearFigure(this.currentFigure2);
            let figure = this.currentFigure;
            this.currentFigure = this.buffer;
            this.buffer = figure;
            this.ui.buffer.src = this.buffer.image.src;
            this.currentFigure.matrix = figures[this.currentFigure.id].matrix;
            this.currentFigure.x = this.field.getStartX(this.currentFigure);
            this.currentFigure.y = 0;
            this.isShifter = false;
            this.field.insertFigure(this.currentFigure, 1);
            this.field.insertFigure(this.currentFigure2, 2);
            this.field.createShadow(this.currentFigure, 1);
            this.field.createShadow(this.currentFigure2, 2);
        }
        if (this.isActive && e.code === 'ShiftRight' && this.isShifter) {
            this.field.clearShadow(this.currentFigure, 1);
            this.field.clearShadow(this.currentFigure2, 2);
            this.field.clearFigure(this.currentFigure);
            this.field.clearFigure(this.currentFigure2);
            let figure = this.currentFigure2;
            this.currentFigure2 = this.buffer;
            this.buffer = figure;
            this.ui.buffer.src = this.buffer.image.src;
            this.currentFigure2.matrix = figures[this.currentFigure2.id].matrix;
            this.currentFigure2.x = this.field.getStartX(this.currentFigure2);
            this.currentFigure2.y = 0;
            this.isShifter = false;
            this.field.insertFigure(this.currentFigure, 1);
            this.field.insertFigure(this.currentFigure2, 2);
            this.field.createShadow(this.currentFigure, 1);
            this.field.createShadow(this.currentFigure2, 2);
        }
    }
    addBufferListener() {
        document.addEventListener('keyup', (e) => {
            this.onBufferKeyUp(e);
        });
    }
}