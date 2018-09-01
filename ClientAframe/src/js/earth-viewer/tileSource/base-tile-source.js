class BaseTileSource {
    constructor (baseUrl, fileFormat){
        this.baseUrl = baseUrl;
        this.fileFormat = fileFormat;
    }

    buildTileURL(zoom, x, y){
        //Typical format for rest request is /{zoom}/{x}/{y}{@2x}.{format}
        return this.baseUrl + '/' + zoom + '/' + x + '/' + y + '.' + this.fileFormat; 
    }
}

export default BaseTileSource;