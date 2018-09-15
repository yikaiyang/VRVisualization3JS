'use strict';
import {EarthViewer} from './earth-viewer.js'

let ascene = document.querySelector('a-scene');
let scene = ascene.object3D;
let earthViewer = new EarthViewer(scene, ascene);
earthViewer.rerenderEarth();
earthViewer.enableAtmosphere();