class GeoBounds {
    constructor (minLatitude, maxLatitude, minLongitude, maxLongitude){
        this.minLatitude = minLatitude;
        this.maxLatitude = maxLatitude;
        this.minLongitude = minLongitude;
        this.maxLongitude = maxLongitude;
    }

    contains(geoBounds){
        if (geoBounds instanceof GeoBounds){
            if (this.minLatitude <= geoBounds.minLatitude 
                && bounds.maxLatitude <= this.maxLatitude
                && this.minLongitude <= geoBounds.maxLongitude
                && bounds.maxLongitude <= this.maxLongitude)
                {
                    return true;
                }
        }
        return false;
    }

    intersects(geoBounds){
        if (this.maxLatitude > geoBounds.minLatitude && this.minLatitude < geoBounds.maxLatitude
            && this.maxLongitude > geoBounds.minLongitude && this.minLongitude < geoBounds.maxLongitude)
        {
            return true;
        } else {
            return false;
        }
    }

    midLatitude(){
        return this.minLatitude + this.deltaLatitude/2;
    }

    midLongitude(){
        return this.minLongitude + this.deltaLongitude/2;
    }

    deltaLatitude(){
        return this.maxLatitude - this.minLatitude;
    }

    deltaLongitude(){
        return this.maxLongitude - this.minLongitude;
    }
}

export default GeoBounds;