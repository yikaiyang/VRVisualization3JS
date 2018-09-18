'use strict';
import {EarthViewer} from './earth-viewer.js'

let ascene = document.querySelector('a-scene');
let scene = ascene.object3D;
let earthViewer = new EarthViewer(scene, ascene);


const tokyo = {
    lat: 35.652832,
    long: 139.839478
}

earthViewer.rerenderEarth();
//earthViewer.enableAtmosphere();
//earthViewer.flyTo(tokyo.lat, tokyo.long, 2000);

window.Earth = earthViewer;
//earthViewer.exampleRotation();
