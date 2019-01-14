import InstancedMeshBuilder from './instanced-mesh-builder.js'

export default class EarthviewerInstancedMeshBuilder extends InstancedMeshBuilder {
    constructor(){
        this._rotationHelperMesh = new THREE.Mesh
        (
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshBasicMaterial()
        )
    }

    /**
     * Merges a given mesh using geometry merging and positions the result at the provided location (latitude, longitude).
     * @param {number} latitude 
     * @param {number} longitude 
     * @param {THREE.Mesh} mesh
     */
    addInstanceAtLocation(latitude, longitude, color, scale){
        if (!latitude || !longitude || !mesh){
            //Invalid values for parameters.
            return;
        }

        //Calculate corresponding world coordinates from latitude, longitude values.
        let position = GeoConversion.WGStoGlobeCoord(latitude, longitude, EarthProperties.RADIUS);

        //Create visual primitive and orientate the element towards the center of the earth (0,0,0)
        const center = new THREE.Vector3(0,0,0);
    
        this._rotationHelperMesh.position.set(position.x, position.y, position.z);
        this._rotationHelperMesh.lookAt(center);
        this._rotationHelperMesh.rotateX(Math.PI / 2);
        this._rotationHelperMesh.updateMatrix();

        //Retrieve quaternion
        let quaternion = this._rotationHelperMesh.quaternion;
        
        //Create instance
        this.addInstance(position, quaternion, color, scale);
    }
}