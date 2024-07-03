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
canvas.width = INTERFACE.field.width;
canvas.height = INTERFACE.field.height;

GAME.init()