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
        this.mergedGeometry = new THREE.Geometry();
    }

    _parseData(data, mapping){
        //TODO: Check validaty of data.
        this.data = data;
        this.mapping = mapping;
    }

    _checkIfPropertyExists(object, propertyPath) {
        const splittedPath = propertyPath.split('.');
        let nextProperty = splittedPath[0];
        if (!object.hasOwnProperty(nextProperty)){
            return false;
        }

        if (splittedPath.length <= 1){
            //Last item reached and object has property.
            return true;
        } else {
            const remainingPath = splittedPath.slice(1, splittedPath.length - 1).join('.');
            this._checkIfPropertyExists(object[nextProperty], remainingPath); 
        }
    }
}