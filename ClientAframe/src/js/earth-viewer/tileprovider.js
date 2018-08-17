const TILE_PROVIDER01 = '.tile.openstreetmap.org';
const TILE_PROVIDER01_RANDOM = ['a', 'b', 'c'];

const TILE_FORMAT_PNG = '.png';
const TILE_FORMAT_2X_PNG = '@2x.png';
const TILE_FORMAT_JPG = '.jpg';

const MapTileSource = {
    openstreetmap: 1,
    customserver: 2,
    mapbox: 3
}

class TileProvider{
    constructor(maptileSource) {
        this.maptileSource = maptileSource;
    }

    setMapTileSource(maptileSource) {
        this.maptileSource = maptileSource;
    }

    buildUrl (zoom, x, y) {
        if (!!this.maptileSource){
            switch (this.maptileSource){
                case 1:
                    console.log('1');
                    break;
                case 2:
                    console.log('2');
                    break;
                case 3:
                    console.log('3');
                    break;
            }
        }
    }
}




