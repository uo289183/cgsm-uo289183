import * as THREE from 'three';
import WEBGL from 'three/examples/jsm/capabilities/WebGL.js';

if ( WEBGL.isWebGL2Available() ) {

	const video = document.getElementById( 'video' );
	video.loop = true;
	video.playsInline = true;
	video.muted = true;

	// Inicializar el reproductor MPEG-DASH sobre el elemento <video> oculto.
	// dashjs se carga como script global en el HTML antes de este módulo.
	const dashUrl = 'http://localhost:60080/sintel_abr.mpd';
	const dashPlayer = window.dashjs.MediaPlayer().create();
	dashPlayer.initialize( video, dashUrl, false );

	let renderer;
	let scene;
	let camera;
	let wall;
	let texture;
	let imageContext;

	// Dimensiones del canvas-textura (ratio 2.35:1 del tráiler de Sintel).
	const CANVAS_W = 640;
	const CANVAS_H = 272;

	const init = () => {
		scene = new THREE.Scene();

		renderer = new THREE.WebGLRenderer( { antialias: true } );
		renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( renderer.domElement );

		camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 5000 );
		camera.position.set( 0, 0, 700 );

		const image = document.createElement( 'canvas' );
		image.width = CANVAS_W;
		image.height = CANVAS_H;
		imageContext = image.getContext( '2d' );
		imageContext.fillStyle = '#000000';
		imageContext.fillRect( 0, 0, CANVAS_W - 1, CANVAS_H - 1 );

		texture = new THREE.Texture( image );
		texture.minFilter = THREE.LinearFilter;
		texture.magFilter = THREE.LinearFilter;
		texture.generateMipmaps = false;

		const material = new THREE.MeshBasicMaterial( { map: texture } );
		wall = new THREE.Mesh( new THREE.PlaneGeometry( CANVAS_W, CANVAS_H, 4, 4 ), material );
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
			imageContext.drawImage( video, 0, 0, CANVAS_W, CANVAS_H );
			if ( texture ) texture.needsUpdate = true;
		}

		wall.rotation.y += 0.01;

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
