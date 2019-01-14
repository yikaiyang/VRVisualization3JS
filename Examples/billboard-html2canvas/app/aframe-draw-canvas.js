/**
 * Aframe draw canvas
 * 
 * https://aframe.io/docs/0.8.0/components/material.html#canvas-textures
 */

 import AFRAME from 'aframe'

 AFRAME.registerComponent('draw-canvas',
 {
    schema: {default: ''},
    init: function() {
        this.canvas = document.getElementById(this.data);
        this.ctx = this.canvas.getContext('2d');

        //Draw on canva
    }
 });