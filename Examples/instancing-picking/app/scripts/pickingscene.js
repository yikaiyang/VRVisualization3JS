var THREE = require('three');
let EventEmitter = require('eventemitter3');

export default class PickingScene{
    constructor(){
        this._scene = new THREE.Scene();
        this._initEventEmitter();
    }

    _initEventEmitter(){
        this._eventEmitter = new EventEmitter();
        this._eventEmitter.on('positionChanged', () => {
            alert('test');
        }, this);
        /** 
        EE.on('positionChanged', () => {
            alert('test');
        }, this);*/
        EE();
    }

    addObject(
        id, 
        position, 
        quaternion, 
        scale, 
        geometry) {

        if (!id || !position || !quaternion || !scale || !geometry) {
            console.error('ERROR: Given parameters are either null or undefined.');
            return;
        }
      
        let matrix = new THREE.Matrix4();
        let color = new THREE.Color();
        matrix.compose(position, quaternion, scale);
        geometry.applyMatrix(matrix);
        let material = new THREE.MeshBasicMaterial({
            //Calculate color using the given id.
            //Hex color value corresponds to id.
            color: color.setHex(id)
        });
      
        let mesh = new THREE.Mesh(geometry, material);
        mesh.name = id;
        this._scene.add(mesh);
    }

    getScene(){
        return this._scene;
    }

    getSceneObjects(){
        return this._scene.children;
    }
}