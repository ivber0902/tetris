class Figure {
    constructor(
        matrix,
        image = new Image(),
        block = new Image(),
        shadow = new Image(),
        id = 0,
    ) {
        this.matrix = matrix.map(row => row.slice());
        this.image = image;
        this.block = block;
        this.shadow = shadow;
        this.x = 0;
        this.y = 0;
        this.id = id
    }
    setX(x) {
        this.x = x;
    }
    setY(y) {
        this.y = y;
    }
}
function getFigure(index) {
    let figure = figures[index];
    return new Figure(
        figure.matrix,
        figure.image,
        figure.block,
        figure.shadow,
        index
    );
}
function rotateMatrix(matrix) {
    let rotated = [];

    for (let i = 0; i < matrix.length; i++) {
        rotated[i] = [];
        for (let j = 0; j < matrix.length; j++) {
            rotated[i][j] = matrix[matrix.length - 1 - j][i];
        }
    }
    return rotated;
}