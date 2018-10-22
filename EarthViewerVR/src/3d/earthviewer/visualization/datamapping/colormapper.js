import JSONUtil from '../../../../util/json-util.js'

class ColorMapper {
    constructor(jsonArray, propertyPath){
        this._parseParameters(jsonArray, propertyPath)
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

    _calculateColors(){
        
    }
}