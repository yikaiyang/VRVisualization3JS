export default class DefaultMeshBuilder {
    constructor(){
        this._meshGroup =  new THREE.Group();
    }

    addMeshAtLocation(latitude, longitude, mesh){
     
    }

    getMesh(){
        return this._meshGroup;
    }
}