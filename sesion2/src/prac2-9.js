import * as THREE from 'three';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js';

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 8);
camera.lookAt(0, 0, 0);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 10, 5);
scene.add(dirLight);

const modelUrl = "../models/iss.dae";
let iss;

const loadingManager = new THREE.LoadingManager( ( ) => {
    scene.add( iss );
    renderer.render( scene, camera );
    console.log( 'Model loaded' );
} );

const loader = new ColladaLoader( loadingManager );
loader.load( modelUrl, ( collada ) => {
    iss = collada.scene;
    iss.rotation.set( Math.PI / 5, Math.PI / 5, 0 );
    const box = new THREE.Box3().setFromObject( iss );
    const size = box.getSize( new THREE.Vector3() );
    iss.scale.setScalar( 5 / Math.max( size.x, size.y, size.z ) );
    const box2 = new THREE.Box3().setFromObject( iss );
    iss.position.sub( box2.getCenter( new THREE.Vector3() ) );
    iss.updateMatrix( );
} );

renderer.render(scene, camera);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
}, false);
