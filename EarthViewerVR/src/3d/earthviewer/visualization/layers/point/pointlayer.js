import BaseVisualizationLayer from '../base-visualization-layer.js';
import axios from 'axios';
import GeoConversion from '../../../util/geoconversion.js';
import JSONUtil from './../../../../../util/json-util.js';

/**
 * http://localhost:8888/src/assets/data/haltestellen.csv
 */
const filePath = './src/assets/data/hospital/hospitalData.json'

const defaultMapping = {
    dataPath: 'data', //Specifies the path to the data array, which should be rendered.
    latitude: 'position.latitude',
    longitude: 'position.longitude',
};

const defaultData = {};

export default class PointLayer extends BaseVisualizationLayer{
    constructor(scene, earth, config){
        super(scene,earth);
        this._parseConfiguration(config);
        this._initMaterials();
    }

    _parseConfiguration(config){
        if (!!config){
            this._data = config.data ;
            this._mapping = config.mapping || defaultMapping;
        } else {
            console.error('_parseProperties: config invalid')
        }
    }

    _initMaterials(){
        
        this._color = new THREE.Color("rgb(187,57,70)");
        this._primitiveGeometry = new THREE.BoxGeometry(10,10,100);
        this._primitiveMaterial = new THREE.MeshBasicMaterial({
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

            this._parseConfiguration(config);
            this.displayData();
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
        }
    }

    _addShape(latitude, longitude){
        let position = GeoConversion.WGStoGlobeCoord(latitude, longitude, EarthProperties.RADIUS);

        if (!!position){
            //Invalid position. Skip this data entry.
            return;
        }

        //Create visual primitive and orientate the element towards the center of the earth (0,0,0)
        const center = new THREE.Vector3(0,0,0);
        let mesh = new THREE.Mesh(this.primitiveGeometry, scope.primitiveMaterial);
        mesh.position.set(position.x, position.y, position.z);
        mesh.lookAt(center);
        mesh.updateMatrix();
        
        //Merge geometries
        this._mergeGeometry(mesh);
    }

    _renderData(){
        const dataMesh = new THREE.Mesh(this._mergedGeometry, this._primitiveMaterial);
        this._earth.add(dataMesh);
    }

    _createStationDataCallback(stationData){
        if (stationData === undefined){
            console.error('ERROR: stationData is undefined\n');
            return;
        }
        stationData = stationData.data;
        const latIdx = 6; //latitude value at 6th position
        const longIdx = 7; //longitude value at 7th position

        for (let i = 0; i < stationData.length; i++){
            let stationLat = stationData[i][latIdx];
            let stationLong = stationData[i][longIdx];

            scope._createPrimitive(scope, stationLat, stationLong);
        }

        let cubes = new THREE.Mesh(this._mergedGeometries, this.primitiveMaterial);
        scope.earth.add(cubes);
    }
}