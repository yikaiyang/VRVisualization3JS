/**
 * A base visualization class which is inherited by all visualization layers (point, arcs...)
 */
import GeoConversion from '../../util/geoconversion';
import {EarthProperties} from '../../earth-viewer.js';
export default class BaseVisualizationLayer {
    constructor(scene, earth){
        this._scene = scene;
        this._earth = earth;

        this._data = null;
        this._mapping = null;
        this._initGeometries();
    }

    setData(data, mapping){
        if (!!data){
            this._parseData(data, mapping);
        }
    }

    /*
        Example for mapping:
        {
            'latitude': 'lat',          //pathToLatitudeProperty
            'longitude': 'lon',         //pathToLongitudeProperty
        }
    */
    
    _initGeometries(){
        this._mergedGeometry = new THREE.Geometry();
    }

    _mergeGeometry(mesh){
        this._mergedGeometry.merge(mesh.geometry, mesh.matrix);
    }

    /**
     * Adds a geometry 
     * @param {number} latitude 
     * @param {number} longitude 
     * @param {THREE.Mesh} mesh
     */
    _addMergedShape(latitude, longitude, mesh){
        if (!latitude || !longitude || !mesh){
            //Invalid values for parameters.
            return;
        }

        //Calculate corresponding world coordinates from latitude, longitude values.
        let position = GeoConversion.WGStoGlobeCoord(latitude, longitude, EarthProperties.RADIUS);

        //Create visual primitive and orientate the element towards the center of the earth (0,0,0)
        const center = new THREE.Vector3(0,0,0);
    
      

        //mesh.geometry.rotateX(Math.PI / 2);
        mesh.position.set(position.x, position.y, position.z);
        mesh.lookAt(center);
        mesh.rotateX(Math.PI / 2);

        mesh.updateMatrix();
        
        //Merge geometries
        this._mergeGeometry(mesh);
    }


    _parseData(data, mapping){
        //TODO: Check validaty of data.
        this.data = data;
        this.mapping = mapping;
    }

    _renderData(){
        const dataMesh = new THREE.Mesh(this._mergedGeometry, new THREE.MeshBasicMaterial());
        this._earth.add(dataMesh);
    }

}