'use strict';

var THREE = require('three');
require('three-instanced-mesh')(THREE);

import MousePicker from '../mousepicker';
import InstancedMeshBuilder from './rendering-helper/instanced-mesh-builder.js';
import DefaultMeshBuilder from './rendering-helper/default-mesh-builder.js';


// Create an empty scene
let scene = new THREE.Scene();
let pickingScene = new THREE.Scene();

let scenes = [];
let activeSceneIdx = 0;
let activeScene = scenes[0];
scenes.push(scene);
scenes.push(pickingScene);

// Create a basic perspective camera
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = 4;

var mousePicker = new MousePicker(pickingScene, camera);

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


function createInstancedMesh(){
  let instancedMeshGenerator = new InstancedMeshBuilder(boxGeometry, boxMaterial, 1000, false, true, false);

  for (var i = 0; i < 1000; i++){
      //get rotation of temp object
      let position = new THREE.Vector3(Math.random(), Math.random(), Math.random());
      let color = new THREE.Color(Math.random(), Math.random(), Math.random());
      let scale = new THREE.Vector3(Math.random(), Math.random(), Math.random());
  
      instancedMeshGenerator.addInstance(position, tempMesh.quaternion, color, scale);
      addToPickingScene(i, position, tempMesh.quaternion, scale);
  }
  // Add cube to Scene
  scene.add(instancedMeshGenerator.getMesh());
}

createInstancedMesh();

function addToPickingScene(id, position, quaternion, scale){
  let geometry = new THREE.BoxGeometry(0.02,0.02,0.02);
  let matrix = new THREE.Matrix4();
  let color = new THREE.Color();
  matrix.compose(position, quaternion, scale);
  geometry.applyMatrix(matrix);
  let material = new THREE.MeshBasicMaterial({
    color: color.setHex(id)
  });

  let mesh = new THREE.Mesh(geometry, material);
  pickingScene.add(mesh);
}



function addCubes(){
    let meshGenerator = new DefaultMeshBuilder();

    for (let i = 0; i < 100; i++){
      let cube = new THREE.BoxGeometry(0.02,0.02,0.02);
      let color = new THREE.Color(Math.random(), Math.random(), Math.random());
      let position = new THREE.Vector3(Math.random(), Math.random(), Math.random());
      let material = new THREE.MeshLambertMaterial({color: color});
      let mesh = new THREE.Mesh(cube, material);
      mesh.position.set(position.x, position.y, position.z);
      scene.add(mesh);
    }
}

//addCubes();

// Render Loop
var render = function () {
  requestAnimationFrame( render );

  mousePicker.tick();
  // Render the scene
  renderer.render(scene, camera);
};

render(); 

function changeScene() {
  if (activeSceneIdx < scenes.length - 1){
    activeSceneIdx++;
    activeScene[activeSceneIdx];
  } else {
    activeSceneIdx = 0;
  }
}

window.APP.scene = scene;
window["test"] = '2';
window.APP.changeScene = changeScene();