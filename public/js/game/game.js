let GAME = {
    width: parseInt(localStorage.Gamewidth),
    height: parseInt(localStorage.Gameheight),
    playTime: new Date(),
    init(player, currentFigureIndex, bufferFigureIndex, NextFiguresIndex) {
        let i = 0;
        figures.forEach((figure) => {
            figure.image.src = `/images/figures/${images[i]}.png`;
            figure.block.src = `/images/blocks/${images[i]}.png`;
            figure.shadow.src = `/images/shadow/${images[i]}.png`;
            i++
        });
        blockField.src = '/images/blocks/bg.png';
        player.field.initField();
        player.field.initFieldMatrix();
        player.tickTime = 15974 / this.height;
        player.initEventListeners();
        player.initFigures(currentFigureIndex, bufferFigureIndex, NextFiguresIndex);
        player.updateSpeed();
        this.addPauseListener(player);
    },
    addPauseListener(player) {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'KeyP') {
                if (!player.isActive) {
                    this.drawDowncount(player, player.field.field, 3, 1, () => { player.isActive = true; this.play(player) })
                } else {
                    player.isActive = false;
                }
            }
        });
    },
    drawDowncount(player, field, fromIndex, toIndex, func) {
        if (fromIndex >= toIndex) {
            setTimeout(() => {
                player.field.clearField();
                // player.field.drawField(this.field.field, this.field.matrix);
                field.fillStyle = "white";
                field.font = "96px Russo One";
                field.fillText(fromIndex, player.field.width * player.field.blockSize / 2 - 36, player.field.height * player.field.blockSize / 2);
                this.drawDowncount(player, field, fromIndex - 1, 1, func);
            }, 1000);
        } else {
            setTimeout(() => { func() }, 1000);
        }
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
    start(player) {
        this.onLoadImages(() => { 
            this.drawDowncount(player, player.field.field, 3, 1, () => { player.isActive = true; this.play(player) }) })
    },
    play(player) {
        player.ui.score = player.score;
        player.ui.level = player.lvl;
        player.update();
        document.querySelector('.game__score').innerHTML = player.score;
        document.querySelector('.game__level').innerHTML = player.lvl;
        requestAnimationFrame(() => this.play(player));

    },
}

const ui = new UI(
    document.querySelector(".buffer__figure"),
    document.querySelectorAll(".figure"),
    document.querySelector(".game__score"),
    document.querySelector(".game__level"),
    document.querySelector(".game__time"),
    document.querySelector(".game__lines"),
);
let player = new Player(ui, new Field([], GAME.width, GAME.height));
GAME.init
    (
        player,
        Math.floor(Math.random() * figures.length),
        Math.floor(Math.random() * figures.length),
        [
            Math.floor(Math.random() * figures.length),
            Math.floor(Math.random() * figures.length),
            Math.floor(Math.random() * figures.length),
            Math.floor(Math.random() * figures.length)
        ]
    )
GAME.start(player)