import adapter from 'webrtc-adapter';

const video = document.querySelector( 'video' );
const canvas = document.querySelector( 'canvas' );
const captureButton = document.getElementById( 'capture' );

const constraints = {
    audio: false,
    video: true
};

let streaming = false;
const width = 320;
let height = 0;

navigator.mediaDevices.getUserMedia( constraints )
    .then( ( stream ) => {
        const videoTracks = stream.getVideoTracks();
        console.log( 'Stream characteristics: ', constraints );
        console.log( 'Using device: ' + videoTracks[0].label );
        stream.onended = () => {
            console.log( 'End of stream' );
        };
        video.srcObject = stream;
    } )
    .catch( ( error ) => {
        if ( error.name === 'ConstraintNotSatisfiedError' ) {
            console.error( 'The resolution ' + constraints.video.width.exact + 'x' +
                constraints.video.width.exact + ' px is not supported by the camera.' );
        } else if ( error.name === 'PermissionDeniedError' ) {
            console.error( 'The user has not allowed the access to the camera and the microphone.' );
        }
        console.error( ' Error in getUserMedia: ' + error.name, error );
    } );

video.addEventListener( 'canplay', ( event ) => {
    if ( !streaming ) {
        height = video.videoHeight / ( video.videoWidth / width );
        video.width = width;
        video.height = height;
        canvas.width = width;
        canvas.height = height;
        streaming = true;
    }
}, false );

captureButton.addEventListener( 'click', ( event ) => {
    takepicture();
}, false );

function takepicture() {
    canvas.width = width;
    canvas.height = height;
    canvas.getContext( '2d' ).drawImage( video, 0, 0, width, height );
    const dataURL = canvas.toDataURL( 'image/png' );
    captureButton.href = dataURL;
}
