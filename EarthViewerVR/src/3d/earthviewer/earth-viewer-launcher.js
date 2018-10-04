'use strict';
import {EarthViewer} from './earth-viewer.js'
let d3 = require('d3-fetch');

/**
 * Initializes the earth and renders the earth for the first time.
 * 
 * Loads only when the dom tree has been built 
 */
window.addEventListener("load", function(event) {
    let ascene = document.querySelector('a-scene');
    let scene = ascene.object3D;
    let earthViewer = new EarthViewer(scene, ascene);
    
    earthViewer.rerenderEarth();

    d3.csv('./src/3d/earthviewer/visualization/haltestellen.csv').then(function(text) {
        alert('yeah');
    });

    //earthViewer.enableAtmosphere();
    
    window.Earth = earthViewer; //Export to global for debug purposes.
});
 


