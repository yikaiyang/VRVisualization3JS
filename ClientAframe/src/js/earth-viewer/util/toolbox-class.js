
const MAX_TEXTURE_REQUEST = 10;
const MAX_TILEMESH = 400;

const TILE_PROVIDER01 = '.tile.openstreetmap.org';
const TILE_PROVIDER01_RANDOM = ['a', 'b', 'c'];
const TILE_PROVIDER01_FILE_EXT = 'png';


class Constants {};
Constants.TILE_PROVIDER01 = '.tile.openstreetmap.org';
Constants.TILE_PROVIDER01_RANDOM = ['a', 'b', 'c'];
Constants.TILE_PROVIDER01_FILE_EXT = 'png';
Constants.MAX_TEXTURE_REQUEST = 10;
Constants.MAX_TILEMESH = 400;
Object.freeze(Constants);


class Toolbox {
    constructor(){
        this.geoTiles = {};
        this.geoTileQueue = [];
    }

    getTileMesh (r, zoom, ytile, power) {
        var id = 'tile_' + zoom + '_' + ytile + '_' + factor;
        if (!(geoTiles.hasOwnProperty(id))) {
            geoTiles[id] = new THREE.Geometry();
            var myGeometry = geoTiles[id];
            geoTileQueue.push(id);
            if (geoTileQueue.length > MAX_TILEMESH) {
                delete geoTiles[geoTileQueue.shift()];
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
            var lonStart = tile2long(0, zoom);
            var latStart = tile2lat(ytile, zoom);
            var lonEnd = tile2long(1, zoom);
            var latEnd = tile2lat(ytile + 1, zoom);
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
        return new THREE.Mesh(geoTiles[id]);
    }
}