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
    insertFigure(figure, playerIndex) {
        for (let h = 0; h < figure.matrix.length; h++) {
            for (let w = 0; w < figure.matrix[0].length; w++) {
                if (figure.matrix[h][w])
                    this.matrix[h + figure.y][w + figure.x] = figure.matrix[h][w] + playerIndex * 100;
            }
        }
    }
    fixFigure(figure, playerIndex) {
        this.clearShadow(figure, playerIndex);
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

    moveDown(figure, playerIndex) {
        if (this.checkPosition(figure.x, figure.y + 1, figure.matrix, playerIndex)) {
            this.clearShadow(figure, playerIndex);
            this.clearFigure(figure);
            figure.y++;
            this.insertFigure(figure, playerIndex);
            this.createShadow(figure, playerIndex);
            return true;
        }
        return false;
    }

    updateHorizontalPosition(figure, isPlayerMove, playerIndex) {
        if (this.checkPosition(figure.x + isPlayerMove.right - isPlayerMove.left, figure.y, figure.matrix, playerIndex)) {
            this.clearShadow(figure, playerIndex);
            this.clearFigure(figure);
            figure.x += isPlayerMove.right - isPlayerMove.left;
            this.insertFigure(figure, playerIndex);
            this.createShadow(figure, playerIndex);
        }
        isPlayerMove.left = isPlayerMove.right = 0;
    }

    dropFigure(figure, playerIndex) {
        let pos = this.getBottomPosition(figure, playerIndex);
        figure.x = pos.x;
        figure.y = pos.y;
    }
    drawField(field, matrix) {
        for (let h = 0; h < this.height; h++) {
            for (let w = 0; w < this.width; w++) {
                let drawingImage
                if (matrix[h][w] - 1 >= 20 && matrix[h][w] - 1 < 100)
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
            if (this.matrix[h].every(element => element > 10 && element < 100)) {
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

    checkPosition(x, y, insertedMatrix, playerIndex) {
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
                    if (10 < color && color <= 20 || ((30 < color) && (color < 100)) || ((color > 100) && (Math.floor(color / 100) !== playerIndex))) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    createShadow(figure, playerIndex) {
        let pos = this.getBottomPosition(figure, playerIndex);
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

    clearShadow(figure, playerIndex) {
        this.clearFigure({ matrix: figure.matrix, ...this.getBottomPosition(figure, playerIndex) });
    }
    drawNumber(num) {
        this.clearField();
        this.drawField();
        field.fillStyle = "white";
        field.font = "96px Russo One";
        field.fillText(num, this.width * this.blockSize / 2 - 36, this.height * this.blockSize / 2);
    }
    getBottomPosition(figure, playerIndex) {
        let i = 1;
        for (; this.checkPosition(figure.x, figure.y + i, figure.matrix, playerIndex);) i++;
        return { x: figure.x, y: figure.y + i - 1 }
    }
    rotateFigure(figure, playerIndex) {
        let rotated = [];
        if(figure.currentPosition < 3){
            rotated = figure.matrixPositions[figure.currentPosition + 1];
            figure.currentPosition += 1;
        }else{
            rotated = figure.matrixPositions[0]
            figure.currentPosition = 0
        }
        if (this.checkPosition(figure.x, figure.y, rotated, playerIndex)) {
            this.clearFigure(figure);
            this.clearShadow(figure, playerIndex);
            figure.matrix = rotated;
            this.insertFigure(figure, playerIndex);
            this.createShadow(figure, playerIndex);
        }
    }
}