import BasePropertyMapper from './base-propertymapper.js'
import chroma from 'chroma-js'

export default class ColorMapper extends BasePropertyMapper{
    constructor(dataArray, options){
        super(dataArray);
        this._parseOptions(options);
        this._createMapping();
    }

    _parseOptions(options){
        options = options || {};
    }

    _createMapping(){
        const defaultColors = ['#48DFC5','#475CE4'];

        //Create mapping for values
        this.mapValue = chroma
            .scale(defaultColors)
            .domain([this.minValue, this.maxValue]);
    }

    getMappedValue(value){
        return this.mapValue(value);
    }
}