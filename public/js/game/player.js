class Player {
    constructor(ui_, figuresQueueSize) {
        this.score = 0;
        this.field = [];
        this.nitro = 1;
        this.lvl = 0;
        this.tickTime = 0;
        this.lines = 0;
        this.figureCount = 0;
        this.mode = 'classic';
        this.move = {
            down: 1,
            left: 0,
            right: 0,
            set: 0,
        }
        this.currentFigure = null;
        this.nextFigures = null;
        this.buffer = null;
        this.ui = ui_;
        this.figuresQueueSize = figuresQueueSize;
        this.isShifter = true;
        this.isActive = true;
    }

    setX(x) {
        this.currentFigure.x = x;
    }

    getRandomFigure(figures) {
        const randomIndex = Math.floor(Math.random() * figures.length);
        let figure = figures[randomIndex];
        return new Figure(
            figure.matrix,
            figure.image,
            figure.block,
            figure.shadow,
            randomIndex
        );
    }

    initField(width, height) {
        for (let line = 0; line < height; line++) {
            this.field[line] = [];
            for (let column = 0; column < width; column++) {
                this.field[line][column] = 0;
            }
        }
    }

    initFigures() {
        this.currentFigure = this.getRandomFigure(figures);
        this.currentFigure.x = this.getStartX(this.currentFigure);
        this.buffer = this.getRandomFigure(figures);
        this.ui.buffer.src = this.buffer.image.src;
        this.nextFigures = [];
        for (let i = 0; i < this.figuresQueueSize; i++) {
            this.nextFigures[i] = this.getRandomFigure(figures);
        }
    }

    insertToField(fix = false) {
        this.createShadow(this.currentFigure);

        for (let i = 0; i < this.currentFigure.matrix.length; i++) {
            for (let j = 0; j < this.currentFigure.matrix[i].length; j++) {
                if (this.currentFigure.matrix[i][j])
                    this.field[i + this.currentFigure.y][j + this.currentFigure.x] = this.currentFigure.matrix[i][j] + (fix ? 10 : 0);
            }
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
                if (this.mode === 'blitz') {
                    GAME.blitzGameEnd(this.score)
                } else
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

    getStartX(figure) {
        return Math.floor((this.field[0].length - Math.max(...figure.matrix.map(row => row.length))) / 2);
    }

    moveDown() {
        if (this.checkPosition(this.currentFigure.x, this.currentFigure.y + 1, this.currentFigure.matrix)) {
            this.clearFigure(this.currentFigure);
            this.currentFigure.y++;
        }
    }

    updatePosition() {
        this.clearShadow(this.currentFigure);
        this.updateHorizontalPosition();
        this.setFigure();
        this.insertToField();
    }

    updateHorizontalPosition() {
        if (this.checkPosition(this.currentFigure.x + this.move.right - this.move.left, this.currentFigure.y, this.currentFigure.matrix)) {
            this.clearFigure(this.currentFigure);
            this.currentFigure.x += this.move.right - this.move.left;
            this.move.left = this.move.right = 0;
        }
    }

    setFigure() {
        if (this.move.set) {
            let pos = this.getBottomPosition(this.currentFigure);
            this.currentFigure.x = pos.x;
            this.currentFigure.y = pos.y;
            this.move.set = 0;
            this.update();
        }
    }

    updateUI() {
        for (let i = 0; i < this.figuresQueueSize; i++) {
            this.ui.viewNextFigures[i].src = this.nextFigures[i].image.src;
        }
    }

    drawField(width, height) {
        for (let row = 0; row < height; row++) {
            for (let col = 0; col < width; col++) {
                if (this.field[row][col] - 1 >= 20)
                    field.drawImage(
                        figures[(this.field[row][col] - 1) % 10].shadow,
                        col * this.ui.blockSize,
                        row * this.ui.blockSize,
                        this.ui.blockSize, this.ui.blockSize
                    )
                else if (this.field[row][col] === 0) {
                    field.drawImage(
                        blockField,
                        col * this.ui.blockSize,
                        row * this.ui.blockSize,
                        this.ui.blockSize,
                        this.ui.blockSize
                    )
                } else {
                    field.drawImage(
                        figures[(this.field[row][col] - 1) % 10].block,
                        col * this.ui.blockSize,
                        row * this.ui.blockSize,
                        this.ui.blockSize,
                        this.ui.blockSize
                    );
                }
            }
        }
    }

    drawOtherField(width, height) {
        otherField.forEach((elem) => {
            elem.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
            for (let row = 0; row < height; row++) {
                for (let col = 0; col < width; col++) {
                    elem.getContext('2d').drawImage(
                        blockField,
                        col * this.ui.blockSize,
                        row * this.ui.blockSize,
                        this.ui.blockSize, this.ui.blockSize
                    )
                }
            }
        })
    }

    rotateFigure(matrix) {
        let rotated = [];

        for (let i = 0; i < matrix.length; i++) {
            rotated[i] = [];
            for (let j = 0; j < matrix.length; j++) {
                rotated[i][j] = matrix[matrix.length - 1 - j][i];
            }
        }

        return rotated;
    }

    clearFigure(figure) {
        for (let i = 0; i < figure.matrix.length; i++) {
            for (let j = 0; j < figure.matrix[0].length; j++) {
                if (figure.matrix[i][j])
                    this.field[i + figure.y][j + figure.x] = 0;
            }
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
        this.lines += cleared;
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
    z
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

    checkPosition(x, y, matrix) {
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[0].length; j++) {
                if (matrix[i][j]) {
                    if (
                        y + i >= this.field.length
                        || x + j >= this.field[y + i].length
                        || y + i < 0
                        || x + j < 0
                    ) return false;
                    let color = this.field[y + i][x + j];
                    if (10 < color && color <= 20 || 30 < color) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    createShadow(figure) {
        let pos = this.getBottomPosition(figure);
        for (let i = 0; i < figure.matrix.length; i++) {
            for (let j = 0; j < figure.matrix[i].length; j++) {
                if (pos.y + i < this.field.length && this.field[pos.y + i][pos.x + j] === 0 && figure.matrix[i][j] !== 0) {
                    this.field[pos.y + i][pos.x + j] = figure.matrix[i][j] + 20;
                }
            }
        }
    }

    clearShadow(figure) {
        this.clearFigure({ matrix: figure.matrix, ...this.getBottomPosition(figure) });
    }

    getBottomPosition(figure) {
        let i = 1;
        for (; this.checkPosition(figure.x, figure.y + i, figure.matrix);) i++;
        return { x: figure.x, y: figure.y + i - 1 }
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
                        this.move.set = 1;
                        break;
                    case 'ArrowDown':
                    case 'KeyS':
                        this.nitro = 4;
                        break;
                    case 'ArrowUp':
                    case 'KeyW':
                        let rotated = this.rotateFigure(this.currentFigure.matrix);

                        if (this.checkPosition(this.currentFigure.x, this.currentFigure.y, rotated)) {
                            this.clearFigure(this.currentFigure);
                            this.clearShadow(this.currentFigure);
                            this.currentFigure.matrix = rotated;
                        }
                        break;
                }
        });
        if (this.isActive)
            document.addEventListener('keyup', (e) => {
                if (e.code === 'ArrowDown' || e.code === 'KeyS') {
                    this.nitro = 1;
                }
            });
    }

    updateSize(game) {
        this.ui.updateSize(game);
    }
    addPauseListener() {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'KeyP') {
                if (!this.isActive) {
                    GAME.drawDowncount(this, field, this.ui, 3, 1, () => { this.isActive = !this.isActive; })
                } else
                    this.isActive = !this.isActive;
            }
        });
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