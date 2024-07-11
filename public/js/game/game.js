let GAME = {
    width: localStorage.Gamewidth,
    height: localStorage.Gameheight,
    playTime: new Date(),
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
        player.initField(this.width, this.height);
        player.tickTime = 15974 / this.height;
        player.initFigures();
        player.initEventListeners();
        player.updateUI();
        ui.initMusic();
        player.updateLvl()
    },
    start(player, field, ui) {
        this.onLoadImages(() => {
            this.drawDowncount(player, field, ui, 0, 1, () => { this.play(player); })
        });
    },
    drawDowncount(player, field, ui, fromIndex, toIndex, func) {
        if (fromIndex >= toIndex) {
            setTimeout(() => {
                this.clear(field);
                player.drawField(this.width, this.height);
                // player.drawOtherField(this.width, this.height, otherPlayersFields);
                field.fillStyle = "white";
                field.font = "96px Russo One";
                field.fillText(fromIndex, ui.field.width / 2 - 36, ui.field.height / 2);
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
    play(player) {

        player.ui.score = player.score;
        player.ui.level = player.lvl;
        if (player.isActive) {
            this.clear(field);
            player.drawField(this.width, this.height);
            player.drawOtherField(this.width, this.height, otherPlayersFields);
            document.querySelector('.game__score').innerHTML = player.score;
            let updateTime = new Date();
            updateTime -= this.playTime;
            if (updateTime * player.nitro >= player.tickTime) {
                this.playTime = new Date;
                player.update();
            }

            player.updatePosition();
            requestAnimationFrame(() => this.play(player));
        }
    }
}