class Field {
    constructor(matrix, width, height) {
        this.matrix = matrix;
        this.height = height;
        this.width = width;
        this.field = null;
        this.blockSize = 34;
    }
    initField() {
        const canvas = document.getElementById('game');
        this.field = canvas.getContext('2d');
        canvas.width = this.width * this.blockSize;
        canvas.height = this.height * this.blockSize;
        this.field.fillStyle = 'black';
        this.field.fillRect(0, 0, this.width * this.blockSize, this.height * this.blockSize);
    }

    initFieldMatrix() {
        for (let h = 0; h < this.height; h++) {
            this.matrix[h] = [];
            for (let w = 0; w < this.width; w++) {
                this.matrix[h][w] = 0;
            }
        }
    }


    clearField() {
        this.field.clearRect(0, 0, this.width * this.blockSize, this.height * this.blockSize);
    }
    insertFigure(figure) {
        for (let h = 0; h < figure.matrix.length; h++) {
            for (let w = 0; w < figure.matrix[0].length; w++) {
                if (figure.matrix[h][w])
                    this.matrix[h + figure.y][w + figure.x] = figure.matrix[h][w];
            }
        }
    }
    fixFigure(figure) {
        this.clearShadow(figure);
        this.clearFigure(figure);
        for (let h = 0; h < figure.matrix.length; h++) {
            for (let w = 0; w < figure.matrix[0].length; w++) {
                if (figure.matrix[h][w])
                    this.matrix[h + figure.y][w + figure.x] = figure.matrix[h][w] + 10;
            }
        }

    }

    getStartX(figure) {
        return Math.floor((this.width - Math.max(...figure.matrix.map(row => row.length))) / 2);
    }

    moveDown(figure) {
        if (this.checkPosition(figure.x, figure.y + 1, figure.matrix)) {
            this.clearShadow(figure);
            this.clearFigure(figure);
            figure.y++;
            this.insertFigure(figure);
            this.createShadow(figure);
            return true;
        }
        return false;
    }

    updateHorizontalPosition(figure, isPlayerMove) {
        if (this.checkPosition(figure.x + isPlayerMove.right - isPlayerMove.left, figure.y, figure.matrix)) {
            this.clearShadow(figure);
            this.clearFigure(figure);
            figure.x += isPlayerMove.right - isPlayerMove.left;
            this.insertFigure(figure);
            this.createShadow(figure);
        }
        isPlayerMove.left = isPlayerMove.right = 0;
    }

    dropFigure(figure) {
        let pos = this.getBottomPosition(figure);
        figure.x = pos.x;
        figure.y = pos.y;
    }
    drawField(field, matrix) {
        for (let h = 0; h < this.height; h++) {
            for (let w = 0; w < this.width; w++) {
                let drawingImage
                if (matrix[h][w] - 1 >= 20)
                    drawingImage = figures[(matrix[h][w] - 1) % 10].shadow
                else
                    if (matrix[h][w] === 0)
                        drawingImage = blockField;
                    else
                        drawingImage = figures[(matrix[h][w] - 1) % 10].block;
                field.drawImage(
                    drawingImage,
                    w * this.blockSize,
                    h * this.blockSize,
                    this.blockSize, this.blockSize
                )
            }
        }
    }

    clearFigure(figure) {
        for (let h = 0; h < figure.matrix.length; h++) {
            for (let w = 0; w < figure.matrix[0].length; w++) {
                if (figure.matrix[h][w])
                    this.matrix[h + figure.y][w + figure.x] = 0;
            }
        }
    }

    clearRow() {
        let cleared = 0;
        for (let h = this.height - 1; h > 0; h--) {
            if (this.matrix[h].every(element => element > 10)) {
                cleared++;
                for (let w = 0; w < this.width; w++) {
                    for (let i = h; i > 0; i--) {
                        this.matrix[i][w] = this.matrix[i - 1][w];
                    }
                }
                h++;
            }
        }
        return cleared;
    }

    checkPosition(x, y, insertedMatrix) {
        for (let h = 0; h < insertedMatrix.length; h++) {
            for (let w = 0; w < insertedMatrix[0].length; w++) {
                if (insertedMatrix[h][w] > 0) {
                    if (
                        y + h >= this.height
                        || x + w >= this.width
                        || y + h < 0
                        || x + w < 0
                    ) return false;
                    let color = this.matrix[y + h][x + w];
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
        for (let h = 0; h < figure.matrix.length; h++) {
            for (let w = 0; w < figure.matrix[h].length; w++) {
                if (
                    pos.y + h < this.height
                    && this.matrix[pos.y + h][pos.x + w] === 0
                    && figure.matrix[h][w] !== 0
                ) this.matrix[pos.y + h][pos.x + w] = figure.matrix[h][w] + 20;
            }
        }
    }

    clearShadow(figure) {
        this.clearFigure({ matrix: figure.matrix, ...this.getBottomPosition(figure) });
    }
    drawNumber(num) {
        this.clearField();
        this.drawField();
        field.fillStyle = "white";
        field.font = "96px Russo One";
        field.fillText(num, this.width * this.blockSize / 2 - 36, this.height * this.blockSize / 2);
    }
    getBottomPosition(figure) {
        let i = 1;
        for (; this.checkPosition(figure.x, figure.y + i, figure.matrix);) i++;
        return { x: figure.x, y: figure.y + i - 1 }
    }
    rotateFigure(figure) {
        let rotated = rotateMatrix(figure.matrix);
        if (this.checkPosition(figure.x, figure.y, rotated)) {
            this.clearFigure(figure);
            this.clearShadow(figure);
            figure.matrix = rotated;
            this.insertFigure(figure);
            this.createShadow(figure);
        }
    }
    stateFigure(fix = false, figure) {
        for (let i = 0; i < figure.matrix.length; i++) {
            for (let j = 0; j < figure.matrix[i].length; j++) {
                if (figure.matrix[i][j])
                    this.matrix[i + figure.y][j + figure.x] = figure.matrix[i][j] + (fix ? 10 : 0);
            }
        }
    }
}
