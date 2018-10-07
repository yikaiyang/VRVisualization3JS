'use strict';
import {EarthViewer} from './earth-viewer.js'

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

    //earthViewer.enableAtmosphere();
    
    window.Earth = earthViewer; //Export to global for debug purposes.
});
 


