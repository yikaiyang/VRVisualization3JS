/**
 * @author Yikai Yang
 * A simple callback helper which intermediates between Aframe controls (which trigger the rerendering of the earth).
 * Since Aframe Components are loaded before THREEJS Components (ThreeJS modules are loaded at the end, because
 * module='type' defers the loading of js code to the end), 
 * Aframe components cannot directly reference ThreeJS components since ES6 import sytax is only allowed if the source file is
 * also declared as 'module='type', which would defer loading of aframe components. However Aframe components must be loaded
 * before the Aframe specific HTML-Elements are loaded (a-scene), otherwise the aframe modules are not registered properly and
 * thus rendered absolutely useless. 
 * => That's why this thing is here to intermediate between aframe controls and the rerendering method
 * of the earth viewer. When the aframe controls are calling the rerendering function, while the threejs component is not loaded yet,
 * the invocation of the method will be ignored.
 * 
 * 
 * TODO: May replace it with an event bus component in the future.
 */

'use strict';
class CallbackHelper {
    constructor(){
        this._callback = null;
    }

    setCallback(cb){
        this._callback = cb;
    }

    callback(){
        if (!!this._callback && (typeof this._callback) === 'function'){
            this._callback.apply(null, arguments);
        }
    }
}

var App = App || {};
App.callbackHelper = new CallbackHelper();
