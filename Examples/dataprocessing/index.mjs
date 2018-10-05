import DataManager from './datamanager.mjs';
import d3 from 'd3';
import path from 'path';
//import fetch from 'node-fetch';
import fetchPolyfill from 'node-fetch-polyfill';
import express from 'express';
import papaparse from 'papaparse'
import fs from 'fs';

if (typeof fetch !== 'function'){
    global.fetch = fetchPolyfill;
}

/**
 * Express setup
 */
const app = express();
const port = 8081;

let server = app.listen(port, function(){
    var host = server.address().adress;
    var port = server.address().port;
    console.log('Server started with hostname: ' + host
        + ' port: ' + port);
})
app.get('/', (req, res) => res.send('Working Server'));
app.use(express.static('public'));

///End express setup

const __dirname = path.resolve(path.dirname(decodeURI(new URL(import.meta.url).pathname)));

const dirPath = './assets/data/hospital';
const files = [
    'BetterHosp.csv',
    'HospitalData.csv',
    //'lookup_address.json'
];


const serverURL = 'http://localhost:8081';

let filePaths = [];
let serverFilePaths = [];

for (let i = 0; i < files.length; i++){
    filePaths.push(dirPath + '/' + files[i]);
    serverFilePaths.push(serverURL + '/assets/data/hospital/' + files[i]);
}

filePaths = filePaths.map(p => __dirname + '/' + path.normalize(p));

console.log(filePaths);
console.log(serverFilePaths);
let data = [];

/* for (let i = 0; i < filePaths.length; i++){
    try {
        d3.csv(filePaths[i], (data) => {
             const element = {
                 csvData: data
             };
             data.push(element);
     
             console.log(data);
         });
    } catch (error){
        console.error(error);
    }
} */
//console.log(path.resolve('haltestellen.csv'));

const serverHostedPath = 'http://localhost:8081/assets/data/haltestellen.csv';

/* fetch('http://localhost:8081/assets/data/haltestellen.csv').then((response) => {
    response.text().then(
        (data) => {
            console.log(data);
        }
    )
}); */


/**
 * Converts a csv file to a json file.
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
            fs.writeFile(destinationPath, jsonData, (error) => {
                if (error){
                    console.error('File could not be written: ' + error);
                }
            });
        }
    });
}

//convertCSVtoJSONFile(serverHostedPath);

for (let i=0; i < serverFilePaths.length; i++){
    convertCSVtoJSONFile(serverFilePaths[i], files[i].split('.')[0] + '.json');
}


/* d3.dsv(';', serverHostedPath, (data) => {
    //console.log(data);
    let dataString = JSON.stringify(data);
    fs.writeFile('data.json', dataString, (error) => {
        if (error){
            console.error('error: ' + error);
        }
    });
});
 */
