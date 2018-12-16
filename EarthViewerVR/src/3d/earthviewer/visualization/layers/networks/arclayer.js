import BaseVisualizationLayer from '../base-visualization-layer.js';
import JSONUtil from '../../../../../util/json-util.js';
import ShapeFactory from '../../shapes/shape-factory';
import {EarthProperties} from '../../../earth-viewer.js';
/**
 * http://localhost:8888/src/assets/data/haltestellen.csv
 */
const filePath = './src/assets/data/hospital/hospitalData.json'

const defaultMapping = {
    dataPath: 'data', //Specifies the path to the data array, which should be rendered.
    latitude: 'position.lat',
    longitude: 'position.lng',
};

const AKHLocation = {
    lat: 48.220582,
    lon: 16.347051
};

const TULocation = {
    lat: 48.2012343,
    lon: 16.3635725
};

export default class ArcLayer extends BaseVisualizationLayer{
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

        this._primitiveGeometry = new THREE.CylinderGeometry(10,10,100,14);
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
        
        let arc = ShapeFactory.createArc(
                AKHLocation, 
                TULocation,
                EarthProperties.RADIUS,
                1000,
        );

        this._earth.add(arc);

        //this._mergeGeometry(arc);
        
        //this._renderData();
    }

    _renderData(){
        const dataMesh = new THREE.Mesh(this._mergedGeometry, this._primitiveMaterial);
        this._earth.add(dataMesh);
    }
}