import BasePropertyMapper from './base-propertymapper.js';
import d3 from 'd3';

export default class SizeMapper extends BasePropertyMapper{
    constructor(jsonArray, propertyPath, options){
        super(jsonArray,propertyPath);
        this._parseOptions(options);
        this._createMapping();
    }

    _parseOptions(options){
        options = options || {}
        this.targetRange = options.range || [0,100];
        this.scaleType = options.scaleType || 'continous';
    }

    _createMapping(){
        //Create mapping for values
        this.mapValue = d3.scaleLinear()
            .domain([this.minValue, this.maxValue])
            .range(this.targetRange);
    }

    getMappedValue(value){
        return this.mapValue(value);
    }
}