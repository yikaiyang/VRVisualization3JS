/**
 * Sample request for mapbox api
 * 
 * "https://api.mapbox.com/v4/mapbox.mapbox-streets-v7/1/0/0.png?access_token=your-access-token
 *
 * @author Yikai Yang
 * @see https://www.mapbox.com/api-documentation/#maps
 */
import BaseTileSource from './base-tile-source.js'

class MapboxOptions {}
MapboxOptions.TerrainRGB = 'mapbox.terrain-rgb';
MapboxOptions.StreetV7 = 'mapbox.mapbox-streets-v7';
/**
 * StreetV1 is a fallback api used for raster tiles which appearently do not work with the newer streetV7 api. 
 * Sample query:
 * https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/4/2/4
 * ?access_token=access_token
 */
MapboxOptions.StreetV1 = 'mapbox/streets-v9/tiles/256';
Object.freeze(MapboxOptions);

 class MapboxTileSource extends BaseTileSource {
    /**
     * Creates an object of MapboxTileSource which builds Tile URLs.
     * @param {*} accessToken   access Token for mapbox service
     * @param {*} fileFormat    file format of tiles. Default is png (Specify file format without '.' prefix)
     * @param {*} customStyle   custom mapbox tile style. (Example mapbox://styles/mapbox/streets-v10@00)
     */
    constructor(accessToken, fileFormat = '.png', mapOption = MapboxOptions.StreetV1, customStyle = undefined){
        const mapboxLegacyURL = 'https://api.mapbox.com/styles/v1/';
        let mapboxURL = 'https://api.mapbox.com/v4/';
        if (mapOption === MapboxOptions.StreetV1){
            mapboxURL = mapboxLegacyURL;
            fileFormat = '' //No support for custom file formats.
            customStyle = undefined; //No support for custom styles in legacy api.
        }

        super(mapboxURL, fileFormat);
        this.accessToken = accessToken;
        this.customStyle = customStyle;
        this.mapOption = mapOption;
    }

    buildTileURL(zoom, x, y){
        //Typical format for rest request is /{zoom}/{x}/{y}{@2x}.{format}+
        const styleParam = (!!this.customStyle) ?  'style=' + this.customStyle + '&' : '';

        return this.baseUrl + this.mapOption + '/' + zoom + '/' + x + '/' + y 
            + this.fileFormat + '?' 
            + styleParam 
            + 'access_token=' + this.accessToken; 
    }
 }

 export {MapboxTileSource, MapboxOptions};