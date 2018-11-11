import BaseVisualizationLayer from '../base-visualization-layer.js';
import JSONUtil from '../../../../../util/json-util.js';
import PrimitivesGenerator from '../../meshgeneration/primitives-util';

import DataSchemaV1 from '../../dataschema/dataSchemaV1.js';

/**
 * http://localhost:8888/src/assets/data/haltestellen.csv
 */
const filePath = './src/assets/data/hospital/hospitalData.json'

const defaultMapping = {
    dataPath: 'data', //Specifies the path to the data array, which should be rendered.
    latitude: 'position.lat',
    longitude: 'position.lng',
    size: 'Bettenanzahl',
};

export default class PointLayer extends BaseVisualizationLayer{
    constructor(scene, earth, data){
        super(scene,earth);
        this._initMaterials();
        this.data = data;
    }
    
    _initMaterials(){
        this._color = new THREE.Color(0xbf0b2c);
        this._primitiveMaterial = new THREE.MeshLambertMaterial({
            color: this._color
        });
    }

    /*Properties */

    set data(value){
        if (!!value){
            this._data = value;
            this._initializeData();
        } else {
            console.error('ERROR: _setData: Parameter data is invalid');
        }
    }

    get data(){
        return this._data;
    }

    _initializeData(){
        if (!!this.data){
            this._dataArray = JSONUtil.getProperty(this.data, 'data');
        } else {
            console.error("_initializeData: Schema violation: data Property does not contain property \'data\'");
        }
    }

    /**
     * Renders the data using the loaded mapping and data.
     */
    displayData(){
        if (!this._dataArray){
            console.error('displayData: Property _displayData is empty or invalid.');
            return;
        }
        
        for (let i = 0; i < this._dataArray.length; i++){
            let dataPoint = this._dataArray[i];
            let dataLatitude = JSONUtil.getProperty(dataPoint, DataSchemaV1.latitude);
            let dataLongitude = JSONUtil.getProperty(dataPoint, DataSchemaV1.longitude);
  
            console.log('point : lat: ' + dataLatitude + ' long: ' + dataLongitude);
            if (!dataLatitude || !dataLongitude){
                //Entry is empty. Skip this entry.
                continue;
            }

            //Create mesh for data entry.
            let mesh = PrimitivesGenerator.createCylinder(100,10);
            this._mergeMeshAtLocation(dataLatitude, dataLongitude, mesh);
        }
        this._renderData();
    }

    _renderData(){
        const dataMesh = new THREE.Mesh(this._mergedGeometry, this._primitiveMaterial);
        this._earth.add(dataMesh);
    }
}