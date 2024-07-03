let music = new Audio("/audio/Korobeiniki.wav");
music.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);

const INTERFACE = new Interface(
    34,
    document.querySelector(".buffer__figure"),
    document.querySelectorAll(".figure"),
    GAME,
    document.querySelector(".game__score"),
    document.querySelector(".game__level"),
);

let player = new Player(INTERFACE, GAME.figuresQueueSize);
const canvas = document.getElementById('game');
const field = canvas.getContext('2d');
let otherField = document.querySelectorAll('.other-field')

canvas.width = INTERFACE.field.width;
canvas.height = INTERFACE.field.height;

otherField.forEach((elem)=>{
    elem.width = INTERFACE.field.width;
    elem.height = INTERFACE.field.height;
    switch(INTERFACE.field.width / INTERFACE.blockSize){
        case 7:
            elem.style.maxHeight = "480px";
            document.querySelector('.palyers-list'). style.paddingRight = '100px'
            break
        case 10:
            elem.style.maxHeight = "400px";
            break
        case 15:
            elem.style.maxHeight = "320px";
            break
    }
})

GAME.init()
GAME.start()
