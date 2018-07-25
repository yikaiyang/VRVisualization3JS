class Tile {
    constructor(tileId, geoAreaBounds){
        this.tileId = tileId;
        this.geoAreaBounds = geoAreaBounds;
    }

    buildTileURL() {
        return "test " + this.tileId;
    }
}

export default Tile