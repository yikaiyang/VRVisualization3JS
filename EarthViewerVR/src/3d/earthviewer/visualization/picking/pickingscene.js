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

    addObject(mesh) {
        this._group.add(mesh);
    }

    getScene(){
        return this._scene;
    }

    getSceneObjects(){
        return this._group.children;
    }
}