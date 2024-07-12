let GAME = {
    width: localStorage.Gamewidth,
    height: localStorage.Gameheight,
    playTime: new Date(),
    startTime: new Date(),
    stopTimer: false,
    figuresQueueSize: 4,
    init(player, ui) {
        let i = 0;
        figures.forEach((figure) => {
            figure.image.src = `/images/figures/${images[i]}.png`;
            figure.block.src = `/images/blocks/${images[i]}.png`;
            figure.shadow.src = `/images/shadow/${images[i]}.png`;
            i++
        });
        blockField.src = '/images/blocks/bg.png';
        player.mode = 'blitz';
        player.initField(this.width, this.height);
        player.tickTime = 15974 / this.height;
        player.initFigures();
        player.initEventListeners();
        player.updateUI(this);
        ui.initMusic();
    },
    start(player, field, ui, func =() => {}) {
        this.onLoadImages(() => {
            this.drawDowncount(player, field, ui, 3, 1, () => { this.startTime = new Date(); this.play(player, func); })
        });
    },
    drawDowncount(player, field, ui, fromIndex, toIndex, func) {
        player.num = fromIndex;
        if (fromIndex >= toIndex) {
            setTimeout(() => {
                player.drawNumber();
                this.drawDowncount(player, field, ui, fromIndex - 1, 1, func);
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
    clear(ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    },
    play(player, func =() => {}) {
        player.ui.score = player.score;
        player.ui.level = player.lvl;
        player.ui.time = new Date() - this.startTime;
        if (player.isActive) {
            let nowTime = new Date();
            if ((!this.stopTimer) && (nowTime - this.startTime >= (2 * 60 - 11) * 1000)) {
                this.stopTimer = true;
                this.drawDowncount(player, field, player.ui, 10, 1, () => {
                    player.isActive = false;
                    gameEnd(player.score)
                })
            }
            this.clear(field);
            player.drawField(this.width, this.height);
            func();
            let updateTime = new Date();
            updateTime -= this.playTime;
            if (updateTime * player.nitro >= player.tickTime) {
                this.playTime = new Date;
                player.update();
            }

            player.updatePosition();
            if (this.stopTimer) {
                player.drawNumber()
            }
            requestAnimationFrame(() => this.play(player));
        }

    }
}