let BOSS = [
    [1, 0, 0, 1, 0, 0, 1],
    [1, 1, 0, 1, 0, 1, 1],
    [0, 1, 0, 1, 0, 1, 0],
    [0, 1, 1, 1, 1, 1, 0],
    [1, 1, 0, 1, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 1, 1],
]

let figures = [
    {
        matrix:
            [
                [1, 0, 0],
                [1, 1, 1],
            ],
        matrixPositions:
            [
                [
                    [1, 0, 0],
                    [1, 1, 1],
                ],
                [
                    [1, 1],
                    [1, 0],
                    [1, 0],
                ],
                [
                    [1, 1, 1],
                    [0, 0, 1],
                ],
                [
                    [0, 1],
                    [0, 1],
                    [1, 1],
                ],

            ],
        image: new Image(),
        block: new Image(),
        shadow: new Image(),
    },
    {
        matrix:
            [
                [0, 2, 0],
                [2, 2, 2],
            ],
        matrixPositions:
            [
                [
                    [0, 2, 0],
                    [2, 2, 2],
                ],
                [
                    [2, 0],
                    [2, 2],
                    [2, 0],
                ],
                [
                    [2, 2, 2],
                    [0, 2, 0],
                ],
                [
                    [0, 2],
                    [2, 2],
                    [0, 2],
                ],

            ],
        image: new Image(),
        block: new Image(),
        shadow: new Image(),
    },
];

let blockField = new Image()

