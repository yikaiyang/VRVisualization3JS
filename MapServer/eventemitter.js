var http = require('http');
var events = require('events');

console.log(__filename);

var eventEmitter = new events.EventEmitter();
var connectHandler = function connected() {
    console.log('connection successful.');

    eventEmitter.emit('data_received');
}

eventEmitter.on('connection', connectHandler);

eventEmitter.on('data_received', function(){
    console.log('data received');
});

eventEmitter.emit('connection');

http.createServer(function (req, res){
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('HelloWorld');
}).listen(8080);

console.log('server running at localhost\n');