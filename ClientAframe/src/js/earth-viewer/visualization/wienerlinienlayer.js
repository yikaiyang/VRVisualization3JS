import FileLoader from '../../util/fileloader.js';
import GeoConversion from '../../util/geoconversion.js';

class WienerLinienLayer {
    constructor(scene, earth){
        this.scene = scene;
        this.earth = earth;
        this.scope = this;

        this.color = new THREE.Color("rgb(187,57,70)");
        this.initGeometries();
    }

    load(){
        this.loadStationData(this.createStationDataCallback);
        //this.createStationData(stationData.data);
    }


    ///Private methods
    initGeometries(){
        this.mergedGeometry = new THREE.Geometry();   
        this.primitiveGeometry = new THREE.BoxGeometry(10,10,100);
        this.primitiveMaterial = new THREE.MeshBasicMaterial({
            color: this.color
        });
    }

    loadStationData(callback){
        if (typeof Papa === undefined){
            console.error('Error: Framework not initialized.\n');
            return;
        }

        this.filePath = '../../../../data/haltestellen.csv';
        this.fpath = 'data/haltestellen.csv';

        let scope = this.scope;

        try {
            FileLoader.parseFile(this.filePath, function(data){
                let results = Papa.parse(data);
                callback(scope, results);
            });
        } catch (error){
            if (typeof error instanceof ReferenceError){
                console.error('Reference error could not parse file');
            }
        }
        
    }

    /**
     * Creates and draws geometry of station data on the earth.
     * @param {} scope    Scope of the layer class (for access to methods and member variables) 
     * @param {*} stationData   Station data as text
     */
    createStationDataCallback(scope, stationData){
        if (stationData === undefined){
            console.error('ERROR: stationData is undefined\n');
            return;
        }
        stationData = stationData.data;
        const latIdx = 6; //latitude value at 6th position
        const longIdx = 7; //longitude value at 7th position

        for (let i = 0; i < stationData.length; i++){
            let stationLat = stationData[i][latIdx];
            let stationLong = stationData[i][longIdx];

            scope.createPrimitive(scope, stationLat, stationLong);
        }

        let cubes = new THREE.Mesh(scope.mergedGeometry, scope.primitiveMaterial);
        scope.earth.add(cubes);
    }

    createPrimitive(scope, latitude, longitude){
        let position = GeoConversion.WGStoGlobeCoord(latitude, longitude, R * 1000);
        if (position == undefined){
            return;
        }

        //Create visual primitive and orientate the element to the center of the earth (0,0,0)
        let center = new THREE.Vector3(0,0,0);
        let mesh = new THREE.Mesh(scope.primitiveGeometry, scope.primitiveMaterial);
        mesh.position.set(position.x, position.y, position.z);
        mesh.lookAt(center);
        mesh.updateMatrix();

        //Merge geometries
        this.mergedGeometry.merge(mesh.geometry, mesh.matrix);
    }


}

export default WienerLinienLayer;