document.addEventListener("DOMContentLoaded", (event) => {
    const canvas = document.getElementById('game');
    const field = canvas.getContext('2d');
    let nextFifures = document.querySelectorAll(".figure");
    let buffer = document.querySelector(".buffer__figure");
    const BOX = 34;
    const BOARD_WIDTH = 10;
    const BOARD_HEIGHT = 20;
    let score = 0;
    let tiktime = 36;
    let nitro = 1;
    let playTime = 0;
    let moveFlag = '';
    canvas.width = 340;
    canvas.height = 680;
    let playField = [];
    const linkBlock = ['/images/blocks/blue.png', '/images/blocks/pink.png', '/images/blocks/yellow.png', '/images/blocks/orange.png', '/images/blocks/red.png', '/images/blocks/green.png', '/images/blocks/mint.png'];
    const linkImage = ['/images/blocks/blueD.png', '/images/blocks/pinkD.png', '/images/blocks/yellowD.png', '/images/blocks/orangeD.png', '/images/blocks/redD.png', '/images/blocks/greenD.png', '/images/blocks/mintD.png']
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
            x: 3,
            y: 0
        },
        {
            matrix:
                [
                    [2, 2, 2],
                    [0, 2, 0],
                    [0, 0, 0],
                ],
            image: new Image(),
            block: new Image(),
            x: 3,
            y: 0
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
            x: 3,
            y: 0
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
            x: 3,
            y: 0
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
            x: 3,
            y: 0
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
            x: 3,
            y: 0
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
            x: 3,
            y: 0
        },
    ];
    let nextFigures = [];
    let figure = getRandomFigure(figures);

    function startGame() {
        let counter = 0;
        figures.forEach((figure) => {
            figure.image.addEventListener('load', (e) => {
                counter++;
                if (counter === figures.length * 2) {
                    game()
                }
            })
            figure.block.addEventListener('load', (e) => {
                counter++;
                if (counter === figures.length * 2) {
                    game()
                }
            })
        }
        )
    }

    function init() {
        let i = 0;
        figures.forEach((figure) => {
            figure.image.src = linkImage[i];
            figure.block.src = linkBlock[i];
            i++
        });
        for (let line = -1; line <= BOARD_HEIGHT; line++) {
            playField[line] = [];
            for (let column = -1; column <= BOARD_WIDTH; column++) {
                if (line === -1 || line === BOARD_HEIGHT || column === -1 || column === BOARD_WIDTH) {
                    playField[line][column] = 100;
                } else {
                    playField[line][column] = 0;
                }
            }
        }


        startGame()
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

    function getRandomFigure(figures) {
        const randomIndex = Math.floor(Math.random() * figures.length);
        return figures[randomIndex];
    }

    function clearFigure(figure) {
        for (let i = 0; i < figure.matrix[0].length; i++) {
            for (let j = 0; j < figure.matrix[0].length; j++) {
                if (figure.matrix[i][j])
                    playField[i + figure.y][j + figure.x] = 0;
            }
        }
    }

    function checkPosition(x, y, matrix) {
        for (let i = 0; i < matrix[0].length; i++) {
            for (let j = 0; j < matrix[0].length; j++) {
                if (matrix[i][j]) {
                    if (Math.floor(playField[y + i][x + j] / 10) !== 0) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    function clearRow() {
        let cleared = 0;
        for (let row = 19; row > 0; row--) {
            if (playField[row].every(element => element > 6)) {
                cleared++;
                for (let j = 0; j < 10; j++) {
                    for (let i = row; i > 0; i--) {
                        playField[i][j] = playField[i - 1][j];
                    }
                }
            }
        }
    
        switch (cleared) {
            case 1:
                score += 100;
                console.log(score)
                break;
            case 2:
                score += 300;
                console.log(score)
                break;
            case 3:
                score += 700;
                console.log(score)
                break;
            case 4:
                score += 1000;
                console.log(score)
                break;
            default:
                break;
        }
        return cleared;
    }



    document.addEventListener('keydown', (e) => {
        if (e.code == 'ArrowLeft') {
            if (checkPosition(figure.x - 1, figure.y, figure.matrix))
                moveFlag = 'left';
        };
        if (e.code == 'ArrowRight') {
            if (checkPosition(figure.x + 1, figure.y, figure.matrix))
                moveFlag = 'right';
        };
        if (e.code == 'ArrowDown') {
            nitro = 4;
        };
        if (e.code == 'Space') {
            moveFlag = 'set';
        }
        if (e.key === 'ArrowUp') {
            let rotated = rotateMatrix(figure.matrix);
            if (checkPosition(figure.x, figure.y, rotated)) {

                clearFigure(figure);
                figure.matrix = rotated
            }
        }
    })

    document.addEventListener('keyup', (e) => {
        if (e.code == 'ArrowDown') {
            nitro = 1;
        };
    })

    document.addEventListener('keyup', (e) => {
        if (e.code == 'ShiftLeft') {
            clearFigure(figure);
            det = figure;
            figure = buffon;
            buffon = det;
            buffer.src = buffon.image.src;
            figure.x = 3;
            figure.y = 0;
            buffon.x = 3;
            buffon.y = 0;
            
        };
    })


    init();

    for (let i = 0; i < 4; i++) {
        let det = getRandomFigure(figures);
        nextFigures[i] = det;
    }
    for (let i = 0; i < 4; i++) {
        nextFifures[i].src = nextFigures[i].image.src;
    }

    buffon = getRandomFigure(figures);
    buffer.src = buffon.image.src;

    function game() {
        field.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < figure.matrix[0].length; i++) {
            for (let j = 0; j < figure.matrix[0].length; j++) {
                if (figure.matrix[i][j])
                    playField[i + figure.y][j + figure.x] = figure.matrix[i][j];
            }
        }

        for (let row = 0; row < BOARD_HEIGHT; row++) {
            for (let col = 0; col < BOARD_WIDTH; col++) {
                if (playField[row][col]) {
                    field.drawImage(figures[(playField[row][col] - 1) % 10].block, col * BOX, row * BOX, BOX, BOX)
                }
            }
        }
        if (playTime * nitro >= tiktime) {
            playTime = 0;
            if (checkPosition(figure.x, figure.y + 1, figure.matrix))
                moveFlag = 'down'
            else {
                for (let i = 0; i < figure.matrix[0].length; i++) {
                    for (let j = 0; j < figure.matrix[0].length; j++) {
                        if (figure.matrix[i][j])
                            playField[i + figure.y][j + figure.x] = figure.matrix[i][j] + 10;
                    }
                }
                figure = nextFigures[0];

                for (let i = 0; i < 3; i++) {
                    nextFigures[i] = nextFigures[i + 1];
                }

                nextFigures[3] = getRandomFigure(figures);

                for (let i = 0; i < 4; i++) {
                    nextFifures[i].src = nextFigures[i].image.src;
                }

                if (checkPosition(3, 0, figure.matrix)) {
                    figure.x = 3;
                    figure.y = 0;
                } else {
                    window.location.href = "/game_over";
                }
            }
        }
        // if (figure.x === 0 && figure.y === 15) {
        //     window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
        //     return;
        // }
        if (moveFlag !== '') {
            clearFigure(figure);
            switch (moveFlag) {
                case 'down':
                    figure.y++
                    break;
                case 'left':
                    figure.x--
                    break;
                case 'right':
                    figure.x++
                    break;
                case 'set':
                    let i = 1;
                    for (; checkPosition(figure.x, figure.y + i, figure.matrix); i++);
                    figure.y += i - 1;
            }
            moveFlag = '';
        }
        playTime++;
        clearRow();
        requestAnimationFrame(game);
    }

});