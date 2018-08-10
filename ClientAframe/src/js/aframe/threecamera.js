AFRAME.registerComponent('pers', {
    init: function (){
        var sceneEl = this.el.sceneEl;
        sceneEl.addEventListener('render-target-loaded', () => {
        this.originalCamera = sceneEl.camera;
        this.cameraParent = sceneEl.camera.parent;
        this.perspectiveCam = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 100, 100000000);
        this.cameraParent.add(this.perspectiveCam);
        sceneEl.camera = this.perspectiveCam;
        });
    },
    remove: function () {
        this.cameraParent.remove(this.perspectiveCam);
        sceneEl.camera = this.originalCamera;
    }
})