let GAME = {
    width: localStorage.Gamewidth,
    height: localStorage.Gameheight,
    playTime: new Date(),
    startTime: new Date(),
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
    start(player, field, ui) {
        this.onLoadImages(() => {
            this.drawDowncount(player, field, ui, 3, 1, () => { this.startTime = new Date(); this.play(player); })
        });
    },
    drawDowncount(player, field, ui, fromIndex, toIndex, func) {
        if (fromIndex >= toIndex) {
            setTimeout(() => {
                this.clear(field);
                player.drawField(this.width, this.height);
                player.drawOtherField(this.width, this.height);
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
        player.ui.time = new Date() - this.startTime;
        if (player.isActive) {
            let nowTime = new Date();
            if (nowTime - this.startTime >= 2 * 60 * 1000) {
                player.isActive = false;
                this.blitzGameEnd(player.score);
            } else 
            this.clear(field);
            player.drawField(this.width, this.height);
            player.drawOtherField(this.width, this.height);
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

    },
     blitzGameEnd(score) {
        localStorage.Gamewidth = 10;
        localStorage.Gameheight = 20;
        this.blitzSendResult(score).then(() => {});
    },
    
    async blitzSendResult(score) {
        let response = await fetch('/api/statistics', {
            method: 'POST',
            body: JSON.stringify({
                score: score
            })
        });
        console.log(response);
        if (response.ok) {
            window.location.href = '/blitz_game_over'
        } else {
            window.location.href = "/blitz_game_over?score=" + score;
        }
    }
}