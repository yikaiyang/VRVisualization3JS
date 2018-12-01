import MergedMeshBuilder from './merged-mesh-builder.js';
import GeoConversion from '../../util/geoconversion.js';
import {EarthProperties} from '../../earth-viewer.js';


export default class EarthviewerMergedMeshBuilder extends MergedMeshBuilder{
    
    /**
     * Merges a given mesh using geometry merging and positions the result at the provided location (latitude, longitude).
     * @param {number} latitude 
     * @param {number} longitude 
     * @param {THREE.Mesh} mesh
     */
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
        
        //Merge geometries
        this.addMesh(mesh);
    }

}