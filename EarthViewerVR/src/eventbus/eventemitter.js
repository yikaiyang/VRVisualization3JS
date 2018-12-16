/**
 * Declares a global event bus which is used for communication between the multiple modules/components/framework (vuejs/earthviewer/controls)
 */
let EventEmitter = require('eventemitter3');
let eventEmitter = new EventEmitter();
module.exports = eventEmitter;