/**
 * Toolbox class for open earth viewer
 */

import GeoConversion from './geoconversion.js'
import OSMTileSource from '../tileSource/osm-tile-source.js'
import {MapboxTileSource, MapboxOptions} from '../tileSource/mapbox-tile-source.js'


class Constants {};
Constants.TILE_PROVIDER01 = '.tile.openstreetmap.org';
Constants.TILE_PROVIDER01_RANDOM = ['a', 'b', 'c'];
Constants.TILE_PROVIDER01_FILE_EXT = 'png';
Constants.MAX_TEXTURE_REQUEST = 10;
Constants.MAX_TILEMESH = 400;

//TODO: Store access token somewhere safe
Constants.MAPBOX_KEY = 'pk.eyJ1IjoieWlrYWl5YW5nIiwiYSI6ImNqaXJ5eXd6MDBhOGwzcGxvMmUwZGxsaDkifQ.Czx2MTe4B6ynlMbpW52Svw';
Object.freeze(Constants);

class Toolbox {
    constructor(){
        this.geoTiles = {};
        this.geoTileQueue = [];

        this.tileMaterial = new THREE.MeshBasicMaterial({color: 0xFFFFFF});
        this.tileMaterial.depthTest = false;
    }

    getTileMesh (r, zoom, ytile, power) {
        var id = 'tile_' + zoom + '_' + ytile + '_' + factor;
        if (!(this.geoTiles.hasOwnProperty(id))) {
            this.geoTiles[id] = new THREE.Geometry();
            var myGeometry = this.geoTiles[id];
            this.geoTileQueue.push(id);
            if (this.geoTileQueue.length > Constants.MAX_TILEMESH) {
                delete this.geoTiles[this.geoTileQueue.shift()];
            }
            /*************************
             *            ^ Y         *
             *            |           *
             *            |           *
             *            |           *
             *            -------> X  *
             *           /            *
             *          /             *
             *         / Z            *
             *************************/
            /***************************
             *       B        C         *
             *                          *
             *                          *
             *                          *
             *      A          D        *
             ***************************/
            var lonStart = GeoConversion.tile2long(0, zoom);
            var latStart = GeoConversion.tile2lat(ytile, zoom);
            var lonEnd = GeoConversion.tile2long(1, zoom);
            var latEnd = GeoConversion.tile2lat(ytile + 1, zoom);
            var factor = Math.pow(2, power);
            var lonStep = (lonEnd - lonStart) / factor;
            var latStep = (latEnd - latStart) / factor;
            for (var u = 0; u < factor; u++) {
                for (var v = 0; v < factor; v++) {

                    var lon1 = lonStart + lonStep * u;
                    var lat1 = latStart + latStep * v;
                    var lon2 = lonStart + lonStep * (u + 1);
                    var lat2 = latStart + latStep * (v + 1);

                    var rUp = r * 1000 * Math.cos(lat1 * Math.PI / 180);
                    var rDown = r * 1000 * Math.cos(lat2 * Math.PI / 180);

                    var Ax = rDown * Math.sin(lon1 * Math.PI / 180);
                    var Ay = r * 1000 * Math.sin(lat2 * Math.PI / 180);
                    var Az = rDown * Math.cos(lon1 * Math.PI / 180);

                    var Bx = rUp * Math.sin(lon1 * Math.PI / 180);
                    var By = r * 1000 * Math.sin(lat1 * Math.PI / 180);
                    var Bz = rUp * Math.cos(lon1 * Math.PI / 180);

                    var Cx = rUp * Math.sin(lon2 * Math.PI / 180);
                    var Cy = r * 1000 * Math.sin(lat1 * Math.PI / 180);
                    var Cz = rUp * Math.cos(lon2 * Math.PI / 180);

                    var Dx = rDown * Math.sin(lon2 * Math.PI / 180);
                    var Dy = r * 1000 * Math.sin(lat2 * Math.PI / 180);
                    var Dz = rDown * Math.cos(lon2 * Math.PI / 180);

                    myGeometry.vertices.push(
                        new THREE.Vector3(Ax, Ay, Az),
                        new THREE.Vector3(Bx, By, Bz),
                        new THREE.Vector3(Cx, Cy, Cz),
                        new THREE.Vector3(Dx, Dy, Dz)
                    );

                    var iStep = (factor - v - 1) + u * factor;
                    myGeometry.faces.push(new THREE.Face3(
                        4 * iStep,
                        4 * iStep + 2,
                        4 * iStep + 1));
                    myGeometry.faces.push(new THREE.Face3(
                        4 * iStep,
                        4 * iStep + 3,
                        4 * iStep + 2));

                    myGeometry.faceVertexUvs[0].push([
                        new THREE.Vector2((0.0 + u) / factor, (0.0 + v) / factor),
                        new THREE.Vector2((1.0 + u) / factor, (1.0 + v) / factor),
                        new THREE.Vector2((0.0 + u) / factor, (1.0 + v) / factor)
                    ]);
                    myGeometry.faceVertexUvs[0].push([
                        new THREE.Vector2((0.0 + u) / factor, (0.0 + v) / factor),
                        new THREE.Vector2((1.0 + u) / factor, (0.0 + v) / factor),
                        new THREE.Vector2((1.0 + u) / factor, (1.0 + v) / factor)
                    ]);
                }
            }
            myGeometry.uvsNeedUpdate = true;
        }
        return new THREE.Mesh(this.geoTiles[id], this.tileMaterial);
    }

    static assignUVs(geometry){
        geometry.computeBoundingBox();

        var max = geometry.boundingBox.max;
        var min = geometry.boundingBox.min;

        var offset = new THREE.Vector2(0 - min.x, 0 - min.y);
        var range = new THREE.Vector2(max.x - min.x, max.y - min.y);

        geometry.faceVertexUvs[0] = [];
        var faces = geometry.faces;

        for (let i = 0; i < geometry.faces.length; i++) {
            var v1 = geometry.vertices[faces[i].a];
            var v2 = geometry.vertices[faces[i].b];
            var v3 = geometry.vertices[faces[i].c];

            geometry.faceVertexUvs[0].push([
                new THREE.Vector2((v1.x + offset.x) / range.x, (v1.y + offset.y) / range.y),
                new THREE.Vector2((v2.x + offset.x) / range.x, (v2.y + offset.y) / range.y),
                new THREE.Vector2((v3.x + offset.x) / range.x, (v3.y + offset.y) / range.y)
            ]);
        }
        geometry.uvsNeedUpdate = true;
    }
}

class TextureLoader {
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
       //this.tileSource = new OSMTileSource(); Uncomment this if tiles from OSM shall be used.
   }

   loadNextTexture(){
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
                        scope.loadNextTexture();
                    },
                    function() {},
                    function() {
                        if (scope.textureAliveRequests.hasOwnProperty(id)) {
                            // this.textureAliveRequests[id].onLoaded(texture);
                            delete scope.textureAliveRequests[id];
                            scope.textureAliveRequestsCount--;
                        }
                        scope.loadNextTexture();
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
            const serverRandom = Constants.TILE_PROVIDER01_RANDOM[
                Math.floor(Math.random() * Constants.TILE_PROVIDER01_RANDOM.length)];

            const tileX = ((zoom > 0) ? (xtile % Math.pow(2, zoom)) : 0);
            const tileY = ((zoom > 0) ? (ytile % Math.pow(2, zoom)) : 0); 
            const url = this.tileSource.buildTileURL(zoom, tileX, tileY);
            
            console.debug(url);
            this.textureRequestsCount = this.textureRequestsCount + (this.textureRequests.hasOwnProperty(id) ? 0 : 1);
            this.textureRequests[id] = {
                url: url,
                onLoaded: onLoaded
            }
            this.loadNextTexture();
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
        this.loadNextTexture();
    }
}

export {Toolbox, TextureLoader};