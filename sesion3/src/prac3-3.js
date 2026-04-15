import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min';
import Stats from 'three/examples/jsm/libs/stats.module';
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
        'WebGL2 no esta disponible en tu navegador.<br>' +
        '<a href="http://get.webgl.org" style="color:orange">Mas informacion</a>';
    document.body.appendChild(warning);
} else {
    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 4000);
    camera.position.set(0, 150, 300);
    camera.lookAt(0, 0, 0);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(100, 200, 100);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const textureLoader = new THREE.TextureLoader();

    // Left cube: basic texture only
    const geometry1 = new THREE.BoxGeometry(100, 100, 100);
    const material1 = new THREE.MeshPhongMaterial({
        map: textureLoader.load("texturas/brick_wall.png")
    });
    const box1 = new THREE.Mesh(geometry1, material1);
    box1.position.set(-80, 0, 0);
    scene.add(box1);

    // Right cube: texture + bump map
    const geometry2 = new THREE.BoxGeometry(100, 100, 100);
    const material2 = new THREE.MeshPhongMaterial({
        map: textureLoader.load("texturas/brick_wall.png"),
        bumpMap: textureLoader.load("texturas/topo_brick_wall.png")
    });
    const box2 = new THREE.Mesh(geometry2, material2);
    box2.position.set(80, 0, 0);
    scene.add(box2);

    const controlData = {
        bumpScale: material2.bumpScale
    }
    
    const gui = new GUI( );
    gui.add( controlData, 'bumpScale', -4, 4 ).step(0.1).name( 'bumpScale' );

    const stats = new Stats( );
    stats.dom.style.position = 'absolute';
    stats.dom.style.top = '0px';
    document.body.appendChild( stats.dom );

    function animate() {
        requestAnimationFrame(animate);

        box1.rotation.y += 0.01;
        box2.rotation.y -= 0.01;

        material2.bumpScale = controlData.bumpScale;

        renderer.render(scene, camera);

        stats.update( );
    }

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);
}
