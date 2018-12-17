'use strict';

var THREE = require('three');
var EventEmitter = require('eventemitter3');
require('three-instanced-mesh')(THREE);

import MousePicker from '../mousepicker';
import InstancedMeshBuilder from './rendering-helper/instanced-mesh-builder.js';
import DefaultMeshBuilder from './rendering-helper/default-mesh-builder.js';

import PickingScene from './pickingscene.js';

let eventEmitter = new EventEmitter();

eventEmitter.emit('positionChanged');

// Create an empty scene
let scene = new THREE.Scene();

let pickingSC = new PickingScene();

let scenes = [];
let activeSceneIdx = 0;
let activeScene = scenes[0];

scenes.push(scene);

// Create a basic perspective camera
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = 4;

var renderer = new THREE.WebGLRenderer();

// Configure renderer size
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize( window.innerWidth, window.innerHeight );
// Append Renderer to DOM
document.body.appendChild(renderer.domElement);

var mousePicker = new MousePicker(pickingSC, camera, renderer);

//Init controls
var controls = new THREE.OrbitControls(camera);
controls.update();





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
  let instancedMesh = instancedMeshGenerator.getMesh();
  instancedMesh.name = 'instanced_mesh';
  scene.add(instancedMesh);
}

createInstancedMesh();

function addToPickingScene(id, position, quaternion, scale){
  let geometry = new THREE.BoxGeometry(0.02,0.02,0.02);
  pickingSC.addObject(id, position, quaternion, scale, geometry);
}



function initEventEmitter(){
  if (!!EVENT_BUS){
    EVENT_BUS.on(
      'positionChanged',
      (args) => {
          handlePositionChange(args)
      }, this);
  }
}

function handlePositionChange(args){
  instancedMesh.rotation.x = instancedMesh.rotation.x + 2;
}

initEventEmitter();

let pickingScene = pickingSC.getScene();
let renderedScene = pickingScene;
let instancedMesh = scene.getObjectByName('instanced_mesh');

// Render Loop
var render = function () {
  requestAnimationFrame(render);
  mousePicker.tick();
  renderer.render(scene, camera);
};

render(); 

