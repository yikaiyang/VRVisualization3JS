class Tile {
    constructor(tileId){
        this.tileIdentifier = tileId;
    }

    buildTileURL() {
        return "test " + this.tileIdentifier;
    }
}