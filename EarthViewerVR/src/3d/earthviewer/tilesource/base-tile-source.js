class BaseTileSource {
    constructor (baseUrl, fileFormat = '.png'){
        this.baseUrl = baseUrl;
        this.fileFormat = fileFormat;
    }

    buildTileURL(zoom, x, y){
        if (zoom === null ||
            zoom === NaN ||
            x === null ||
            x === NaN || 
            y === null ||
            y === NaN){
            console.error('Invalid paramters: Either zoom, x or y value is invalid : ' + 'x: '+ x + 'y:'+ y + ' z:' + zoom );
            return;
        }
        
        //Typical format for rest request is /{zoom}/{x}/{y}{@2x}.{format}
        return this.baseUrl + '/' + zoom + '/' + x + '/' + y + this.fileFormat; 
    }
}

export default BaseTileSource;