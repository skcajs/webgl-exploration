// MultiTexture.js
// Vertex Shader Program
var VSHADER_SOURCE = `
attribute vec4 a_Position;
attribute vec2 a_TexCoord;
varying vec2 v_TexCoord;
void main() {
    gl_Position = a_Position;
    v_TexCoord = a_TexCoord;
}`;
// Fragment Shader Program
var FSHADER_SOURCE = `
precision mediump float;
uniform sampler2D u_Sampler0;
uniform sampler2D u_Sampler1;
varying vec2 v_TexCoord;
void main() {
    vec4 color0 = texture2D(u_Sampler0, v_TexCoord);
    vec4 color1 = texture2D(u_Sampler1, v_TexCoord);
    gl_FragColor = color0 * color1;
}`;

function main() {
    // Get canvas element
    var canvas = document.getElementById('webgl');

    // Get webGL context
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get webgl context, not supported by browser');
        return;
    }

    // Initialise shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to initialise shaders');
        return;
    }

    // Set positions of vertices
    var n = initVertexBuffers(gl);
    if (n < 0) {
        console.log('Failed to set vertex buffers');
        return;
    }

    // Setting the textures
    if (!initTextures(gl, n)) {
        console.log('Failed to initialise textures');
    }

    // Set color for clearing
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Do clearing
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Do the drawing
    gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffers(gl) {
    var verticesTexCoords = new Float32Array([
        -0.5, 0.5, 0.0, 1.0,
        -0.5, -0.5, 0.0, 0.0,
        0.5, 0.5, 1.0, 1.0,
        0.5, -0.5, 1.0, 0.0
    ]);
    var n = 4;

    // Create buffer object
    var vertexTexCoordBuffer = gl.createBuffer();
    if (!vertexTexCoordBuffer) {
        console.log('Failed to create buffer object');
        return -1;
    }

    // Write vertex coords and texture coords to the object buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);

    var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;

    // Get storage location for a_Position
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get storage location of a_Position');
        return -1;
    }
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
    gl.enableVertexAttribArray(a_Position);

    // Get storage location for a_TextCoord
    var a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
    if (a_TexCoord < 0) {
        console.log('Failed to get storage location of a_TexCoord');
        return -1;
    }
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
    gl.enableVertexAttribArray(a_TexCoord);

    return n;
}

function initTextures(gl, n) {
    // Create texture object
    var texture0 = gl.createTexture();
    var texture1 = gl.createTexture();
    if (!texture0 && !texture1) {
        console.log('Failed to create texture objects');
        return false;
    }

    // Get storage location of of the u_Sampler
    var u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
    var u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
    if (u_Sampler0 < 0 && u_Sampler1 < 0) {
        console.log('Failed to get storage location of u_Sampler0 or u_Sampler1');
        return false;
    }

    // Create an image object
    var image0 = new Image();
    var image1 = new Image();
    if (!image0 && !image1) {
        console.log('Failed to create image objects');
        return false;
    }

    // Register the event handler to be called on loading an image
    image0.onload = function () { loadTexture(gl, n, texture0, u_Sampler0, image0, 0); };
    image1.onload = function () { loadTexture(gl, n, texture1, u_Sampler1, image1, 1); };
    // Tell the browser to load an image
    image0.src = '../resources/sky.jpg';
    image1.src = '../resources/circle.gif';

    return true;
}

//Specify whether the texture unit is ready to use
var g_texUnit0 = false, g_texUnit1 = false;

function loadTexture(gl, n, texture, u_Sampler, image, texUnit) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the images y axis

    // Make the texture unit active
    if (texUnit == 0) {
        gl.activeTexture(gl.TEXTURE0);
        g_texUnit0 = true;
    } else {
        gl.activeTexture(gl.TEXTURE1);
        g_texUnit1 = true;
    }

    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set the texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // Set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    // Set the texture unit to the sampler
    gl.uniform1i(u_Sampler, texUnit);

    gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>

    if (g_texUnit0 && g_texUnit1) {
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle
    }
}