document.addEventListener("DOMContentLoaded", (event) => {
const canvas = document.getElementById('game');
const field = canvas.getContext('2d');
let nextFifures = document.querySelectorAll(".figure");
const box = 34;
const size = 3;
canvas.width = 340;
canvas.height = 680;
let playField = [];
const figures = [
    {
        matrix:
        [
            [0, 0, 1],
            [0, 0, 1],
            [0, 1, 1]
        ],
        imageSrc: '/images/blocks/blue.png',
        detail: '/images/blocks/blueD.png' 
    },
    {
        matrix:
        [
            [1, 1, 1],
            [0, 1, 0],
            [0, 0, 0]
        ],
        imageSrc: '/images/blocks/pink.png',
        detail: '/images/blocks/pinkD.png'
    },
    {
        matrix:
        [
            [0, 1, 1],
            [0, 1, 1],
            [0, 0, 0]
        ],
        imageSrc: '/images/blocks/yellow.png',
        detail: '/images/blocks/yellowD.png' 
    },
    {
        matrix:
        [
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 1]
        ],
        imageSrc: '/images/blocks/orange.png',
        detail: '/images/blocks/orangeD.png' 
    },
    {
        matrix:
        [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0]
        ],
        imageSrc: '/images/blocks/red.png',
        detail: '/images/blocks/redD.png'
    },
    {
        matrix:
        [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0]
        ],
        imageSrc: '/images/blocks/green.png',
        detail: '/images/blocks/greenD.png' 
    } 
];

start();


function start(){
    for (let line = 0; line < 20; line++)
        {
            playField[line] = [];
            for (let column = 0; column < 10; column++)
                {
                    playField[line][column] = 0;            
                }
        }
    loop()  

}

function getRandomMatrix(matrices) {
    const randomIndex = Math.floor(Math.random() * matrices.length);
    return matrices[randomIndex];
}

function loop(){

    console.log('hello');
    field.clearRect(0,0,canvas.width,canvas.height);


    
    for (let row = 0; row < 20; row++) {
        for (let col = 0; col < 10; col++) {
          if (playField[row][col] ) {
            const name = playField[row][col];
            field.fillStyle = colors[name];
            field.drawImage(image, column * box, line * box, box, box);
          }
        }
      }
      let figure = getRandomMatrix(figures); 
      let image = new Image();
      image.src = figure.imageSrc;

      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            playField[i][3 + j] = figure.matrix[i][j];
        }
    }

    image.onload = function() {
        for (let line = 0; line < 20; line++) {
            for (let column = 0; column < 10; column++) {
                if (playField[line][column] === 1) {
                    // Рисуем изображение на канвасе в ячейках с единицами
                    
                }
            }
        }
    };
    requestAnimationFrame(loop);
}

});


