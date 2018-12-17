import MousePicker from './mousepicker'
import EarthviewerPickingScene from './earthviewer-pickingscene'
import BaseThreeJSComponent from '../../../components/base-threejs-component';

class PickingManager extends BaseThreeJSComponent{
    /**
     * 
     * @param {THREE.PerspectiveCamera} camera 
     * @param {THREE.WEBGLRenderer} renderer 
     */
    constructor(ascene, camera, renderer, isEnabled = false){
        this._camera = camera;
        this._renderer = renderer;

        this.isEnabled = isEnabled
        this._pickingScene = null;
        this._picker = null;

        if (this.isEnabled){
            this.enable()
        }

        super(ascene);
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
    }

    /**
     * Disables picking
     */
    disable(){
        this.isEnabled = false;
    }
}