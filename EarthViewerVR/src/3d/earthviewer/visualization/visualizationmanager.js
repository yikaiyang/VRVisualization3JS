import DataLoader from './dataprocessing/dataloader.js'
import DataProcessor from './dataprocessing/dataprocessor.js'

import PropertyMapping from './../../../assets/data/hospital/hospitalDataMapping.js';

//Import all supported layertypes
import BarsLayer from './layers/primitives/barslayer.js'
import PointLayer from './layers/primitives/pointlayer2.js'
import WienerLinienLayer from './layers/wienerlinienlayer.js'
import ArcLayer from './layers/networks/arclayer.js'
import SizeMapper from './datamapping/sizemapper.js'

class VisualizationLayerType {};
VisualizationLayerType.PointLayer = 1;
VisualizationLayerType.BarsLayer = 2;
VisualizationLayerType.WienerLinienLayer = 3;
VisualizationLayerType.ArcLayer = 4;
Object.freeze(VisualizationLayerType);

class VisualizationManager{
    constructor(scene, earth){
        this._scene = scene;
        this._earth = earth;
        this.layers = [];
    }

    createLayer(layerType, filePath, propertyMapping = PropertyMapping){
        if (!!layerType && !!filePath){
            DataLoader.loadData(filePath)
                .then((data => {
                    //Process data
                    const processedData = DataProcessor.processData(data, propertyMapping);

                    //Add data to layer
                    this._addLayer(layerType, processedData);
                    
                }))
                .catch((error) =>{
                    console.error('Error: Could no load data from file:' + filePath);
                    console.error(error);
                    return;
                });

            

        } else {
            console.error(
                'ERROR: Invalid parameters: layerType: ' + layerType + ' filepath: ' + filePath
                + ' Either layertype or filepath is invalid.'
            );
        }
    }

    _addLayer(layerType, data){
        if (!!layerType && !!data){
            let layer;
            switch(layerType){
                case VisualizationLayerType.PointLayer:
                    //Initialize Pointlayer
                    layer = new PointLayer(this._scene, this._earth, data);
                    break;
                case VisualizationLayerType.BarsLayer:
                    //Initialize Barslayer
                    layer = new BarsLayer(this._scene, this._earth, data);
                    break;
                case VisualizationLayerType.WienerLinienLayer:
                    layer = new WienerLinienLayer(this._scene, this._earth, data);
                    break;
                case VisualizationLayerType.ArcLayer:
                    layer = new ArcLayer(this._scene, this._earth, data);
                    break;
                default:
                    console.error('ERROR: invalid layertype.');
            }

            layer.displayData();
            this.layers.push(layer);
        }
    }
}

export {VisualizationManager, VisualizationLayerType};