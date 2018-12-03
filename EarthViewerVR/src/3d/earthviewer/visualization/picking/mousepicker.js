import BaseThreeJSComponent from "../../../components/base-threejs-component";

/**
 * https://threejs.org/docs/#api/en/core/Raycaster
 */
export default class MousePicker extends BaseThreeJSComponent{
    init(scene){
        //Init raycaster
        this._raycaster = new THREE.Raycaster();
        this._mousePosition = new THREE.Vector2();
        //Get camera from scene
        //TODO: in VR mode we translate the camera rig and not the camera itself. -> differentiation between VR and non VR mode needs to be implemented.
        if (!scene){
            console.error('Invalid scene object. Scene is null or undefined');
        }
        this._camera = scene.camera;

        //Initialize event listener
        window.addEventListener('mousemove', ()=>{this.onMouseMove()}, false);
    }

    onMouseMove(){
        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components
        if (!this._mousePosition){
            alert('mousePositoin is null');
        }
        this._mousePosition.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        this._mousePosition.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    }

    tick(time, delta){
        //console.log(time);
        if (!this._raycaster){
            //Raycaster is not defined.
            console.error('Raycaster undefined or null');
            return;
        }
        this._raycaster.setFromCamera(this._mousePosition,this._camera);
        // calculate objects intersecting the picking ray
        let intersects = this._raycaster.intersectObjects( this._threeScene.children );

        for ( let i = 0; i < intersects.length; i++ ) {
            intersects[i].object.material.color.set(0xff0000);
        }
        console.log(intersects);

        //console.log(intersects);
    }
}