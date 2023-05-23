// HelloPoint2.js
//  Vertex shader program
var VSHADER_SOURCE = `
attribute vec4 a_Position;
attribute float a_PointSize;

void main() {
    gl_Position = a_Position;  // Coordinates
    gl_PointSize = a_PointSize;
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

    // Step 4: Get storage location of attribute variable
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get storage location of a_Position');
        return;
    }

    var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
    if (a_PointSize < 0) {
        console.log('Failed to get storage location of a_PointSize');
        return;
    }

    // Step 5: Pass vertex position to attribute variable
    gl.vertexAttrib3f(a_Position, 0.5, 0.0, 0.0);
    gl.vertexAttrib1f(a_PointSize, 10.0);

    // Step 6: Specify colours for clearing <canvas>
    gl.clearColor(0.5, 0.5, 0.5, 1);

    // Step 7: Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Step 8: Draw a point
    gl.drawArrays(gl.POINTS, 0, 1);
}