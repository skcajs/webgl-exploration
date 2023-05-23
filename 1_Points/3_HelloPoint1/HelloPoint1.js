// HelloPoint1.js
//  Vertex shader program
var VSHADER_SOURCE = `void main() {
    gl_Position = vec4(0.7, 0.3, 0.0, 1.0);  // Coordinates
    gl_PointSize = 10.0;
}`;

// Fragment Shader program
var FSHADER_SOURCE = `void main() {
    gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0); // Set the color
}`;

function main() {
    // Step 1: Retrieve canvas element
    var canvas = document.getElementById('webgl');

    // Step 2: Get the rendering context for WebGL
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get rendering context for WebGL.');
        return;
    }

    // Step 3: Initialise shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to initialise shaders.');
        return;
    }

    // Step 4: Specify colours for clearing <canvas>
    gl.clearColor(0.5, 0.5, 0.5, 1);

    // Step 5: Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Step 6: Draw a point
    gl.drawArrays(gl.POINTS, 0, 1);
}