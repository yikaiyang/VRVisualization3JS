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

    static createCube(height, width, hexColor){
        let geometry = new THREE.BoxGeometry(width, height, width);
        let material = new THREE.MeshLambertMaterial({
            color: new THREE.color(hexColor)
        });

        if (!!geometry && !! material){
            return new THREE.Mesh(geometry, material);
        }

        return null;
    }

    static createArc(height, hexColor){
        
    }
}

export default PrimitivesGenerator;