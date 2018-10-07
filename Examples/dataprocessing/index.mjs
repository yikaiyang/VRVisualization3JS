import DataManager from './datamanager.mjs';
import path from 'path';
//import fetch from 'node-fetch';
import fetchPolyfill from 'node-fetch-polyfill';
import express from 'express';
import papaparse from 'papaparse'
import fs from 'fs';
import csvToJson from './csv-to-json'

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
    'HospitalData.csv'
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

for (let i=0; i < serverFilePaths.length; i++){
    csvToJson(serverFilePaths[i], 'jsonData/' + files[i].split('.')[0] + '.json');
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
