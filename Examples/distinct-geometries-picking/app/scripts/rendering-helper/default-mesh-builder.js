var THREE = require('three');

export default class DefaultMeshBuilder {
    constructor(){
        this._meshGroup = new THREE.Group();
    }

    addMesh(mesh){
        this._meshGroup.add(mesh);
    }

    getMesh(){
        return this._meshGroup;
    }
}