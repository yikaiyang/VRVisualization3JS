import JSONUtil from "../../../../util/json-util";

const Schema = {
    "id": "id",
    "title": "title",
    "latitude": "position.lat",
    "longitude": "position.lon",
    "links": "links",
    "properties": "properties",
    "getProperty": function(dataPoint, propertyPath){
        return JSONUtil.getProperty(dataPoint[Schema.properties], propertyPath);
    },
    "getPathForProperty": function(propertyPath){
        return Schema.properties + '.' + propertyPath;
    }
}

export default Schema;