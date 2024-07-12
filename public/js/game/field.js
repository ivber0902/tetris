class Field {
    constructor(matrix, width, height) {
        this.matrix = matrix;
        this.height = height;
        this.width = width;
    }

    initField() {
        for (let h = 0; h < this.height; h++) {
            this.matrix[h] = [];
            for (let w = 0; w < this.width; w++) {
                this.matrix[h][w] = 0;
            }
        }
    }

    insertFigure(figure) {
        for (let h = 0; h < figure.matrix.length; h++) {
            for (let w = 0; w < figure.matrix[0].length; w++) {
                if (figure.matrix[h][w])
                    this.matrix[h + figure.y][w + figure.x] = figure.matrix[h][w];
            }
        }
    }

    getStartX(figure) {
        return Math.floor((this.width - Math.max(...figure.matrix.map(row => row.length))) / 2);
    }

    updateVerticalPosition(figure) {
        this.clearFigure(figure);
        figure.y++;
        this.insertFigure(figure);
    }

    updateHorizontalPosition(figure, isPlayerMove) {
        this.clearShadow(figure);
        this.changeHorizontalPosition(figure, isPlayerMove);
        if (isPlayerMove.drop) {
            this.dropFigure(figure);
            isPlayerMove.drop = 0;
            //this.update();
        }
        this.insertFigure(figure);
        this.createShadow(figure);
    }

    changeHorizontalPosition(figure, isPlayerMove) {
        if (this.checkPosition(figure.x + isPlayerMove.right - isPlayerMove.left, figure.y, figure.matrix)) {
            this.clearFigure(figure);
            figure.x += isPlayerMove.right - isPlayerMove.left;
            isPlayerMove.left = isPlayerMove.right = 0;
        }
    }

    dropFigure(figure) {
        let pos = this.getBottomPosition(figure);
        figure.x = pos.x;
        figure.y = pos.y;
    }

    drawField(ctx, blockSize) {
        for (let h = 0; h < this.height; h++) {
            for (let w = 0; w < this.width; w++) {
                let drawingImage
                if (this.matrix[h][w] - 1 >= 20)
                    drawingImage = figures[(this.matrix[h][w] - 1) % 10].shadow
                else
                    if (this.matrix[h][w] === 0)
                        drawingImage = blockField;
                    else
                      drawingImage = figures[(this.matrix[h][w] - 1) % 10].block;
                ctx.drawImage(
                    drawingImage,
                    w * blockSize,
                    h * blockSize,
                    blockSize, blockSize
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
                if (insertedMatrix[h][w]) {
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
    stateFigure(fix = false, figure){
        for (let i = 0; i < figure.matrix.length; i++) {
            for (let j = 0; j < figure.matrix[i].length; j++) {
                if (figure.matrix[i][j])
                    this.matrix[i + figure.y][j + figure.x] = figure.matrix[i][j] + (fix ? 10 : 0);
            }
        }
    }
}