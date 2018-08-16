/**
 * Singleton storing threejs global variables
 * https://en.wikipedia.org/wiki/Immediately-invoked_function_expression
 */
class ThreeGlobals {
    constructor(){
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer();
        this.camera = new THREE.PerspectiveCamera();
        this.cameraRig = new THREE.PerspectiveCamera();
        
    }

}

const Globals = ( function () {
    let instance;
    
    function init(){
        let globals = new ThreeGlobals();
        return globals;
    }

    function getInstance(){
        if (!instance){
            instance = init();
        }
        return instance;
    }

    return {
        getInstance
    }
})();

export default Globals;

//let singleton = Globals.getInstance();
//alert(singleton.scene);