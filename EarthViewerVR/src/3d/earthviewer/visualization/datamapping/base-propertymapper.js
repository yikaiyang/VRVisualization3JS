import JSONUtil from '../../../../util/json-util.js'

/**
 * Base class for all data mapping classes.
 * 
 * The following processing is done by this object:
 * 1. Extracts a property values from a json array using a specified propertyPath and appends them to a list .
 * 2. Basic dataprocessing of the extracted values. (Sorting and identification of max and min values).
 */
class BasePropertyMapper {
    constructor(values){
        if (!Array.isArray(values)){
            console.error('ERROR: Parameter jsonArray is not an array.');
        }

        if (!Array.isArray(values)){
            console.error('ERROR: _parseParameters: Returned object is invalid (null or undefined)');
            return;
        }

        if (values.length <= 0){
            console.warn('The resulting array is empty.');
        }
        
        //Check if array is empty
        this._values = values;
        this._processData();
    }

    _processData(){
        //Sort the array in ascending order
        this._values.sort((a,b) => (a - b));

        //Determine largest and smallest value.
        this.minValue = this._values[0];
        this.maxValue = this._values[this._values.length - 1];
        this.valueRange = this.maxValue - this.minValue;
    }
}

export default BasePropertyMapper;