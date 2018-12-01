/**
 * A base visualization class which is inherited by all visualization layers (point, arcs...)
 */
import GeoConversion from '../../util/geoconversion';
import {EarthProperties} from '../../earth-viewer.js';
import EarthviewerMergedMeshBuilder from '../rendering-helper/earthviewer-merged-mesh-builder.js';
export default class BaseVisualizationLayer {
    constructor(scene, earth){
        this._scene = scene;
        this._earth = earth;

        this._data = null;
        this._mapping = null;

        this._meshBuilder = new EarthviewerMergedMeshBuilder();
    }

    setData(data, mapping){
        if (!!data){
            this._parseData(data, mapping);
        }
    }

    /**
     * Merges a given geometry with the existing merged geometry.
     * @param {*} mesh 
     */
    _mergeGeometry(mesh){
        this._mergedGeometry.merge(mesh.geometry, mesh.matrix);
    }

    /**
     * Merges a given mesh using geometry merging and positions the result at the provided location (latitude, longitude).
     * @param {number} latitude 
     * @param {number} longitude 
     * @param {THREE.Mesh} mesh
     */
    _mergeMeshAtLocation(latitude, longitude, mesh){
        if (!latitude || !longitude || !mesh){
            //Invalid values for parameters.
            return;
        }
        this._meshBuilder.addMeshAtLocation(latitude, longitude,mesh);
    }


    _parseData(data, mapping){
        //TODO: Check validaty of data.
        this.data = data;
        this.mapping = mapping;
    }

    _renderData(){
        //let dataMesh = new THREE.Mesh(this._mergedGeometry, new THREE.MeshBasicMaterial());
        
        let dataMesh = this._meshBuilder.getMesh();
        this._earth.add(dataMesh);
    }

}