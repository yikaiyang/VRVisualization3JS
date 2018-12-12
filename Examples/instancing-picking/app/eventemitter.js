let EE = require('eventemitter3');
let emitter;
if (!emitter){
    emitter = new EE();
}

function hello(){
    alert('test');
    
}

var Test = function hello(){
    alert('test1');
    
}

var x = '45';

module.exports = Test;