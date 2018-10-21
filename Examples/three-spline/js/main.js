import GeoConversion from './geoconversion.js';

const newYork = {
    lat: 40.730610,
    lon: -73.935242
};

const vienna = {
    lat: 48.210033, 
    lon: 16.363449
};

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
var controls = new THREE.OrbitControls( camera );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//Create sphere
let sphereGeometry = new THREE.SphereGeometry(5,12,12);
let sphereMaterial = new THREE.MeshNormalMaterial( {color: 0xffffff, wireframe: true, opacity: 0.5, transparent: true});
let sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphereMesh);

//World coordinates of location point
let newYorkWC = GeoConversion.WGStoGlobeCoord(newYork.lat, newYork.lon, 5);
let viennaWC = GeoConversion.WGStoGlobeCoord(vienna.lat, vienna.lon, 5);

console.log('NY x:' + newYorkWC.x + ' y: ' + newYorkWC.y + ' z: ' + newYorkWC.z);
console.log('vienna x:' + viennaWC.x + ' y: ' + viennaWC.y + ' z: ' + viennaWC.z);

// Create a sine-like wave
var curve = new THREE.SplineCurve( [
    new THREE.Vector3( newYorkWC.x, newYorkWC.y , newYorkWC.z),
    //new THREE.Vector3( -2.5, 5, 0),
    new THREE.Vector3( viennaWC.x, viennaWC.y , viennaWC.z),
] );

var points = curve.getPoints( 50 );
var geometry = new THREE.BufferGeometry().setFromPoints( points );

var material = new THREE.LineBasicMaterial( { color : 0xff0000 } );

// Create the final object to add to the scene
var splineObject = new THREE.Line( geometry, material );

//splineObject.lookAt(10,0,10);

scene.add(splineObject);

const gridHelper = new THREE.GridHelper(10,10);
scene.add(gridHelper);

/*
var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( {color: 0x333333 });
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );*/

camera.position.z = 30;

var animate = function () {
    requestAnimationFrame( animate );
    controls.update();
    //cube.rotation.x += 0.01;
    //cube.rotation.y += 0.01;

    renderer.render( scene, camera );
};

animate();