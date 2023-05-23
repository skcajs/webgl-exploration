// LookAtTrianglesWithKeys.js
// Vertex Shader
var VSHADER_SOURCE = `
attribute vec4 a_Position;
attribute vec4 a_Color;
uniform mat4 u_ViewMatrix;
varying vec4 v_Color;
void main() {
    gl_Position = u_ViewMatrix * a_Position;
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
    var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');

    if (!u_ViewMatrix) {
        console.log('Unable to get location of u_ViewMatrix');
        return;
    }

    // Set the eye point, lookat point, and the up direction
    var viewMatrix = new Matrix4();
    document.onkeydown = function (ev) { keydown(ev, gl, n, u_ViewMatrix, viewMatrix); };

    // Draw a triangle
    draw(gl, n, u_ViewMatrix, viewMatrix);
}

function initVertexBuffers(gl) {
    // Create vertices
    var verticesColors = new Float32Array([
        0.0, 0.5, -0.4, 0.4, 1.0, 0.4,
        -0.5, -0.5, -0.4, 0.4, 1.0, 0.4,
        0.5, -0.5, -0.4, 1.0, 0.4, 0.4,

        0.5, 0.4, -0.2, 1.0, 0.4, 0.4,
        -0.5, 0.4, -0.2, 1.0, 1.0, 0.4,
        0.0, -0.6, -0.2, 1.0, 1.0, 0.4,

        0.0, 0.5, 0.0, 0.4, 0.4, 1.0,
        -0.5, -0.5, 0.0, 0.4, 0.4, 1.0,
        0.5, -0.5, 0.0, 1.0, 0.4, 0.4,
    ]);
    var n = 9;

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

var g_eyeX = 0.20, g_eyeY = 0.25, g_eyeZ = 0.25; // The eye point
function keydown(ev, gl, n, u_ViewMatrix, viewMatrix) {
    if (ev.keyCode == 39) { // Right arrow
        g_eyeX += 0.01;
    } else
        if (ev.keyCode == 37) // Left arrow
        {
            g_eyeX -= 0.01;
        } else { return; } // Prevent uneccessary drawing
    draw(gl, n, u_ViewMatrix, viewMatrix);
}

function draw(gl, n, u_ViewMatrix, viewMatrix) {
    viewMatrix.setLookAt(g_eyeX, g_eyeY, g_eyeZ, 0, 0, 0, 0, 1, 0);

    // Pass the view matrix to the uniform variable
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

    // Set color for clearing and clear
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw arrays
    gl.drawArrays(gl.TRIANGLES, 0, n);
}