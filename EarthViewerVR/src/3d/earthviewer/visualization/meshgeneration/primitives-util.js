import MathUtil from '../../../../util/math-util';
class PrimitivesGenerator {
    /**
     * Creates a three js cylinder mesh with the given parameters.
     * Returns a cylinder mesh if valid parameters are provided, otherwise null.
     */
    static createCylinder(height = 100, width = 10, hexColor =  0xbf0b2c){
        let geometry = new THREE.CylinderGeometry(width, width, height, 14);
        let material = new THREE.MeshLambertMaterial({
            color: new THREE.Color(hexColor)
        });

        if (!!geometry && !! material){
            return new THREE.Mesh(geometry, material);
        }

        return null;
    }

    static createCube(height, width, hexColor = 0xbf0b2c){
        let geometry = new THREE.BoxGeometry(width, height, width);
        let material = new THREE.MeshLambertMaterial({
            color: new THREE.Color(hexColor)
        });

        if (!!geometry && !! material){
            return new THREE.Mesh(geometry, material);
        }

        return null;
    }

    /**
     * Creates a spline on an globe with radius using a given geoencoded start and end position.
     * An optional elevation or color can also be specified.
     * 
     * Note: 
     *      This version of createArc uses GLLINES to draw the arcs, 
     *      which supports only linewidths of 1.0.
     *      Due to the large scaling of the coordinate system, usage of this method may not be appropriate
     *         
     *      See: https://threejs.org/docs/index.html#api/en/materials/LineBasicMaterial.linewidth
     *  
     * 
     * @param {*} startPosition the startPosition as json object in json format: {lat: 43, lon: 3}
     * @param {*} endPosition the endPosition as json object in json format: {lat: 43, lon: 3}
     * @param {*} radius    the radius of the globe
     * @param {*} elevation the protrusion of the midpoint of the spline. (optional) default is 0.
     * @param {*} hexColor the color of the spline
     */
    static createArcUsingGLLine(startPosition, endPosition, radius, elevation, hexColor = 0xff0000) {
        if (!startPosition || !endPosition || !elevation){
            return null;
        }

        //Calculate mid point.
        const midPoint = {
            lat: MathUtil.midValue(startPosition.lat, endPosition.lat),
            lon: MathUtil.midValue(startPosition.lon, endPosition.lon)
        };

        const startCoords = GeoConversion.WGStoGlobeCoord(startPosition.lat, startPosition.lon, radius);
        const endCoords = GeoConversion.WGStoGlobeCoord(endPosition.lat, endPosition.lon, radius);

        const midPointCoords = GeoConversion.WGStoGlobeCoord(midPoint.lat, midPoint.lon, radius + elevation);

        const digits = 8; //Specifies how many digits shall be left.

        // Create a sine-like wave
        var curve = new THREE.QuadraticBezierCurve3( 
            new THREE.Vector3( 
                MathUtil.roundNumber(startCoords.x, digits),
                MathUtil.roundNumber(startCoords.y, digits),
                MathUtil.roundNumber(startCoords.z, digits)
            ),
            new THREE.Vector3( 
                MathUtil.roundNumber(midPointCoords.x, digits),
                MathUtil.roundNumber(midPointCoords.y, digits),
                MathUtil.roundNumber(midPointCoords.z, digits)
            ),
            new THREE.Vector3( 
                MathUtil.roundNumber(endCoords.x, digits),
                MathUtil.roundNumber(endCoords.y, digits), 
                MathUtil.roundNumber(endCoords.z, digits)
            ),
        );

        var points = curve.getPoints(40);
        var geometry = new THREE.BufferGeometry().setFromPoints(points);
        var material = new THREE.LineBasicMaterial( { 
            color : hexColor,
        } );

        // Create the final object to add to the scene
        var splineObject = new THREE.Line( geometry, material );
        return splineObject;
    }

    /**
     * Creates a spline on an globe with radius using a given geoencoded start and end position.
     * An optional elevation or color can also be specified.
     * @param {*} startPosition the startPosition as json object in json format: {lat: 43, lon: 3}
     * @param {*} endPosition the endPosition as json object in json format: {lat: 43, lon: 3}
     * @param {*} radius    the radius of the globe
     * @param {*} elevation the protrusion of the midpoint of the spline. (optional) default is 0.
     * @param {*} hexColor the color of the spline
     */
    static createArc(startPosition, endPosition, radius, elevation, hexColor = 0xff0000, lineWidth) {
        if (!startPosition || !endPosition || !elevation){
            return null;
        }

        //Calculate mid point.
        const midPoint = {
            lat: MathUtil.midValue(startPosition.lat, endPosition.lat),
            lon: MathUtil.midValue(startPosition.lon, endPosition.lon)
        };

        const startCoords = GeoConversion.WGStoGlobeCoord(startPosition.lat, startPosition.lon, radius);
        const endCoords = GeoConversion.WGStoGlobeCoord(endPosition.lat, endPosition.lon, radius);

        const midPointCoords = GeoConversion.WGStoGlobeCoord(midPoint.lat, midPoint.lon, radius + elevation);

        const digits = 8; //Specifies how many digits shall be left.

        // Creates geometry of arc
        let curve = new THREE.QuadraticBezierCurve3( 
            new THREE.Vector3( 
                MathUtil.roundNumber(startCoords.x, digits),
                MathUtil.roundNumber(startCoords.y, digits),
                MathUtil.roundNumber(startCoords.z, digits)
            ),
            new THREE.Vector3( 
                MathUtil.roundNumber(midPointCoords.x, digits),
                MathUtil.roundNumber(midPointCoords.y, digits),
                MathUtil.roundNumber(midPointCoords.z, digits)
            ),
            new THREE.Vector3( 
                MathUtil.roundNumber(endCoords.x, digits),
                MathUtil.roundNumber(endCoords.y, digits), 
                MathUtil.roundNumber(endCoords.z, digits)
            ),
        );
        let points = curve.getPoints(40);

        let geometry = new THREE.BufferGeometry().setFromPoints(points);
        let material = new THREE.LineBasicMaterial( { 
            color : hexColor,
        } );

        // Create the final object to add to the scene
        var splineObject = new THREE.Line( geometry, material );
        return splineObject;
    }
}

export default PrimitivesGenerator;