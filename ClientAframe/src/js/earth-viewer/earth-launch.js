'use strict';
import {EarthViewer} from './earth.js'

var App = window.App || {};
var callbackHelper = App.callbackHelper;

var scene = document.querySelector('a-scene').object3D;

let earthViewer = new EarthViewer(scene);
earthViewer.rerenderEarth();




//Set callback to trigger manual rerendering of earth when a zoomlevel has changed.
/* if (!!callbackHelper){
    callbackHelper.setCallback(updateSceneLazy);
} */
