class Interface {
    constructor(blockSize, buffer, viewNextFigures, game) {
        this.blockSize = blockSize;
        this.buffer = buffer;
        this.viewNextFigures = viewNextFigures;
        this.field = {
            width: game.width * this.blockSize,
            height: game.height * this.blockSize,
        }
    }
}
