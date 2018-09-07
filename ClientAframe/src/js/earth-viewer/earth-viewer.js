'use strict';
import {TileTextureProvider} from './util/tile-texture-provider.js'
import {TileMeshProvider} from "./util/tile-mesh-provider.js";
import WienerLinienLayer from './visualization/wienerlinienlayer.js'
import GeoConversion from './util/geoconversion.js'

var App = window.App || {};
var callbackHelper = App.callbackHelper;

/**
 * Earth Viewer constants
 */
class EarthProperties{}
EarthProperties.RADIUS = 6378137; //The default radius of the earth in km.
EarthProperties.DEFAULT_LATITUDE = 48.210033;
EarthProperties.DEFAULT_LONGITUDE = 16.363449;
EarthProperties.DEFAULT_ALTITUDE = EarthProperties.RADIUS;

EarthProperties.ZOOM_LEVEL_MIN = 1;
EarthProperties.ZOOM_LEVEL_FLAT = 13; //At this zoom level all tiles are rendered in a flat style (no curvatures)
EarthProperties.ZOOM_SHIFT_SIZE = 4;

EarthProperties.TILE_COLOR = 0xEFE9E1;
Object.freeze(EarthProperties);

class EarthViewer{
    constructor(scene){
        this.scene = scene;
        this._initEarthObject();
        this._initProperties();
        this._registerCallback();

        this._loadVisualization();
    }

    /**
     * Initializes 'private/internal' properties used by the earth viewer
     */
    _initProperties(){
        this.tileGroups = new THREE.Object3D();
        this.tileGroup = [];

        //Toolbox
        this.tileMeshProvider = new TileMeshProvider();

        //Texture loader
        this.textureLoader = new TileTextureProvider();

        //Zoom levels
        this.zoom = 4;

        this.lonStamp;
        this.latStamp;

        //Tiles
        this.xtile = 0;
        this.ytile = 0;
    }

    _initEarthObject(){
        this.earth = new THREE.Object3D();
        this.earth.position.set(0, 0, -EarthProperties.RADIUS);
        scene.add(this.earth);
        this._addAtmosphere();
    }

    _loadVisualization(){
        let visLayer = new WienerLinienLayer(scene, this.earth);
        visLayer.load();
    }

    _registerCallback(){
        callbackHelper.setCallback(
            (altitude, latitude, longitude) => {
                this.rerenderEarth(altitude,latitude,longitude);
            }
        );
    }

    _addAtmosphere(){
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
    
        let atmGeometry = new THREE.SphereGeometry(EarthProperties.RADIUS, 20, 20);
        let mesh = new THREE.Mesh(atmGeometry, shaderMaterial);
      
        mesh.scale.multiplyScalar(2.0);
        mesh.position.set(0,0, -EarthProperties.RADIUS);
    
        this.scene.add(mesh);
    }

    /**
     * Sets position of the earth.
     * Default values are x=0.0, y=0.0, z=0.0
     */
    setEarthPosition(x = 0.0, y = 0.0, z = 0.0){
        this.earth.position.set(x, y, z);
    }

    rerenderEarth(
        altitude = EarthProperties.DEFAULT_ALTITUDE,
        latitude = EarthProperties.DEFAULT_LATITUDE,
        longitude = EarthProperties.DEFAULT_LONGITUDE
    ){
        console.log('rerenderEarth: altitude: ' + altitude + ' lat: '+ latitude + ' lon: '+ longitude);
        ////////////////////////////////////////////////////////////
        let oldZoom = this.zoom;

        //Check Zoom level boundaries
        let zoom__ = Math.floor(Math.max(Math.min(Math.floor(27 - Math.log2(altitude)), 19), 1));

        if (zoom__ > EarthProperties.ZOOM_LEVEL_MIN) {
            this.zoom = zoom__;
        } else {
            this.zoom = EarthProperties.ZOOM_LEVEL_MIN;
        }

        if (this.lonStamp != longitude || this.latStamp != longitude) {
            //Check if latitude or longitude changed since last call and verify if an update is needed. (Movement by user changed by more than 1 tile)        
            this.lonStamp = longitude;
            this.latStamp = latitude;

            //Rotate the earth to new position
            this.earth.rotation.set(
                latitude * Math.PI / 180,
                (-longitude) * Math.PI / 180,
                0);

            //Calculate new tiles
            let oldXtile = this.xtile;
            let oldYtile = this.ytile;
            this.xtile = GeoConversion.long2tile(this.lonStamp, this.zoom);
            this.ytile = GeoConversion.lat2tile(this.latStamp, this.zoom);

            //If difference between old tile and new tile is larger than 1. Then update earth tiles.
            if (Math.abs(oldXtile - this.xtile) >= 1 ||
                Math.abs(oldYtile - this.ytile) >= 1) {
                this._redrawEarth({
                    'lon': this.lonStamp,
                    'lat': this.latStamp,
                    'alti': altitude
                });
            }
        } else if (Math.abs(zoom - oldZoom) >= 1) {
            //If zoom level has changed by 1 then update the earth.
            this._redrawEarth({
                'lon': this.lonStamp,
                'lat': this.latStamp,
                'alti': altitude
            });
        }
    }

    /**
     * Completely redraws (loads new tiles) the earth using the given position.
     * @param {*} position 
     */
    _redrawEarth(position){
        //alert('updateScene: ' + position);
        console.log('position.lon:', position.lon);
        console.log('position.lat:', position.lat);
        this.xtile = GeoConversion.long2tile(position.lon, this.zoom);
        this.ytile = GeoConversion.lat2tile(position.lat, this.zoom);

        let tiles = {};

        this.earth.remove(this.tileGroups);
        console.log('Removing tiles:' + this.tileGroups);
        console.log(this.tileGroups);
    
        this.tileGroups = new THREE.Object3D();
        this.earth.add(this.tileGroups);
        var oriGround = new THREE.Object3D();

        if (this.zoom >= EarthProperties.ZOOM_LEVEL_FLAT) {
            var xtileOri = GeoConversion.long2tile(position.lon, EarthProperties.ZOOM_LEVEL_FLAT);
            var ytileOri = GeoConversion.lat2tile(position.lat, EarthProperties.ZOOM_LEVEL_FLAT);
            var lonOri = GeoConversion.tile2long(xtileOri, EarthProperties.ZOOM_LEVEL_FLAT);
            var latOri = GeoConversion.tile2lat(ytileOri, EarthProperties.ZOOM_LEVEL_FLAT);
    
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
    
            this.tileGroups.add(oriLonRot);
        }
    
        var currentIds = {};

        for (var zoom_ = Math.max(this.zoom, EarthProperties.ZOOM_LEVEL_MIN);
                 zoom_ > Math.max(this.zoom - EarthProperties.ZOOM_SHIFT_SIZE, EarthProperties.ZOOM_LEVEL_MIN);
                 zoom_--) {
            var zShift = this.zoom - zoom_;
            this.tileGroup[zShift] = new THREE.Object3D(); //create an empty container
            this.tileGroups.add(this.tileGroup[zShift]);
    
            if (zoom_ < 0 && zShift > 0) {
                continue;
            }
            var factor = Math.pow(2, zShift);
            var xtile_ = Math.floor(this.xtile / factor);
            var ytile_ = Math.floor(this.ytile / factor);
            if (this.zoom < 8 && zoom_ < 6) {
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
               
                    var id = 'z_' + zoom_ + '_' + atile + "_" + btile;
                    for (var zzz = 1; zzz <= 2; zzz++) {                        
                        var idNext = 'z_' + (zoom_ - zzz) + '_' + Math.floor(atile / Math.pow(2, zzz)) + "_" + Math.floor(btile / Math.pow(2, zzz));
                        tiles[idNext] = {};
                    }
                    if (!tiles.hasOwnProperty(id)) {
                        
                        if (zoom_ < EarthProperties.ZOOM_LEVEL_FLAT) {
                            //Draw curved tiles
                            var tileMesh;
                            var tileEarth = new THREE.Object3D(); //create an empty container
                            tileEarth.rotation.set(0, (lon1 + 180) * Math.PI / 180, 0);
                            this.tileGroup[zShift].add(tileEarth);
                            tileMesh = this.tileMeshProvider.getTileMesh(R, zoom_, btile, Math.max(9 - zoom_, 0));
                            tileEarth.add(tileMesh);
                        } else {
                            //Draw flat tiles

                            /**
                             * Calculating some points, i guess?
                             */
                            var lat1 = GeoConversion.tile2lat(btile, zoom_);
                            var lat2 = GeoConversion.tile2lat(btile + 1, zoom_);
                            var lat = (lat1 + lat2) / 2;
                            var widthUp = GeoConversion.measure(lat1, lon1, lat1, lon2);
                            var widthDown = GeoConversion.measure(lat2, lon1, lat2, lon2);
                            var widthSide = GeoConversion.measure(lat1, lon1, lat2, lon1);

                            var tileMesh = this.tileMeshProvider.getFlatTileMesh(widthUp, widthDown);

                            var xTileShift = (atile - xtile_) + (xtile_ % Math.pow(2, zoom_ - EarthProperties.ZOOM_LEVEL_FLAT));
                            var yTileShift = (btile - ytile_) + (ytile_ % Math.pow(2, zoom_ - EarthProperties.ZOOM_LEVEL_FLAT));

                            var tileSupport = new THREE.Object3D(); //create an empty container
                            tileSupport.position.set(xTileShift * widthUp, -yTileShift * widthSide, 0);
                            tileSupport.add(tileMesh)
                            oriGround.add(tileSupport);
                        }
                        //Loads a tile texture... -> TODO: Find out why this is an IIFE????
                        (function(scope, yourTileMesh, yourZoom, yourXtile, yourYtile) {
                            scope.textureLoader.textureFactory(
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
                        })(this, tileMesh, zoom_, atile % modulus, btile % modulus);
                        var id = 'tile' + zoom_ + '_' + (atile % modulus) + '_' + (btile % modulus);
                        currentIds[id] = {};
                    }
                }
            }
        }
        this.textureLoader.cancelOtherRequests(currentIds);
    }
}

export {EarthViewer, EarthProperties};