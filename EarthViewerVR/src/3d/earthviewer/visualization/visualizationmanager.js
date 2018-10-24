import DataLoader from './dataprocessing/dataloader.js'

//Import all supported layertypes
import BarsLayer from './layers/primitives/barslayer.js'
import PointLayer from './layers/primitives/pointlayer.js'
import WienerLinienLayer from './layers/wienerlinienlayer.js'
import SizeMapper from './datamapping/sizemapper.js'

class VisualizationLayerType {};
VisualizationLayerType.PointLayer = 1;
VisualizationLayerType.BarsLayer = 2;
VisualizationLayerType.WienerLinienLayer = 3;
Object.freeze(VisualizationLayerType);

class VisualizationManager{
    constructor(scene, earth){
        this._scene = scene;
        this._earth = earth;
        this.layers = [];
    }

    createLayer(layerType, filePath){
        if (!!layerType && !!filePath){
            DataLoader.loadData(filePath)
                .then((config => {
                    this._addLayer(layerType,config);
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

    _addLayer(layerType, configuration){
        if (!!layerType && !!configuration){
            let layer;
            switch(layerType){
                case VisualizationLayerType.PointLayer:
                    //Initialize Pointlayer
                    layer = new PointLayer(this._scene, this._earth, configuration);
                    break;
                case VisualizationLayerType.BarsLayer:
                    //Initialize Barslayer
                    layer = new BarsLayer(this._scene, this._earth, configuration);
                    break;
                case VisualizationLayerType.WienerLinienLayer:
                    layer = new WienerLinienLayer(this._scene, this._earth, configuration);
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