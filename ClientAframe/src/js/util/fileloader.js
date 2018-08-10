export default class FileLoader {
    static parseFile(fileURL, callback){
        var request = new XMLHttpRequest();
        request.open("GET", fileURL, true);
        request.onreadystatechange = function(){
            if (request.readyState === 4){
                if (request.status === 200 || request.status === 0){
                    var text = request.responseText;
                    callback(text);
                }
            }
        }
        request.send(null);
    }
}

