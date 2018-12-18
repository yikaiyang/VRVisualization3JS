import JSONUtil from "../../../../util/json-util";
import ColorMapper from './colormapper';
import SizeMapper from './sizemapper';

export default class DataMapperFactory {
    static createColorMapper(dataArray, propertyPath, options){
        //Extract given property from dataarray
        let array = JSONUtil.extractPropertiesFromArrayAsList(dataArray, propertyPath);
        let mapper = new ColorMapper(array, options);
        return mapper;
    }

    static createSizeMapper(dataArray, propertyPath, options){
        //Extract given property from dataarray
        let array = JSONUtil.extractPropertiesFromArrayAsList(dataArray, propertyPath);
        let sizeMapper = new SizeMapper(array, options);
        return sizeMapper;
    }
}