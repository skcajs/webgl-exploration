// DrawRectangle.js
function main() {
    // Step 1: Retrieve <canvas> element
    var canvas = document.getElementById('example');
    if (!canvas) {
        console.log('Failed to retrieve <canvas> element');
        return;
    }

    // Step 2: Request the rendering context for 2D computer graphics
    var ctx = canvas.getContext('2d');

    // Step 3: Draw a blue rectangle
    ctx.fillStyle = 'rgba(0, 0, 255, 1.0)'; // Set a blue colour
    ctx.fillRect(120, 10, 150, 150); // Fill a rectangle with the colour
}