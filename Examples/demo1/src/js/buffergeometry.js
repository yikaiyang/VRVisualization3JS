import FileLoader from './util/fileloader.js';
import GeoConversion from './util/geoconversion.js';

var camera, scene, renderer, geometry, material, mesh;
var controls;
let stats;

initFPSCounter();
init();
animate();

function initFPSCounter(){
    stats = new Stats();
    if (!!stats){
        stats.showPanel(0);
        document.body.appendChild(stats.dom);
    }
}

function WGStoGlobeCoord(latitude = 0.0, longitude = 0.0, radius = 0.0){
        if (!!latitude && !!longitude && !!radius){
            let latRadiant = latitude * Math.PI / 180;
            let longRadiant = longitude * Math.PI / 180;

            let x = radius * Math.cos(latRadiant) * Math.sin(longRadiant);
            let z = radius * Math.cos(latRadiant) * Math.cos(longRadiant);
            let y = radius * Math.sin(latRadiant);
            let vector = new THREE.Vector3(x,y,z);
            //alert('x' + vector.x + ' y' + vector.y + ' z' + vector.z);
            return vector;
        }
}

let color = new THREE.Color('rgb(155,155,155)');


var geometry = new THREE.BoxBufferGeometry(0.1,0.1,0.1);
var material = new THREE.MeshBasicMaterial({
    color: color
});
var combinedGeometry = new THREE.Geometry();

function createCube(latitude, longitude){
    let position = GeoConversion.WGStoGlobeCoord(latitude, longitude, 20);
    if (position === undefined){
        return;
    }
  
    var cube = new THREE.Mesh(geometry, material);
    cube.position.set(position.x, position.y, position.z);
    cube.lookAt(new THREE.Vector3(0,0,0));
    //scene.add(cube);

    //combinedGeometry.merge(cube.geometry, cube.matrix);
    //geometry.translate(-position.x, -position.y, -position.z);
    //scene.add(cube);
}



function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    controls = new THREE.OrbitControls(camera);
    camera.position.z = 100;
    camera.position.y = 20;
    scene.add(camera);
    
    let gridHelper = new THREE.GridHelper(40 , 5);
    scene.add(gridHelper);
    let axesHelper = new THREE.AxesHelper(40);
    scene.add(axesHelper);

    geometry = new THREE.SphereGeometry(20, 20, 20);
    material = new THREE.MeshNormalMaterial({
    	wireframe: true
    });
    mesh = new THREE.Mesh(geometry, material);
    
    let latitude = 48.210033;
    let longitude = 16.363449;

    let coord = WGStoGlobeCoord(latitude, longitude, 20);
    
    
    let lineMaterial = new THREE.LineBasicMaterial({
    	color: 0xffffff
    });
    let lineGeometry = new THREE.Geometry();
    lineGeometry.vertices.push(
        new THREE.Vector3(0,0,0),
        new THREE.Vector3(coord.x, coord.y, coord.z)
      //new THREE.Vector3(4,30,0)
    );
    
    let line = new THREE.Line(lineGeometry, lineMaterial);
    scene.add(line);
    
    //scene.add(mesh);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);
}

function drawBufferedGeometries(){
    let mergedGeometry = new THREE.Geometry();
    let boxGeometry = new THREE.BoxGeometry(1,5,1);
    let material = new THREE.MeshBasicMaterial({
        color: 0xff0000
    });

   
    for (let i = 0; i < 50; i++){
        let mesh = new THREE.Mesh(boxGeometry,material);
  
        mesh.position.setX(i * 2);
        mesh.lookAt(0,0,10);
        mesh.updateMatrix(); //Update matrix needed before merge
        //scene.add(mesh);
        mergedGeometry.merge(mesh.geometry, mesh.matrix);
        //boxGeometry.translate(-i * 2,0,0);
    }
    let cubes = new THREE.Mesh(mergedGeometry,material);
    scene.add(cubes);
}

drawBufferedGeometries();

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    stats.begin();
		//controls.update();
    renderer.render(scene, camera);
    stats.end();
}
