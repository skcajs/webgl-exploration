// HelloCanvas.js
function main() {
    // Step 1: Retrieve canvas element
    var canvas = document.getElementById('webgl');

    // Step 2: Get the rendering context for WebGL
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    // Step 3: Specify the colour for clearing <context>
    gl.clearColor(0.5, 0.5, 0.5, 1);

    // Step 4: Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
}