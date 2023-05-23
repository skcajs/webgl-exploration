// ClickedPoints.js
//  Vertex shader program
var VSHADER_SOURCE = `
attribute vec4 a_Position;
void main() {
    gl_Position = a_Position;  // Coordinates
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

    // Step 4: Get storage location of attribute variable
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get storage location of a_Position');
        return;
    }

    // Register function (event handler) to be called on mouse click
    canvas.onmousedown = function (ev) { click(ev, gl, canvas, a_Position); };

    // Step 6: Specify colours for clearing <canvas>
    gl.clearColor(0.5, 0.5, 0.5, 1);

    gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_points = []; // Array for mouse presses
function click(ev, gl, canvas, a_Position) {
    var x = ev.clientX; // x coordinate of mouse pointer
    var y = ev.clientY; // y coordinate of mouse pointer
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.height / 2) / (canvas.height / 2);
    y = (canvas.width / 2 - (y - rect.top)) / (canvas.width / 2);
    // Store coordinates to g_points array
    g_points.push([x, y]);

    gl.clear(gl.COLOR_BUFFER_BIT);

    var len = g_points.length;
    for (var i = 0; i < len; i++) {
        gl.vertexAttrib3f(a_Position, g_points[i][0], g_points[i][1], 0.0);
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}