class FileUtils {
    /**
     * Returns true if the path of a file exists. If not it creates the directories leading to the file path.
     * @param filepath the file path (for example : /mypath/to/file.js ) If directories are not available, they will be created.
     */
    static ensureDirectoryExists(filepath){
        const dirname = path.dirname(filepath);
        console.log(dirname);
        if (!fs.existsSync(dirname)){
            ensureDirectoryExists(dirname);
            fs.mkdirSync(dirname);
        } else {
            return true;
        }
    }
}

export default FileUtils;