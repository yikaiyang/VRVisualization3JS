'use strict';
/**
 * @author Yikai Yang
 * Custom wasd / htc vive controls which is used for navigation in the earth viewer
 * based on aframe wasd controls
 */

var App = App || {};
var userPosition = App.UserPosition;
var EVENT_BUS = window.EVENT_BUS;

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
  '68': 'KeyD',
  '84': 'KeyT',
  '71': 'KeyG',
  '69': 'KeyE',
  '81': 'KeyQ'
}

var CLAMP_VELOCITY = 0.00001;
var MAX_DELTA = 0.2;
var KEYS = [
  'KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyT', 'KeyG',
  'KeyE', 'KeyQ',
  'ArrowUp', 'ArrowLeft', 'ArrowRight', 'ArrowDown',
  'MoveFrwd', 'MoveBwrd'
];

let pressedKeys = {}; //Stores pressed keyboard values
let viveAxisValues = {}; //Stores vive trackpad values

var zoomScale = 1;

/**
 * WASD component to control entities using WASD keys.
 */
AFRAME.registerComponent('vive-wasd-controls', {
  schema: {
    acceleration: { default: 10000 },
    adAxis: { default: 'x', oneOf: ['x', 'y', 'z'] },
    adEnabled: { default: true },
    adInverted: { default: false },
    cameraRigIdentifier: { type: 'string'},
    easing: { default: 20 },
    enabled: { default: false },
    maxDistance: { default: 6378000 },
    minDistance: { default: 200 },
    fly: { default: false },
    vrEnabled: {default: false}, ///When VrEnabled is set to true. 
    wsAxis: { default: 'z', oneOf: ['x', 'y', 'z'] },
    wsEnabled: { default: true },
    wsInverted: { default: false }
  },

  init: function () {
    console.log('ViveControls initialized');
    // To keep track of the pressed keys.
    pressedKeys = {};

    this.position = {};
    this.isVREnabled = false;
    //this.velocity = new THREE.Vector3();
    // Bind methods and add event listeners.
    /**
    this.onBlur = bind(this.onBlur, this);
    this.onFocus = bind(this.onFocus, this);
    this.onKeyDown = bind(this.onKeyDown, this);
    this.onKeyUp = bind(this.onKeyUp, this);
    this.onVisibilityChange = bind(this.onVisibilityChange, this);**/
    this.attachKeyEventListeners();
    this.attachViveKeyEventListeners();

    ///Handle transition to camera rig 
    this.el.sceneEl.addEventListener('enter-vr', () => {
			if (!AFRAME.utils.device.checkHeadsetConnected() &&
        !AFRAME.utils.device.isMobile()) { return; }
        this.isVREnabled = true;
        //alert('yay VR ' + this.isVREnabled);
        //console.log('yay VR ' + event.target);
        //vrEnabled = true;

		});

	  this.el.sceneEl.addEventListener('exit-vr', () => {
			if (!AFRAME.utils.device.checkHeadsetConnected() &&
        !AFRAME.utils.device.isMobile()) { return; }
        this.isVREnabled = false;
        //alert('bye VR ' + this.isVREnabled);
        ///vrEnabled = false;
    });
  },

  tick: function (time, delta) {
    var data = this.data;
    var el = this.el;
    let scene = el.sceneEl;
    let height = scene.clientHeight;
    this.height = height;
    let cameraRig;
    //var movementVector;
    //var position = this.position;
    //var velocity = this.velocity;

    /**
     * Example how to set position when in camera rig mode
     * 
     * document.querySelector('#camera-rig').object3D.position.set(0,0,10000)
     */

    if (!data.enabled) { 
      return; 
    } //Check whether control is enabled. Do nothing if control is disabled
    if (isEmptyObject(pressedKeys)) { return; }

    let cameraRigId = data.cameraRigIdentifier;

    if (cameraRigId){
      //alert('cameraRigIdentifier: ' + data.cameraRigIdentifier);
      cameraRig = document.querySelector('#camera-rig');
      if (cameraRig !== undefined){
        cameraRig = cameraRig.object3D;
      }
    }

    //Check if camera rig identifier is provided
    var camera = el.getObject3D('camera');
    if (camera === undefined) {
      //If there is no camera element in the current element, move the position of the current element instead.
      // In this case vive-wasd-controls is placed in the #camera-rig element
      camera = el.object3D;
    }
 

    /*     if (!velocity[data.adAxis] && !velocity[data.wsAxis] &&
            isEmptyObject(pressedKeys)) { return; } */

    // Update velocity.
    delta = delta / 1000;
    //this.updateVelocity(delta);

    //if (!velocity[data.adAxis] && !velocity[data.wsAxis]) { return; }

 /*    console.log('current camera position: '
      + ' x: ' + currentPosition.x
      + ' y: ' + currentPosition.y
      + ' z: ' + currentPosition.z
      + ' minDistance: ' + data.minDistance
      + ' maxDistance: ' + data.maxDistance
    ); */

    let position = camera.position;

    var scaleFactor = 0.98;  //Factor by which the earth is enlarged when zoomed in/out.

    // console.log(pressedKeys);

    let panAcceleration = 10;

    //Vive controls
    if (pressedKeys.TrackpadDown){
      //Handle Vive trackpad input
      let x = viveAxisValues.x;
      let y = viveAxisValues.y;

      let panScale = panAcceleration * userPosition.altitude / height;
      this.pan(-x * panScale, y * panScale);
      this.updateEarthPosition();
    }

    // Zoom in / out
    if (pressedKeys.KeyT || pressedKeys.MoveFwdVive) {
      console.log('KeyT handled');
      //Zoom into the earth. Reduce acceleration the closer the position is to earth.
      userPosition.altitude = userPosition.altitude * scaleFactor;
      this.updateEarthPosition();
    }

    if (pressedKeys.KeyG || pressedKeys.MoveBwdVive) {
      userPosition.altitude = userPosition.altitude / scaleFactor;
      this.updateEarthPosition();
    }

    //Pan earth

    if (pressedKeys.KeyW || pressedKeys.ArrowUp) {
      this.panUp(panAcceleration * userPosition.altitude / height);
      this.updateEarthPosition();
    }

    if (pressedKeys.KeyS || pressedKeys.ArrowDown) {
      this.panUp(-panAcceleration * userPosition.altitude / height);
      this.updateEarthPosition();
    }

    if (pressedKeys.KeyA || pressedKeys.ArrowLeft) {
      this.panLeft(panAcceleration * userPosition.altitude / height);
      this.updateEarthPosition();
    }

    if (pressedKeys.KeyD || pressedKeys.ArrowRight) {
      this.panLeft(panAcceleration * -userPosition.altitude / height);
      this.updateEarthPosition();
    }

    // Limit camera position by defined max / min distance.
    if (userPosition.altitude > data.maxDistance) {
      userPosition.altitude = data.maxDistance;
    }

    if (userPosition.altitude < data.minDistance) {
      userPosition.altitude = data.minDistance;
    }

    //el.setAttribute('position', position);

    //Use threejs camera object to prevent interferences with orbit controls
    if (!this.isVREnabled){
      //Move the 'traditional' camera object when not in VR mode. 
      //camera.position.set(position.x, position.y, userPosition.altitude);
      camera.position.set(position.x, position.y, userPosition.altitude);
    } else {
      //Move the outer camera rig element object when in VR mode. (Camera position will be overriden by the VR Headset)
      cameraRig.position.set(position.x, position.y, userPosition.altitude);
    }
   
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
  /**
   * Pan left function with functionality similar to AframeOrbitControls.
   */
  panLeft: function (distance) {
    //Assume thetha is 0
    let theta = 0;
    let R = 6370; // Radius of earth
    var lonDelta = Math.cos(theta) * (distance / (1000 * R * Math.cos(userPosition.latitude * Math.PI / 180))) * 180 / Math.PI;
    userPosition.longitude -= lonDelta;
    var latDelta = -Math.sin(theta) * (distance / (R * 1000)) * 180 / Math.PI;

    /* console.log('panLeft: lonDelta: ' + lonDelta
      + ' latDelta: ' + latDelta
      + ' lonDelta: ' + lonDelta
      + ' latitude: ' + userPosition.latitude
      + ' longitude: ' + userPosition.longitude
      + ' tetha: ' + theta); */
    if (userPosition.latitude + latDelta < 80 && userPosition.latitude + latDelta > -80) {
      userPosition.latitude += latDelta;
      // console.log('latitude:', latitude)
    }
    // latitude = (latitude + 90) % 180 - 90;
    userPosition.longitude = (userPosition.longitude + 540) % 360 - 180;
    console.log('latitude: ' + userPosition.latitude + 'longitude: ' + userPosition.longitude);
  },

  panUp: function (distance) {
    let theta = 0;
    let R = 6370;

    var lonDelta = Math.sin(theta) * (distance / (1000 * R * Math.cos(userPosition.latitude * Math.PI / 180))) * 180 / Math.PI;
    userPosition.longitude -= lonDelta;
    var latDelta = Math.cos(theta) * (distance / (1000 * R)) * 180 / Math.PI;

 /*    console.log('panUp: lonDelta: ' + lonDelta
      + ' latDelta: ' + latDelta
      + ' lonDelta: ' + lonDelta
      + ' latitude: ' + userPosition.latitude
      + ' longitude: ' + userPosition.longitude); */

    if (userPosition.latitude + latDelta < 80 && userPosition.latitude + latDelta > -80) {
      userPosition.latitude += latDelta;
    }
    // latitude = (latitude + 90) % 180 - 90;
    userPosition.longitude = (userPosition.longitude + 360) % 360;
  },

  pan: function (distanceX, distanceY) {
    this.panLeft(distanceX);
    this.panUp(distanceY);
  },
  /* 
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
      if (keys.KeyA || keys.ArrowLeft) {
        velocity[adAxis] -= adSign * acceleration * delta;
      }
      if (keys.KeyD || keys.ArrowRight) {
        velocity[adAxis] += adSign * acceleration * delta;
      }
    }
    if (data.wsEnabled) {
      wsSign = data.wsInverted ? -1 : 1;

      let scaleFactor = 1;

      if (keys.KeyW || keys.ArrowUp || keys.moveFrwdVive) {
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
  }, */
  updateEarthPosition: function(){
    if (!!EVENT_BUS){
      EVENT_BUS.emit('earthviewer:positionChanged', {
        'altitude': userPosition.altitude,
        'longitude': userPosition.longitude,
        'latitude': userPosition.latitude
      });
    }
  },

  /*
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
  })(),*/

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

  attachViveKeyEventListeners: function () {
    window.addEventListener('triggerup', this.triggerUp);
    window.addEventListener('triggerdown', this.triggerDown);
    window.addEventListener('trackpaddown', this.trackpadDown);
    window.addEventListener('trackpadup', this.trackpadUp);
    window.addEventListener('trackpadchanged', this.trackpadChanged);
    window.addEventListener('axismove', this.axisMove);
  },

  removeViveKeyEventListeners: function () {
    window.removeEventListener('triggerup', this.triggerUp);
    window.removeEventListener('triggerdown', this.triggerDown);
    window.removeEventListener('trackpaddown', this.trackpadDown);
    window.removeEventListener('trackpadup', this.trackpadUp);
    window.removeEventListener('trackpadchanged', this.trackpadChanged);
    window.removeEventListener('axismove', this.axisMoved);
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
    if (!shouldCaptureKeyEvent(event)) {
      return;
    }
    code = event.code || KEYCODE_TO_CODE[event.keyCode];
    if (KEYS.indexOf(code) !== -1) {
      console.log('keyDown: ' + code);
      pressedKeys[code] = true;
    }
  },

  onKeyUp: function (event) {
    var code;
    code = event.code || KEYCODE_TO_CODE[event.keyCode];
    console.debug('keyUp: ' + code)
    delete pressedKeys[code];
  },

  /** HTC Vive controller event handlers */
  triggerUp: function (event) {
    // console.log("trigger up!");
    console.debug('trigger up');
    delete pressedKeys.MoveFwdVive;
    delete pressedKeys.MoveBwdVive;

  },
  triggerDown: function (event) {
    console.debug('trigger down');
    console.log(event.target);

    /***
     * Find out on which controller (left/right) the trigger was activated
     */
    let hand = event.target.getAttribute('laser-controls').hand;
    if (hand === undefined) {
      console.error('The trigger of the controller has been activated. But the type of the controller (left/right) is unknown. Please specify the type of controller (hand:left/hand:right)');
    } else if (hand === 'left'){
      /**
       * Dirty bugfixing: For unknown reason the left trigger is always triggered
       * after the right trigger has been activated.
       * Solution: Ignore the left trigger when the right trigger has been activated.
       */
      if (pressedKeys.MoveFwdVive === true){
        return; //Right trigger is active. Ignore the left trigger event
      }
      console.error('left trigger');
      pressedKeys.MoveBwdVive = true;
    } else if (hand === 'right'){
      console.error('right trigger');
      pressedKeys.MoveFwdVive = true;
    }    
  },
  trackpadUp: function (event) {
    console.debug('trackpad up');
    delete pressedKeys.TrackpadDown;
    delete viveAxisValues.x;
    delete viveAxisValues.y;

    // console.log("trackpadup!");
  },
  trackpadDown: function (event) {
    console.debug('trackpad down');

    console.log(event.target);

    
    /***
     * Find out on which controller (left/right) the trigger was activated
     */
    let hand = event.target.getAttribute('laser-controls').hand;
    if (hand === undefined) {
      console.error('The trigger of the controller has been activated. But the type of the controller (left/right) is unknown. Please specify the type of controller (hand:left/hand:right)');
    } else if (hand === 'left'){
      /**
       * Dirty bugfixing: For unknown reason the left trigger is always triggered
       * after the right trigger has been activated.
       * Solution: Ignore the left trigger when the right trigger has been activated.
       */
      if (pressedKeys.TrackpadDown === true){
        return; //Right trigger is active. Ignore the left trigger event
      }
    } else if (hand === 'right'){
      pressedKeys.TrackpadDown = true;
    }    
  
    // console.log("trackpaddown!");
  },
  trackpadChanged: function (event) {
    //console.error("trackpadchanged! ");
    //console.log(event);
  },

  axisMove: function (event) {
    //console.log(event.detail.axis);
    let x = event.detail.axis[0];
    let y = event.detail.axis[1];
    viveAxisValues.x = x;
    viveAxisValues.y = y;

    //console.log(typeof this.panLeft);
  }
});

function isEmptyObject(keys) {
  var key;
  for (key in keys) { return false; }
  return true;
}
