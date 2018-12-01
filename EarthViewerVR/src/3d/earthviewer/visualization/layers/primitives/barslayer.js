import BaseVisualizationLayer from '../base-visualization-layer.js';
import JSONUtil from '../../../../../util/json-util.js';
import ShapeFactory from '../../meshgeneration/shape-factory.js';


const defaultMapping = {
    dataPath: 'data', //Specifies the path to the data array, which should be rendered.
    latitude: 'position.lat',
    longitude: 'position.lng',
};

export default class BarsLayer extends BaseVisualizationLayer{
    constructor(scene, earth, config){
        super(scene,earth);
        this._initMaterials();
        this.setConfiguration(config);
    }

    setConfiguration(config){
        if (!!config){
            this._data = config.data;
            this._mapping = config.mapping || defaultMapping;
        } else {
            console.error('_parseProperties: config invalid')
        }
    }

    _initMaterials(){
        this._color = new THREE.Color(0xbf0b2c);

        this._primitiveGeometry = new THREE.BoxGeometry(10,1000,10);
        this._primitiveMaterial = new THREE.MeshLambertMaterial({
            color: this._color
        });
    }

    /**
     * Renders the data using the loaded mapping and data.
     */
    displayData(){
        //Do preparation stuff
        const data_source = this._data;
        const mapping = this._mapping;

        const data = JSONUtil.getProperty(data_source, mapping.dataPath);
        
        for (let i = 0; i < data.length; i++){
            let dataPoint = data[i];
            let dataLatitude = JSONUtil.getProperty(dataPoint, mapping.latitude);
            let dataLongitude = JSONUtil.getProperty(dataPoint, mapping.longitude);
  
            console.log('point : lat: ' + dataLatitude + ' long: ' + dataLongitude);
            if (!dataLatitude || !dataLongitude){
                //Entry is empty. Skip this entry.
                continue;
            }

            //Create mesh for data entry.
            let mesh = ShapeFactory.createCube(1000, 10, 0xbf0b2c);
            this.addMeshAtLocation(dataLatitude, dataLongitude, mesh);
            this._renderData();
        }
    }

    _renderData(){
        const dataMesh = new THREE.Mesh(this._mergedGeometry, this._primitiveMaterial);
        this._earth.add(dataMesh);
    }
}