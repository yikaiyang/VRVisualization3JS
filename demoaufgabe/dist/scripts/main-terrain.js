import { WEBVR } from '../libs/webVR.js';

var WINDOW_WIDTH = window.innerWidth;
var WINDOW_HEIGHT = window.innerHeight; 
var ASPECT_RATIO = WINDOW_WIDTH / WINDOW_HEIGHT;

//Scene properties
var WORLD_WIDTH = 2000;
var WORLD_HEIGHT = 1900;

//Create scene and initialize camera
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, ASPECT_RATIO, 0.1, 3000);
var renderer = new THREE.WebGLRenderer({antialias: false});

var clock = new THREE.Clock();

//Sets the size in which the app is rendered
var resolutionScale = 0.5; //Render at half resolution
renderer.setPixelRatio(window.devicePixelRatio * resolutionScale);
//TODO: Scale size according to display resolution. (Full resolution for 4K monitors is probably not required)
renderer.setSize(WINDOW_WIDTH, WINDOW_HEIGHT);
renderer.vr.enabled = true;

var color = new THREE.Color(0xffd4a6);
renderer.setClearColor(color,1.0);

camera.position.set(0,-180,120);
camera.up = new THREE.Vector3(0,0,1);

camera.lookAt(scene.position);

//Terrain
function loadCube(){
    var material = new THREE.MeshPhongMaterial({color: 'red'});
    var geometry = new THREE.BoxGeometry(50,50,50);
    var cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
}

loadCube();

function loadTerrain(){
    var scaleFactor = 1;
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
        }

        loadTexturedTerrain(terrainGeometry);
    });
}

//loadTerrain();

function loadTexturedTerrain(terrainGeometry){
    var texture;
    var textureLoader = new THREE.TextureLoader();
    var textureURL = "../data/Gale_texture_high_4096px.jpg";
    textureLoader.load(textureURL, function(texture){
        var material = new THREE.MeshLambertMaterial({
            map: texture
        });
        var surface = new THREE.Mesh(terrainGeometry, material);
        addToScene(surface);
        showWireFrame(terrainGeometry);
    });
}

function showWireFrame(geometry){
    //Make mesh visible
    var wireframeMesh = new THREE.LineSegments(geometry);
    wireframeMesh.material.depthTest = true;
    wireframeMesh.material.transparent = true;
    wireframeMesh.material.opacity = 0.2;
    wireframeMesh.material.color = new THREE.Color( 0xffffff);
    scene.add(wireframeMesh);
}

function addToScene(mesh){
    scene.add(mesh);
}

//Controls
// Detect mobile devices in the user agent
var is_mobile= /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
if (is_mobile){
    var controls = new THREE.VRControls(camera);
} else {
    var controls = new THREE.FlyControls(camera);
    controls.autoForward = false;
    controls.dragToLook = true;
    
    controls.movementSpeed = 20;
    controls.rollSpeed = Math.PI / 12;
}


function initLighting(){
    //Lighting
    var ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
}

function initVR(){
    document.body.appendChild( WEBVR.createButton( renderer ) );
}


document.body.appendChild(renderer.domElement);



initLighting();
initVR();

//Render loop
function render() {
    var delta = clock.getDelta();
    controls.update(delta);

    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

render();
