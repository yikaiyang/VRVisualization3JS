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


var geometry = new THREE.BoxGeometry(0.1,0.1,0.1);
var material = new THREE.MeshBasicMaterial({
    color: color
});
var combinedGeometry = new THREE.Geometry();

function createCube(latitude, longitude){
    let position = GeoConversion.WGStoGlobeCoord(latitude, longitude, 20);
    if (position === undefined){
        return;
    }
  
    let cube = new THREE.Mesh(geometry, material);
    cube.position.set(position.x, position.y, position.z);
    cube.lookAt(new THREE.Vector3(0,0,0));
    //.add(cube);
    cube.updateMatrix();
    combinedGeometry.merge(cube.geometry, cube.matrix);
    //geometry.translate(-position.x, -position.y, -position.z);
  
    //scene.add(cube);
}

function loadStationData(){
    FileLoader.parseFile('../data/haltestellen.csv', function(data){
        let results = Papa.parse(data);
        renderStations(results.data);
    });
}

function renderStations(stationData){
    const latIdx = 6;
    const longIdx = 7;

    for (let i = 0; i < stationData.length; i++){
        let stationLat = stationData[i][latIdx];
        let stationLong = stationData[i][longIdx];
        createCube(stationLat, stationLong);
    }
    let cubes = new THREE.Mesh(combinedGeometry, material);
    scene.add(cubes);
}

loadStationData();

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
    controls = new THREE.OrbitControls(camera);
    camera.position.z = 100;
    camera.position.y = 20;
    scene.add(camera);
    
    let gridHelper = new THREE.GridHelper(40 , 5);
    scene.add(gridHelper);
    let axesHelper = new THREE.AxesHelper(40);
    scene.add(axesHelper);

    let Shader = {
        'atmosphere' : {
            uniforms: {},
            vertexShader: [
              'varying vec3 vNormal;',
              'void main() {',
                'float atmosphereRadius = 20.0;',
                'float earthRadius = 20.0;',
                'vNormal = normalize( normalMatrix * normal );',
                'vec3 npos = position * (atmosphereRadius / earthRadius);',
                'gl_Position = projectionMatrix * modelViewMatrix * vec4( npos, 1.0 );',
              '}'
            ].join('\n'),
            fragmentShader: [
              'varying vec3 vNormal;',
              'vec3 atmosphereColor = vec3(0.17, 0.79, 0.88);',
              'void main() {',
                'float intensity = pow( 0.5 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) ), 2.0 );',
                'gl_FragColor = vec4( atmosphereColor, 1.0 ) * intensity;',
              '}'
            ].join('\n')
        }
    };
    
    let shader = Shader.atmosphere;
    let uniforms = THREE.UniformsUtils.clone(shader.uniforms);

    let shaderMaterial = new THREE.ShaderMaterial({

          uniforms: uniforms,
          vertexShader: shader.vertexShader,
          fragmentShader: shader.fragmentShader,
          side: THREE.BackSide,
          blending: THREE.AdditiveBlending ,
          transparent: true

        });

    let atGeometry = new THREE.SphereGeometry(20, 20, 20);
    mesh = new THREE.Mesh(atGeometry, shaderMaterial);
    mesh.scale.multiplyScalar(1.1);
    scene.add(mesh);

    geometry = new THREE.SphereGeometry(20, 20, 20);
    material = new THREE.MeshNormalMaterial({
        wireframe: false
    });
    let earthMesh = new THREE.Mesh(geometry, material);
    scene.add(earthMesh);
    
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

    var light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(10000, 15000, 20000);
    scene.add(light);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    stats.begin();
		//controls.update();
    //mesh.rotation.x += 0.01;
    //mesh.rotation.y += 0.02;

    renderer.render(scene, camera);
    stats.end();
}
