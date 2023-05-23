// MultiAttributeSizeInterleaved.js
//  Vertex shader program
var VSHADER_SOURCE = `
attribute vec4 a_Position;
attribute float a_PointSize;
void main() {
    gl_Position = a_Position;  // Coordinates
    gl_PointSize = a_PointSize;
}`;

// Fragment Shader program
var FSHADER_SOURCE = `
void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // Set the color
}`;

function main() {

    // 1. Retrieve the canvas element
    var canvas = document.getElementById('webgl');

    // 2. Get the webGL rendering context
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get rendering context for WebGL.');
        return;
    }

    // 3. Initialise shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to initialise shaders.');
        return;
    }

    // 4. Set positions of vertices
    var n = initVertexBuffers(gl);
    if (n < 0) {
        console.log('Failed to set the positions of the vertices.');
        return;
    }

    // 7. Set colour for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // 8. Clear <canvas> 
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw three points
    gl.drawArrays(gl.POINTS, 0, n); // n is 3
}

function initVertexBuffers(gl) {
    // 4.1. Define vertices and sizes
    var verticesSizes = new Float32Array([
        0.0, 0.5, 10.0, // First Vertex
        -0.5, -0.5, 20.0, // Second Vertex
        0.5, -0.5, 30.0 // Third Vertex
    ]);
    var n = 3; // The number of vertices

    // 4.3. Create a buffer object
    var vertexSizeBuffer = gl.createBuffer();
    if (!vertexSizeBuffer) {
        console.log('Failed to create buffer objects');
        return -1;
    }

    // 4.4. Bind buffer object to a target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexSizeBuffer);
    // 4.5. Write data into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, verticesSizes, gl.STATIC_DRAW);

    var FSIZE = verticesSizes.BYTES_PER_ELEMENT;

    // 4.6. Get storage locations for shader attributes
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get storage location of a_Position');
        return;
    }

    // 4.7. Assign buffer object to a_Position (attribute) variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 3, 0);

    // 4.8. Enable assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    // 4.6`. Get storage locations for shader attributes
    var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
    if (a_PointSize < 0) {
        console.log('Failed to get storage location of a_PointSize');
        return;
    }

    // 4.7`. Assign buffer object to a_PointSize (attribute) variable
    gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, FSIZE * 3, FSIZE * 2);

    // 4.8`. Enable assignment to a_PointSize variable
    gl.enableVertexAttribArray(a_PointSize);

    return n;
}