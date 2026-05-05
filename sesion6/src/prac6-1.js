import adapter from 'webrtc-adapter';

const video = document.querySelector( 'video' );
const constraints = {
    audio: false,
    video: true
};

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
