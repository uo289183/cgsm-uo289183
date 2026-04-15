import Stats from 'three/examples/jsm/libs/stats.module';
import * as THREE from 'three';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';

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
        'WebGL2 no esta disponible en tu navegador.<br>' +
        '<a href="http://get.webgl.org" style="color:orange">Mas informacion</a>';
    document.body.appendChild(warning);
} else {
    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 4000);
    camera.position.set(0, 50, 300);
    camera.lookAt(0, 0, 0);

    // Directional light
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 0.5, 100);
    scene.add(light);

    // Hemisphere light
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xf0f0f0, 0.6);
    hemiLight.position.set(0, 500, 0);
    scene.add(hemiLight);

    // Grid floor
    const helper = new THREE.GridHelper(800, 40, 0x444444, 0x444444);
    helper.position.y = 0.1;
    scene.add(helper);

    // Textures
    const textureLoader = new THREE.TextureLoader();

    // Special face material (brick_wall_with_button + bump map)
    const specialFaceMaterial = new THREE.MeshPhongMaterial({
        map: textureLoader.load("texturas/brick_wall_with_button.png"),
        bumpMap: textureLoader.load("texturas/topo_brick_wall_with_button.png")
    });

    // Regular face material (brick_wall + bump map)
    const regularFaceMaterial = new THREE.MeshPhongMaterial({
        map: textureLoader.load("texturas/brick_wall.png"),
        bumpMap: textureLoader.load("texturas/topo_brick_wall.png")
    });

    // Cube 1: special face on +x (facing right, toward cube 2)
    const materials1 = [
        specialFaceMaterial,   // +x (right)
        regularFaceMaterial,   // -x (left)
        regularFaceMaterial,   // +y (top)
        regularFaceMaterial,   // -y (bottom)
        regularFaceMaterial,   // +z (front)
        regularFaceMaterial,   // -z (back)
    ];
    const geometry1 = new THREE.BoxGeometry(50, 50, 50);
    const box1 = new THREE.Mesh(geometry1, materials1);
    box1.position.set(-150, 25, 0);
    scene.add(box1);

    // Cube 2: special face on -x (facing left, toward cube 1)
    const materials2 = [
        regularFaceMaterial,   // +x (right)
        specialFaceMaterial,   // -x (left)
        regularFaceMaterial,   // +y (top)
        regularFaceMaterial,   // -y (bottom)
        regularFaceMaterial,   // +z (front)
        regularFaceMaterial,   // -z (back)
    ];
    const geometry2 = new THREE.BoxGeometry(50, 50, 50);
    const box2 = new THREE.Mesh(geometry2, materials2);
    box2.position.set(150, 25, 0);
    scene.add(box2);

    // Stats
    const stats = new Stats();
    stats.dom.style.position = 'absolute';
    stats.dom.style.top = '0px';
    document.body.appendChild(stats.dom);

    // First person controls
    const controls = new FirstPersonControls(camera, renderer.domElement);
    controls.movementSpeed = 70;
    controls.lookSpeed = 0.05;
    controls.noFly = false;
    controls.lookVertical = false;

    // Clock for delta time
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const delta = clock.getDelta();
        controls.update(delta);

        renderer.render(scene, camera);

        stats.update();
    }

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        controls.handleResize();
    }, false);
}
