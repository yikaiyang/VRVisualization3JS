var THREE = require('three');

export default class MergedMeshBuilder {
    constructor(){
        this._mergedGeometry = new THREE.Geometry();
    }

    addMesh(mesh){
        this._mergedGeometry.merge(mesh.geometry, mesh.matrix);
    }

    getMesh(material){
        if (!material){
            console.error('ERROR: getMesh(): Invalid parameter \'material\'');
        }

        return new THREE.Mesh(this._mergedGeometry, material);
    }
}