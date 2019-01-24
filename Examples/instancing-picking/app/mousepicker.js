var THREE = require('three');

/**
 * https://threejs.org/docs/#api/en/core/Raycaster
 * 
 * Examples:
 * https://threejs.org/examples/#webgl_interactive_cubes
 */
export default class MousePicker{
    constructor(sceneWrapper, camera, renderer, mode = 'raycast'){
        //Init raycaster
        this._sceneWrapper = sceneWrapper;
        this._scene = sceneWrapper.getScene();
        this._camera = camera;
        this._raycaster = new THREE.Raycaster();
        this._mousePosition = new THREE.Vector2();
        this._pickingTexture = new THREE.WebGLRenderTarget(1,1); //Create 1x1 pixel render target.
        this._renderer = renderer;

        this._selected = null;
        
        if (mode === 'pixelbuffer' || mode === 'raycast'){
            this._mode = mode;
        } else {
            //Set default mode to raycast
            this._mode = 'raycast';
        }

        this.log = true;

        //Initialize event listener
        window.addEventListener('mousemove', (e) => { this.onMouseMove(e) }, false);
    }

    onMouseMove(e){
        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components
        if (!this._mousePosition){
            alert('mousePositoin is null');
        }

        let boundingBox = e.target.getBoundingClientRect();
        this._mousePosition.elementX = e.clientX - boundingBox.left;
        this._mousePosition.elementY = e.clientY - boundingBox.top;
        this._mousePosition.clientX = e.clientX;
        this._mousePosition.clientY = e.clientY;
        this._mousePosition.x = ( e.clientX / window.innerWidth ) * 2 - 1;
        this._mousePosition.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
        console.log('x:' + this._mousePosition.clientX + ' y:' + this._mousePosition.clientY);
    }

    /**
     * Picking method using a raycast.
     */
    _raycastPick(){
        if (!this._raycaster){
            //Raycaster is not defined.
            console.error('Raycaster undefined or null');
            return;
        }

        let selectionElement = document.querySelector('#selection');
        
        //Rerender 1x1 pixel. 
        //We actually do not need to render a scene at all.
        //By rerendering a scene, the matrices of the objects in the scene graph get automatically updated,
        // which is needed if objects inside the scene graph are moved.
      /*   this._camera.setViewOffset(
            this._renderer.domElement.width, 
            this._renderer.domElement.height, 
            0,
            0,
            1,
            1);

        //Rerender Scene
        this._renderer.render(this._scene, this._camera);

        // clear the view offset so rendering returns to normal
		this._camera.clearViewOffset();
     */

        this._raycaster.setFromCamera(this._mousePosition,this._camera);
        // calculate objects intersecting the picking ray
        let intersects = this._raycaster.intersectObjects( this._sceneWrapper.getSceneObjects());
        
        if (this.log){
            console.log(intersects);
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
                    
                    selectionElement.innerHTML = 'ID: ' + color;
                }
            }  
        } 
    }

    /**
     * Picking method using a 1x1 pixel buffer.
     * Renders a 1x1 pixel of the scene (mouse target) and reads the color value <=> corresponding id.
     */
    _pixelBufferPick(){
        // set the view offset to represent just a single pixel under the mouse
        this._camera.setViewOffset(
            this._renderer.domElement.width, 
            this._renderer.domElement.height, 
            this._mousePosition.elementX * window.devicePixelRatio | 0,
            this._mousePosition.elementY * window.devicePixelRatio | 0,
            1,
            1);

        //Rerender Scene
        this._renderer.render(this._scene, this._camera, this._pickingTexture);

        // clear the view offset so rendering returns to normal
		this._camera.clearViewOffset();

        //Create pixel buffer and read it's color value <=> id
        let pixelBuffer = new Uint8Array(4);
        this._renderer.readRenderTargetPixels(this._pickingTexture, 0,0,1,1, pixelBuffer);
        //Interpret the pixel as an Id.
        console.log('pixelbuffer: ' + pixelBuffer)
        let id = ( pixelBuffer[0] << 16 ) | ( pixelBuffer[1] << 8 ) | ( pixelBuffer[2] );
        console.log('id' + id);
    }

    tick(time, delta){
        if (this._mode === 'raycast'){
            this._raycastPick();
        } else if (this._mode === 'pixelbuffer'){
            this._pixelBufferPick();
        }
    }
}