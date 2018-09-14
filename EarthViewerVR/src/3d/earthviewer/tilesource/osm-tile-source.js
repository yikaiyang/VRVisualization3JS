/**
 * 
 * Tile Source Provider for Open Street Maps.
 * Builds the tile query url.
 * 
 * example url https://b.tile.openstreetmap.org/9/278/176.png
 * @author Yikai Yang
 */
import BaseTileSource from './base-tile-source.js'

 class OSMTileSource extends BaseTileSource {
    constructor(){
         const osmUrl = '.tile.openstreetmap.org';
         const fileFormat = '.png'
         super(osmUrl, fileFormat);
    }

    _getRandomServer(){
        const randomServerOptions = ['a', 'b', 'c'];
        const idx = Math.floor(Math.random() * randomServerOptions.length);
        console.log(idx);
        return randomServerOptions[idx];
    }

    buildTileURL(zoom, x, y){
        //Typical format for a tile request is /{zoom}/{x}/{y}{@2x}.{format}
        return 'https://' + this._getRandomServer() + this.baseUrl + '/' + zoom + '/' + x + '/' + y + this.fileFormat; 
    }
 }

 export default OSMTileSource;