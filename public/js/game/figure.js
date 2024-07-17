class Figure {
    constructor(
        matrix,
        matrixPositions,
        image = new Image(),
        block = new Image(),
        shadow = new Image(),
        id = 0,
    ) {
        this.matrix = matrix.map(row => row.slice());
        this.matrixPositions = matrixPositions;
        this.image = image;
        this.block = block;
        this.shadow = shadow;
        this.x = 0;
        this.y = 0;
        this.id = id;
        this.currentPosition = 0;
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
        figure.matrixPositions,
        figure.image,
        figure.block,
        figure.shadow,
        index
    );
}