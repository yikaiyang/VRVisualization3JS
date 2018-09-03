import {WEBVR} from '../libs/webVR.js';
import GeoConversion from './earth-viewer/util/geoconversion.js'
import FileLoader from './util/fileloader.js';

var scene = new THREE.Scene();
var earth = new THREE.Object3D(); //create an empty container
/* Variables */

//Start position

var R = 6378.137; //radius in kilometers
var xtile = 0;
var ytile = 0;
var zoom = 0;
var tileGroups;
var tileGroup = [];

var defaultAlti = R * 1000;
var geojsonLoader = new THREE.GeojsonLoader();

//http://localhost:8080/styles/osm-bright/8/133/89@2x.png

function initVR(renderer){
    renderer.vr.enabled = true;
    let vrButton = WEBVR.createButton(renderer);
    if (!!vrButton){
        document.body.appendChild(vrButton);
    }
}

//Initialize FPS Display
var stats;
function initFPSCounter(){
    stats = new Stats();
    if (!!stats){
        stats.showPanel(0);
        document.body.appendChild(stats.dom);
    }
}
initFPSCounter();

 //Coordinates for vienna
const latitude = 48.210033;
const longitude = 16.363449;
const color = new THREE.Color("rgb(187,57,70)");

/**Drawing primitives based on stations of WL */
let center = new THREE.Vector3(0,0,0)
let cubeGeometry = new THREE.BoxGeometry(10,10,100);
let cubeMaterial = new THREE.MeshBasicMaterial({
    color: color
});
let mergedGeometry = new THREE.Geometry();

function createCube(latitude, longitude){
    let position = GeoConversion.WGStoGlobeCoord(latitude, longitude, R * 1000);
    if (position == undefined){
        return;
    }

    let mesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
    mesh.position.set(position.x, position.y, position.z);
    mesh.lookAt(center);

    //Merge geometries
    mesh.updateMatrix();
    mergedGeometry.merge(mesh.geometry, mesh.matrix);
}

function loadStationData(){
    FileLoader.parseFile('../data/haltestellen.csv', function(data){
        let results = Papa.parse(data);
        renderStations(results.data);
    });
}

function renderStations(stationData){
    const latIdx = 6;
    const longIdx = 7;

    for (let i = 0; i < stationData.length; i++){
        let stationLat = stationData[i][latIdx];
        let stationLong = stationData[i][longIdx];
        createCube(stationLat, stationLong);
    }
    let cubes = new THREE.Mesh(mergedGeometry, cubeMaterial);
    earth.add(cubes);
}

loadStationData();

var proxy = 'localhost';
var proxyPort = '8484';

var grid = new THREE.GridHelper(R * 1000);
var axesHelper = new THREE.AxesHelper(R * 1000);
scene.add(grid);
scene.add(axesHelper);

var params = getSearchParameters();

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 100, 100000000);
camera.up.set(0, 0, 1);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

var rig = new THREE.PerspectiveCamera(); 
rig.add(camera);
rig.position.set(0,0,defaultAlti);
scene.add(rig);

/*  renderer.shadowMapEnabled = true;
renderer.shadowMapSoft = false;

renderer.shadowCameraNear = 3;
renderer.shadowCameraFar = camera.far;
renderer.shadowCameraFov = 50;

renderer.shadowMapBias = 0.0039;
renderer.shadowMapDarkness = 0.5;
renderer.shadowMapWidth = 1024;
renderer.shadowMapHeight = 1024; */

//enableVR
initVR(renderer);

var goUpdateSceneLazy = function() {
    updateSceneLazy();
};

/* var controls = new THREE.EarthControls(
    rig,
    renderer.domElement,
    goUpdateSceneLazy, {
        longitude: LONGITUDE_ORI,
        latitude: LATITUDE_ORI
    }); */

var controls = new THREE.OrbitControls(rig, undefined, goUpdateSceneLazy);

var lonStamp = 0;
var latStamp = 0;
var altitude = (params.alti) ? params.alti : defaultAlti;

document.body.appendChild(renderer.domElement);


earth.position.set(0, 0, -R * 1000);
scene.add(earth);

var light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10000, 15000, 20000);
scene.add(light);

var sphere = new THREE.SphereGeometry(R * 995, 64, 64);

document.addEventListener("keydown", onDocumentKeyDown, false);

camera.position.z = altitude;

function onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (keyCode == 70) {
        console.log('F pressed!');
    }
}
// ENDOF initialization //

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}

function animate(){
    renderer.setAnimationLoop(render);
}

function render() {
    stats.begin();
    renderer.render(scene, camera);
   console.log('camera:' +
    ' x: ' + ((rig||{}).position||{}).x + 
    ' y: ' +  ((rig||{}).position||{}).y +
    ' z: ' + ((rig||{}).position||{}).z +
    ' rotationX: ' + ((rig||{}).rotation||{}).x +
    ' rotationY: ' + ((rig||{}).rotation||{}).y +
    ' rotationZ: ' + ((rig||{}).rotation||{}).z 
    );
    //rig.position.z += 10;

    stats.end();
}

var updateSceneLazy = function() {
    ////////////////////////////////////////////////////////////
    var oldZoom = zoom;
    var dist = new THREE.Vector3().copy(controls.object.position).sub(controls.target).length();
    var zoom__ = Math.floor(Math.max(Math.min(Math.floor(27 - Math.log2(dist)), 19), 1));
    if (zoom__ > ZOOM_MIN) {
        zoom = zoom__;
    }

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
    renderer.render(scene, camera);
};

updateSceneLazy();
animate();


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
                        /* if (zoom >= 18 && zoom_ >= zoom - 1) {
                            var defaultColor =
                                ((13 * zoom) % 256) * 65536 +
                                ((53 * (atile % modulus)) % 256) * 256 +
                                ((97 * (btile % modulus)) % 256);
                            var lod = Math.max(0, zoom_ - 14);
                            (function(earth, myTile, zoom, xtile, ytile, lod, defaultColor) {
                                var url = 'http://www.openearthview.net/3dtile.php?format=geojson&zoom=' + zoom + '&xtile=' + xtile + '&ytile=' + ytile;
                                geojsonLoader.load(
                                    url,
                                    function(obj) {
                                        myTile.add(obj);
                                        render();
                                    },
                                    function() {},
                                    function() {},
                                    lod,
                                    defaultColor);
                            })(earth, tileSupport, zoom_, (atile % modulus), (btile % modulus), lod, defaultColor);
                        } */
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
                                render();
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