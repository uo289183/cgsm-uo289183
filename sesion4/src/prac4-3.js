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
    camera.lookAt(0, 50, 0);

    // AudioListener attached to camera (positional audio from camera perspective)
    const listener = new THREE.AudioListener();
    camera.add(listener);

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

    // Regular face material for non-button faces
    const regularFaceMaterial = new THREE.MeshPhongMaterial({
        map: textureLoader.load("texturas/brick_wall.png"),
        bumpMap: textureLoader.load("texturas/topo_brick_wall.png")
    });

    // Pre-load both button states to avoid overhead on toggle
    const matButtonOn = new THREE.MeshPhongMaterial({
        map: textureLoader.load("texturas/brick_wall_with_button_active.png"),
        bumpMap: textureLoader.load("texturas/topo_brick_wall_with_button.png")
    });
    const matButtonOff = new THREE.MeshPhongMaterial({
        map: textureLoader.load("texturas/brick_wall_with_button.png"),
        bumpMap: textureLoader.load("texturas/topo_brick_wall.png")
    });

    // Sound 1 for box1
    const audioLoader1 = new THREE.AudioLoader();
    const sound1 = new THREE.PositionalAudio(listener);
    audioLoader1.load("audio/audio_001.ogg", (buffer) => {
        sound1.setBuffer(buffer);
        sound1.setRefDistance(20);
        sound1.setLoop(true);
        sound1.setRolloffFactor(1);
        // sound1.play(); // Modern browsers do not allow sound to start without user interaction
    });

    // Cube 1: button face on +x (index 0). Initial state: sound off → matButtonOff
    const materials1 = [
        matButtonOff,          // +x (right) – button face, initially off
        regularFaceMaterial,   // -x (left)
        regularFaceMaterial,   // +y (top)
        regularFaceMaterial,   // -y (bottom)
        regularFaceMaterial,   // +z (front)
        regularFaceMaterial,   // -z (back)
    ];
    const geometry1 = new THREE.BoxGeometry(50, 50, 50);
    const box1 = new THREE.Mesh(geometry1, materials1);
    box1.name = 'Caja 1';
    box1.position.set(-150, 25, 0);
    box1.add(sound1);
    scene.add(box1);

    // Sound 2 for box2
    const audioLoader2 = new THREE.AudioLoader();
    const sound2 = new THREE.PositionalAudio(listener);
    audioLoader2.load("audio/audio_002.ogg", (buffer) => {
        sound2.setBuffer(buffer);
        sound2.setRefDistance(20);
        sound2.setLoop(true);
        sound2.setRolloffFactor(1);
        // sound2.play(); // Modern browsers do not allow sound to start without user interaction
    });

    // Cube 2: button face on -x (index 1). Initial state: sound off → matButtonOff
    const materials2 = [
        regularFaceMaterial,   // +x (right)
        matButtonOff,          // -x (left) – button face, initially off
        regularFaceMaterial,   // +y (top)
        regularFaceMaterial,   // -y (bottom)
        regularFaceMaterial,   // +z (front)
        regularFaceMaterial,   // -z (back)
    ];
    const geometry2 = new THREE.BoxGeometry(50, 50, 50);
    const box2 = new THREE.Mesh(geometry2, materials2);
    box2.name = 'Caja 2';
    box2.position.set(150, 25, 0);
    box2.add(sound2);
    scene.add(box2);

    // Raycaster for object selection
    const rayCaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let intersectedObject = null;

    document.body.addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }, false);

    // Space key: toggle sound and texture of the intersected box
    document.body.addEventListener('keydown', (event) => {
        const spaceKeyCode = "Space";

        // Space pressed and intersected object
        if (event.code == spaceKeyCode && intersectedObject) {
            if (intersectedObject.name === 'Caja 1') {
                // Ensure AudioContext is running (first interaction)
                if (listener.context.state === 'suspended') listener.context.resume();

                if (sound1.isPlaying === true) {
                    sound1.pause();
                    // The first face is the one with the button
                    box1.material[0] = matButtonOff;
                    box1.material.needsUpdate = true;
                } else {
                    sound1.play();
                    // The first face is the one with the button
                    box1.material[0] = matButtonOn;
                    box1.material.needsUpdate = true;
                }
            } else if (intersectedObject.name === 'Caja 2') {
                if (listener.context.state === 'suspended') listener.context.resume();

                if (sound2.isPlaying === true) {
                    sound2.pause();
                    box2.material[1] = matButtonOff;
                    box2.material.needsUpdate = true;
                } else {
                    sound2.play();
                    box2.material[1] = matButtonOn;
                    box2.material.needsUpdate = true;
                }
            }
        }
    }, false);

    // Stats
    const stats = new Stats();
    stats.dom.style.position = 'absolute';
    stats.dom.style.top = '0px';
    document.body.appendChild(stats.dom);

    // First person controls
    const controls = new FirstPersonControls(camera, renderer.domElement);
    controls.movementSpeed = 70;
    controls.lookSpeed = 0.05;
    controls.noFly = true;
    controls.lookVertical = false;

    // Clock for delta time
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const delta = clock.getDelta();
        controls.update(delta);

        // Update intersected object via raycasting
        rayCaster.setFromCamera(mouse, camera);
        const intersects = rayCaster.intersectObjects(scene.children);
        if (intersects.length > 0) {
            // Sorted by Z (close to the camera)
            if (intersectedObject != intersects[0].object) {
                intersectedObject = intersects[0].object;
                console.log('New intersected object: ' + intersectedObject.name);
            }
        } else {
            intersectedObject = null;
        }

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
