import * as THREE from 'three';

function isWebGL2Available() {
    try {
        const canvas = document.createElement('canvas');
        return !!(window.WebGL2RenderingContext && canvas.getContext('webgl2'));
    } catch (e) {
        return false;
    }
}

if (isWebGL2Available()) {
    const msg = document.createElement('div');
    msg.style.cssText = 'color: lime; font-size: 22px; padding: 30px; font-family: monospace;';
    msg.textContent = '✓ WebGL2 está disponible en tu navegador.';
    document.body.appendChild(msg);
} else {
    const warning = document.createElement('div');
    warning.style.cssText = 'color: red; font-size: 22px; padding: 30px; font-family: monospace;';
    warning.innerHTML =
        '✗ WebGL2 no está disponible en tu navegador.<br>' +
        '<a href="http://get.webgl.org" style="color:orange">Más información</a>';
    document.body.appendChild(warning);
}
