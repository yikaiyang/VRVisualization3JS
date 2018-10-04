import DataManager from './datamanager.mjs';
import d3 from 'd3';
import fetchPolyFill from 'node-fetch-polyfill';
import path from 'path';
import fetch from 'node-fetch';
import express from 'express';

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

const __dirname = path.resolve(path.dirname(decodeURI(new URL(import.meta.url).pathname)));

/* if (typeof fetch !== 'function'){
    global.fetch = fetchPolyFill;
} */

const dirPath = './assets/data/hospital';
const files = [
    'BetterHosp.csv',
    'HospitalData.csv',
    'lookup_address.json'
];

let filePaths = [];
for (let i = 0; i < files.length; i++){
    filePaths.push(dirPath + '/' + files[i]);
}

filePaths = filePaths.map(p => __dirname + '/' + path.normalize(p));

console.log(filePaths);
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
const haltestellenPath = path.resolve('haltestellen.csv');

fetch('http://localhost:8081/assets/data/haltestellen.csv').then((response) => {
    console.log(response);
});


/* d3.csv(path.resolve('haltestellen.csv'), (data) => {
    console.log(data);
});  */

console.log(data);

