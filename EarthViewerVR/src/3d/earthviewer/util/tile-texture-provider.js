/**
 * TileTextureProvider is responsible for loading and assigning tile textures to a geometry.
 */

import OSMTileSource from '../tileSource/osm-tile-source.js'
import {MapboxTileSource, MapboxOptions} from '../tileSource/mapbox-tile-source.js'

class Constants {};
Constants.MAX_TEXTURE_REQUEST = 10;
Constants.MAX_TILEMESH = 400;
//TODO: Store access token somewhere safe
Constants.MAPBOX_KEY = 'pk.eyJ1IjoieWlrYWl5YW5nIiwiYSI6ImNqaXJ5eXd6MDBhOGwzcGxvMmUwZGxsaDkifQ.Czx2MTe4B6ynlMbpW52Svw';
Object.freeze(Constants);

class TileTextureProvider {
   constructor(){
       this.textureLoader = new THREE.TextureLoader();
       this.textureLoader.crossOrigin = '';
       this.textures = {};
       this.textureRequests = {};
       this.textureAliveRequests = {};
       this.textureAliveRequestsCount = 0;
       this.textureRequestsCount = 0;
       
       //Initialize Tile Source Provider
       this.tileSource = new MapboxTileSource(Constants.MAPBOX_KEY,undefined, MapboxOptions.StreetV1,'mapbox://styles/yikaiyang/cjljkon0224u72rmqfyvybx1e');
       //this.tileSource = new OSMTileSource(); //Uncomment this if tiles from OSM should be used.
   }

   _loadNextTexture(){
        // console.log('this.textureAliveRequestsCount:', this.textureAliveRequestsCount, '/textureRequestsCount:', textureRequestsCount);
        while (this.textureAliveRequestsCount < Constants.MAX_TEXTURE_REQUEST && this.textureRequestsCount > 0) {
            var ids = Object.keys(this.textureRequests);
            var id = ids[ids.length - 1];
            this.textureAliveRequestsCount = this.textureAliveRequestsCount + (this.textureAliveRequests.hasOwnProperty(id) ? 0 : 1);
            this.textureAliveRequests[id] = this.textureRequests[id];
            var url = this.textureAliveRequests[id].url;
            delete this.textureRequests[id];
            this.textureRequestsCount--;

            (function(scope, url, id) {
                //Loads a texture by using the url and saves it to the textures array.
                //TODO Find out why this is an IIFE
                scope.textureAliveRequests[id].request = scope.textureLoader.load(url,
                    function(texture) {
                        scope.textures[id] = texture;
                        if (scope.textureAliveRequests.hasOwnProperty(id)) {
                            scope.textureAliveRequests[id].onLoaded(texture);
                            delete scope.textureAliveRequests[id];
                            scope.textureAliveRequestsCount--;
                        }
                        scope._loadNextTexture();
                    },
                    function() {},
                    function() {
                        if (scope.textureAliveRequests.hasOwnProperty(id)) {
                            // this.textureAliveRequests[id].onLoaded(texture);
                            delete scope.textureAliveRequests[id];
                            scope.textureAliveRequestsCount--;
                        }
                        scope._loadNextTexture();
                    }
                );
            })(this, url, id);
        }
   }

   textureFactory(zoom, xtile, ytile, onLoaded) {
        var id = 'tile' + zoom + '_' + xtile + '_' + ytile;
        if (this.textures.hasOwnProperty(id)) {
            onLoaded(this.textures[id]);
        } else {
            const tileX = ((zoom > 0) ? (xtile % Math.pow(2, zoom)) : 0);
            const tileY = ((zoom > 0) ? (ytile % Math.pow(2, zoom)) : 0); 
            
            const url = this.tileSource.buildTileURL(zoom, tileX, tileY);
            console.debug(url);

            this.textureRequestsCount = this.textureRequestsCount + (this.textureRequests.hasOwnProperty(id) ? 0 : 1);
            this.textureRequests[id] = {
                url: url,
                onLoaded: onLoaded
            }
            this._loadNextTexture();
        }
    }

    cancelOtherRequests(currentIds) {
        for (let id in this.textureRequests) {
            if (!currentIds.hasOwnProperty(id)) {
                delete this.textureRequests[id];
                this.textureRequestsCount--;
            }
        }
        for (let id in this.textureAliveRequests) {
            if (!currentIds.hasOwnProperty(id)) {
                // if (textureAliveRequests[id].request.hasOwnProperty('abort')) {
                //     textureAliveRequests[id].request.abort();
                // }
                // delete textureAliveRequests[id];
                // textureAliveRequestsCount--;
            }
        }
        this._loadNextTexture();
    }
}

export {TileTextureProvider, Constants};