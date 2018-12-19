import PickingScene from './pickingscene'
import ShapeFactory from '../shapes/shape-factory'
import {EarthProperties} from '../../earth-viewer'
import * as THREE from 'three'
import GeoConversion from '../../util/geoconversion'

export default class EarthviewerPickingScene extends PickingScene{
    constructor(){
        super();
        this._handleEvents();
    }

    _handleEvents(){
        if (!!EVENT_BUS){
            //Register events
            EVENT_BUS.on(
                'earthviewer:rotationChanged',
                (args) => {
                    this._handleRotationChanged(args)
                });
        } else {
            console.error('Event bus could not be accessed.');
        }
    }

    addMeshAtLocation(latitude, longitude, mesh){
        if (!latitude || !longitude || !mesh){
            //Invalid values for parameters.
            return;
        }

        //Calculate corresponding world coordinates from latitude, longitude values.
        let position = GeoConversion.WGStoGlobeCoord(latitude, longitude, EarthProperties.RADIUS);

        //Create visual primitive and orientate the element towards the center of the earth (0,0,0)
        const center = new THREE.Vector3(0,0,0);
    
        mesh.position.set(position.x, position.y, position.z);
        mesh.lookAt(center);
        mesh.rotateX(Math.PI / 2);
        mesh.updateMatrix();
        
        //Add mesh
        this.addObject(mesh);
    }

    _initContainer(){
        let container = ShapeFactory.createEarthContainer(EarthProperties.RADIUS);
        this._group = container;
        let color = new THREE.Color();
        color.setHex(1);
        let testMesh = ShapeFactory.createCylinder(10000,10000,color);
        this._group.add(testMesh);
    }

    _handleRotationChanged(args){
        if (!!args){
            let quaternion = args.quaternion; //Rotation as quaternion matrix
            let rotation = args.rotation;     //Rotation in euler form
            if (!!quaternion){
                this._group.setRotationFromQuaternion(quaternion); 
            } else if (!!rotation){
                this._group.setRotationFromEuler(rotation);
            }
            this._group.updateMatrix();
        }
    }
}