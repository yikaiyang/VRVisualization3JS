import FileLoader from './util/fileloader.js';
import GeoConversion from './util/geoconversion.js';

var camera, scene, renderer, geometry, material, mesh;
var sphere;
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

function roundNumber(number, digits){
    return +number.toFixed(digits);
}

function midValue(number1, number2){
    return number1 + (number2 - number1) / 2;
}

/**
 * Creates a spline on an globe with radius using a given geoencoded start and end position.
 * An optional elevation or color can also be specified.
 * @param {*} startPosition the startPosition as json object in json format: {lat: 43, lon: 3}
 * @param {*} endPosition the endPosition as json object in json format: {lat: 43, lon: 3}
 * @param {*} radius    the radius of the globe
 * @param {*} elevation the protrusion of the midpoint of the spline. (optional) default is 0.
 * @param {*} hexColor the color of the spline
 */
function createSpline(startPosition, endPosition, radius, elevation, hexColor = 0xff0000) {
    if (!startPosition || !endPosition || !elevation){
        return null;
    }

    //Calculate mid point.
    const midPoint = {
        lat: midValue(startPosition.lat, endPosition.lat),
        lon: midValue(startPosition.lon, endPosition.lon)
    };

    const startCoords = GeoConversion.WGStoGlobeCoord(startPosition.lat, startPosition.lon, radius);
    const endCoords = GeoConversion.WGStoGlobeCoord(endPosition.lat, endPosition.lon, radius);

    const midPointCoords = GeoConversion.WGStoGlobeCoord(midPoint.lat, midPoint.lon, radius + elevation);

    const digits = 8; //Specifies how many digits shall be left.

     // Create a sine-like wave
     var curve = new THREE.QuadraticBezierCurve3( 
        new THREE.Vector3( 
            roundNumber(startCoords.x, digits),
            roundNumber(startCoords.y, digits),
            roundNumber(startCoords.z, digits)
        ),
        new THREE.Vector3( 
            roundNumber(midPointCoords.x, digits),
            roundNumber(midPointCoords.y, digits),
            roundNumber(midPointCoords.z, digits)
        ),
        new THREE.Vector3( 
            roundNumber(endCoords.x, digits),
            roundNumber(endCoords.y, digits), 
            roundNumber(endCoords.z, digits)
        ),
     );

    var points = curve.getPoints(40);
    var geometry = new THREE.BufferGeometry().setFromPoints(points);
    var material = new THREE.LineBasicMaterial( { 
        color : hexColor,
    } );

    // Create the final object to add to the scene
    var splineObject = new THREE.Line( geometry, material );
    return splineObject;
}

function initSplines (){
    const newYork = {
        lat: 40.730610,
        lon: -73.935242
    };
    
    const vienna = {
        lat:  48.2380820689074,
        lon: 16.3871662275896
    };

    const splineObject = createSpline(newYork, vienna, 20, 10);
    scene.add(splineObject);

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
    //scene.add(mesh);

    geometry = new THREE.SphereGeometry(20, 20, 20);
    material = new THREE.MeshNormalMaterial({
        wireframe: true
    });
    sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    initSplines();

   /*  let position = { x: 0, y : 0};
    let target = { x: 400, y : 400};
    let tween = new TWEEN.Tween(position).to(target, 4000);
    tween.onUpdate(function(){
        //alert('onUpdate');
        sphere.rotation.x = position.x;
        sphere.rotation.y = position.y;
    });
    tween.start(); */
    
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

function animate(time) {
    requestAnimationFrame(animate);
    TWEEN.update(time);
    
    render();
}

function render() {
    stats.begin();
        //controls.update();
        /*
    sphere.rotation.x += 0.01;
    sphere.rotation.y += 0.02;*/

    renderer.render(scene, camera);
    stats.end();
}
