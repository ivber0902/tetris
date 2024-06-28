let figures = [
    {
        matrix:
            [
                [0, 0, 1],
                [0, 0, 1],
                [0, 1, 1]
            ],
        image: new Image(),
        block: new Image(),
        shadow: new Image(),
    },
    {
        matrix:
            [
                [0, 0, 0],
                [2, 2, 2],
                [0, 2, 0],
            ],
        image: new Image(),
        block: new Image(),
        shadow: new Image(),
    },
    {
        matrix:
            [
                [0, 3, 3],
                [0, 3, 3],
                [0, 0, 0]
            ],
        image: new Image(),
        block: new Image(),
        shadow: new Image(),
    },
    {
        matrix:
            [
                [0, 4, 0],
                [0, 4, 0],
                [0, 4, 4]
            ],
        image: new Image(),
        block: new Image(),
        shadow: new Image(),
    },
    {
        matrix:
            [
                [5, 5, 0],
                [0, 5, 5],
                [0, 0, 0]
            ],
        image: new Image(),
        block: new Image(),
        shadow: new Image(),
    },
    {
        matrix:
            [
                [0, 6, 6],
                [6, 6, 0],
                [0, 0, 0]
            ],
        image: new Image(),
        block: new Image(),
        shadow: new Image(),
    },
    {
        matrix:
            [
                [0, 7, 0, 0],
                [0, 7, 0, 0],
                [0, 7, 0, 0],
                [0, 7, 0, 0],
            ],
        image: new Image(),
        block: new Image(),
        shadow: new Image(),
    },
];

class Figure {
    constructor(
        matrix,
        image = new Image(),
        block = new Image(),
        shadow = new Image(),
    ) {
        this.matrix = matrix.map(row => row.slice());
        this.image = image;
        this.block = block;
        this.shadow = shadow;
        this.x = 0;
        this.y = 0;
    }
}