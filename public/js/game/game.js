let GAME = {
    width: localStorage.Gamewidth,
    height: localStorage.Gameheight,
    playTime: new Date(),
    init(player, ui){
        let i = 0;
        figures.forEach((figure) => {
            figure.image.src = `/images/figures/${images[i]}.png`;
            figure.block.src = `/images/blocks/${images[i]}.png`;
            figure.shadow.src = `/images/shadow/${images[i]}.png`;
            i++
        });
        blockField.src = '/images/blocks/bg.png';
        player.field.initField()
        player.tickTime = 15974 / this.height;
        player.initEventListeners();
        player.initFigures();
        player.updateSpeed()
    },
    onLoadImages(func) {
        let counter = 0;
        figures.forEach((figure) => {
            figure.image.addEventListener('load', () => {
                counter++;
                if (counter === figures.length * 3 + 1) {
                    func()
                }
            })
            figure.block.addEventListener('load', () => {
                counter++;
                if (counter === figures.length * 3 + 1) {
                    func()
                }
            })
            figure.shadow.addEventListener('load', () => {
                counter++;
                if (counter === figures.length * 3 + 1) {
                    func()
                }
            })
        }
        );
        blockField.addEventListener('load', () => {
            counter++;
            if (counter === figures.length * 3 + 1) {
                func()
            }
        })
    },
    start(player, field, ui){
        this.onLoadImages(()=>{this.play(player, field, ui)})
    },
    play(player, func = () => {}) {
        player.ui.score = player.score;
        player.ui.level = player.lvl;
        if (player.isActive) {
            this.clear(field);
            player.field.drawField(field, 34)
            // player.drawField(this.width, this.height);
            if (localStorage.mode === 'm') player.drawOtherField(this.width, this.height, otherPlayersFields)
            document.querySelector('.game__score').innerHTML = player.score;
            let updateTime = new Date();
            updateTime -= this.playTime;
            if (updateTime * player.nitro >= player.tickTime) {
                this.playTime = new Date;
                player.update();
            }
            player.field.updateHorizontalPosition(player.currentFigure, player.move)
            requestAnimationFrame(() => this.play(player, func));
        }
    },
    clear(ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

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

let matrix = [];
let arrayField = new Field(matrix, 10, 20)
let player = new Player(ui, arrayField);
const canvas = document.getElementById('game');
const field = canvas.getContext('2d');
canvas.width = ui.field.width;
canvas.height = ui.field.height;
field.fillStyle = 'black';
field.fillRect(0, 0, ui.field.width, ui.field.height);
GAME.init(player, ui)
GAME.start(player, field, ui)
