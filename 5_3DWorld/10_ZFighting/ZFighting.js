// ZFighting.js
// Vertex Shader
var VSHADER_SOURCE = `
attribute vec4 a_Position;
attribute vec4 a_Color;
uniform mat4 u_MvpMatrix;
varying vec4 v_Color;
void main() {
    gl_Position = u_MvpMatrix * a_Position;
    v_Color = a_Color;
}
`;

// Fragment Shader
var FSHADER_SOURCE = `
precision mediump float;
varying vec4 v_Color;
void main() {
    gl_FragColor = v_Color;
}
`;

function main() {
    // Retrieve the canvas element
    var canvas = document.getElementById('webgl');

    // Initialise the webgl context
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get webgl context or browser not supported');
        return;
    }

    // Initialise shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to initialise shaders');
        return;
    }

    // Set vertex positions
    var n = initVertexBuffers(gl);
    if (n < 0) {
        console.log('Unable to initialise vertex buffers');
        return;
    }

    // Get location of u_ViewMatrix
    var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');

    if (!u_MvpMatrix) {
        console.log('Unable to get location of u_MvpMatrix');
        return;
    }

    // Set the eye point, lookat point, and the up direction
    var viewProjMatrix = new Matrix4();

    viewProjMatrix.setPerspective(30, canvas.width / canvas.height, 1, 100).lookAt(3.06, 2.5, 10.0, 0, 0, -2, 0, 1, 0);

    // Pass the view and projection matrices into the gl program
    gl.uniformMatrix4fv(u_MvpMatrix, false, viewProjMatrix.elements);

    // Set color for clearing and clear
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Enable hidden surface removal function
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.POLYGON_OFFSET_FILL);

    // Clear the color and depth buffer
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Draw arrays

    gl.drawArrays(gl.TRIANGLES, 0, n / 2); // Draw triangles on right
    gl.polygonOffset(1.0, 1.0);
    gl.drawArrays(gl.TRIANGLES, n / 2, n / 2);
}

function initVertexBuffers(gl) {
    // Create vertices
    var verticesColors = new Float32Array([
        0.0, 2.5, -5.0, 0.4, 1.0, 0.4,
        -2.5, -2.5, -5.0, 0.4, 1.0, 0.4,
        2.5, -2.5, -5.0, 1.0, 0.4, 0.4,

        0.0, 3.0, -5.0, 1.0, 0.4, 0.4,
        -3.0, -3.0, -5.0, 1.0, 1.0, 0.4,
        3.0, -3.0, -5.0, 1.0, 1.0, 0.4,
    ]);
    var n = 6;

    var FSIZE = verticesColors.BYTES_PER_ELEMENT;

    // Create vertex buffer
    var vertexColorBuffer = gl.createBuffer();
    if (!vertexColorBuffer) {
        console.log('Failed to create buffer object');
        return -1;
    }

    // Bind buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

    // Get location of a_Potision
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get storage location of a_Position');
        return -1;
    }
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(a_Position);

    // Get location of a_Color
    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    if (a_Color < 0) {
        console.log('Failed to get storage location of a_Color');
        return -1;
    }
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(a_Color);

    return n;
}