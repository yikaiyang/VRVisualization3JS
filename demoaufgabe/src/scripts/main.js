import {WEBVR} from './libs/webVR.js';
//import * as stat from './libs/threejs-stats.js';
import GeoBounds from './geo/geoBounds.js';

var clock = new THREE.Clock();

var container, canvas;
var camera, scene, renderer;
var ANTI_ALIAS = false;

var stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

//Create canvas dom-element for threejs render context
function initThreeJSCanvas(){
    container = document.createElement('div');
    container.setAttribute('id', 'container');
    document.body.appendChild( container );

    canvas = document.createElement('canvas');
    canvas.setAttribute('id', 'threejs');
    container.appendChild(canvas);
}



var boundaries = new GeoBounds(42.5,15.34,12.3,13.4);

init();
animate();

var isVRControls = false;
var keyboardControls;

//var tile = new Tile("test");

/** Load bitmap tile file from server **/
var loader = new THREE.FileLoader();
var imgLoader = new THREE.ImageLoader();
var textureLoader = new THREE.TextureLoader();

let mbUrl = 'https://api.mapbox.com/v4/mapbox.streets/10/558/355.png?access_token=pk.eyJ1IjoieWlrYWl5YW5nIiwiYSI6ImNqaXJ5eXd6MDBhOGwzcGxvMmUwZGxsaDkifQ.Czx2MTe4B6ynlMbpW52Svw';
let url = 'http://localhost:8081/tiles/10/557/354';
let textureUrl = '../data/Gale_texture_mobile_2048px.jpg';

function loadTile(zoom, x, y){
    imgLoader.load(
        mbUrl,
        //onload
        function (data){
            if (!!data){
                console.log(data);

                var container = document.getElementById('container');
                var canvas2 = container.appendChild(document.createElement('canvas'));
                canvas2.setAttribute('id', 'canvas2');

                var ctx = canvas2.getContext('2d');
                ctx.drawImage(data,0,0);

                //let image = new ImageData(imgArray, ctx.canvas.width, ctx.canvas.height);

                //ctx.putImageData(imgData, 0, 0);
                
                /** 
                let tile = JSON.parse(data);
                let imgData = (tile.tile_data || {}).data;
                
                let imgArray = new Uint8ClampedArray(imgData);
                console.log(imgArray);

                
                //console.log('id: ' + data.id);
                //console.log('imgData:' + imgData);

                var container = document.getElementById('container');
                
                var canvas2 = container.appendChild(document.createElement('canvas'));
                canvas2.setAttribute('id', 'canvas2');

                var ctx = canvas2.getContext('2d');
                ctx.fillStyle = 'red';

                let image = new ImageData(imgArray, ctx.canvas.width, ctx.canvas.height);
                ctx.putImageData(image,0,0);

                //ctx.putImageData(imgData, 0, 0);

                //var tileTexture = new THREE.Texture(imgData);
                //tileTexture.needsUpdate = true;
                
                **/
                //Add sample tile
                let tileTexture = new THREE.Texture(data);
                tileTexture.needsUpdate = true;

                var tileGeometry = new THREE.PlaneGeometry(120, 120, 1, 1);
                var tileMaterial = new THREE.MeshLambertMaterial({
                    color : 0x180B7E, 
                    wireframe: true,
                    map: tileTexture
                });
                var tileMesh = new THREE.Mesh(tileGeometry, tileMaterial);
                tileMesh.rotation.x  = -Math.PI / 2;
                scene.add(tileMesh);
                
            
            } else {
                console.error('Tile loading failed for tile {zoom:' + zoom + ' x: ' + x + ' y:' + y+ '}');
            }
        },
        //on progress
        undefined,
        //on error
        function(){
            console.log('Error at loader.load');
        }
    );
}

loadTile()

/**
 * Initializes VR Controls 
 * https://raw.githubusercontent.com/stewdio/THREE.VRController/master/index.html
 */

 //vr controller connect event fires even if no vr controller is detected??
function initVRControls(){
    window.addEventListener('vr controller connected', function(event){
        //  Here it is, your VR controller instance.
	    //  It’s really a THREE.Object3D so you can just add it to your scene:
        var controller = event.detail;
        scene.add(controller);

        //  HEY HEY HEY! This is important. You need to make sure you do this.
        //  For standing experiences (not seated) we need to set the standingMatrix
        //  otherwise you’ll wonder why your controller appears on the floor
        //  instead of in your hands! And for seated experiences this will have no
        //  effect, so safe to do either way:
        controller.standingMatrix = renderer.vr.getStandingMatrix();
        //controller.standingMatrix = camera.matrix;
        //console.log(camera.mat)

        //  And for 3DOF (seated) controllers you need to set the controller.head
        //  to reference your camera. That way we can make an educated guess where
        //  your hand ought to appear based on the camera’s rotation.

        var userHead = new THREE.Group();
 		userHead.position.set( 0, 1.5, 0 );
 		scene.add(userHead);
        userHead.add(camera);
        controller.head = userHead;
        //console.log("camera: {0}", camera);

        var meshColorOff = 0xDB3236;
        var meshColorOn  = 0xF4C20D;
        var controllerMaterial = new THREE.MeshStandardMaterial({
            color: meshColorOff
        });
        var controllerMesh = new THREE.Mesh(
            new THREE.CylinderGeometry(0.005, 0.05, 0.1, 6),
            controllerMaterial
        );

        var handleMesh = new THREE.Mesh(
            new THREE.BoxBufferGeometry(0.03, 0.1, 0.03),
            controllerMaterial
        );

        controllerMaterial.flatShading = true;
        controllerMesh.rotation.x = - Math.PI / 2;
        handleMesh.position.y = -0.05;
        controllerMesh.add(handleMesh);
        controller.userData.mesh = controllerMesh;
        controller.add(controllerMesh);

        //  Button events. How easy is this?!
        //  We’ll just use the “primary” button -- whatever that might be ;)
        //  Check out the THREE.VRController.supported{} object to see
        //  all the named buttons we’ve already mapped for you!
        controller.addEventListener( 'primary press began', function( event ){

            event.target.userData.mesh.material.color.setHex( meshColorOn );
            //guiInputHelper.pressed( true )
        });
        
        controller.addEventListener( 'primary press ended', function( event ){

            event.target.userData.mesh.material.color.setHex( meshColorOff );
            //guiInputHelper.pressed( false )
        });

        //  Daddy, what happens when we die?
        controller.addEventListener( 'disconnected', function( event ){
            console.log("Controller disconnected");
            controller.parent.remove( controller );
        });

        isVRControls = true;
    });
}

function initKeyboardControls(){
    keyboardControls = new THREE.OrbitControls(camera);
    keyboardControls.autoForward = false;
    keyboardControls.dragToLook = true;
    keyboardControls.movementSpeed = 2;
    keyboardControls.rollSpeed = Math.PI / 42;
}

function init() {
    initThreeJSCanvas();

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x505050 );
    camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 2000 );
    camera.position.set(0, 800, 50);
    camera.rotation.set(-Math.PI / 2,0,0);

    scene.add(camera);

    //loadTerrain();
    initPoints();
    
    initLighting();
    initKeyboardControls();
    //initVRControls();

    renderer = new THREE.WebGLRenderer( { antialias: ANTI_ALIAS , canvas: canvas } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth , window.innerHeight);
    renderer.vr.enabled = true;
    container.appendChild( renderer.domElement );
    window.addEventListener( 'resize', onWindowResize, false );
    window.addEventListener( 'vrdisplaypointerrestricted', onPointerRestricted, false );
    window.addEventListener( 'vrdisplaypointerunrestricted', onPointerUnrestricted, false );
    document.body.appendChild( WEBVR.createButton( renderer ) );
}

var TILE_SIZE = 100;

function loadTiles(){
    //Create a 5x5 grid of plane tiles
    for (var x = -2; x <= 2; x++ ){
        for (var y = -2; y <= 2; y++){
            var tileGeometry = new THREE.PlaneGeometry(TILE_SIZE, TILE_SIZE, 1, 1);
            var tileMaterial = new THREE.MeshLambertMaterial({
                color : 0x180B7E, 
                wireframe: true
            });
            var tileMesh = new THREE.Mesh(tileGeometry, tileMaterial);
            tileMesh.rotation.x  = -Math.PI / 2;
            tileMesh.position.set(x * TILE_SIZE, 0 , -y * TILE_SIZE);
            scene.add(tileMesh);
        }
    }
}

loadTiles();

function loadTerrain(){

    var WORLD_HEIGHT = 100;
    var WORLD_WIDTH = 100;

    var scaleFactor = 0.5;
    var DEM_FILE_WIDTH = 299;
    var DEM_FILE_HEIGHT = 284;

    if (scaleFactor > 1){
        scaleFactor = 1;
    }

    var DEM_WIDTH = Math.ceil(299 * scaleFactor); 
    var DEM_HEIGHT = Math.ceil(284 * scaleFactor);
    var terrainGeometry = new THREE.PlaneGeometry(WORLD_WIDTH, WORLD_HEIGHT, DEM_WIDTH, DEM_HEIGHT);


    terrainGeometry.verticesNeedUpdate = true;
    var terrMaterial = new THREE.MeshLambertMaterial({color : 0x834003});
    var terrainURL = "../data/Gale_HRSC_DEM_50m_300x285.bin";

    var terrainLoader = new THREE.TerrainLoader();
    terrainLoader.load(terrainURL, function(data){
        //console.log(data);
        console.log("terrainG length: " + terrainGeometry.vertices.length);
            
        for (var i = 0; i < terrainGeometry.vertices.length; i++){
            //console.log("terrainG length: " + terrainGeometry.vertices.length);
            //terrainGeometry.vertices[i].z = data[i] / 65535 * 100;
            terrainGeometry.vertices[i].z = Math.random() * 2;
        }
    
        var terrainMaterial = new THREE.MeshLambertMaterial({color : 0x834003});
        var terrainMesh = new THREE.Mesh(terrainGeometry, terrainMaterial);
        terrainMesh.rotation.x  = -Math.PI / 2;
        //scene.add(terrainMesh);
        loadTexturedTerrain(terrainGeometry);
    });
}

function initPoints(){
    //retrieve file
    var csvURL = "../data/haltestellen.csv";
    
    getFile(csvURL, function(text){
        var results = Papa.parse(text);
        drawStationPoints(results.data);
        //console.log(results);
    });
}

function drawStationPoints(stations){
    var cubeGeometry = new THREE.BoxBufferGeometry( 0.2, 1, 0.2);
    var cubeMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});

    for (let i = 1; i < stations.length; i++){
        let long = stations[i][6];
        let lat = stations[i][7];

        var cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
    
        var pos = {"long": long, "lat": lat};
        var coords = WGStoTileCoords(pos, coordBoundaries, tileBoundaries, -50);
        cubeMesh.position.set(coords.lat,2,-(coords.long));
        scene.add(cubeMesh);
        //console.log(coords);
        //console.log("long: {0} lat: {1}", stations[i][6], stations[i][7]);
    }
}

//Boundaries in WGS84 coords of a map tile
var coordBoundaries = {
    "maxLong": 48.247,
    "minLong": 48.10,
    "maxLat": 16.52,
    "minLat": 16.30
}

//Tile Boundaries in world space units (How large a tile is in the scene)
var tileBoundaries = {
    "tileWidth": 100,
    "tileHeight": 100
};

/**
 * Converts WGS coordinates to world coordinates in 
 * @param {*} pos   position of the point in WGS84
 * @param {*} coordBoundaries WGS84 Coordinate boundaries of the maptile
 * @param {*} tileBoundaries  Width and height of maptile
 * @param {*} offset          offset of center point to outer borders of maptile.
 */
function WGStoTileCoords(pos, coordBoundaries, tileBoundaries, offset){
    let long = pos.long;
    let lat = pos.lat;

    let maxLat = coordBoundaries.maxLat;
    let minLat = coordBoundaries.minLat;

    let maxLong = coordBoundaries.maxLong;
    let minLong = coordBoundaries.minLong;

    let nLat = ((lat - minLat) / (maxLat-minLat)) * tileBoundaries.tileWidth + offset;
    let nLong = ((long - minLong) / (maxLong-minLong)) * tileBoundaries.tileHeight + offset;
   
    var coords = {
        "lat": nLat,
        "long": nLong
    };

    //console.log(coords);

    return coords;
}

function getFile(fileURL, callback){
    var request = new XMLHttpRequest();
    request.open("GET", fileURL, true);
    request.onreadystatechange = function(){
        if (request.readyState === 4){
            if (request.status === 200 || request.status === 0){
                var text = request.responseText;
                callback(text);
            }
        }
    }
    request.send(null);
}

function loadTexturedTerrain(terrainGeometry){
    var texture;
    var textureLoader = new THREE.TextureLoader();
    var textureURL = "../data/Gale_texture_high_4096px.jpg";
    textureLoader.load(textureURL, function(texture){
        var material = new THREE.MeshLambertMaterial({
            map: texture
        });
        var surface = new THREE.Mesh(terrainGeometry, material);
        surface.rotation.x = -Math.PI /2;
        scene.add(surface);
    });
}

function initLighting(){
    var ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
}

function onPointerRestricted() {
    var pointerLockElement = renderer.domElement;
    if ( pointerLockElement && typeof(pointerLockElement.requestPointerLock) === 'function' ) {
        pointerLockElement.requestPointerLock();
    }
}

function onPointerUnrestricted() {
    var currentPointerLockElement = document.pointerLockElement;
    var expectedPointerLockElement = renderer.domElement;
    if ( currentPointerLockElement && currentPointerLockElement === expectedPointerLockElement && typeof(document.exitPointerLock) === 'function' ) {
        document.exitPointerLock();
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
    renderer.setAnimationLoop(render);
}

function render() {
    stats.begin();
    var delta = clock.getDelta() * 60;

    if (isVRControls){
        THREE.VRController.update();
    } else {
        if (keyboardControls != undefined){
            keyboardControls.update(delta);
        } else {
            //alert("KeyboardControls undefined");
        }
  
    }

    renderer.render( scene, camera );
    stats.end();
}
    
