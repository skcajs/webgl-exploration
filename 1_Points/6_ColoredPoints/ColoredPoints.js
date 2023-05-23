// ColoredPoints.js
//  Vertex shader program
var VSHADER_SOURCE = `
attribute vec4 a_Position;
void main() {
    gl_Position = a_Position;  // Coordinates
    gl_PointSize = 10.0;
}`;

// Fragment Shader program
var FSHADER_SOURCE = `
precision mediump float;
uniform vec4 u_FragColor;
void main() {
    gl_FragColor = u_FragColor; // Set the color
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

    // 4. Get storage locations for shader attributes
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get storage location of a_Position');
        return;
    }

    // 5. Get storage locations for shader uniform variables
    var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get storage location of u_FragColor');
        return;
    }

    // 6. Handle on user events
    canvas.onmousedown = function (ev) { click(ev, gl, canvas, a_Position, u_FragColor); };

    // 7. Set colour for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // 8. Clear <canvas> 
    gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_points = []; // Array for mouse presses
var g_colors = []; // Array for point colors
function click(ev, gl, canvas, a_Position, u_FragColor) {
    // 6.1. Specify coordinates for x,y
    var x = ev.clientX; // x coordinate of mouse pointer
    var y = ev.clientY; // y coordinate of mouse pointer
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.height / 2) / (canvas.height / 2);
    y = (canvas.width / 2 - (y - rect.top)) / (canvas.width / 2);
    // Store coordinates to g_points array
    g_points.push([x, y]);

    // Store the color to g_colors array
    if (x >= 0.0 && y >= 0.0) {
        g_colors.push([1.0, 0.0, 0.0, 1.0]); // Red
    } else if (x < 0.0 && y < 0.0) {
        g_colors.push([0.0, 1.0, 0.0, 1.0]); // Green
    } else {
        g_colors.push([1.0, 1.0, 1.0, 1.0]); // White
    }

    // 6.2. Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 6.3. Draw points from g_points
    var len = g_points.length;
    for (var i = 0; i < len; i++) {
        gl.vertexAttrib3f(a_Position, g_points[i][0], g_points[i][1], 0.0);
        gl.uniform4f(u_FragColor, g_colors[i][0], g_colors[i][1], g_colors[i][2], g_colors[i][3]);
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}