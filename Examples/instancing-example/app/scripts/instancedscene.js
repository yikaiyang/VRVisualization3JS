'use strict';

var THREE = require('three');
require('three-instanced-mesh')(THREE);

//import InstancedMeshGenerator from './instanced-mesh-generator';

// Create an empty scene
var scene = new THREE.Scene();

// Create a basic perspective camera
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = 4;

//Init controls
var controls = new THREE.OrbitControls(camera);
controls.update();

var renderer = new THREE.WebGLRenderer();

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
var boxMaterial = new THREE.MeshLambertMaterial();

var tempGeometry = new THREE.BoxGeometry(1,1,1);
var tempMesh = new THREE.Mesh(
    tempGeometry, 
    new THREE.MeshBasicMaterial()
);
tempMesh.position.set(1,1,1);
tempMesh.lookAt(0,0,0);
//scene.add(tempMesh);

function initInstancedMesh(
        geometry, 
        material, 
        instanceCount, 
        isDynamic = false,
        hasColor = false,
        isUniformScaled = false
    ){
    var cluster = new THREE.InstancedMesh(
        boxGeometry,
        boxMaterial,
        1000,
        false,
        true,
        false,
    );
}

var cluster = new THREE.InstancedMesh(
    boxGeometry,
    boxMaterial,
    1000,
    false,
    true,
    false,
);

var offsetVec = new THREE.Vector3();
var quaternion = new THREE.Quaternion();
var scaleVec = new THREE.Vector3(1,1,1);

for (var i = 0; i < 1000; i++){
    //get rotation of temp object

    cluster.setQuaternionAt(i, tempMesh.quaternion);
    cluster.setPositionAt(i, offsetVec.set(
        Math.random(), Math.random(), Math.random()
    ));
    var color = new THREE.Color(Math.random(), Math.random(), Math.random());
    cluster.setColorAt(i,color);
    var scale = new THREE.Vector3(Math.random(), Math.random(), Math.random());
    cluster.setScaleAt(i,scale);
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