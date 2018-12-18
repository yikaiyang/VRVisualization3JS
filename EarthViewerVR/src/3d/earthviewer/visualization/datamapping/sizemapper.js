import BasePropertyMapper from './base-propertymapper.js';
import * as d3 from 'd3-scale';

export default class SizeMapper extends BasePropertyMapper{
    constructor(jsonArray, options){
        super(jsonArray);
        this._parseOptions(options);
        this._createMapping();
    }

    _parseOptions(options){
        options = options || {};
        //TODO Support for different options
        this.targetRange = options.range || [this.minValue,this.maxValue];
        this.scaleType = options.scaleType || 'continous';
    }

    _createMapping(){
        //Create mapping for values
        this.mapValue = d3.scaleLinear()
            .domain([this.minValue, this.maxValue])
            .range(this.targetRange);
    }

    /**
     * 
     * @param {[number,number]} range  Sets the target range of the mapping in the format [minValue, maxValue]. 
     */
    setRange(range){
        this.mapValue.range(range);
    }

    getMappedValue(value){
        return this.mapValue(value);
    }
}