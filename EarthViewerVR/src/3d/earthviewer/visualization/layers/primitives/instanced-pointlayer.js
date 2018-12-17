import BaseVisualizationLayer from '../base-visualization-layer.js';
import JSONUtil from '../../../../../util/json-util.js';
import ShapeFactory from '../../shapes/shape-factory';

import DataSchemaV1 from '../../dataschema/dataSchemaV1.js';
import SizeMapper from '../../datamapping/sizemapper.js';
import ColorMapper from '../../datamapping/colormapper.js';

import EarthviewerInstancedMeshBuilder from '../../rendering-helper/earthviewer-instanced-mesh-builder.js';

const defaultVisualChannelMapping = {
    "height": "Bettenanzahl",
    "color": "Bettenanzahl"
};

export default class InstancedPointLayer extends BaseVisualizationLayer{
    constructor(scene, earth, data, visualChannelMapping = defaultVisualChannelMapping){
        super(scene,earth);
        this._initMaterials();
        this.data = data;

        this._initInstancing();
        this._parseVisualChannelMapping(visualChannelMapping);
    }

    _initInstancing(){
        const color = new THREE.Color(Math.random(),Math.random(),Math.random());
        let mesh = ShapeFactory.createCylinder(10, 10, color);
        let geometry = new THREE.BoxBufferGeometry(1,1,1);
        this._meshBuilder = new EarthviewerInstancedMeshBuilder(
            geometry,
            new THREE.MeshLambertMaterial({}),
            1000,
            false,
            true,
            false
        );
    }

    _parseVisualChannelMapping(visualChannelMapping){
        if (!!visualChannelMapping){
            this._visualChannelMapping = visualChannelMapping;
            const colorProperty = visualChannelMapping.color;
            const heightProperty = visualChannelMapping.height;
            this._setHeightMapping(this._dataArray, heightProperty);
        } else {
            console.error("_parseVisualChannelMapping. Property visual channel mapping is null or undefined.");
        }
    }

    _setColorMapping(data, colorProperty){
        if (!!data && !!colorProperty){
            this._colorMapper = new ColorMapper(dataArray, colorProperty);
        }
    }
    
    _setHeightMapping(dataArray, heightProperty){
        if (!!dataArray && !!heightProperty){
            this._heightMapper = new SizeMapper(dataArray, heightProperty);
        }
    }
    
    _initMaterials(){
        this._color = new THREE.Color(0xbf0b2c);
        this._material = new THREE.MeshLambertMaterial({
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

        const DEFAULT_HEIGHT = 0;
        const DEFAULT_COLOR = '0xbf0b2c';
        
        for (let i = 0; i < this._dataArray.length; i++){
            let dataPoint = this._dataArray[i];
            let dataLatitude = JSONUtil.getProperty(dataPoint, DataSchemaV1.latitude);
            let dataLongitude = JSONUtil.getProperty(dataPoint, DataSchemaV1.longitude);
        
            let height = JSONUtil.getProperty(
                dataPoint,
                DataSchemaV1.properties + '.' + this._visualChannelMapping.height) || DEFAULT_HEIGHT;

            let color = JSONUtil.getProperty(
                dataPoint,
                DataSchemaV1.properties + '.' + this._visualChannelMapping.color) || DEFAULT_COLOR;
            
            console.log('point : lat: ' + dataLatitude + ' long: ' + dataLongitude);
            if (!dataLatitude || !dataLongitude){
                //Entry is empty. Skip this entry.
                continue;
            }

            //Create mesh for data entry.
            let meshColor = new THREE.Color(Math.random(), Math.random(), Math.random());
            let mesh = ShapeFactory.createCylinder(height,10, meshColor);
          
            this._meshBuilder.addInstanceAtLocation(
                    dataLatitude, 
                    dataLongitude, 
                    meshColor,
                    new THREE.Vector3(10,height,10)
            )
        }
        this._renderData();
    }

    _renderData(){
        let mesh = this._meshBuilder.getMesh();
        this._earth.add(mesh);
    }
}