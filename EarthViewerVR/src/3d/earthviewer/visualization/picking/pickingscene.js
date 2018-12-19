import * as THREE from 'three'
import ShapeFactory  from '../shapes/shape-factory'

export default class PickingScene{
    constructor(){
        this._scene = new THREE.Scene();
        this._initContainer();
        this._group.matrixAutoUpdate = false;
        this._scene.add(this._group);
    }

    _initContainer(){
        this._group = new THREE.Group();
    }

    addObject(
        id, 
        position, 
        quaternion, 
        scale, 
        geometry) {

        if (!id || !position || !quaternion || !scale || !geometry) {
            console.warn('ERROR: Given parameters are either null or undefined.');
            console.warn('Entry: ')
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
        this._group.add(mesh);
    }

    getScene(){
        return this._scene;
    }

    getSceneObjects(){
        return this._group.children;
    }
}