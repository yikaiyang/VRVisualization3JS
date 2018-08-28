'use strict';
class CallbackHelper {
    constructor(){
        this._callback = null;
    }

    setCallback(cb){
        this._callback = cb;
    }

    callback(){
        if (!!this._callback && (typeof this._callback) === 'function'){
            this._callback.apply(null, arguments);
        }
    }
}

var App = App || {};
App.callbackHelper = new CallbackHelper();
