'use strict';

var THREE = require('three');
require('three-instanced-mesh')(THREE);

import InstancedMeshBuilder from './rendering-helper/instanced-mesh-builder.js';

// Create an empty scene
let scene = new THREE.Scene();

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

var cluster = new THREE.InstancedMesh(
    boxGeometry,
    boxMaterial,
    1000,
    false,
    true,
    false,
);

let instancedMeshGenerator = new InstancedMeshBuilder(boxGeometry, boxMaterial, 1000, false, true, false);

for (var i = 0; i < 1000; i++){
    //get rotation of temp object
    
    let position = new THREE.Vector3(Math.random(), Math.random(), Math.random());
    let color = new THREE.Color(Math.random(), Math.random(), Math.random());
    let scale = new THREE.Vector3(Math.random(), Math.random(), Math.random());

    cluster.setQuaternionAt(i, tempMesh.quaternion);
    cluster.setColorAt(i,color);
    cluster.setPositionAt(i, position);
    cluster.setScaleAt(i,scale);

    instancedMeshGenerator.addInstance(position, tempMesh.quaternion, color, scale);
}

// Add cube to Scene
//scene.add( cube );
scene.add(instancedMeshGenerator.getMesh());

// Render Loop
var render = function () {
  requestAnimationFrame( render );

  // Render the scene
  renderer.render(scene, camera);
};

render(); 