import papaparse from 'papaparse';
import fetch from 'node-fetch';
import path from 'path';
import fs from 'fs';
import FileUtils from 'util/fileUtils.mjs'

/**
 * Converts a csv file to a json object and write the output to a file specified by the destination path.
 * @param originFilePath 
 * @param destinationPath 
 */
function convertCSVtoJSONFile(originFilePath, destinationPath){
    fetch(originFilePath).then((response) => {
        response.text().then(
            (data) => {
                //console.log(data);
                parseCSVData(data, destinationPath);
            }
        )
    });
}

function parseCSVData(data, destinationPath = 'data.json'){
    const result = papaparse.parse(data, {
        header: true,
        complete: (result) => {
            console.log('complete');
            const jsonData = JSON.stringify(result);
            FileUtils.ensureDirectoryExists(destinationPath);
            fs.writeFile(destinationPath, jsonData, (error) => {
                if (error){
                    console.error('File could not be written: ' + error);
                }
            });
        }
    });
}

export default convertCSVtoJSONFile;