var http = require('http');
var fs = require('fs');
var url = require('url');
var sqlite = require('better-sqlite3');
var express = require('express');
var app = express();

const dbPath = './db/2017-07-03_austria_vienna.mbtiles';

try {
    var db = new sqlite(dbPath, readonly = true);
    console.log('Connected to database');
} catch (e){
    console.error('Could not open database: ' + e.message);
}


app.get('/', function (req, res){
    res.send('');
});

app.get('/tiles/', function (req, res){
    var tile = loadTile(10, 557, 354);
    res.send(tile);
});

//Try http://localhost:8081/tiles/10/557/354
app.get('/tiles/:zoom/:x/:y/', function(req,res){
    let zoom = parseInt(req.params.zoom);
    let x = parseInt(req.params.x);
    let y = parseInt(req.params.y);
    console.log("Request tile with zoom: " + zoom + " x: " + x + " y: " + y);
    
    //Check if request is valid
    if (isNaN(zoom) || isNaN(x) || isNaN(y)
        || zoom < 0 || x < 0 || y < 0)
    {
        res.send('invalid tile request');
    }

    //Retrieve tile if available
    let tile = loadTile(zoom, x, y);
    if (tile === undefined){
        //Send invalid message as json object
        res.send('no tile found');
    }

    res.send(tile);
});

//testQuery();

function testQuery(){
    let query = "select * from map";
    let preparedQ = db.prepare(query);
    // var res = db.exec(query);
    let res = db.each(preparedQ, (err, row) => {
        if (err){
            console.error(err.message);
        }
        console.log(row.tile_id);
    });
    let x = res;
}

function loadTile(zoomlevel, x, y){
    try {
        let query = db.prepare("select * from package_tiles where "
                            +" zoom_level = (?)"
                            +" and tile_column = (?)"
                            +" and tile_row = (?)");
        let res = query.get(zoomlevel, x, y);
        return res;
    } catch (e) {
        console.error('Loadtiles method failed: ' + e.message);
    }
}

/**
 * Queries all available tiles
 */
function loadAllTiles(){
    try {
        let query = db.prepare('select * from package_tiles');
        let res = query.all();
        return res;
    } catch (e){
        console.error('Error loadAllTiles: ' + e.message);
    }
}

var tile = loadTile(10, 557, 354);

function closeDB(){
    db.close((err) => {
        if (err){
            console.error(err.message);
        }
    })

    console.log("Closed sqlite database");
}

var server = app.listen(8081, function(){
    var host = server.address().address;
    var port = server.address().port;
    console.log("Server started %s %s", host, port);
});

/**
http.createServer( function (request,response){
    var pathname = url.parse(request.url).pathname;

    console.log("Request for " + pathname + "received.");

    fs.readFile(pathname.substr(1), function(err, data){
        if (err) {
            console.log(err);
            response.writeHead(404, {'Content-Type': 'text/html'});
        } else {
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.write(data.toString());
        }

        response.end();
    });
}).listen(8081);
**/

console.log('server running at http://127.0.0.1:8081/');