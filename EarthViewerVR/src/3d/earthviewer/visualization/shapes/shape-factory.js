import MathUtil from '../../../../util/math-util';
import GeoConversion from '../../util/geoconversion';
import {MeshLine, MeshLineMaterial} from 'three.meshline';
class ShapeFactory {
    /**
     * Creates a three js cylinder mesh with the given parameters.
     * Returns a cylinder mesh if valid parameters are provided, otherwise null.
     */
    static createCylinder(height = 100, width = 10, color = new THREE.Color('0xbf0b2c')){
        let geometry = new THREE.CylinderGeometry(width, width, height, 14);
        let material = new THREE.MeshLambertMaterial({
            color: new THREE.Color(color)
        });

        if (!!geometry && !! material){
            return new THREE.Mesh(geometry, material);
        }

        return null;
    }

    static createCube(height, width, color = new THREE.Color('0xbf0b2c')){
        let geometry = new THREE.BoxGeometry(width, height, width);
        let material = new THREE.MeshLambertMaterial({
            color: new THREE.Color(color)
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
    static createArc(startPosition, endPosition, radius, elevation, hexColor = 0xff0000, lineWidth, options = {}) {
        if (!startPosition || !endPosition || !elevation){
            return null;
        }

        let renderOption = (options.renderOption === 'GLLines') ? 'GLLines' : 'MeshLine';

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

        let geometry = new THREE.Geometry().setFromPoints(points);
        let material = new THREE.LineBasicMaterial( { 
            color : hexColor,
        } );

        // Create the final object to add to the scene
        let splineObject = new THREE.Line(geometry, material); //GLLINE
        //let splineObject = PrimitivesGenerator.createMeshLine(geometry, 1.0); //THREE.MeshLine
        return splineObject;
    }

    /**
     * Creates a THREE.MeshLine object using a given geometry and linewidth.
     * @param {*} geometry      the geometry data
     * @param {*} linewidth     the line width
     */
    static createMeshLine(geometry, linewidth = 0.1) {
        if (!geometry){
            console.error('Error: makeLine: geometry is undefined or null.');
            return;
        }

        var g = new MeshLine();
        g.setGeometry(geometry);

        var material = new MeshLineMaterial( {
            useMap: false,
            color: new THREE.Color(0xf47d42),
            opacity: 1.0,
            resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
            sizeAttenuation: !false,
            lineWidth: linewidth,
            //Not needed for now
            near: 10,
            far: 637800000
            //Define far plane as maximum limit of used height.
            // Objects must be within the range of the far plane. Otherwise they become invisible.
        });
        var mesh = new THREE.Mesh(g.geometry, material);
        return mesh;
    }
}

export default ShapeFactory;