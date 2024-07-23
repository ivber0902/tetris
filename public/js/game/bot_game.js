
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
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
        blockAdd.src = '/images/blocks/addLine.png';
        player.field.initField('game');
        bot.field.initField('bot-game');
        player.field.initFieldMatrix();
        bot.field.initFieldMatrix();
        player.initEventListeners();
        player.tickTime = 15974 / this.height;
        player.initFigures(currentFigureIndex, bufferFigureIndex, NextFiguresIndex);
        bot.initFigures(currentFigureIndex, bufferFigureIndex, NextFiguresIndex);
        player.updateSpeed();
        this.addPauseListener(player);
    },
    addPauseListener(player) {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'KeyP') {
                if (!player.isActive) {
                    this.drawDowncount(player, player.field.field, 3, 1, () => {
                        player.isActive = true; bot.isActive = true;
                        ui.music.play(); this.play(player); bot.play()
                    })
                } else {
                    player.isActive = false;
                    bot.isActive = false;
                    ui.music.pause();
                }
            }
        });
    },
    drawDowncount(player, field, fromIndex, toIndex, func) {
        if (fromIndex >= toIndex) {
            setTimeout(
                () => {
                    this.drawNumber(player, field, fromIndex);
                    this.drawDowncount(player, field, fromIndex - 1, 1, func);

                }, 1000);
        } else {
            setTimeout(() => { func() }, 1000);
        }
    },
    drawNumber(player, field, num) {
        player.field.clearField();
        player.field.drawField(player.field.field, player.field.matrix);
        field.fillStyle = "white";
        field.font = "96px Russo One";
        field.fillText(num, player.field.width * player.field.blockSize / 2 - 36, player.field.height * player.field.blockSize / 2);
    },
    onLoadImages(func) {
        let counter = 0;
        figures.forEach((figure) => {
            figure.image.addEventListener('load', () => {
                counter++;
                if (counter === figures.length * 3 + 2) {
                    func()
                }
            })
            figure.block.addEventListener('load', () => {
                counter++;
                if (counter === figures.length * 3 + 2) {
                    func()
                }
            })
            figure.shadow.addEventListener('load', () => {
                counter++;
                if (counter === figures.length * 3 + 2) {
                    func()
                }
            })
        }
        );
        blockField.addEventListener('load', () => {
            counter++;
            if (counter === figures.length * 3 + 2) {
                func()
            }
        })
        blockAdd.addEventListener('load', () => {
            counter++;
            if (counter === figures.length * 3 + 2) {
                func()
            }
        })
    },
    start() {
        player.isActive = true;
        this.onLoadImages(() => {
            this.drawDowncount(player, player.field.field, 3, 1, () => { player.isActive = true; bot.isActive = true; this.play(player); bot.play() });
        })
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

const botUI = new UI(
    document.querySelector(".bot-buffer__figure"),
    document.querySelectorAll(".bot-figure"),
    document.querySelector(".bot-game__score"),
    document.querySelector(".bot-game__level"),
    document.querySelector(".bot-game__time"),
    document.querySelector(".bot-game__lines"),
);

let player = new Player(ui, new Field([], GAME.width, GAME.height));
let bot = new Bot(botUI, new Field([], GAME.width, GAME.height));
player.countAddLines = [];
player.emptyCell = [];
bot.countAddLines = [];
bot.emptyCell = [];
player.field.defaultClearRow = player.field.clearRow;
bot.field.defaultClearRow = bot.field.clearRow;
player.field.clearRow = () => {
    let needClearLines = player.field.defaultClearRow();
    let clearLines = needClearLines;
    let newField = player.field.matrix;
    if (bot.sumArr(player.countAddLines) >= needClearLines) {
        player.countAddLines.forEach((countLine, index) => {
            if (countLine - needClearLines > 0) {
                countLine = countLine - needClearLines;
                needClearLines = 0;
                for (i = 0; i < newField.length - countLine; i++) {
                    newField[i] = newField[i + countLine]
                }
                let newLine = Array(player.field.matrix[0].length).fill(19);
                newLine[player.emptyCell[index]] = 0;
                for (let i = newField.length - countLine; i < newField.length; i++) {
                    newField[i] = Array(...newLine)
                }
            } else {
                needClearLines = needClearLines - countLine;
            }
        })
        player.countAddLines = [];
        player.emptyCell = [];
    } else {
        bot.countAddLines.push(clearLines - bot.sumArr(player.countAddLines));
        bot.emptyCell.push(Math.floor(Math.random() * GAME.width))
    }
    return clearLines
}
bot.field.clearRow = () => {
    let needClearLines = bot.field.defaultClearRow();
    let clearLines = needClearLines;
    let newField = bot.field.matrix;
    if (bot.sumArr(bot.countAddLines) >= needClearLines) {
        bot.countAddLines.forEach((countLine, index) => {
            if (countLine - needClearLines > 0) {
                countLine = countLine - needClearLines;
                needClearLines = 0;
                for (i = 0; i < newField.length - countLine; i++) {
                    newField[i] = newField[i + countLine]
                }
                let newLine = Array(bot.field.matrix[0].length).fill(19);
                newLine[bot.emptyCell[index]] = 0;
                for (let i = newField.length - countLine; i < newField.length; i++) {
                    newField[i] = Array(...newLine)
                }
            } else {
                needClearLines = needClearLines - countLine;
            }
        })
        bot.countAddLines = [];
        bot.emptyCell = [];
    } else {
        player.countAddLines.push(clearLines - bot.sumArr(bot.countAddLines));
        player.emptyCell.push(Math.floor(Math.random() * GAME.width))
    }
    return clearLines
}
