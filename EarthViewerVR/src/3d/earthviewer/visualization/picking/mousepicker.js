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

        this._sceneObjects = this._sceneWrapper.getSceneObjects(); //Store objects of scene here.

        this._isEnabled = true;

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

        //Rerender 0x0 pixel. 
        //We actually do not need to render a scene at all.
        //By rerendering a scene, the matrices of the objects in the scene graph get automatically updated,
        // which is needed if objects inside the scene graph are moved.
         this._camera.setViewOffset(
            this._renderer.domElement.width, 
            this._renderer.domElement.height, 
            0,
            0,
            0,
            0);

        

        // clear the view offset so rendering returns to normal
        this._camera.clearViewOffset(); 


        //Rerender Scene
        this._renderer.render(this._scene, this._camera);
    

        this._raycaster.setFromCamera(this._mousePosition,this._camera);
        // calculate objects intersecting the picking ray
        let intersects = this._raycaster.intersectObjects( this._sceneWrapper.getSceneObjects());
        
        if (this.log){
            console.log(intersects);
        }
        
        /**
         * Check if currently selected item matches the intersected object.
         * Intersects[0] returns undefined if nothing is selected, the selected object otherwise.
         */
        if (this._selected !== intersects[0]){
            this._selected = intersects[0];
            if (!!this._selected){
                //Object is selected
                let object = this._selected.object;
                if (!!object){
                    let color = object.material.color.getHex();
                    //selectionElement.innerHTML = 'ID: ' + color;
                    console.log('id' + color);

                    EVENT_BUS.emit(
                        'earthviewer:sceneSelectedItemChanged',
                        color);
                    //alert(color);
                }
            } else {
                //Object is not selected anymore.
                EVENT_BUS.emit(
                    'earthviewer:sceneSelectedItemChanged',null);
                //alert('unselect');
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

    enable(){
        this._isEnabled = true;
    }

    disable(){
        this._isEnabled = false;
    }

    tick(time, delta){
        if (!this._isEnabled){
            return;
        }

        if (this._mode === 'raycast'){
            this._raycastPick();
        } else if (this._mode === 'pixelbuffer'){
            this._pixelBufferPick();
        }
    }
}