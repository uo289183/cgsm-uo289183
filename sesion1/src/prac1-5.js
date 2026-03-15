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

    // Cámara alejada para ver los 4 objetos
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 4000);
    camera.position.set(0, 0, 550);

    // Cubo (izquierda)
    const boxGeometry = new THREE.BoxGeometry(80, 80, 80);
    const boxMaterial = new THREE.MeshBasicMaterial();
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.set(-180, 0, 0);
    box.rotation.set(Math.PI / 5, Math.PI / 5, 0);
    scene.add(box);

    // Cilindro (centro-izquierda)
    const cylinderGeometry = new THREE.CylinderGeometry(40, 40, 90, 32);
    const cylinderMaterial = new THREE.MeshBasicMaterial();
    const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    cylinder.position.set(-50, 0, 0);
    scene.add(cylinder);

    // Esfera (centro-derecha)
    const sphereGeometry = new THREE.SphereGeometry(50, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial();
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(90, 0, 0);
    scene.add(sphere);

    // Geometría personalizada: casa plana (BufferGeometry)
    // Vértices de la silueta de una casa vista de frente
    const houseGeometry = new THREE.BufferGeometry();

    const vertices = new Float32Array([
        // Cuerpo (rectángulo)
        -50, -55, 0,  // 0 – esquina inferior izquierda
         50, -55, 0,  // 1 – esquina inferior derecha
         50,  15, 0,  // 2 – esquina superior derecha
        -50,  15, 0,  // 3 – esquina superior izquierda
        // Tejado (triángulo)
          0,  70, 0   // 4 – cúspide del tejado
    ]);

    // Caras (triángulos, orientación CCW vista desde +Z)
    const indices = [
        0, 1, 2,  // mitad inferior derecha del cuerpo
        0, 2, 3,  // mitad superior izquierda del cuerpo
        3, 2, 4   // triángulo del tejado
    ];

    houseGeometry.setIndex(indices);
    houseGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    houseGeometry.computeVertexNormals();

    const houseMaterial = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });
    const house = new THREE.Mesh(houseGeometry, houseMaterial);
    house.position.set(240, 0, 0);
    scene.add(house);

    renderer.render(scene, camera);

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.render(scene, camera);
    }, false);
}
