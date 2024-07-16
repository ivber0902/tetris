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
function rotateMatrix(matrix, matrixPositions, currentPosition) {
    // let rotated = [];
    // if(currentPosition < 3){
    //     rotated = matrixPositions[currentPosition + 1];
    //     currentPosition += 1;
    // }else{
    //     rotated = matrixPositions[0]
    //     currentPosition = 0
    // }
    // matrixPositions.forEach(elem =>{
    //     console.log(elem, matrix)
    // })
    // console.log(matrixPositions.indexOf(matrix), matrixPositions, matrix)
    // for (let i = 0; i < matrix.length; i++) {
    //     rotated[i] = [];
    //     for (let j = 0; j < matrix.length; j++) {
    //         rotated[i][j] = matrix[matrix.length - 1 - j][i];
    //     }
    // }

    return matrix;
}