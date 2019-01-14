var THREE = require('three');

export default class MergedMeshBuilder {
    constructor(){
        this._mergedGeometry = new THREE.Geometry();
    }

    addMesh(mesh){
        this._mergedGeometry.merge(mesh.geometry, mesh.matrix);
    }

    getMesh(){
        return this._mergedGeometry;
    }
}