var THREE = require('three');

/**
 * https://threejs.org/docs/#api/en/core/Raycaster
 * 
 * Examples:
 * https://threejs.org/examples/#webgl_interactive_cubes
 */
export default class MousePicker{
    constructor(sceneWrapper, camera, renderer){
        //Init raycaster
        this._sceneWrapper = sceneWrapper;
        this._scene = sceneWrapper.getScene();
        this._camera = camera;
        this._raycaster = new THREE.Raycaster();
        this._mousePosition = new THREE.Vector2();
        this._pickingTexture = new THREE.WebGLRenderTarget(1,1); //Create 1x1 pixel render target.
        this._renderer = renderer;

        this._selected = null;
        this.log = true;

        //Initialize event listener
        window.addEventListener('mousemove', () => { this.onMouseMove() }, false);
    }

    onMouseMove(){
        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components
        if (!this._mousePosition){
            alert('mousePositoin is null');
        }
        this._mousePosition.clientX = event.clientX;
        this._mousePosition.clientY = event.clientY;
        this._mousePosition.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        this._mousePosition.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        console.log('x:' + this._mousePosition.normalizedX + ' y:' + this._mousePosition.normalizedY);
    }

    tick(time, delta){
        //console.log(time);
        if (!this._raycaster){
            //Raycaster is not defined.
            console.error('Raycaster undefined or null');
            return;
        }
        
        // set the view offset to represent just a single pixel under the mouse
        this._camera.setViewOffset(
            this._renderer.domElement.width, 
            this._renderer.domElement.height, 
            this._mousePosition.clientX * window.devicePixelRatio | 0,
            this._mousePosition.clientY * window.devicePixelRatio | 0,
            1,
            1);

        //Rerender Scene
        this._renderer.render(this._scene, this._camera, this._pickingTexture);

        // clear the view offset so rendering returns to normal
		this._camera.clearViewOffset();
        /*  Render whole scene
        camera.setViewOffset();
        this._renderer.render(this._scene, this._camera); */

        //Create pixel buffer and read it's color value <=> id
        let pixelBuffer = new Uint8Array(4);
        let x = 2;
        this._renderer.readRenderTargetPixels(this._pickingTexture, 0,0,1,1, pixelBuffer);
        //pixelBuffer[0] = 2;
        //Interpret the pixel as an Id.
        let id = ( pixelBuffer[ 0 ] << 16 ) | ( pixelBuffer[ 1 ] << 8 ) | ( pixelBuffer[ 2 ] );
        console.log('id' + pixelBuffer[0]);


        this._raycaster.setFromCamera(this._mousePosition,this._camera);
        // calculate objects intersecting the picking ray
        let intersects = this._raycaster.intersectObjects( this._sceneWrapper.getSceneObjects());
        
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