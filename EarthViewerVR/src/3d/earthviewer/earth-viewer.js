import {TileTextureProvider} from './util/tile-texture-provider.js'
import {TileMeshProvider} from "./util/tile-mesh-provider.js";
import WienerLinienLayer from './visualization/layers/wienerlinienlayer.js'
import PointLayer from './visualization/layers/primitives/pointlayer.js'
import GeoConversion from './util/geoconversion.js'
import BaseThreeJSComponent from './../components/base-threejs-component.js'
import Units from './util/units.js'
import BaseTileSource from './tilesource/base-tile-source.js'
import {VisualizationManager, VisualizationLayerType} from './visualization/visualizationmanager.js'

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

EarthProperties.ZOOM_LEVEL_EARTH_TRUNCATED = 6; //At this zoom level parts of the earth is culled and only areas visible for the viewer are displayed.

EarthProperties.TILE_COLOR = 0xEFE9E1;
Object.freeze(EarthProperties);

/**
 * Globals
 */
var App = window.App || {};
var callbackHelper = App.callbackHelper;
var userPosition = App.UserPosition;


class EarthViewer extends BaseThreeJSComponent{
    constructor(scene, ascene){
        super(ascene); 
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
    }

    //region Visualisation
    _loadVisualization(){
        const filePath = './src/assets/data/hospital/hospitalData.json'
        this._visualizationManager = new VisualizationManager(this.scene, this.earth);
        this._visualizationManager
            .createLayer(
                VisualizationLayerType.PointLayer, 
                filePath
            );
    }
    //endregion

    _registerCallback(){
        callbackHelper.setCallback(
            (altitude, latitude, longitude) => {
                this.rerenderEarth(altitude,latitude,longitude);
            }
        );
    }

    getUserPosition(){
        const userPositionClone = Object.assign({}, userPosition);
        return userPositionClone;
    }

    setUserPosition(latitude, longitude, altitude){
        if (!!latitude && !!longitude && !!altitude){
            userPosition.set(latitude, longitude, altitude);
        }
    }

    /**
     * Sets the provided tile source and rerenders the earth.
     * @param {*} tilesource 
     */
    setTileSource(tilesource){
        if (!!tilesource){
            this.textureLoader.setTileSource(tilesource);
        } else {
            console.error('ERROR: setMapTileSource: The provided maptilesource is invalid: ' );
        }
    }

    //region Interaction
    /**
     * Rotates the earth to a given latitude, longitude position and updates the userposition with the provided latitude, longitude values 
     * @param {*} latititude 
     * @param {*} longitude 
     */
    rotateTo(latitude, longitude, duration = 1000, options){
        var options = options || {};

        let position = {lat: userPosition.latitude , lon: userPosition.longitude};
        const newPosition = {lat: latitude, lon: longitude};

          /**
         * Ensure user is in a zoomed out position. otherwise don't apply the rotation effect. 
         * (Doesn't look good, because only parts of the earth is rendered)
         */
        if (this.zoom < EarthProperties.ZOOM_LEVEL_EARTH_TRUNCATED) {
            const tween = new TWEEN.Tween(position)
            .delay(0)
            .to(newPosition, duration)
            .easing(TWEEN.Easing.Quartic.InOut)
            .onUpdate(() => {
                //Rotate earth without loading tiles
                this.earth.rotation.set(
                    position.lat * Math.PI / 180,
                    (-position.lon) * Math.PI / 180,
                    0);
                //console.log('tween: lat:' + position.lat + ' lon: ' + position.lon)
                //this.rerenderEarth(undefined, position.lat, position.lon)
            })
            .onComplete(() => {
                //Set new position globally, so that controls can access the updated position.
                if (!!userPosition){
                    userPosition.set(position.lat, position.lon, userPosition.altitude);
                }
                /*
                //Rerender when the rotation is complete
                this.rerenderEarth(userPosition.altitude, position.lat, position.lon); */
            });
            tween.start();
        }    
    }


    /**
     * Rotates and updates the position of the earth to a new location in a defined time interval (duration).
     * 
     * {
     *    lat: 43.21,
     *    lon: 16.00,
     *    duration: 2000, (optional) : Default value will be 0.
     *    targetAltitude: 4000: Default value will be the current position altitude (Altitude wont be changed)
     *    
     *    
     * }
     * 
     * @param {*} latitude 
     * @param {*} longitude 
     * @param {*} duration 
     */
    flyTo(latitude, longitude, duration){

        let position = {lat: this.latStamp , lon: this.lonStamp};
        const newPosition = {lat: latitude, lon: longitude};

        //alert(this.zoom);

        /**
         * If the user is below below the zoom level, in which the earth is truncated.
         */
        if (this.zoom >= EarthProperties.ZOOM_LEVEL_EARTH_TRUNCATED){
            //alert('Earth truncated');
            if (!!userPosition){
                userPosition.set(position.lat, newPosition.lon, userPosition.altitude);
            }
            //Rerender when the rotation is complete
            this.rerenderEarth(userPosition.altitude, newPosition.lat, newPosition.lon);
        } else {
            const tween = new TWEEN.Tween(position)
            .delay(0)
            .to(newPosition, duration/2)
            .easing(TWEEN.Easing.Quartic.InOut)
            .onUpdate(() => {
                //Rotate earth without loading tiles
                this.earth.rotation.set(
                    position.lat * Math.PI / 180,
                    (-position.lon) * Math.PI / 180,
                    0);
                //console.log('tween: lat:' + position.lat + ' lon: ' + position.lon)
                //this.rerenderEarth(undefined, position.lat, position.lon)
            })
            .onComplete(() => {
                //Set new position globally, so that controls can access the updated position.
                if (!!userPosition){
                    userPosition.set(position.lat, position.lon, userPosition.altitude);
                }
                //Rerender when the rotation is complete
                this.rerenderEarth(userPosition.altitude, position.lat, position.lon);
            });
            tween.start();
        }    
    }

    enableAtmosphere(){
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
                    'gl_FragColor = vec4( atmosphereColor, 1.0 ) * intensity;',
                  '}'
                ].join('\n')
            },
            'atmosphere-cutout' : {
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
        
        const shader = Shaders.atmosphere;
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

    _getZoomLevel(altitude){
        const zoom = Math.floor(
            Math.max(
                Math.min(Math.floor(27 - Math.log2(
                    Units.toTHREE(altitude))
                ), 
                19
            ), 
        1));
        return zoom;
    }

    rerenderEarth(
        altitude = EarthProperties.DEFAULT_ALTITUDE,
        latitude = EarthProperties.DEFAULT_LATITUDE,
        longitude = EarthProperties.DEFAULT_LONGITUDE
    ){
        console.log('rerenderEarth: altitude: ' + altitude + ' lat: '+ latitude + ' lon: '+ longitude);
        ////////////////////////////////////////////////////////////
        const oldZoom = this.zoom;

        //Check Zoom level boundaries
        let newZoomLevel = this._getZoomLevel(altitude);

        if (newZoomLevel > EarthProperties.ZOOM_LEVEL_MIN) {
            this.zoom = newZoomLevel;
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
        } else if (Math.abs(this.zoom - oldZoom) >= 1) {
            //If zoom level has changed by 1 then update the earth.
            this._redrawEarth({
                'lon': this.lonStamp,
                'lat': this.latStamp,
                'alti': altitude
            });
        }
    }

    /**
     * Dismisses all tiles of earth and rerenders earth.
     */
    forceRerenderEarth(){
        this._redrawEarth({
            'lon': this.lonStamp,
            'lat': this.latStamp,
            'alti': this.userPosition.altitude
        });
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
                            tileMesh = this.tileMeshProvider.getTileMesh(EarthProperties.RADIUS, zoom_, btile, Math.max(9 - zoom_, 0));
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

    tick(time, delta){
        TWEEN.update(time);
    }
}

export {EarthViewer, EarthProperties};