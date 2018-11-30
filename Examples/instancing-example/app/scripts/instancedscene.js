'use strict';

var THREE = require('three');
require('three-instanced-mesh')(THREE);

// Create an empty scene
var scene = new THREE.Scene();

// Create a basic perspective camera
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = 4;

//Init controls
var controls = new THREE.OrbitControls(camera);
controls.update();

var renderer = new THREE.WebGLRenderer();

// Configure renderer clear color
//renderer.setClearColor("#000000");

// Configure renderer size
renderer.setSize( window.innerWidth, window.innerHeight );

// Append Renderer to DOM
document.body.appendChild(renderer.domElement);

// ------------------------------------------------
// FUN STARTS HERE
// ------------------------------------------------



//lights
var light = new THREE.HemisphereLight( 0xffffff, 0x080820, 1 );
scene.add(light);

var boxGeometry = new THREE.BoxBufferGeometry(0.02,0.02,0.02);
var boxMaterial = new THREE.MeshLambertMaterial({
    color: 'white'
});

var cluster = new THREE.InstancedMesh(
    boxGeometry,
    boxMaterial,
    1000,
    false,
    false,
    false,
);

var offsetVec = new THREE.Vector3();
var quaternion = new THREE.Quaternion();
var scaleVec = new THREE.Vector3(1,1,1);

for (var i = 0; i < 1000; i++){
    cluster.setQuaternionAt(i, quaternion);
    cluster.setPositionAt(i, offsetVec.set(
        Math.random(), Math.random(), Math.random()
    ));

    var scale = new THREE.Vector3(Math.random(), Math.random(), Math.random());
    cluster.setScaleAt(i, scale);
}

// Add cube to Scene
//scene.add( cube );
scene.add(cluster);

// Render Loop
var render = function () {
  requestAnimationFrame( render );

  // Render the scene
  renderer.render(scene, camera);
};

render(); 