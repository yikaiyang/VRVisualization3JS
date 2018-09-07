'use strict';
import {EarthViewer} from './earth-viewer.js'



var scene = document.querySelector('a-scene').object3D;

let earthViewer = new EarthViewer(scene);
earthViewer.rerenderEarth();
