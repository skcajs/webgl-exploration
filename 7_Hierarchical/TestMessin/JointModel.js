// JointModel.js
// Vertex Shader
var VSHADER_SOURCE = `
attribute vec4 a_Position;
attribute vec4 a_Color;
attribute vec4 a_Normal;
varying vec4 v_Color;
uniform mat4 u_MvpMatrix;
uniform vec3 u_LightColor;
uniform vec3 u_LightDirection;
uniform vec3 u_AmbientLight;
void main() {
    gl_Position = u_MvpMatrix * a_Position;
    // Normalise the normal
    vec3 normal = normalize(vec3(a_Normal));
    // Dot product of light direction and orientation of a surface
    float nDotL = max(dot(u_LightDirection, normal), 0.0);
    // Calculate the diffuse reflection
    vec3 diffuse = u_LightColor * vec3(a_Color) * nDotL;
    // Calculate the color due to the ambient light
    vec3 ambient = u_AmbientLight * a_Color.rgb;
    // Surface color due to ambient and diffuse reflection
    v_Color = vec4(diffuse + ambient, a_Color.a);
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
    var canvas = document.getElementById('webgl');

    // Get WebGL rendering context
    gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Unable to get webgl rendering context');
        return;
    }

    // Initialise Shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Unable to initialise shaders');
        return;
    }

    // Initialise vertex Buffers
    var n = initVertexBuffers();
    if (n < 0) {
        console.log('Unable to initialise vertex buffers');
        return;
    }

    // Initialise uniform variables
    var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
    var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    var u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
    var u_LightDirection = gl.getUniformLocation(gl.program, 'u_LightDirection');
    var u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');
    if (u_MvpMatrix < 0 || u_ModelMatrix < 0 || u_AmbientLight < 0 || u_LightColor < 0) {
        console.log('Unable to find uniform variables');
        return;
    }

    // Set light color
    gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
    // Set light direction in world coordinates
    var lightDirection = new Vector3([0.2, 4.0, 2.0]);
    lightDirection.normalize(); // Normalise the light vector
    gl.uniform3fv(u_LightDirection, lightDirection.elements);

    mvpMatrix = new Matrix4();
    modelMatrix = new Matrix4();
    mvpMatrix.setPerspective(30, canvas.width / canvas.height, 1, 100);
    mvpMatrix.lookAt(0, 0, 3, 0, 0, 0, 0, 1, 0);

    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

    gl.uniform3f(u_AmbientLight, 1.0, 1.0, 1.0);

    // Specify color for clearing and enable depth
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    // Clear
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Draw to screen
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}

function initVertexBuffers() {
    // Create vertices
    var vertices = new Float32Array([
        0.0, 0.5, 0.1,
        -0.5, -0.5, -0.5,
        0.5, -0.5, 0.0,
    ]);

    var colors = new Float32Array([
        0.4, 0.7, 1.0,
        0.4, 0.7, 1.0,
        0.4, 0.7, 1.0,
    ]);

    var normals = calculateNormals(Array.from(vertices));

    var indices = new Uint8Array([
        0, 1, 2
    ]);

    if (!initArrayBuffer(gl, vertices, 3, gl.FLOAT, 'a_Position')) return -1;
    if (!initArrayBuffer(gl, colors, 3, gl.FLOAT, 'a_Color')) return -1;
    if (!initArrayBuffer(gl, normals, 3, gl.FLOAT, 'a_Normal')) return -1;

    // Create index buffer
    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    return indices.length;
}

function initArrayBuffer(gl, data, n, type, attribute) {
    // Create new buffer object
    var buffer = gl.createBuffer();

    // Assign a_Position to the vertexBuffer
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    // Find location of a_Position in VSHADER
    var a_Attribute = gl.getAttribLocation(gl.program, attribute);
    if (a_Attribute < 0) {
        console.log(`Could not find the location of attribute ${attribute}`);
        return -1;
    }

    // Write the vertex data to the attribute
    gl.vertexAttribPointer(a_Attribute, n, type, false, 0, 0);
    gl.enableVertexAttribArray(a_Attribute);

    return true;
}

function calculateNormals(vertices) {
    var a = [vertices[3] - vertices[0], vertices[4] - vertices[1], vertices[5] - vertices[2]];
    var b = [vertices[6] - vertices[0], vertices[7] - vertices[1], vertices[8] - vertices[2]];

    var normals = [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
    return new Float32Array([...normals, ...normals, ...normals]);
}