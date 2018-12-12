var THREE = require('three');

/**
 * https://threejs.org/docs/#api/en/core/Raycaster
 * 
 * Examples:
 * https://threejs.org/examples/#webgl_interactive_cubes
 */
export default class MousePicker{
    constructor(scene, camera){
        //Init raycaster
        this._scene = scene;
        this._camera = camera;
        this._raycaster = new THREE.Raycaster();
        this._mousePosition = new THREE.Vector2();      

        this._selected = null;
        this.log = true;

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
        console.log('x:' + this._mousePosition.x + ' y:' + this._mousePosition.y);
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
        let intersects = this._raycaster.intersectObjects( this._scene.getSceneObjects());
        
        if (!!this.log){
            console.log(intersects);
            if (intersects.length > 0){
                //alert(JSON.stringify(intersects));
            }
        }
       

        if (this._selected !== intersects[0]){
            if (!!this._selected){
             //   this._selected.object.material.emissive.set(0x000000);//Reset selection glow
            }
            
            this._selected = intersects[0];
            if (!!this._selected){
            //    this._selected.object.material.emissive.set(0xff0000);
                //Selected object differs from the object set.
                let object = this._selected.object;
                if (!!object){
                    let color = object.material.color.getHex();
                    let selectionElement = document.querySelector('#selection');
                    selectionElement.innerHTML = 'ID: ' + color;
                }
            }  
        } 
    }
}