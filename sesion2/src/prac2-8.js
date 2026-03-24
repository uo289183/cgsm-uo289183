import * as THREE from 'three';

const vertexShader = require('../shaders/vertex.glsl');
const fragmentShader = require('../shaders/fragment.glsl');

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 16);

// Luz solar.
const sunLight = new THREE.PointLight(0xffffff, 2, 0, 0);
sunLight.position.set(-10, 0, -5);
scene.add(sunLight);

const earthRadius = 1;
const textureLoader = new THREE.TextureLoader();

// Tierra.
const earthMap = textureLoader.load('../textures/earth.gif', () => { renderer.render(scene, camera); });
const earthMaterial = new THREE.MeshPhongMaterial({ map: earthMap });
const earthGlobe = new THREE.Mesh(new THREE.SphereGeometry(earthRadius, 64, 64), earthMaterial);

// Atmósfera.
const atmosphereMap = textureLoader.load('../textures/atmosphere.gif', () => { renderer.render(scene, camera); });
var atmosphereMaterial = new THREE.MeshLambertMaterial( { color: 0xFFFFFF, map: atmosphereMap,
    transparent: true } );
const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(earthRadius * 1.01, 64, 64), atmosphereMaterial);

// Grupo Terrestre.
const earth = new THREE.Object3D();
earth.rotation.z = 0.36;
earth.add(earthGlobe);
earth.add(atmosphere);
scene.add(earth);

// Luna.
const moonRadius = earthRadius * 0.27;
const moonMapUrl = '../textures/moon_1024.jpg';
const moonMap = textureLoader.load( moonMapUrl, ( loaded ) => { renderer.render( scene, camera ); } );
const moonMaterial = new THREE.MeshLambertMaterial( { map: moonMap, color: 0x888888 } );
const moon = new THREE.Mesh(new THREE.SphereGeometry(moonRadius, 32, 32), moonMaterial);

const distance = 60.27;
moon.position.set( Math.sqrt( distance / 2 ), 0, -Math.sqrt( distance / 2 ) );
moon.rotation.y = Math.PI;

const moonGroup = new THREE.Object3D( );
moonGroup.add( moon );
moonGroup.rotation.x = 0.089;
scene.add(moonGroup);

// Sol y Shaders.
const NOISEMAP = '../textures/cloud.png';
const SUNMAP = '../textures/lavatile.jpg';

const uniforms = {
    "fogDensity": { value: 0 },
    "fogColor": { value: new THREE.Vector3( 0, 0, 0 ) },
    "time": { value: 1.0 },
    "uvScale": { value: new THREE.Vector2( 3.0, 1.0 ) },
    "texture1": { value: textureLoader.load( NOISEMAP ) },
    "texture2": { value: textureLoader.load( SUNMAP ) }
};

uniforms[ "texture1" ].value.wrapS = uniforms[ "texture1" ].value.wrapT = THREE.RepeatWrapping;
uniforms[ "texture2" ].value.wrapS = uniforms[ "texture2" ].value.wrapT = THREE.RepeatWrapping;

const sunMaterial = new THREE.ShaderMaterial( {
    uniforms,
    vertexShader,
    fragmentShader
} );

const sunSphere = new THREE.Mesh(new THREE.SphereGeometry(earthRadius * 5, 64, 64), sunMaterial);
sunSphere.position.copy(sunLight.position);
scene.add(sunSphere);

// Animación.
const clock = new THREE.Clock( );

function animate( ) {
    const delta = clock.getDelta( );

    const rotation = ( delta * Math.PI * 2 ) / 24;
    earthGlobe.rotation.y += rotation;
    atmosphere.rotation.y += rotation * 0.95;

    moonGroup.rotation.y += ( delta * Math.PI * 2 ) / ( 28 * 24 );

    uniforms[ "time" ].value += 0.2 * delta;

    renderer.render( scene, camera );

    requestAnimationFrame( animate );
};

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);
