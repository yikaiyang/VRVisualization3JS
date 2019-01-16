class Constants {};
Constants.DEFAULT_ALTITUDE = 6378000;
Constants.DEFAULT_LATITUDE = 48.210033;
Constants.DEFAULT_LONGITUDE = 16.363449;
Object.freeze(Constants); 

var App = App || {};

class UserPosition {
    constructor(){
        this._altitude = Constants.DEFAULT_ALTITUDE;
        this._latitude = Constants.DEFAULT_LATITUDE;
        this._longitude = Constants.DEFAULT_LONGITUDE;
    }
    
    set altitude(value) {
        if (value !== null && value !== undefined && !isNaN(value)){
            this._altitude = value;
        } else {
            console.warn('Tried to set invalid altitude value: ' + value);
        } 
    }

    get altitude(){
        return this._altitude;
    }

    set latitude(value) {
        if (value !== null || value !== undefined || !isNaN(value)){
            this._latitude = value;
        } else {
            console.warn('Tried to set invalid latitude value: ' + value);
        } 
    }

    get latitude(){
        return this._latitude;
    }

    set longitude(value) {
        if (value !== null && value !== undefined && !isNaN(value)){
            this._longitude = value;
        } else {
            console.warn('Tried to set invalid longitude value: ' + value);
        } 
    }

    get longitude() {
        return this._longitude;
    }
}

//TODO: Move this to a boostrapper.
App.UserPosition = new UserPosition();