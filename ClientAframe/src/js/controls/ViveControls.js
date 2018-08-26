/* var KEYCODE_TO_CODE = require('../constants').keyboardevent.KEYCODE_TO_CODE;
var registerComponent = require('../core/component').registerComponent;
var THREE = require('../lib/three');
var utils = require('../utils/');

var bind = utils.bind;
var shouldCaptureKeyEvent = utils.shouldCaptureKeyEvent;
*/

var shouldCaptureKeyEvent = function (event) {
  if (event.metaKey) { return false; }
  return document.activeElement === document.body;
};

var KEYCODE_TO_CODE = {
  '38': 'ArrowUp',
  '37': 'ArrowLeft',
  '40': 'ArrowDown',
  '39': 'ArrowRight',
  '87': 'KeyW',
  '65': 'KeyA',
  '83': 'KeyS',
  '68': 'KeyD'
}

var CLAMP_VELOCITY = 0.00001;
var MAX_DELTA = 0.2;
var KEYS = [
  'KeyW', 'KeyA', 'KeyS', 'KeyD',
  'ArrowUp', 'ArrowLeft', 'ArrowRight', 'ArrowDown'
];

var pressedKeys = {};
var zoomScale = 1;
var spherical = new THREE.Spherical(6378000, 0, 0);

/**
 * WASD component to control entities using WASD keys.
 */
AFRAME.registerComponent('vive-wasd-controls', {
  schema: {
    acceleration: {default: 10000},
    adAxis: {default: 'x', oneOf: ['x', 'y', 'z']},
    adEnabled: {default: true},
    adInverted: {default: false},
    easing: {default: 20},
    enabled: {default: true},
    maxDistance: {default: 10000000},
    minDistance: {default: 100},
    fly: {default: false},
    wsAxis: {default: 'z', oneOf: ['x', 'y', 'z']},
    wsEnabled: {default: true},
    wsInverted: {default: false}
  },

  init: function () {

    console.log('ViveControls initialized');
    // To keep track of the pressed keys.
    pressedKeys = {};

    this.position = {};
    this.velocity = new THREE.Vector3();

    // Bind methods and add event listeners.
    /**
    this.onBlur = bind(this.onBlur, this);
    this.onFocus = bind(this.onFocus, this);
    this.onKeyDown = bind(this.onKeyDown, this);
    this.onKeyUp = bind(this.onKeyUp, this);
    this.onVisibilityChange = bind(this.onVisibilityChange, this);**/
    this.attachKeyEventListeners();
  },

  tick: function (time, delta) {

    //console.log('t:'  + time);
    var currentPosition;
    var data = this.data;
    var el = this.el;
    var movementVector;
    var position = this.position;
    var velocity = this.velocity;

    var camera = el.getObject3D('camera');

    if (!velocity[data.adAxis] && !velocity[data.wsAxis] &&
        isEmptyObject(pressedKeys)) { return; }

    // Update velocity.
    delta = delta / 1000;
    this.updateVelocity(delta);

    if (!velocity[data.adAxis] && !velocity[data.wsAxis]) { return; }

    // Get movement vector and translate position.
    currentPosition = camera.position;
    
    console.log('current position: '
                + ' x: ' + currentPosition.x 
                + ' y: ' + currentPosition.y 
                + ' z: ' + currentPosition.z 
                + ' minDistance: ' + data.minDistance
                + ' maxDistance: ' + data.maxDistance
              );

    movementVector = this.getMovementVector(delta);
    position.x = currentPosition.x + movementVector.x;
    position.y = currentPosition.y + movementVector.y;
    //position.z = currentPosition.z + movementVector.z;

    var scaleFactor = 0.98;

    //Enable non linear zooming.
    if (pressedKeys.KeyW || pressedKeys.ArrowUp) { 
      //Zoom into the earth. Reduce acceleration the closer the position is to earth.
      position.z = currentPosition.z * 0.98;
    }
    if (pressedKeys.KeyS || pressedKeys.ArrowDown) { 
      position.z = currentPosition.z / 0.98;
    }

    // Check if current position has already reached boundaries
/*     if (position.z > data.maxDistance){
      position.z = data.maxDistance;
    } 

    if (position.z < data.minDistance){
      position.z = data.minDistance;
    } */

    //el.setAttribute('position', posidtion);
    camera.position.set(position.x, position.y, position.z);
  },

  remove: function () {
    this.removeKeyEventListeners();
    this.removeVisibilityEventListeners();
  },

  play: function () {
    this.attachKeyEventListeners();
  },

  pause: function () {
    pressedKeys = {};
    this.removeKeyEventListeners();
  },

  updateVelocity: function (delta) {
    var acceleration;
    var adAxis;
    var adSign;
    var data = this.data;
    var keys = pressedKeys;
    var velocity = this.velocity;
    var wsAxis;
    var wsSign;

    adAxis = data.adAxis;
    wsAxis = data.wsAxis;

    // If FPS too low, reset velocity.
    if (delta > MAX_DELTA) {
      velocity[adAxis] = 0;
      velocity[wsAxis] = 0;
      return;
    }

    // Decay velocity.
    if (velocity[adAxis] !== 0) {
      velocity[adAxis] -= velocity[adAxis] * data.easing * delta;
    }
    if (velocity[wsAxis] !== 0) {
      velocity[wsAxis] -= velocity[wsAxis] * data.easing * delta;
    }

    // Clamp velocity easing.
    if (Math.abs(velocity[adAxis]) < CLAMP_VELOCITY) { velocity[adAxis] = 0; }
    if (Math.abs(velocity[wsAxis]) < CLAMP_VELOCITY) { velocity[wsAxis] = 0; }

    if (!data.enabled) { return; }

    // Update velocity using keys pressed.
    acceleration = data.acceleration;
    if (data.adEnabled) {
      adSign = data.adInverted ? -1 : 1;
      if (keys.KeyA || keys.ArrowLeft) { velocity[adAxis] -= adSign * acceleration * delta; }
      if (keys.KeyD || keys.ArrowRight) { velocity[adAxis] += adSign * acceleration * delta; }
    }
    if (data.wsEnabled) {
      wsSign = data.wsInverted ? -1 : 1;

      let scaleFactor = 1;
     
      //Enable non linear zooming.
      if (keys.KeyW || keys.ArrowUp) { 
        //Zoom into the earth. Reduce acceleration the closer the position is to earth.
        zoomScale = zoomScale * scaleFactor;
        velocity[wsAxis] -= wsSign * acceleration * zoomScale * delta; 
        console.log('zoomScale: ' + zoomScale);
      }
      if (keys.KeyS || keys.ArrowDown) { 
        zoomScale = zoomScale / scaleFactor;
        velocity[wsAxis] += wsSign * acceleration * zoomScale * delta;
        console.log('zoomScale: ' + zoomScale);
      }

      
    }
  },

  getMovementVector: (function () {
    var directionVector = new THREE.Vector3(0, 0, 0);
    var rotationEuler = new THREE.Euler(0, 0, 0, 'YXZ');

    return function (delta) {
      var rotation = this.el.getAttribute('rotation');
      var velocity = this.velocity;
      var xRotation;

      directionVector.copy(velocity);
      directionVector.multiplyScalar(delta);

      // Absolute.
      if (!rotation) { return directionVector; }

      xRotation = this.data.fly ? rotation.x : 0;

      // Transform direction relative to heading.
      rotationEuler.set(THREE.Math.degToRad(xRotation), THREE.Math.degToRad(rotation.y), 0);
      directionVector.applyEuler(rotationEuler);
      return directionVector;
    };
  })(),

  attachVisibilityEventListeners: function () {
    window.addEventListener('blur', this.onBlur);
    window.addEventListener('focus', this.onFocus);
    document.addEventListener('visibilitychange', this.onVisibilityChange);
  },

  removeVisibilityEventListeners: function () {
    window.removeEventListener('blur', this.onBlur);
    window.removeEventListener('focus', this.onFocus);
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
  },

  attachKeyEventListeners: function () {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  },

  removeKeyEventListeners: function () {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
  },

  onBlur: function () {
    this.pause();
  },

  onFocus: function () {
    this.play();
  },

  onVisibilityChange: function () {
    if (document.hidden) {
      this.onBlur();
    } else {
      this.onFocus();
    }
  },

  onKeyDown: function (event) {
    var code;
    if (!shouldCaptureKeyEvent(event)) { return; }
    code = event.code || KEYCODE_TO_CODE[event.keyCode];
    if (KEYS.indexOf(code) !== -1) { 
      pressedKeys[code] = true; 
    }
  },

  onKeyUp: function (event) {
    var code;
    code = event.code || KEYCODE_TO_CODE[event.keyCode];
    delete pressedKeys[code];
  }
});

function isEmptyObject (keys) {
  var key;
  for (key in keys) { return false; }
  return true;
}