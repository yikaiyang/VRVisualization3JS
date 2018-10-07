import BaseVisualizationLayer from '../base-visualization-layer.js';
import Axios from 'axios';

const filePath = './src/3d/earthviewer/visualization/haltestellen.csv'

export default class PointLayer extends BaseVisualizationLayer{
    constructor(scene, earth, props){
        super(scene,earth);
        this._parseProperties(props);
        this._initMaterials();
    }

    _parseProperties(props){
        if (!!props){
            const data = props.data;
            const mapping = props.mapping;
        } else {
            console.error('_parseProperties: props invalid')
        }
    }

    _initMaterials(){
        this.color = new THREE.Color("rgb(187,57,70)");
        this.primitiveMaterial = new THREE.MeshBasicMaterial({
            color: this.color
        });
    }

    _loadData(){
        axios({
            method: 'get',
            url: filePath,
        })
        .then((response) => {
            alert('loaded data');
            console.log(response);
        })
        .catch((error) => {
            console.error(error);
        })

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