import * as THREE from 'three';

function isWebGL2Available() {
    try {
        const canvas = document.createElement('canvas');
        return !!(window.WebGL2RenderingContext && canvas.getContext('webgl2'));
    } catch (e) {
        return false;
    }
}

if (!isWebGL2Available()) {
    const warning = document.createElement('div');
    warning.style.cssText = 'color: red; font-size: 22px; padding: 30px; font-family: monospace;';
    warning.innerHTML =
        '✗ WebGL2 no está disponible en tu navegador.<br>' +
        '<a href="http://get.webgl.org" style="color:orange">Más información</a>';
    document.body.appendChild(warning);
} else {
    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 4000);
    camera.position.set(0, 0, 400);

    // Cubo (izquierda)
    const boxGeometry = new THREE.BoxGeometry(80, 80, 80);
    const boxMaterial = new THREE.MeshBasicMaterial();
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.set(-130, 0, 0);
    box.rotation.set(Math.PI / 5, Math.PI / 5, 0);
    scene.add(box);

    // Cilindro (centro)
    const cylinderGeometry = new THREE.CylinderGeometry(40, 40, 90, 32);
    const cylinderMaterial = new THREE.MeshBasicMaterial();
    const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    cylinder.position.set(0, 0, 0);
    scene.add(cylinder);

    // Esfera (derecha)
    const sphereGeometry = new THREE.SphereGeometry(50, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial();
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(130, 0, 0);
    scene.add(sphere);

    renderer.render(scene, camera);

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.render(scene, camera);
    }, false);
}
