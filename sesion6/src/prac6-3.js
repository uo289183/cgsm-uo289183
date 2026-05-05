import adapter from 'webrtc-adapter';

let localStream,
    localPeerConnection,
    remotePeerConnection;

const offerOptions = {
    offerToReceiveAudio: true,
    offerToReceiveVideo: true
};

const localVideo = document.getElementById( 'localVideo' );
const remoteVideo = document.getElementById( 'remoteVideo' );
const startButton = document.getElementById( 'startButton' );
const callButton = document.getElementById( 'callButton' );
const hangupButton = document.getElementById( 'hangupButton' );

startButton.disabled = false;
callButton.disabled = true;
hangupButton.disabled = true;

startButton.onclick = start;
callButton.onclick = call;
hangupButton.onclick = hangup;

function start() {
    startButton.disabled = true;

    navigator.mediaDevices.getUserMedia( { audio: false, video: true } )
        .then( ( stream ) => {
            localStream = stream;
            localVideo.srcObject = stream;
            callButton.disabled = false;
            console.log( 'Local stream captured: ' + stream.getVideoTracks()[0].label );
        } )
        .catch( ( error ) => {
            console.error( 'Error in getUserMedia: ' + error.name, error );
            startButton.disabled = false;
        } );
}

function call() {
    callButton.disabled = true;
    hangupButton.disabled = false;

    const servers = null;

    localPeerConnection = new RTCPeerConnection( servers );
    localPeerConnection.onicecandidate = gotLocalIceCandidate;

    remotePeerConnection = new RTCPeerConnection( servers );
    remotePeerConnection.onicecandidate = gotRemoteIceCandidate;
    remotePeerConnection.ontrack = gotRemoteTrack;

    localStream.getTracks().forEach( track => localPeerConnection.addTrack( track, localStream ) );

    localPeerConnection.createOffer( offerOptions ).then( gotLocalDescription );
}

function hangup() {
    localPeerConnection.close();
    remotePeerConnection.close();
    localPeerConnection = null;
    remotePeerConnection = null;
    remoteVideo.srcObject = null;
    hangupButton.disabled = true;
    callButton.disabled = false;
}

function gotLocalDescription( description ) {
    localPeerConnection.setLocalDescription( description );
    remotePeerConnection.setRemoteDescription( description );
    remotePeerConnection.createAnswer().then( gotRemoteDescription );
}

function gotRemoteDescription( description ) {
    remotePeerConnection.setLocalDescription( description );
    localPeerConnection.setRemoteDescription( description );
}

function gotLocalIceCandidate( event ) {
    if ( event.candidate ) {
        remotePeerConnection.addIceCandidate( new RTCIceCandidate( event.candidate ) );
    }
}

function gotRemoteIceCandidate( event ) {
    if ( event.candidate ) {
        localPeerConnection.addIceCandidate( new RTCIceCandidate( event.candidate ) );
    }
}

function gotRemoteTrack( event ) {
    remoteVideo.srcObject = event.streams[0];
}
