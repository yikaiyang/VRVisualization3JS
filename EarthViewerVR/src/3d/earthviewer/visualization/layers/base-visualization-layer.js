/**
 * A base visualization class which is inherited by all visualization layers (point, arcs...)
 */

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

    _parseData(data, mapping){
        //TODO: Check validaty of data.
        this.data = data;
        this.mapping = mapping;
    }

}