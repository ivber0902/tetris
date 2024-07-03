 let GAME = {
    width: 10,
    height: 20,
    playTime: new Date(),
    useT: 0,
    figuresQueueSize: 4,
    init() {
        let i = 0;
        figures.forEach((figure) => {
            figure.image.src = `/images/figures/${images[i]}.png`;
            figure.block.src = `/images/blocks/${images[i]}.png`;
            figure.shadow.src = `/images/shadow/${images[i]}.png`;
            i++
        });
        blockField.src = '/images/blocks/bg.png';
        player.initField(this.width, this.height);
        player.tickTime = 15974 / this.height;
        player.initFigures();
        player.initEventListeners();
        player.updateInterface();
        INTERFACE.initMusic();
        this.onLoadImages(() => this.play());
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
    clear(ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    },
    play() {
        this.clear(field);

        if (player.isActive) {
            player.drawField(this.width, this.height);
            document.querySelector('.game__score').innerHTML = player.score;
            let updateTime = new Date();
            updateTime -= this.playTime;
            updateTime -= this.useT;
            if (updateTime * player.nitro >= player.tickTime) {
                let downCount = Math.floor(updateTime * player.nitro / player.tickTime);
                this.useT += updateTime;
                for (let i = 0; i < downCount; i++)
                    player.update();
            }

            player.updatePosition();
        }
        requestAnimationFrame(() => this.play());
    }
}

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
