let GAME = {
    width: localStorage.Gamewidth,
    height: localStorage.Gameheight,
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
        blockField.src = '/images/blocks/bg.png';
        player.initField(this.width, this.height);
        player.initFigures();
        player.initEventListeners();
        player.updateInterface();


        music.play();
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
            if (this.playTime * player.nitro >= player.tickTime) {
                this.playTime = 0;
                player.update();
            }

            player.updatePosition();
        }

        this.playTime++;
        requestAnimationFrame(() => this.play());
    }
}

