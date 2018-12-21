export default class DataStorage {
    constructor(dataObject){
        //TODO Schema validation
        //access data array
        this._data = dataObject.data;
        window.DATA_STORAGE = this._data;
    }

    setData(data){
        this._data = data;
    }

    getData(){
        return this._data;
    }

    getObjectAtIndex(index){
        return this._data[index];
    }
}