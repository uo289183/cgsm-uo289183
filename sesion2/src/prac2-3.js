import * as THREE from 'three';

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 2.8);

// Luz solar
const sunLight = new THREE.PointLight(0xffffff, 2, 0, 0);
sunLight.position.set(-10, 0, 0);
scene.add(sunLight);

const earthRadius = 1;
const textureLoader = new THREE.TextureLoader();

// Tierra
const earthMap = textureLoader.load('../textures/earth.gif', () => { renderer.render(scene, camera); });
const earthMaterial = new THREE.MeshPhongMaterial({ map: earthMap });
const earthGlobe = new THREE.Mesh(new THREE.SphereGeometry(earthRadius, 64, 64), earthMaterial);
scene.add(earthGlobe);

// Atmosfera
const atmosphereMap = textureLoader.load('../textures/atmosphere.gif', () => { renderer.render(scene, camera); });
var atmosphereMaterial = new THREE.MeshLambertMaterial( { color: 0xFFFFFF, map: atmosphereMap,
    transparent: true } );
const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(earthRadius * 1.01, 64, 64), atmosphereMaterial);
scene.add(atmosphere);

renderer.render(scene, camera);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
}, false);
