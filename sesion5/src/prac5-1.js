/* global dashjs */
const url = "http://localhost:60080/sintel_abr.mpd";
const player = dashjs.MediaPlayer().create();
player.initialize(document.querySelector("#player"), url, true);
