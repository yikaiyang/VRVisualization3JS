export function createCube(scene,position){
    if (scene instanceof THREE.Scene){
        var geometry = new THREE.BoxGeometry(100,100,100);
        var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
        var cube = new THREE.Mesh(geometry, material);
        cube.position.set(position);
        scene.add(cube);
    }
}