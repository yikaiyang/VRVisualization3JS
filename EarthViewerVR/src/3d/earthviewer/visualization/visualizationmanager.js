import DataLoader from './dataprocessing/dataloader.js'

//Import all supported layertypes


class LayerType {};
LayerType.PointLayer;
LayerType.BarsLayer;
LayerType.WienerLinienLayer;
Object.freeze(LayerType);

class VisualizationManager{
    constructor(scene, earth){
        this._scene = scene;
        this._earth = earth;
        this.layers = [];
    }

    createLayer(layerType, filePath){
        if (!!layerType && !!filePath){
            let configuration, layer;

            DataLoader.loadData(filePath)
                .then((config => {
                    configuration = config;
                }))
                .catch((error) =>{
                    console.error('Error: Could no load data from file:' + filePath);
                    return;
                });

            switch(layerType){
                case LayerType.PointLayer:
                    //Initialize Pointlayer
                    break;
                case LayerType.BarsLayer:
                    //Initialize Barslayer
                    break;
                case LayerType.WienerLinienLayer:
                    break;
                default:
                    console.error('ERROR: invalid layertype.');
            }
        } else {
            console.error(
                'ERROR: Invalid parameters: layerType: ' + layerType + ' filepath: ' + filePath
                + ' Either layertype or filepath is invalid.'
            );
        }
    }


    _addLayer(layer){
        if (!!layer){
            this.layers.push(layer);
        }
    }
}

export {LayerType, VisualizationManager};