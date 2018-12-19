import BaseVisualizationLayer from '../base-visualization-layer.js';
import JSONUtil from '../../../../../util/json-util.js';
import ShapeFactory from '../../shapes/shape-factory';

import DataSchema from '../../dataschema/dataSchema.js';
import DataMapperFactory from '../../datamapping/datamapper-factory.js';

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
        this.data = data;

        this._initInstancing();
        this._initVisualChannels(visualChannelMapping);
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

    _initVisualChannels(visualChannelMapping){
        if (!!visualChannelMapping){
            this._visualChannelMapping = visualChannelMapping;

            //Extract mapping paths
            const colorPropertyPath = visualChannelMapping.color || null;
            const heightPropertyPath = visualChannelMapping.height || null;

            try {
                this._setHeightMapping(this._dataArray, heightPropertyPath);
                this._setColorMapping(this._dataArray, colorPropertyPath);
            } catch(e) {
                console.error('Error initializing visual mapping: ' + e.message);
            }
        } else {
            console.error("_parseVisualChannelMapping. Property visual channel mapping is null or undefined.");
        }
    }

    _setColorMapping(dataArray, colorPropertyPath){
        if (!!dataArray && !!colorPropertyPath){
            this._colorMapper = DataMapperFactory.createColorMapper(dataArray,  DataSchema.getPathForProperty(colorPropertyPath));
        }
    }
    
    _setHeightMapping(dataArray, heightPropertyPath){
        if (!!dataArray && !!heightPropertyPath){
            this._heightMapper = DataMapperFactory.createSizeMapper(dataArray, DataSchema.getPathForProperty(heightPropertyPath));
        }
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
        const MIN_WIDTH = 50;
        
        for (let i = 0; i < this._dataArray.length; i++){
            let dataPoint = this._dataArray[i];
            let dataLatitude = JSONUtil.getProperty(dataPoint, DataSchema.latitude);
            let dataLongitude = JSONUtil.getProperty(dataPoint, DataSchema.longitude);

            console.log('point : lat: ' + dataLatitude + ' long: ' + dataLongitude);
            if (!dataLatitude || !dataLongitude){
                //Entry is empty. Skip this entry.
                continue;
            }

            //Retrieve height information
            let height = DataSchema.getProperty(dataPoint,this._visualChannelMapping.height) || DEFAULT_HEIGHT;
            let color = DataSchema.getProperty(dataPoint, this._visualChannelMapping.color) || DEFAULT_COLOR;

            //Create mesh for data entry.
            let meshColor = new THREE.Color(Math.random(), Math.random(), Math.random());
            let mesh = ShapeFactory.createCylinder(height, MIN_WIDTH, color);

            let mappedHeight = this._heightMapper.getMappedValue(height);
            let mappedChromaColor = this._colorMapper.getMappedValue(color); //Color in chroma js color format
            let mappedColor = (!!mappedChromaColor) ? new THREE.Color(mappedChromaColor.hex()) : meshColor;

            //alert(mappedValue);
          
            this._meshBuilder.addInstanceAtLocation(
                    dataLatitude,
                    dataLongitude,
                    mappedColor,
                    new THREE.Vector3(MIN_WIDTH, mappedHeight, MIN_WIDTH)
            )
        }
        this._renderData();
    }

    _renderData(){
        let mesh = this._meshBuilder.getMesh();
        this._earth.add(mesh);
    }
}