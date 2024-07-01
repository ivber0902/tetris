class Player {
    constructor(interface_, figuresQueueSize) {
        this.score = 0;
        this.field = [];
        this.nitro = 1;
        this.move = {
            down: 1,
            left: 0,
            right: 0,
            set: 0,
        }
        this.currentFigure = null;
        this.nextFigures = null;
        this.buffer = null;
        this.interface = interface_;
        this.figuresQueueSize = figuresQueueSize;
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
        this.currentFigure.x = this.getStartX();
        this.buffer = this.getRandomFigure(figures);
        this.interface.buffer.src = this.buffer.image.src;
        this.nextFigures = [];
        for (let i = 0; i < this.figuresQueueSize; i++) {
            this.nextFigures[i] = this.getRandomFigure(figures);
        }
    }

    insertToField(fix= false) {
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

        this.updateInterface();
    }

    update() {
        this.clearShadow(this.currentFigure);
        this.moveDown();
        if (!this.checkPosition(this.currentFigure.x, this.currentFigure.y + 1, this.currentFigure.matrix)) {
            this.insertToField(true);
            this.nextFigure();
            let startX = this.getStartX();
            if (this.checkPosition(startX, 0, this.currentFigure.matrix)) {
                this.currentFigure.x = startX;
                this.currentFigure.y = 0;
            } else {
                this.isActive = false;
                gameEnd(this.score);
                return;
            }
        }
        this.clearRow();
    }

    getStartX() {
        return 3
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
        this.updateVerticalPosition();
        this.insertToField();
    }

    updateHorizontalPosition() {
        if (this.checkPosition(this.currentFigure.x + this.move.right - this.move.left, this.currentFigure.y, this.currentFigure.matrix)) {
            this.clearFigure(this.currentFigure);
            this.currentFigure.x += this.move.right - this.move.left;
            this.move.left = this.move.right = 0;
        }
    }

    updateVerticalPosition() {
        if (this.move.set) {
            let pos = this.getBottomPosition(this.currentFigure);
            this.currentFigure.x = pos.x;
            this.currentFigure.y = pos.y;
            this.move.set = 0;
            this.update();
        }
    }

    updateInterface() {
        for (let i = 0; i < this.figuresQueueSize; i++) {
            this.interface.viewNextFigures[i].src = this.nextFigures[i].image.src;
        }
    }

    drawField(width, height) {
        for (let row = 0; row < height; row++) {
            for (let col = 0; col < width; col++) {
                if (this.field[row][col]) {
                    if (this.field[row][col] - 1 >= 20)
                        field.drawImage(
                            figures[(this.field[row][col] - 1) % 10].shadow,
                            col * this.interface.blockSize,
                            row * this.interface.blockSize,
                            this.interface.blockSize, this.interface.blockSize
                        );
                    else
                        field.drawImage(
                            figures[(this.field[row][col] - 1) % 10].block,
                            col * this.interface.blockSize,
                            row * this.interface.blockSize,
                            this.interface.blockSize,
                            this.interface.blockSize
                        );
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
        for (let row = 19; row > 0; row--) {
            if (this.field[row].every(element => element > 10)) {
                cleared++;
                for (let j = 0; j < 10; j++) {
                    for (let i = row; i > 0; i--) {
                        this.field[i][j] = this.field[i - 1][j];
                    }
                }
                row++;
            }
        }
        switch (cleared) {
            case 1:
                this.score += 100;
                break;
            case 2:
                this.score += 300;
                break;
            case 3:
                this.score += 700;
                break;
            case 4:
                this.score += 1000;
                break;
            default:
                break;
        }
        return cleared;
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
        this.clearFigure({matrix: figure.matrix, ...this.getBottomPosition(figure)});
    }

    getBottomPosition(figure) {
        let i = 1;
        for (; this.checkPosition(figure.x, figure.y + i, figure.matrix);) i++;
        return { x: figure.x, y: figure.y + i - 1 }
    }

    initEventListeners() {
        this.addBufferListener();
        this.addPositionListeners();
    }

    addPositionListeners() {
        document.addEventListener('keydown', (e) => {
            switch (e.code) {
                case 'ArrowLeft', 'KeyA':
                    this.move.left = this.checkPosition(this.currentFigure.x - 1, this.currentFigure.y, this.currentFigure.matrix) ? 1 : 0;
                    break;
                case 'ArrowRight', 'KeyD':
                    this.move.right = this.checkPosition(this.currentFigure.x + 1, this.currentFigure.y, this.currentFigure.matrix) ? 1 : 0;
                    break;
                case 'Space':
                    this.move.set = 1;
                    break;
                case 'ArrowDown', 'KeyS':
                    this.nitro = 4;
                    break;
                case 'ArrowUp', 'KeyW':
                    let rotated = this.rotateFigure(this.currentFigure.matrix);

                    if (this.checkPosition(this.currentFigure.x, this.currentFigure.y, rotated)) {
                        this.clearFigure(this.currentFigure);
                        this.clearShadow(this.currentFigure);
                        this.currentFigure.matrix = rotated;
                    }
                    break;
            }
        });
        document.addEventListener('keyup', (e) => {
            if (e.code === 'ArrowDown' || e.code === 'KeyS') {
                this.nitro = 1;
            }
        });
    }

    addBufferListener() {
        document.addEventListener('keyup', (e) => {
            if (e.code === 'ShiftLeft') {
                this.clearFigure(this.currentFigure);
                this.clearShadow(this.currentFigure);
                let figure = this.currentFigure;
                this.currentFigure = this.buffer;
                this.buffer = figure;
                this.interface.buffer.src = this.buffer.image.src;
                this.currentFigure.matrix = figures[this.currentFigure.id].matrix;
                this.currentFigure.x = this.getStartX();
                this.currentFigure.y = 0;
            }
        });
    }
}

class Interface {
    constructor(blockSize, buffer, viewNextFigures, game) {
        this.blockSize = blockSize;
        this.buffer = buffer;
        this.viewNextFigures = viewNextFigures;
        this.field = {
            width: game.width*this.blockSize,
            height: game.height*this.blockSize,
        }
    }
}
