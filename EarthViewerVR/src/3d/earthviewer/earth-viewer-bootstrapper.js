'use strict';
import {EarthViewer} from './earth-viewer.js'
import EarthPickingScene from './visualization/picking/earthviewer-pickingscene.js'
import PickingHandler from './visualization/picking/pickinghandler'

//Expose Earthviewer API to global scope (for aframe components)
import './api/earthviewer-api';

/**
 * Initializes the earth and renders the earth for the first time.
 * 
 * Loads only when the dom tree has been built 
 */
window.addEventListener("load", (event) => {
    let ascene = document.querySelector('a-scene');
    let scene = ascene.object3D;
    let earthViewer = new EarthViewer(scene, ascene);
    earthViewer.rerenderEarth();
    //earthViewer.enableAtmosphere();

     //Export to global scope for debug purposes
    window.Earth = earthViewer;
    window.Ascene = ascene;

    let camera = document.querySelector('#camera').getObject3D('camera');;

    let renderer = ascene.renderer;
    let pickingHandler = new PickingHandler(ascene, camera, renderer, true);
    //pickingHandler.disable();

    //Expose eventbus to global scope
    window.EVENT_BUS = EVENT_BUS;
    
});
 


