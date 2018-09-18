/**
 * Helper class for conversion methods related to geocoordinates and the earthviewer.
 */

 import {EarthProperties} from '../earth-viewer.js'
 import Units from '../util/units.js'
class GeoConversion {
    static WGStoGlobeCoord(latitude = 0.0, longitude = 0.0, radius = 0.0){
        if (!!latitude && !!longitude && !!radius){
            let latRadiant = latitude * Math.PI / 180;
            let longRadiant = longitude * Math.PI / 180;

            let x = radius * Math.cos(latRadiant) * Math.sin(longRadiant);
            let z = radius * Math.cos(latRadiant) * Math.cos(longRadiant);
            let y = radius * Math.sin(latRadiant);
            let vector = new THREE.Vector3(x,y,z);
            
            return vector;
        }
    }

    static long2tile(lon, zoom) {
        return (Math.floor((lon + 180) / 360 * Math.pow(2, zoom)));
    }
    
    static lat2tile(lat, zoom) {
        return (Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom)));
    }
    
    static tile2long(x, z) {
        return ((x / Math.pow(2, z) * 360 - 180) + 540) % 360 - 180;
    }
    
    static tile2lat(y, z) {
        var n = Math.PI - 2 * Math.PI * y / Math.pow(2, z);
        return (180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))));
    }
    
    static measure(lat1, lon1, lat2, lon2) { // generally used geo measurement function
        var dLat = (lat2 - lat1) * Math.PI / 180;
        var dLon = (lon2 - lon1) * Math.PI / 180;
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = Units.toReal(EarthProperties.RADIUS) * c;
        return d; // meters
    }
    
}

export default GeoConversion;
