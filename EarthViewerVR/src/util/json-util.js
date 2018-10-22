export default class JSONUtil {
    /**
     * Check whether a json object contains a specified property.
     * Returns true if property is contained in the given object, otherwise false.
     * @author Yikai Yang
     * @param {*} object    the json object
     * @param {*} propertyPath path to property (for example: location.latitude.wgs84 (for nested property) or latitude (property is directly contained in the object))
     */
    static checkIfPropertyExists(object, propertyPath) {
        const splittedPath = propertyPath.split('.');
        let nextProperty = splittedPath[0];
        if (!object.hasOwnProperty(nextProperty)){
            return false;
        }

        if (splittedPath.length <= 1){
            //Last item reached and object has property.
            return true;
        } else {
            const remainingPath = splittedPath.slice(1, splittedPath.length).join('.');
            return JSONUtil.checkIfPropertyExists(object[nextProperty], remainingPath); 
        }
    }

    /**
     * Returns property of a json object, described in the property path.
     * Return undefined if path is incorrect or property does not exist.
     * @param {*} object    the json object
     * @param {string} propertyPath  the path of the object (for example position.latitude)
     */
    static getProperty(object, propertyPath){
        if (!!object && !!propertyPath){
            let objectElement = object;
            const splittedPath = propertyPath.split('.');
            for (let i=0; i < splittedPath.length; i++){
                objectElement = (objectElement || {})[splittedPath[i]];
            }

            return (objectElement);
        }
    }

    /**
     * Checks whether a json object is empty.
     * From here: https://coderwall.com/p/_g3x9q/how-to-check-if-javascript-object-is-empty
     * @param {*} obj 
     */
    static isEmpty(obj) {
        for(var key in obj) {
            if(obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    /**
     * Extracts properties from a json array by specifying the property path.
     * For example for the json object:
     * const array = [
     *    {
     *      "p1": {
     *          "p2": 121
     *      }
     *    },
     *    {
     *      "p1": {
     *          "p2": 123
     *      }
     *    }
     * ]
     * this method can be called: extractPropertiesFromArrayAsList(array, "p1.p2", type="Number")
     * to retrieve a list of the properties p2 contained in the array.
     * -> [121, 123]
     * 
     * @param {*} jsonArray 
     * @param {string} propertyPath 
     * @param {string} type 
     */
    static extractPropertiesFromArrayAsList(jsonArray, propertyPath, type = "Number"){
        let result = [];
        let property;
        let error = false;
        for (let i = 0; i < jsonArray.length; i++){
            property = JSONUtil.getProperty(jsonArray[i], propertyPath);

            switch (type){
                //Specified property is number.
                case 'Number':
                    property = parseFloat(property);
                    break;
                default:
                    error = true;
                    console.error('ERROR: extractPropertiesFromArrayAsList');
            }
            
            if (!error){
                if (!!property){
                    result.push(property);
                }
            }
        }

        return result;
    }
}