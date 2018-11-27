import JSONUtil from '../../../../util/json-util.js'
import BasePropertyMapper from './base-propertymapper.js'
import chroma from 'chroma-js'

export default class ColorMapper extends BasePropertyMapper{
    constructor(jsonArray, propertyPath, options){
        super(jsonArray,propertyPath);
        this._parseOptions(options);
        this._createMapping();
    }

    _parseOptions(options){
        options = options || {};
        this.targetRange = options.range || [0,100];
        this.scaleType = options.scaleType || 'continous';
    }

    _createMapping(){
        const defaultColors = ['white', 'red'];

        //Create mapping for values
        this.mapValue = chroma
            .scale(defaultColors)
            .domain([this.minValue, this.maxValue]);
    }

    getMappedValue(value){
        return this.mapValue(value);
    }
}