class Player {
    constructor(ui_, figuresQueueSize) {
        this.score = 0;
        this.field = [];
        this.nitro = 1;
        this.nitro2 = 1;
        this.lvl = 0;
        this.num = 10;
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
        this.move2 = {
            down: 1,
            left: 0,
            right: 0,
            set: 0,
        }
        this.currentFigure = null;
        this.currentFigure2 = null;
        this.nextFigures = null;
        this.buffer = null;
        this.ui = ui_;
        this.figuresQueueSize = figuresQueueSize;
        this.isBufferActive = true;
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
        this.currentFigure.x = this.getStartX(this.currentFigure) - 5;
        this.currentFigure2 = this.getRandomFigure(figures);
        this.currentFigure2.x = this.getStartX(this.currentFigure2) + 5;
        this.buffer = this.getRandomFigure(figures);
        this.ui.buffer.src = this.buffer.image.src;
        this.nextFigures = [];
        for (let i = 0; i < this.figuresQueueSize; i++) {
            this.nextFigures[i] = this.getRandomFigure(figures);
        }
    }

    insertToField(playerIndex, fix = false) {
        if (playerIndex === 1) {
            //this.createShadow(this.currentFigure);
            for (let i = 0; i < this.currentFigure.matrix.length; i++) {
                for (let j = 0; j < this.currentFigure.matrix[i].length; j++) {
                    if (this.currentFigure.matrix[i][j])
                        this.field[i + this.currentFigure.y][j + this.currentFigure.x] = this.currentFigure.matrix[i][j] + (fix ? 10 : 100);
                }
            }
        } else {
            //this.createShadow(this.currentFigure2);
            for (let i = 0; i < this.currentFigure2.matrix.length; i++) {
                for (let j = 0; j < this.currentFigure2.matrix[i].length; j++) {
                    if (this.currentFigure2.matrix[i][j])
                        this.field[i + this.currentFigure2.y][j + this.currentFigure2.x] = this.currentFigure2.matrix[i][j] + (fix ? 10 : 200);
                }
            }
        }
    }


    nextFigure(playerIndex) {
        if (playerIndex === 1) {
            this.currentFigure = this.nextFigures[0];
        }
        else {
            this.currentFigure2 = this.nextFigures[0];
        }
        for (let i = 0; i < this.figuresQueueSize - 1; i++) {
            this.nextFigures[i] = this.nextFigures[i + 1];
        }
        this.nextFigures[this.figuresQueueSize - 1] = this.getRandomFigure(figures);
        this.updateUI();
        this.isBufferActive = true;
    }

    needStop(playerIndex) {
        if (playerIndex === 1) {
            if (!this.checkPosition(this.currentFigure.x, this.currentFigure.y + 1, this.currentFigure.matrix, playerIndex)) {
                this.insertToField(playerIndex, true);
                this.nextFigure(playerIndex);
                let startX = this.getStartX(this.currentFigure) - 5;
                if (this.checkPosition(startX, 0, this.currentFigure.matrix, playerIndex)) {
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
        } else {
            if (!this.checkPosition(this.currentFigure2.x, this.currentFigure2.y + 1, this.currentFigure2.matrix, playerIndex)) {
                this.insertToField(playerIndex, true);
                this.nextFigure(playerIndex);
                let startX = this.getStartX(this.currentFigure2) + 5;
                if (this.checkPosition(startX, 0, this.currentFigure2.matrix, playerIndex)) {
                    this.currentFigure2.x = startX;
                    this.currentFigure2.y = 0;
                    this.figureCount += 1;
                } else {
                    this.isActive = false;
                    gameEnd(this.score);
                    return true;
                }

            }

        }
    }
    update() {
        //this.clearShadow(this.currentFigure);
        //this.clearShadow(this.currentFigure2);
        if (!this.needStop(1)) {
            this.moveDown(1);
        }
        if (!this.needStop(2)) {
            this.moveDown(2);
        }
        this.clearRow();
    }
    update1() {
        //this.clearShadow(this.currentFigure);
        if (!this.needStop(1)) {
            this.moveDown(1);
        }
        this.clearRow();
    }
    update2() {
        //this.clearShadow(this.currentFigure2);
        if (!this.needStop(2)) {
            this.moveDown(2);
        }
        this.clearRow();
    }

    getStartX(figure) {
        return Math.floor((this.field[0].length - Math.max(...figure.matrix.map(row => row.length))) / 2);
    }

    moveDown(playerIndex) {
        if (playerIndex === 1) {
            if (this.checkPosition(this.currentFigure.x, this.currentFigure.y + 1, this.currentFigure.matrix, playerIndex)) {
                this.clearFigure(this.currentFigure);
                this.currentFigure.y++;
            }
        } else {
            if (this.checkPosition(this.currentFigure2.x, this.currentFigure2.y + 1, this.currentFigure2.matrix, playerIndex)) {
                this.clearFigure(this.currentFigure2);
                this.currentFigure2.y++;
            }

        }
    }

    updatePosition() {
        //this.clearShadow(this.currentFigure);
        //this.clearShadow(this.currentFigure2);
        this.updateHorizontalPosition();
        this.setFigure();
        this.insertToField(1);
        this.insertToField(2);
    }

    updateHorizontalPosition() {
        if (this.checkPosition(this.currentFigure.x + this.move.right - this.move.left, this.currentFigure.y, this.currentFigure.matrix, 1)) {
            this.clearFigure(this.currentFigure);
            this.currentFigure.x += this.move.right - this.move.left;
            this.move.left = this.move.right = 0;
        }
        if (this.checkPosition(this.currentFigure2.x + this.move2.right - this.move2.left, this.currentFigure2.y, this.currentFigure2.matrix, 2)) {
            this.clearFigure(this.currentFigure2);
            this.currentFigure2.x += this.move2.right - this.move2.left;
            this.move2.left = this.move2.right = 0;
        }
    }

    setFigure() {
        if (this.move.set) {
            let pos = this.getBottomPosition(this.currentFigure, 1);
            this.currentFigure.x = pos.x;
            this.currentFigure.y = pos.y;
            this.move.set = 0;
            this.update();
        }
        if (this.move2.set) {
            let pos = this.getBottomPosition(this.currentFigure2, 2);
            this.currentFigure2.x = pos.x;
            this.currentFigure2.y = pos.y;
            this.move2.set = 0;
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
                if ((this.field[row][col] - 1 >= 20) && (this.field[row][col] - 1 < 100)) {
                    field.drawImage(
                        figures[(this.field[row][col] - 1) % 10].shadow,
                        col * this.ui.blockSize,
                        row * this.ui.blockSize,
                        this.ui.blockSize, this.ui.blockSize
                    )
                }
                else {
                    if (this.field[row][col] === 0) {
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
            if (this.field[row].every(element => ((element > 10) && (element < 100)))) {
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
        if (this.figureCount >= 10) {
            this.lvl += Math.floor(this.figureCount / 10);
            this.figureCount = this.figureCount % 10;
            this.updateLvl();
        }
        switch (cleared) {
            case 1:
                this.score += 1000 * Math.max(1, this.lvl);
                break;
            case 2:
                this.score += 3000 * Math.max(1, this.lvl);
                break;
            case 3:
                this.score += 7000 * Math.max(1, this.lvl);
                break;
            case 4:
                this.score += 15000 * Math.max(1, this.lvl);
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

    checkPosition(x, y, matrix, playerIndex) {
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
                    if (10 < color && color <= 20 || (30 < color && color < 100) || ((color > 100) && (Math.floor(color / 100) !== (playerIndex)))) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    createShadow(figure) {
        let pos = this.getBottomPosition(figure, ((figure.matrix === this.currentFigure.matrix) ? 1 : 2));
        for (let i = 0; i < figure.matrix.length; i++) {
            for (let j = 0; j < figure.matrix[i].length; j++) {
                if (pos.y + i < this.field.length && this.field[pos.y + i][pos.x + j] === 0 && figure.matrix[i][j] !== 0) {
                    this.field[pos.y + i][pos.x + j] = figure.matrix[i][j] + 20 + ((figure.matrix > 100)? ((figure.matrix === this.currentFigure.matrix) ? -100 : -200): 0);
                }
            }
        }
    }

    clearShadow(figure) {
        this.clearFigure({ matrix: figure.matrix, ...this.getBottomPosition(figure, ((figure.matrix === this.currentFigure.matrix) ? 1 : 2)) });
    }

    getBottomPosition(figure, playerIndex) {
        let i = 1;
        for (; this.checkPosition(figure.x, figure.y + i, figure.matrix, playerIndex);) i++;
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
                        this.move.left = this.checkPosition(this.currentFigure.x - 1, this.currentFigure.y, this.currentFigure.matrix, 1) ? 1 : 0;
                        break;
                    case 'ArrowRight':
                    case 'KeyD':
                        this.move.right = this.checkPosition(this.currentFigure.x + 1, this.currentFigure.y, this.currentFigure.matrix, 1) ? 1 : 0;
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
                        if (this.checkPosition(this.currentFigure.x, this.currentFigure.y, rotated, 1)) {
                            this.clearFigure(this.currentFigure);
                            //this.clearShadow(this.currentFigure);
                            this.currentFigure.matrix = rotated;
                        }
                        break;
                    case 'KeyJ':
                        this.move2.left = this.checkPosition(this.currentFigure2.x - 1, this.currentFigure2.y, this.currentFigure2.matrix, 2) ? 1 : 0;
                        break;
                    case 'KeyL':
                        this.move2.right = this.checkPosition(this.currentFigure2.x + 1, this.currentFigure2.y, this.currentFigure2.matrix, 2) ? 1 : 0;
                        break;
                    case 'KeyB':
                        this.move2.set = 1;
                        break;
                    case 'KeyK':
                        this.nitro2 = 4;
                        break;
                    case 'KeyI':
                        let rotatedSecond = this.rotateFigure(this.currentFigure2.matrix);
                        if (this.checkPosition(this.currentFigure2.x, this.currentFigure2.y, rotatedSecond, 2)) {
                            this.clearFigure(this.currentFigure2);
                            //this.clearShadow(this.currentFigure2);
                            this.currentFigure2.matrix = rotatedSecond;
                        }
                        break;
                }
        });
        if (this.isActive)
            document.addEventListener('keyup', (e) => {
                if (e.code === 'ArrowDown' || e.code === 'KeyS') {
                    this.nitro = 1;
                }
                if (e.code === 'KeyK') {
                    this.nitro2 = 1;
                }
            });
    }

    addBufferListener() {
        document.addEventListener('keyup', (e) => {
            if (this.isActive && e.code === 'ShiftLeft' && this.isBufferActive) {
                this.clearFigure(this.currentFigure);
                //this.clearShadow(this.currentFigure);
                let figure = this.currentFigure;
                this.currentFigure = this.buffer;
                this.buffer = figure;
                this.ui.buffer.src = this.buffer.image.src;
                this.currentFigure.matrix = figures[this.currentFigure.id].matrix;
                this.currentFigure.x = this.getStartX(this.currentFigure, 1) - 5;
                this.currentFigure.y = 0;
                this.isBufferActive = false;
            }
            if (this.isActive && e.code === 'ShiftRight' && this.isBufferActive) {
                this.clearFigure(this.currentFigure2);
                //this.clearShadow(this.currentFigure2);
                let figure = this.currentFigure2;
                this.currentFigure2 = this.buffer;
                this.buffer = figure;
                this.ui.buffer.src = this.buffer.image.src;
                this.currentFigure2.matrix = figures[this.currentFigure2.id].matrix;
                this.currentFigure2.x = this.getStartX(this.currentFigure2, 2) + 5;
                this.currentFigure2.y = 0;
                this.isBufferActive = false;
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
        this.drawOtherField(this.field[0].length, this.field.length);
        field.fillStyle = "white";
        field.font = "96px Russo One";
        field.fillText(player.num, this.ui.field.width / 2 - 36, this.ui.field.height / 2);
    }
}

