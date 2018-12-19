import MousePicker from './mousepicker'
import EarthviewerPickingScene from './earthviewer-pickingscene'
import BaseThreeJSComponent from '../../../components/base-threejs-component';

export default class PickingHandler extends BaseThreeJSComponent{
    /**
     * 
     * @param {THREE.PerspectiveCamera} camera 
     * @param {THREE.WEBGLRenderer} renderer 
     */
    constructor(ascene, camera, renderer, isEnabled = false){
        super(ascene);

        this._camera = camera;
        this._renderer = renderer;

        this.isEnabled = isEnabled
        this._pickingScene = null;
        this._picker = null;

        if (this.isEnabled){
            this.enable()
        }
    }

    /**
     * Enables picking
     */
    enable(){
        this.isEnabled = true;
        if (!this._pickingScene){
            this._pickingScene = new EarthviewerPickingScene();
            this._picker = new MousePicker(this._pickingScene, this._camera, this._renderer);
        }

        this._picker.enable();
    }

    /**
     * Disables picking
     */
    disable(){
        this.isEnabled = false;
        this._picker.disable();
    }

    addObject(
        id, 
        position, 
        quaternion, 
        scale, 
        geometry){
        this._pickingScene.addObject(
            id,
            position,
            quaternion,
            scale,
            geometry
        )
    }

    addMeshAtLocation(latitude, longitude, mesh){
        this._pickingScene.addMeshAtLocation(latitude,longitude,mesh);
    }

    tick(time, delta){
        //console.log(time);
        if (!!this._picker){
            this._picker.tick(time, delta);
        }
    }
}