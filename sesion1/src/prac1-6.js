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
    camera.position.set(0, 0, 550);

    // ── Luces ──────────────────────────────────────────────────────────────
    // Luz ambiental: ilumina todos los objetos por igual
    const ambientLight = new THREE.AmbientLight(0x404040, 2.0);
    scene.add(ambientLight);

    // Luz direccional: aporta la componente difusa y especular
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0);
    directionalLight.position.set(1, 2, 2);
    scene.add(directionalLight);

    // ── Cubo – MeshBasicMaterial (rojo) ────────────────────────────────────
    // No se ve afectado por las luces; mismo color independientemente de la iluminación.
    const boxGeometry = new THREE.BoxGeometry(80, 80, 80);
    const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xff2200 });
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.set(-180, 0, 0);
    box.rotation.set(Math.PI / 5, Math.PI / 5, 0);
    scene.add(box);

    // ── Cilindro – MeshLambertMaterial (azul) ──────────────────────────────
    // Modelo de iluminación Lambert: componentes ambiental + difusa.
    const cylinderGeometry = new THREE.CylinderGeometry(40, 40, 90, 32);
    const cylinderMaterial = new THREE.MeshLambertMaterial({ color: 0x0044ff });
    const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    cylinder.position.set(-50, 0, 0);
    scene.add(cylinder);

    // ── Esfera – MeshPhongMaterial (verde) ─────────────────────────────────
    // Modelo de iluminación Blinn-Phong: ambiental + difusa + especular.
    const sphereGeometry = new THREE.SphereGeometry(50, 32, 32);
    const sphereMaterial = new THREE.MeshPhongMaterial({
        color: 0x00cc00,
        shininess: 120
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(90, 0, 0);
    scene.add(sphere);

    // ── Casa – geometría plana personalizada (BufferGeometry) ───────────────
    //
    //         4 (cúspide del tejado)
    //        /\
    //       /  \
    //      3----2   <- parte superior de las paredes
    //      |    |
    //      0----1   <- base
    //
    const houseGeometry = new THREE.BufferGeometry();

    const vertices = new Float32Array([
        -50, -55, 0,  // 0 – esquina inferior izquierda
         50, -55, 0,  // 1 – esquina inferior derecha
         50,  15, 0,  // 2 – esquina superior derecha
        -50,  15, 0,  // 3 – esquina superior izquierda
          0,  70, 0   // 4 – cúspide del tejado
    ]);

    const houseIndices = [
        0, 1, 2,
        0, 2, 3,
        3, 2, 4
    ];

    houseGeometry.setIndex(houseIndices);
    houseGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    houseGeometry.computeVertexNormals();

    // MeshLambertMaterial para que la casa reaccione a la luz
    const houseMaterial = new THREE.MeshLambertMaterial({
        color: 0xff8800,
        side: THREE.DoubleSide
    });
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
