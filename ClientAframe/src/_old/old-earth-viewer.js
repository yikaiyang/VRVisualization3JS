'use strict';
import {Toolbox, TextureLoader} from '../earth-viewer/util/toolbox-class.js'
import WienerLinienLayer from './visualization/wienerlinienlayer.js'
import GeoConversion from './util/geoconversion.js'
import {EarthViewer} from './earth.js'

var App = window.App || {};
var callbackHelper = App.callbackHelper;

let toolbox = new Toolbox();
let textureLoader = new TextureLoader();

var scene = document.querySelector('a-scene').object3D;
var earth = new THREE.Object3D();

let visLayer = new WienerLinienLayer(scene, earth);
visLayer.load();

let earthViewer = new EarthViewer(scene);
earthViewer.rerenderEarth();

var defaultLatitude = 48.210033;
var defaultLongitude = 16.363449;

///Variables
var R = 6378.137; //radius in kilometers
var xtile = 0;
var ytile = 0;
var zoom = 0;
var tileGroups;
var tileGroup = [];

var ZOOM_SHIFT_SIZE = 4;
var ZOOM_MIN = 1;

var ZOOM_SHIFT_SIZE = 4;
var ZOOM_MIN = 1;
var ZOOM_FLAT = 13; //ZoomLevel
var tileMeshes = {};
var tileMeshQueue = [];

var defaultAltitude = R * 1000;
var lonStamp, latStamp;

earth.position.set(0, 0, -R * 1000);
scene.add(earth);

/* 

let spGeometry = new THREE.SphereGeometry(R * 1200, 42, 42);
let spMaterial = new THREE.MeshNormalMaterial({
    wireframe: false
});
let earthMesh = new THREE.Mesh(spGeometry, spMaterial);
earthMesh.position.set(0, 0, -R * 1000);
scene.add(earthMesh); */


function addAtmosphere(){
    const Shaders = {
        'atmosphere' : {
            uniforms: {},
            vertexShader: [
              'varying vec3 vNormal;',
              'varying vec3 pos;',
              'void main() {',
                'float atmosphereRadius = 20.0;',
                'pos = position;',
                'vNormal = normalize( normalMatrix * normal );',
                'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
              '}'
            ].join('\n'),
            fragmentShader: [
              'varying vec3 vNormal;',
              'varying vec3 pos;',
              'vec3 atmosphereColor = vec3(0.17, 0.79, 0.88);',
              'void main() {',
                'float intensity = pow( 0.5 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) ), 2.0 );',
                'if (pos.x < 1800000.0 && pos.x > -1800000.0 && pos.y < 1800000.0 && pos.y > -1800000.0 && pos.y < 1800000.0 && pos.y > -1800000.0) {',
                '   gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0) ;',
                '} else {',
                '   gl_FragColor = vec4( atmosphereColor, 1.0 ) * intensity;',
                '}',
              '}'
            ].join('\n')
        }
    };
    
    let shader = Shaders.atmosphere;
    let uniforms = THREE.UniformsUtils.clone(shader.uniforms);

    let shaderMaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: shader.vertexShader,
        fragmentShader: shader.fragmentShader,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true
    });

    let atmGeometry = new THREE.SphereGeometry(R * 1000, 20, 20);
    let mesh = new THREE.Mesh(atmGeometry, shaderMaterial);
  
    mesh.scale.multiplyScalar(2.0);
    mesh.position.set(0,0,-R*1000);

    scene.add(mesh);
}

addAtmosphere();

var zoom = 4;
var updateSceneLazy = function(
        altitude = defaultAltitude,
        latitude = defaultLatitude,
        longitude = defaultLongitude
    )
    {
    //alert('updateSceneLazy: altitude: ' + altitude);
    ////////////////////////////////////////////////////////////
    var oldZoom = zoom;
    var zoom__ = Math.floor(Math.max(Math.min(Math.floor(27 - Math.log2(altitude)), 19), 1));

    if (zoom__ > ZOOM_MIN) {
        zoom = zoom__;
    }

    if (lonStamp != longitude || latStamp != longitude) {
        lonStamp = longitude;
        latStamp = latitude;
        earth.rotation.set(
            latitude * Math.PI / 180,
            (-longitude) * Math.PI / 180,
            0);
        var oldXtile = xtile;
        var oldYtile = ytile;
        xtile = GeoConversion.long2tile(lonStamp, zoom);
        ytile = GeoConversion.lat2tile(latStamp, zoom);

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
};

updateSceneLazy();

//Set callback to trigger manual rerendering of earth when a zoomlevel has changed.
if (!!callbackHelper){
    callbackHelper.setCallback(updateSceneLazy);
}

//Custom tilematerial which is using during loading of tiles
var tilematerial = new THREE.MeshBasicMaterial( { color: 0xffffff, opacity: 1, transparent: false } ); // new line
                       
function updateScene(position) {
    console.log('position.lon:', position.lon);
    console.log('position.lat:', position.lat);
    xtile = GeoConversion.long2tile(position.lon, zoom);
    ytile = GeoConversion.lat2tile(position.lat, zoom);

    var tiles = {};

    earth.remove(tileGroups);
    console.log('Removing tiles:' + tileGroups);
    console.log(tileGroups)

    tileGroups = new THREE.Object3D();
    earth.add(tileGroups);
    var oriGround = new THREE.Object3D();
    if (zoom >= ZOOM_FLAT) {
        var xtileOri = GeoConversion.long2tile(position.lon, ZOOM_FLAT);
        var ytileOri = GeoConversion.lat2tile(position.lat, ZOOM_FLAT);
        var lonOri = GeoConversion.tile2long(xtileOri, ZOOM_FLAT);
        var latOri = GeoConversion.tile2lat(ytileOri, ZOOM_FLAT);

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
            var lon1 = GeoConversion.tile2long(atile, zoom_);
            var lon2 = GeoConversion.tile2long(atile + 1, zoom_);
            var lon = (lon1 + lon2) / 2;
            for (var btile = minYtile; btile <= maxYtile; btile++) {
                var lat1 = GeoConversion.tile2lat(btile, zoom_);
                var lat2 = GeoConversion.tile2lat(btile + 1, zoom_);
                var lat = (lat1 + lat2) / 2;
                var widthUp = GeoConversion.measure(lat1, lon1, lat1, lon2);
                var widthDown = GeoConversion.measure(lat2, lon1, lat2, lon2);
                var widthSide = GeoConversion.measure(lat1, lon1, lat2, lon1);
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
                        tileMesh = toolbox.getTileMesh(R, zoom_, btile, Math.max(9 - zoom_, 0));
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
                        Toolbox.assignUVs(geometry);
                        var tileMesh = new THREE.Mesh(geometry,tilematerial);
                        var tileSupport = new THREE.Object3D(); //create an empty container
                        tileSupport.position.set(xTileShift * widthUp, -yTileShift * widthSide, 0);
                        tileSupport.add(tileMesh)
                        oriGround.add(tileSupport);
                    }
                    (function(yourTileMesh, yourZoom, yourXtile, yourYtile) {
                       textureLoader.textureFactory(
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
    textureLoader.cancelOtherRequests(currentIds);
}