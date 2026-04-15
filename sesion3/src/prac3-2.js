import * as THREE from 'three';
import WEBGL from 'three/examples/jsm/capabilities/WebGL.js';

if ( WEBGL.isWebGL2Available() ) {

	const video = document.getElementById( 'video' );
	video.loop = true;
	video.playsInline = true;

	let renderer;
	let scene;
	let camera;
	let wall;
	let texture;
	let imageContext;

	const init = () => {
		scene = new THREE.Scene();

		renderer = new THREE.WebGLRenderer( { antialias: true } );
		renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( renderer.domElement );

		camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 5000 );
		camera.position.set( 0, 0, 700 );

		const image = document.createElement( 'canvas' );
		image.width = 480;
		image.height = 204;
		imageContext = image.getContext( '2d' );
		imageContext.fillStyle = '#000000';
		imageContext.fillRect( 0, 0, image.width - 1, image.height - 1 );

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

		if ( video.readyState === video.HAVE_ENOUGH_DATA ) {
			imageContext.drawImage( video, 0, 0, imageContext.canvas.width, imageContext.canvas.height );
			if ( texture ) {
				texture.needsUpdate = true;
			}
		}


		wall.rotation.y += 0.01

		renderer.render( scene, camera );
	};

	const playVideo = () => {
		video.play().then( () => {
			if ( !video.paused ) {
				document.removeEventListener( 'pointerdown', playVideo );
				document.removeEventListener( 'click', playVideo );
				document.removeEventListener( 'keydown', playVideo );
			}
		} ).catch( () => {} );
	};

	init();
	playVideo();
	video.addEventListener( 'canplay', playVideo );
	document.addEventListener( 'pointerdown', playVideo );
	document.addEventListener( 'click', playVideo );
	document.addEventListener( 'keydown', playVideo );

} else {
	const warning = WEBGL.getWebGL2ErrorMessage();
	document.body.appendChild( warning );
}