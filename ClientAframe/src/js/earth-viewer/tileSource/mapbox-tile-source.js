/**
 * 
 * Sample request for mapbox api
 * 
 * "https://api.mapbox.com/v4/mapbox.mapbox-streets-v7/1/0/0.png?access_token=your-access-token
 *
 * @author Yikai Yang
 * @see https://www.mapbox.com/api-documentation/#maps
 */
import BaseTileSource from './base-tile-source.js'

 class MapboxTileSource extends BaseTileSource {
    constructor(accessToken, fileFormat = 'png'){
         const mapboxURL = 'https://api.mapbox.com/v4/mapbox.mapbox-streets-v7';
         super(mapboxURL, fileFormat);
         this.accessToken = accessToken;
    }

    buildTileURL(zoom, x, y){
        //Typical format for rest request is /{zoom}/{x}/{y}{@2x}.{format}
        return this.baseUrl + '/' + zoom + '/' + x + '/' + y + '.' + this.fileFormat + '?access_token=' + this.accessToken; 
    }
 }

 export default MapboxTileSource;