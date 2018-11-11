import JSONUtil from '../../../../util/json-util';

export default class DataProcessor {
    /**
     * 
     * @param {*} data 
     * @param {*} mapping 
     */
    static processData(data, mapping){
        if (!mapping || !data){
            console.error("Invalid parameter data or mapping is undefined or null.");
            return null;
        }

        //Check if data array exists
        const dataPath = mapping.dataPath;
        let dataArray = JSONUtil.getProperty(data, dataPath);

        if (!Array.isArray(dataArray) || !dataArray.length) {
            console.error('processData: Retrieved dataArray is empty or invalid.');
        }

        //JSON object in which the result is stored.
        let result = {
            data: [],
        };

        //Process data
        for (let i = 0 ; i < dataArray.length; i++){
            let dataPoint = dataArray[i];

            let dataId = JSONUtil.getProperty(dataPoint, mapping.id);
            let dataTitle = JSONUtil.getProperty(dataPoint, mapping.title);
            let dataLatitude = JSONUtil.getProperty(dataPoint, mapping.latitude);
            let dataLongitude = JSONUtil.getProperty(dataPoint, mapping.longitude);
            let dataPosition = {
                "lat": dataLatitude,
                "lon": dataLongitude
            };

            let entry = DataProcessor.buildEntry(
                dataId,
                dataTitle,
                dataArray[i], //Save all properties of data entry
                dataPosition,
                null //No links for now
                );

            result.data.push(entry);
        }

        return result;
    }

    /**
     * Builds a data entry according to the dataschema.
     * @param {*} id 
     * @param {String} title 
     * @param {*} properties 
     * @param {*} position 
     * @param {*} links 
     */
    static buildEntry(id, title, properties, position, links){
        let entry = {}
        entry.id = id;
        entry.title = title;
        entry.properties = properties;
        entry.position = position;
        entry.links = links;

        return entry;
    }
}