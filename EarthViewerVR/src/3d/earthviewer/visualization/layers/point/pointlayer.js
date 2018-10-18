import BaseVisualizationLayer from '../base-visualization-layer.js';
import axios from 'axios';

import JSONUtil from './../../../../../util/json-util.js';


/**
 * http://localhost:8888/src/assets/data/haltestellen.csv
 */
const filePath = './src/assets/data/hospital/hospitalData.json'

const defaultMapping = {
    dataPath: 'data', //Specifies the path to the data array, which should be rendered.
    latitude: 'position.lat',
    longitude: 'position.lng',
};

const defaultData = {};

export default class PointLayer extends BaseVisualizationLayer{
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

        this._Rcolor = new THREE.Color("rgb(187,57,70)");

        this._primitiveGeometry = new THREE.CylinderGeometry(10,10,100,14);
        //this._primitiveGeometry = this._primitiveGeometry.rotateX(Math.PI / 2);
        this._primitiveMaterial = new THREE.MeshLambertMaterial({
            color: this._color
        });
    }

    _loadData(){
        axios({
            method: 'get',
            url: filePath,
        })
        .then((response) => {
            alert('loaded data');
            let data;
            if (!!response){
                data = response.data;
            }

            const config = {
                data: data
            }

            this.setConfiguration(config);
            this.displayData();
            this._renderData();
        })
        .catch((error) => {
            console.error(error);
        })
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
            let mesh = new THREE.Mesh(this._primitiveGeometry, this._primitiveMaterial);
            this._addMergedShape(dataLatitude, dataLongitude, mesh);
        }
    }

    _renderData(){
        const dataMesh = new THREE.Mesh(this._mergedGeometry, this._primitiveMaterial);
        this._earth.add(dataMesh);
    }
}