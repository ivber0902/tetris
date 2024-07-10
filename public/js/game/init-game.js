const ui = new UI(
    34,
    document.querySelector(".buffer__figure"),
    document.querySelectorAll(".figure"),
    GAME,
    document.querySelector(".game__score"),
    document.querySelector(".game__level"),
    document.querySelector(".game__time"),
    document.querySelector(".game__lines"),
);

let player = new Player(ui, GAME.figuresQueueSize);
const canvas = document.getElementById('game');
const field = canvas.getContext('2d');


let otherField = document.querySelectorAll('.other-field')

canvas.width = ui.field.width;
canvas.height = ui.field.height;
field.fillStyle = 'black';
field.fillRect(0, 0, ui.field.width, ui.field.height);
otherField.forEach((elem) => {
    elem.width = ui.field.width;
    elem.height = ui.field.height;
    switch (ui.field.width / ui.blockSize) {
        case 7:
            elem.style.maxHeight = "480px";
            document.querySelector('.palyers-list').style.paddingRight = '100px'
            break
        case 10:
            elem.style.maxHeight = "400px";
            break
        case 15:
            elem.style.maxHeight = "320px";
            break
    }
})

GAME.init(player, ui)
GAME.start(player, field, ui)
