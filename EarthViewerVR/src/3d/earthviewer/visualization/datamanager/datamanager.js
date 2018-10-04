class DataManager {
    constructor(files){
        this.files = files;
    }

    /**
     * Loads an array containing the filepaths that point to the files which shall be read in.
     * @param {*} files 
     */
    loadFiles(files){
        if (!files){
            this.files = files;
        }        
    }

    processFiles(){
        const filepath = '../haltestellen.csv';
        d3.csv(filepath, function(data){
            console.log(data);
        });
    }
}

export default DataManager;