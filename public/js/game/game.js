let GAME = {
    width: 10,
    height: 20,
    tickTime: 36,
    playTime: 0,
    figuresQueueSize: 4,
    init() {
        let i = 0;
        figures.forEach((figure) => {
            figure.image.src = `/images/figures/${images[i]}.png`;
            figure.block.src = `/images/blocks/${images[i]}.png`;
            figure.shadow.src = `/images/shadow/${images[i]}.png`;
            i++
        });
        player.initField(this.width, this.height);
        player.initFigures();
        player.initEventListeners();
        player.updateInterface();
        this.onLoadImages(() => this.play());
    },
    onLoadImages(func) {
        let counter = 0;
        figures.forEach((figure) => {
                figure.image.addEventListener('load', () => {
                    counter++;
                    if (counter === figures.length * 2) {
                        func()
                    }
                })
                figure.block.addEventListener('load', () => {
                    counter++;
                    if (counter === figures.length * 2) {
                        func()
                    }
                })
                figure.block.addEventListener('load', () => {
                    counter++;
                    if (counter === figures.length * 2) {
                        func()
                    }
                })
            }
        )
    },
    clear(ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    },
    play() {
        this.clear(field);

        if (player.isActive) {
            player.drawField(this.width, this.height);
            document.querySelector('.game__score').innerHTML = player.score;
            if (this.playTime * player.nitro >= this.tickTime) {
                this.playTime = 0;
                player.update();
            }

            player.updatePosition();
        }

        this.playTime++;
        requestAnimationFrame(() => this.play());
    }
}

const INTERFACE = new Interface(
    34,
    document.querySelector(".buffer__figure"),
    document.querySelectorAll(".figure"),
    GAME
);

let player = new Player(INTERFACE, GAME.figuresQueueSize);
const canvas = document.getElementById('game');
const field = canvas.getContext('2d');
canvas.width = INTERFACE.field.width;
canvas.height = INTERFACE.field.height;
