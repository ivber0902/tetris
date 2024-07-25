class Bot {
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
        this.field2 = null;
        this.timeOut = 100;
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
        }
    }

    async play() {
        this.field.clearField();
        this.field.drawField(this.field.field, this.field.matrix);
        let maxdropscore = -1000000;
        let posmax = 0;
        let maxposx = 0;
        let currentFigure2 = new Figure([], []);
        for (let h = 0; h < this.currentFigure.matrix.length; h++) {
            currentFigure2.matrix[h] = [];
            for (let w = 0; w < this.currentFigure.matrix[h].length; w++) {
                currentFigure2.matrix[h][w] = this.currentFigure.matrix[h][w];
            }
        }
        for (let position = 0; position < this.currentFigure.matrixPositions.length; position++) {
            currentFigure2.matrixPositions[position] = [];
            for (let h = 0; h < this.currentFigure.matrix.length; h++) {
                currentFigure2.matrixPositions[position][h] = [];
                for (let w = 0; w < this.currentFigure.matrixPositions[position][h].length; w++) {
                    currentFigure2.matrixPositions[position][h][w] = this.currentFigure.matrixPositions[position][h][w];
                }
            }
        }
        for (let posx = -5; posx < this.field.width + 5; posx++) {
            for (let i = 0; i < this.currentFigure.matrixPositions.length; i++) {
                if (this.field.checkPosition(posx, 0, this.currentFigure.matrixPositions[i])) {
                    currentFigure2.matrix = currentFigure2.matrixPositions[i];
                    currentFigure2.x = posx;
                    currentFigure2.y = 0;
                    let field2 = new Field([], GAME.width, GAME.height);
                    for (let h = 0; h < this.field.height; h++) {
                        field2.matrix[h] = [];
                        for (let w = 0; w < this.field.width; w++) {
                            field2.matrix[h][w] = this.field.matrix[h][w];
                        }
                    }
                    let emptyBefore = 0;
                    for (let w = 0; w < field2.width; w++) {
                        let emptySearch = false;
                        for (let h = 0; h < field2.height; h++) {
                            if (field2.matrix[h][w] !== 0) {
                                emptySearch = true;
                            }
                            if (emptySearch && field2.matrix[h][w] === 0) {
                                emptyBefore += 1;
                            }
                        }
                    }
                    field2.dropFigure(currentFigure2);
                    field2.fixFigure(currentFigure2);
                    let FigureY = currentFigure2.y;
                    let clearedRows = field2.clearRow();
                    let emptyAfter = 0;
                    for (let w = 0; w < field2.width; w++) {
                        let emptySearch = false;
                        for (let h = 0; h < field2.height; h++) {
                            if (field2.matrix[h][w] !== 0) {
                                emptySearch = true;
                            }
                            if (emptySearch && field2.matrix[h][w] === 0) {
                                emptyAfter += 1;
                            }
                        }
                    }
                    let dropScore = 0
                    if ((emptyBefore - emptyAfter) < 0) {
                        dropScore = clearedRows * 20 + (emptyBefore - emptyAfter) * 2.5 + FigureY * 2
                    }
                    else {
                        dropScore = clearedRows * 20 - (emptyBefore - emptyAfter) * 10 + FigureY * 2
                    }
                    if (dropScore > maxdropscore) {
                        maxdropscore = dropScore;
                        posmax = i;
                        maxposx = posx;
                    }
                }
            }
        }
        this.currentFigure.setX(this.field.getStartX(this.currentFigure));
        this.currentFigure.setY(0);
        this.field.insertFigure(this.currentFigure);
        this.field.createShadow(this.currentFigure);
        this.field.clearField();
        this.field.drawField(this.field.field, this.field.matrix);
        while (this.currentFigure.x < maxposx && this.field.checkPosition(this.currentFigure.x+1, this.currentFigure.y, this.currentFigure.matrix)) {
            await sleep(100);
            this.field.clearShadow(this.currentFigure);
            this.field.clearFigure(this.currentFigure);
            this.currentFigure.x += 1;
            this.field.insertFigure(this.currentFigure);
            this.field.createShadow(this.currentFigure);
            this.field.clearField();
            this.field.drawField(this.field.field, this.field.matrix);
        }
        while (this.currentFigure.x > maxposx && this.field.checkPosition(this.currentFigure.x-1, this.currentFigure.y, this.currentFigure.matrix)) {
            await sleep(100);
            this.field.clearShadow(this.currentFigure);
            this.field.clearFigure(this.currentFigure);
            this.currentFigure.x -= 1;
            this.field.insertFigure(this.currentFigure);
            this.field.createShadow(this.currentFigure);
            this.field.clearField();
            this.field.drawField(this.field.field, this.field.matrix);
        }
        this.field.moveDown(this.currentFigure)
        while (this.currentFigure.matrix !== this.currentFigure.matrixPositions[posmax]) {
            await sleep(10);
            this.field.rotateFigure(this.currentFigure);
            this.field.clearField();
            this.field.drawField(this.field.field, this.field.matrix);
        }
        this.field.moveDown(this.currentFigure)
        while (this.currentFigure.x < maxposx && this.field.checkPosition(this.currentFigure.x+1, this.currentFigure.y, this.currentFigure.matrix)) {
            await sleep(10);
            this.field.clearShadow(this.currentFigure);
            this.field.clearFigure(this.currentFigure);
            this.currentFigure.x += 1;
            this.field.insertFigure(this.currentFigure);
            this.field.createShadow(this.currentFigure);
            this.field.clearField();
            this.field.drawField(this.field.field, this.field.matrix);
        }
        while (this.currentFigure.x > maxposx && this.field.checkPosition(this.currentFigure.x-1, this.currentFigure.y, this.currentFigure.matrix)) {
            await sleep(10);
            this.field.clearShadow(this.currentFigure);
            this.field.clearFigure(this.currentFigure);
            this.currentFigure.x -= 1;
            this.field.insertFigure(this.currentFigure);
            this.field.createShadow(this.currentFigure);
            this.field.clearField();
            this.field.drawField(this.field.field, this.field.matrix);
        }
        this.field.clearShadow(this.currentFigure);
        this.field.clearFigure(this.currentFigure);
        this.field.dropFigure(this.currentFigure);
        if (this.currentFigure.y < 15) {
            this.timeOut = 200;
        }
        if (this.currentFigure.y < 7) {
            this.timeOut = 100;
        }
        this.field.fixFigure(this.currentFigure);
        this.updateResults();
        this.nextFigure();
        document.querySelector('.game__score').innerHTML = this.score;
        document.querySelector('.game__level').innerHTML = this.lvl;
        if (maxdropscore === -1000000) {
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
                mode: 3,
                time: new Date() - GAME.startTime,
                score: player.score,
                tetris_count: player.countTetris,
                figure_count: player.figureCount,
                filled_rows: player.countClearLines,
                field_mode: player.fieldMode,
                is_won: true
            }
            gameEnd(result);
        };
        if (this.isActive) setTimeout(() => { this.play() }, this.timeOut);
    }
    sumArr(array) {
        let sum = 0;
        if (array) {
            array.forEach((elem) => {
                sum = sum + elem
            })
        }
        return sum
    }
    updateResults() {
        this.move.drop = 0;
        this.move.left = 0;
        this.move.right = 0;
        this.figureCount++;
        this.updateScore(this.field.clearRow());
        this.updateLvl();
    }
}