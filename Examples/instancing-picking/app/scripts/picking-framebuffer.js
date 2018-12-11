var THREE = require('three')

export default class PickingFrameBuffer{
    constructor(){
        this._scene = new THREE.Scene();
    }

    addToBuffer(
        id, 
        position, 
        quaternion, 
        scale, 
        geometry) {
        
        if (!id || !position || !quaternion || !scale || !geometry) {
            console.error('ERROR: Given parameters are either null or undefined.');
            return;
        }
      
        let matrix = new THREE.Matrix4();
        let color = new THREE.Color();
        matrix.compose(position, quaternion, scale);
        geometry.applyMatrix(matrix);
        let material = new THREE.MeshBasicMaterial({
            //Calculate color using the given id.
            //Hex color value corresponds to id.
            color: color.setHex(id)
        });
      
        let mesh = new THREE.Mesh(geometry, material);
        mesh.name = id;
        this._scene.add(mesh);
    }

    getScene(){
        return this._scene;
    }
}