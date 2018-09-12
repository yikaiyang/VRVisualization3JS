class Constants {};
Constants.DEFAULT_ALTITUDE = 6378000;
Constants.DEFAULT_LATITUDE = 48.210033;
Constants.DEFAULT_LONGITUDE = 16.363449;
Object.freeze(Constants); 

var App = App || {};

class UserPosition {
    constructor(){
        this.altitude = Constants.DEFAULT_ALTITUDE;
        this.latitude = Constants.DEFAULT_LATITUDE;
        this.longitude = Constants.DEFAULT_LONGITUDE;
    }

    set(latitude, longitude, altitude){
        this.latitude = latitude;
        this.longitude = longitude;
        this.altitude = altitude;
    }
    
    setAltitude(altitude) {
        this.altitude = altitude;
    }

    setLatitude(latitude) {
        this.latitude = latitude;
    }

    setLongitude(longitude) {
        this.longitude = longitude;
    }
}

//TODO: Move this to an intializer
App.UserPosition = new UserPosition();