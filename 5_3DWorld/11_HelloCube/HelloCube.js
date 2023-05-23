// HelloCube.js
// Vertex Shader
var VSHADER_SOURCE = `
attribute vec4 a_Position;
attribute vec4 a_Color;
varying vec4 v_Color;
uniform mat4 u_MvpMatrix; 
void main() {
    gl_Position = u_MvpMatrix * a_Position;
    v_Color = a_Color;
}
`;
var FSHADER_SOURCE = `
precision mediump float;
varying vec4 v_Color;
void main() {
    gl_FragColor = v_Color;
}
`;

function main() {
    // Retrieve canvas element
    var canvas = document.getElementById('webgl');

    // Get WebGL Rendering Context
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get webGL context.');
        return;
    }

    // Initialise Shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to initialise shaders.');
        return;
    }

    // Retrieve vertices
    var n = initVertexBuffers(gl);
    if (n < 0) {
        console.log('Failed to initialise vertex buffers.');
        return;
    }

    // Set clear colour and enable hidden surface removal
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    // Get storage location for mvp matrix
    var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
    if (!u_MvpMatrix) {
        console.log('Failed to get storage location u_MvpMatrix');
        return;
    }

    var mvpMatrix = new Matrix4();
    mvpMatrix.setPerspective(30, 1, 1, 100).lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);

    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}

function initVertexBuffers(gl) {
    var verticesColors = new Float32Array([
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, // v0 white
        -1.0, 1.0, 1.0, 1.0, 0.0, 1.0, // v1 magenta
        -1.0, -1.0, 1.0, 1.0, 0.0, 0.0, // v2 red
        1.0, -1.0, 1.0, 1.0, 1.0, 0.0, // v3 yellow
        1.0, -1.0, -1.0, 0.0, 1.0, 0.0, // v4 green
        1.0, 1.0, -1.0, 0.0, 1.0, 1.0, // v5 cyan
        -1.0, 1.0, -1.0, 0.0, 0.0, 1.0, // v6 blue
        -1.0, -1.0, -1.0, 0.0, 0.0, 0.0 // v7 black
    ]);

    var indices = new Uint8Array([
        0, 1, 2, 0, 2, 3,
        0, 3, 4, 0, 4, 5,
        0, 5, 6, 0, 6, 1,
        1, 6, 7, 1, 7, 2,
        7, 4, 3, 7, 3, 2,
        4, 7, 6, 4, 6, 5
    ]);

    // Create buffers for vertexColor and index
    var vertexColorBuffer = gl.createBuffer();
    var indexBuffer = gl.createBuffer();

    if (!vertexColorBuffer || !indexBuffer) {
        return -1;
    }

    // Write the vertex coords and colour to the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

    var FSIZE = verticesColors.BYTES_PER_ELEMENT;

    // Assign buffer object to a_Position and enable it
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to find the location of a_Position');
        return -1;
    }
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(a_Position);

    // Assign buffer object to a_Color and enable it
    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    if (a_Color < 0) {
        console.log('Failed to find the location of a_Color');
        return -1;
    }
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(a_Color);

    // Write the indices to the buffer object
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    return indices.length;
}