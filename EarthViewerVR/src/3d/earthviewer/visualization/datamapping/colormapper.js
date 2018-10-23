import JSONUtil from '../../../../util/json-util.js'

import BasePropertyMapper from './base-propertymapper.js'

class ColorMapper extends BasePropertyMapper{
    constructor(jsonArray, propertyPath){
        this._parseParameters(jsonArray, propertyPath);
    }

    _parseParameters(jsonArray, propertyPath){
        if (!!jsonArray && !!propertyPath){
            let values = JSONUtil.extractPropertiesFromArrayAsList(jsonArray, propertyPath);
            if (!Array.isArray(values)){
                console.error('ERROR: _parseParameters: Returned object is invalid (null or undefined)');
            }
            this._values = values;
        }
    }

    _calculateColors(options){
        this.type = options.scale || 'continous'; //Type of scaling {continuous | segmented}. When values are 
        this.range = options.range || [0,100]; //Range of target values as array f.e. if target: [0,100] 
    }

    /**
     * Maps a value to a color value using the specified techniques ()
     * @param {*} value 
     */
    mapValueToColor(value){
        
    }
}