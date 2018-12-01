import GeoConversion from '../../util/geoconversion';
import {EarthProperties} from '../../earth-viewer.js';
export default class DefaultMeshBuilder {
    constructor(){
        this._meshGroup = new THREE.Group();
    }

    addMeshAtLocation(latitude, longitude, mesh){
        if (!latitude || !longitude || !mesh){
            //Invalid values for parameters.
            return;
        }

        //Calculate corresponding world coordinates from latitude, longitude values.
        let position = GeoConversion.WGStoGlobeCoord(latitude, longitude, EarthProperties.RADIUS);

        //Create visual primitive and orientate the element towards the center of the earth (0,0,0)
        const center = new THREE.Vector3(0,0,0);
    
        mesh.position.set(position.x, position.y, position.z);
        mesh.lookAt(center);
        mesh.rotateX(Math.PI / 2);
        mesh.updateMatrix();
        
        //Add mesh
        this._meshGroup.add(mesh);
    }

    getMesh(){
        return this._meshGroup;
    }
}