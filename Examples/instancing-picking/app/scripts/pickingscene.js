var THREE = require('three');

export default class PickingScene{
    constructor(){
        this._scene = new THREE.Scene();
        this._group = new THREE.Group();
        this._scene.add(this._group);
        this._initEventEmitter();
    }

    _initEventEmitter(){
        EVENT_BUS.on(
            'positionChanged',
            (args) => {
                this._handlePositionChange(args)
            }, this);

        EVENT_BUS.emit('positionChanged',
        'test1');
    }

    _handlePositionChange(args){
        if (!!args){

        }
    }

    addObject(
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
        this._group.add(mesh);
    }

    getScene(){
        return this._scene;
    }

    getSceneObjects(){
        return this._group.children;
    }
}