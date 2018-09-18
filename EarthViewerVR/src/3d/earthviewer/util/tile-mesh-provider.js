import GeoConversion from './geoconversion.js';
import { EarthProperties } from '../earth-viewer.js';
import { Constants } from './tile-texture-provider.js';

class TileMeshProvider {
    constructor() {
        this.geoTiles = {};
        this.geoTileQueue = [];
        this.tileMaterial = new THREE.MeshBasicMaterial({ color: EarthProperties.TILE_COLOR });
    }

    getTileMesh(r, zoom, ytile, power) {
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
                    var rUp = r * Math.cos(lat1 * Math.PI / 180);
                    var rDown = r * Math.cos(lat2 * Math.PI / 180);
                    var Ax = rDown * Math.sin(lon1 * Math.PI / 180);
                    var Ay = r * Math.sin(lat2 * Math.PI / 180);
                    var Az = rDown * Math.cos(lon1 * Math.PI / 180);
                    var Bx = rUp * Math.sin(lon1 * Math.PI / 180);
                    var By = r * Math.sin(lat1 * Math.PI / 180);
                    var Bz = rUp * Math.cos(lon1 * Math.PI / 180);
                    var Cx = rUp * Math.sin(lon2 * Math.PI / 180);
                    var Cy = r * Math.sin(lat1 * Math.PI / 180);
                    var Cz = rUp * Math.cos(lon2 * Math.PI / 180);
                    var Dx = rDown * Math.sin(lon2 * Math.PI / 180);
                    var Dy = r * Math.sin(lat2 * Math.PI / 180);
                    var Dz = rDown * Math.cos(lon2 * Math.PI / 180);
                    myGeometry.vertices.push(new THREE.Vector3(Ax, Ay, Az), new THREE.Vector3(Bx, By, Bz), new THREE.Vector3(Cx, Cy, Cz), new THREE.Vector3(Dx, Dy, Dz));
                    var iStep = (factor - v - 1) + u * factor;
                    myGeometry.faces.push(new THREE.Face3(4 * iStep, 4 * iStep + 2, 4 * iStep + 1));
                    myGeometry.faces.push(new THREE.Face3(4 * iStep, 4 * iStep + 3, 4 * iStep + 2));
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

    /**
     * Retrieves a mesh for a flat tile (Zoom level > ZOOM_LEVEL_FLAT)
     */
    getFlatTileMesh(widthUp, widthSide){
        //Create tile
        var tileShape = new THREE.Shape();
        var xA = 0;
        var xB = xA;
        var xC = widthUp;
        var xD = xC;
        var yA = -widthSide;
        var yB = 0;
        var yC = yB;
        var yD = yA;
        tileShape.moveTo(xA, yA);
        tileShape.lineTo(xB, yB);
        tileShape.lineTo(xC, yC);
        tileShape.lineTo(xD, yD);
        tileShape.lineTo(xA, yA);

        var geometry = new THREE.ShapeGeometry(tileShape);
        TileMeshProvider.assignUVs(geometry);
        var tileMesh = new THREE.Mesh(geometry, this.tileMaterial);
        return tileMesh;
    }

    static assignUVs(geometry) {
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

export {TileMeshProvider};