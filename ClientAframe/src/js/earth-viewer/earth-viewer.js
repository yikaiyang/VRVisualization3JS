'use strict';
var App = App || {};

var scene = document.querySelector('a-scene').object3D;
var earth = new THREE.Object3D();

//Set callback to trigger manual rerendering of earth when a zoomlevel has changed.

class Controls{
    constructor(){
        this.latitude = 48.210033;
        this.longitude = 16.363449;
    }

    getLatitude(){
        return this.latitude;
    }

    getLongitude(){
        return this.longitude;
    }
}

var controls = new Controls();

///Variables
var R = 6378.137; //radius in kilometers
var xtile = 0;
var ytile = 0;
var zoom = 0;
var tileGroups;
var tileGroup = [];

var TILE_PROVIDER01 = '.tile.openstreetmap.org';
var TILE_PROVIDER01_RANDOM = ['a', 'b', 'c'];
var TILE_PROVIDER01_FILE_EXT = 'png';

var ZOOM_SHIFT_SIZE = 4;
var ZOOM_MIN = 1;
var MAX_TILEMESH = 400;
var ZOOM_FLAT = 13;
var tileMeshes = {};
var tileMeshQueue = [];

var ZOOM_SHIFT_SIZE = 4;
var ZOOM_MIN = 1;
var MAX_TILEMESH = 400;
var ZOOM_FLAT = 13;
var tileMeshes = {};
var tileMeshQueue = [];

var defaultAlti = R * 1000;


var params = getSearchParameters();
var lonStamp = 0;
var latStamp = 0;
var altitude = (params.alti) ? params.alti : defaultAlti;

earth.position.set(0, 0, -R * 1000);
scene.add(earth);

var zoom = 4;
var updateSceneLazy = function(altitude) {
    alert('updateSceneLazy: altitude: ' + altitude);
    ////////////////////////////////////////////////////////////
    var oldZoom = zoom;
    //var dist = new THREE.Vector3().copy(controls.object.position).sub(controls.target).length();
    //var zoom__ = Math.floor(Math.max(Math.min(Math.floor(27 - Math.log2(dist)), 19), 1));

   /*  if (zoom__ > ZOOM_MIN) {
        zoom = zoom__;
    } */

    if (lonStamp != controls.getLongitude() || latStamp != controls.getLatitude()) {
        lonStamp = controls.getLongitude();
        latStamp = controls.getLatitude();
        earth.rotation.set(
            controls.getLatitude() * Math.PI / 180,
            (-controls.getLongitude()) * Math.PI / 180,
            0);
        var oldXtile = xtile;
        var oldYtile = ytile;
        xtile = long2tile(lonStamp, zoom);
        ytile = lat2tile(latStamp, zoom);

        if (Math.abs(oldXtile - xtile) >= 1 ||
            Math.abs(oldYtile - ytile) >= 1) {
            updateScene({
                'lon': lonStamp,
                'lat': latStamp,
                'alti': altitude
            });
        }
    } else if (Math.abs(zoom - oldZoom) >= 1) {
        updateScene({
            'lon': lonStamp,
            'lat': latStamp,
            'alti': altitude
        });
    }
    ////////////////////////////////////////////////////////////
    //renderer.render(scene, camera);
};

updateSceneLazy();

//Register re-render calback
if (!!App.callbackHelper){
    callbackHelper.setCallback(updateSceneLazy);
}

var tilematerial = new THREE.MeshBasicMaterial( { color: 0xffffff, opacity: 0.4, transparent: true } ); // new line
                       
function updateScene(position) {
    console.log('position.lon:', position.lon);
    console.log('position.lat:', position.lat);
    xtile = long2tile(position.lon, zoom);
    ytile = lat2tile(position.lat, zoom);

    var tiles = {};
    var nextMinXtile, nextMaxXtile;

    earth.remove(tileGroups);
    tileGroups = new THREE.Object3D();
    earth.add(tileGroups);
    var oriGround = new THREE.Object3D();
    if (zoom >= ZOOM_FLAT) {
        var xtileOri = long2tile(position.lon, ZOOM_FLAT);
        var ytileOri = lat2tile(position.lat, ZOOM_FLAT);
        var lonOri = tile2long(xtileOri, ZOOM_FLAT);
        var latOri = tile2lat(ytileOri, ZOOM_FLAT);

        // 3 - ground position
        oriGround.position.set(0, 0, R * 1000);
        // 2 - Latitude rotation
        let oriLatRot = new THREE.Object3D();
        oriLatRot.rotation.set((-latOri) * Math.PI / 180, 0, 0);
        oriLatRot.add(oriGround);
        // 1 - Longitude rotation
        let oriLonRot = new THREE.Object3D();
        oriLonRot.rotation.set(0, lonOri * Math.PI / 180, 0);
        oriLonRot.add(oriLatRot);

        tileGroups.add(oriLonRot);
    }

    var currentIds = {};
    for (var zoom_ = Math.max(zoom, ZOOM_MIN); zoom_ > Math.max(zoom - ZOOM_SHIFT_SIZE, ZOOM_MIN); zoom_--) {
        var zShift = zoom - zoom_;
        tileGroup[zShift] = new THREE.Object3D(); //create an empty container
        tileGroups.add(tileGroup[zShift]);

        if (zoom_ < 0 && zShift > 0) {
            continue;
        }
        var factor = Math.pow(2, zShift);
        var xtile_ = Math.floor(xtile / factor);
        var ytile_ = Math.floor(ytile / factor);
        if (zoom < 8 && zoom_ < 6) {
            var size = 2;
        } else if (zoom_ < 19) {
            var size = 2;
        } else {
            size = 2;
        }
        var minXtile = Math.max(0, Math.floor((xtile_ - (Math.pow(2, (size - 1)) - 1)) / 2) * 2);
        var maxXtile = Math.floor((xtile_ + (Math.pow(2, (size - 1)) - 1)) / 2) * 2 + 1;
        var minYtile = Math.max(0, Math.floor((ytile_ - (Math.pow(2, (size - 1)) - 1)) / 2) * 2);
        var maxYtile = Math.floor((ytile_ + (Math.pow(2, (size - 1)) - 1)) / 2) * 2 + 1;
        var modulus = (zoom_ > 0) ? Math.pow(2, zoom_) : 0;
        for (var atile = minXtile; atile <= maxXtile; atile++) {
            var lon1 = tile2long(atile, zoom_);
            var lon2 = tile2long(atile + 1, zoom_);
            var lon = (lon1 + lon2) / 2;
            for (var btile = minYtile; btile <= maxYtile; btile++) {
                var lat1 = tile2lat(btile, zoom_);
                var lat2 = tile2lat(btile + 1, zoom_);
                var lat = (lat1 + lat2) / 2;
                var widthUp = measure(lat1, lon1, lat1, lon2);
                var widthDown = measure(lat2, lon1, lat2, lon2);
                var widthSide = measure(lat1, lon1, lat2, lon1);
                var id = 'z_' + zoom_ + '_' + atile + "_" + btile;
                for (var zzz = 1; zzz <= 2; zzz++) {
                    var idNext = 'z_' + (zoom_ - zzz) + '_' + Math.floor(atile / Math.pow(2, zzz)) + "_" + Math.floor(btile / Math.pow(2, zzz));
                    tiles[idNext] = {};
                }
                if (!tiles.hasOwnProperty(id)) {
                    if (zoom_ < ZOOM_FLAT) {
                        var tileMesh;
                        var tileEarth = new THREE.Object3D(); //create an empty container
                        tileEarth.rotation.set(0, (lon1 + 180) * Math.PI / 180, 0);
                        tileGroup[zShift].add(tileEarth);
                        tileMesh = getTileMesh(R, zoom_, btile, Math.max(9 - zoom_, 0));
                        tileEarth.add(tileMesh);
                    } else {
                        var tileShape = new THREE.Shape();

                        var xTileShift = (atile - xtile_) + (xtile_ % Math.pow(2, zoom_ - ZOOM_FLAT));
                        var yTileShift = (btile - ytile_) + (ytile_ % Math.pow(2, zoom_ - ZOOM_FLAT));
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
                        assignUVs(geometry);
                        var tileMesh = new THREE.Mesh(geometry,tilematerial);
                        var tileSupport = new THREE.Object3D(); //create an empty container
                        tileSupport.position.set(xTileShift * widthUp, -yTileShift * widthSide, 0);
                        tileSupport.add(tileMesh)
                        oriGround.add(tileSupport);
                    }
                    (function(yourTileMesh, yourZoom, yourXtile, yourYtile) {
                        textureFactory(
                            yourZoom,
                            yourXtile,
                            yourYtile,
                            function(texture) {
                                yourTileMesh.material = new THREE.MeshBasicMaterial({
                                    map: texture
                                });
                                //render();
                            }
                        );
                    })(tileMesh, zoom_, atile % modulus, btile % modulus);
                    var id = 'tile' + zoom_ + '_' + (atile % modulus) + '_' + (btile % modulus);
                    currentIds[id] = {};
                }
            }
        }
    }
    cancelOtherRequests(currentIds);
}