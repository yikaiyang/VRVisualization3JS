import JSONUtil from '../../../../util/json-util.js'

/**
 * Base class for all data mapping classes.
 * 
 * The following processing is done by this object:
 * 1. Extracts a property values from a json array using a specified propertyPath and appends them to a list .
 * 2. Basic dataprocessing of the extracted values. (Sorting and identification of max and min values).
 */
class BasePropertyMapper {
    constructor(jsonArray, propertyPath){
        if (!Array.isArray(jsonArray)){
            console.error('ERROR: Parameter jsonArray is not an array.');
        }
        this._parseParameters(jsonArray, propertyPath);
    }

    _parseParameters(jsonArray, propertyPath){
        if (!!jsonArray && !!propertyPath){
            let values = JSONUtil.extractPropertiesFromArrayAsList(jsonArray, propertyPath);
            if (!Array.isArray(values)){
                console.error('ERROR: _parseParameters: Returned object is invalid (null or undefined)');
                return;
            }
            this._values = values;
            this._processData();
        }
    }

    _processData(){
        //Sort the array before determining the division of the mapping
        this._values.sort();

        //Determine largest and smallest value.
        this.minValue = this._values[0];
        this.maxValue = this._values[this._values.length - 1];
        this.valueRange = this.maxValue - this.minValue;
    }
}

export default BasePropertyMapper;