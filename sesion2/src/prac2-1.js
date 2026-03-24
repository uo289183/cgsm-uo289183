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
    camera.position.set(0, 0, 200);

    const geometry = new THREE.BoxGeometry(100, 100, 100);

    const mapUrl = "../textures/crate.gif"; // The file used as texture
    const textureLoader = new THREE.TextureLoader( ); // The object used to load textures
    const map = textureLoader.load( mapUrl, ( loaded ) => { renderer.render( scene, camera ); } );
    const material = new THREE.MeshBasicMaterial( { map: map } );

    const box = new THREE.Mesh(geometry, material);
    box.rotation.set(Math.PI / 5, Math.PI / 5, 0);

    scene.add(box);
    renderer.render(scene, camera);

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.render(scene, camera);
    }, false);
}
