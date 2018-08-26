import FileLoader from '../../util/fileloader.js';
import GeoConversion from '../../util/geoconversion.js';

class WienerLinienLayer {
    constructor(scene, earth){
        this.scene = scene;
        this.earth = earth;

        this.color = new THREE.Color("rgb(187,57,70)");
        this.primitiveGeometry = new THREE.BoxGeometry(10,10,100);
        this.primitiveMaterial = new THREE.MeshBasicMaterial({
            color: color
        });
    }

    load(){
        let stationData = this.loadStationData();
        if (stationData === undefined){
            console.error('Loaded station data is undefined!');
        }

        this.createStationData(stationData.data);
    }


    ///Private methods
    initMergedGeometry(){
        this.mergedGeometry = new THREE.Geometry();   
    }

    loadStationData(){
        FileLoader.parseFile('../../../data/haltestellen.csv', function(data){
            let results = Papa.parse(data);
            return results;
        });
    }

    createStationData(stationData){
        const latIdx = 6; //latitude value at 6th position
        const longIdx = 7; //longitude value at 7th position

        for (let i = 0; i < stationData.length; i++){
            let stationLat = stationData[i][latIdx];
            let stationLong = stationData[i][longIdx];

            this.createPrimitive(stationLat, stationLong);
        }

        let cubes = new THREE.Mesh(this.mergedGeometry, this.primitiveMaterial);
        this.earth.add(cubes);
    }

    createPrimitive(latitude, longitude){
        let position = GeoConversion.WGStoGlobeCoord(latitude, longitude, R * 1000);
        if (position == undefined){
            return;
        }

        let mesh = new THREE.Mesh(this.primitiveGeometry, this.primitiveMaterial);
        mesh.position.set(position.x, position.y, position.z);
        mesh.lookAt(center);
        mesh.updateMatrix();

        //Merge geometries
        this.mergedGeometry.merge(mesh.geometry, mesh.matrix);
    }


}

export default WienerLinienLayer;