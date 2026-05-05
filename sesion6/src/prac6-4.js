import * as THREE from 'three';
import WEBGL from 'three/examples/jsm/capabilities/WebGL.js';

if ( WEBGL.isWebGL2Available() ) {

    let renderer, scene, camera, wall, texture, imageContext;
    let videoElement = null;

    const init = () => {
        scene = new THREE.Scene();

        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( renderer.domElement );

        camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 5000 );
        camera.position.set( 0, 0, 700 );

        const image = document.createElement( 'canvas' );
        image.width = 640;
        image.height = 480;
        imageContext = image.getContext( '2d' );
        imageContext.fillStyle = '#000000';
        imageContext.fillRect( 0, 0, image.width, image.height );

        texture = new THREE.Texture( image );
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;

        const material = new THREE.MeshBasicMaterial( { map: texture } );
        wall = new THREE.Mesh( new THREE.PlaneGeometry( image.width, image.height, 4, 4 ), material );
        scene.add( wall );

        window.addEventListener( 'resize', onWindowResize, false );

        animate();
    };

    const onWindowResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
    };

    const animate = () => {
        requestAnimationFrame( animate );

        if ( videoElement && videoElement.readyState === videoElement.HAVE_ENOUGH_DATA ) {
            imageContext.drawImage( videoElement, 0, 0, imageContext.canvas.width, imageContext.canvas.height );
            if ( texture ) {
                texture.needsUpdate = true;
            }
        }

        wall.rotation.y += 0.01;
        renderer.render( scene, camera );
    };

    navigator.mediaDevices.getUserMedia( { audio: false, video: true } )
        .then( ( stream ) => {
            videoElement = document.createElement( 'video' );
            videoElement.autoplay = true;
            videoElement.playsInline = true;
            videoElement.muted = true;
            videoElement.srcObject = stream;
            videoElement.play();
        } )
        .catch( ( error ) => {
            console.error( 'Error accessing camera: ' + error.name, error );
        } );

    init();

} else {
    const warning = WEBGL.getWebGL2ErrorMessage();
    document.body.appendChild( warning );
}
