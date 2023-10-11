const screenCanvas = <HTMLCanvasElement>document.getElementById("screenCanvas");
const bufferCanvas = <HTMLCanvasElement>document.getElementById("bufferCanvas");

const screenContext = screenCanvas?.getContext("2d");
const bufferContext = bufferCanvas?.getContext("2d");

// Initial conditions
let x = 0.1;
let y = 0.0;
let z = 0.0;

// Parameters
const sigma = 10.0;
const rho = 28.0;
const beta = 8.0 / 3.0;

// Scale the data to the canvas
const width = screenCanvas.width;
const height = screenCanvas.height;

// Time step and scale
const dt = 0.01;
const scale = 3;

function draw() {
  if (screenContext && bufferContext) {
    // Update the chaotic system using Euler method
    const dx = sigma * (y - x) * dt;
    const dy = (x * (rho - z) - y) * dt;
    const dz = (x * y - beta * z) * dt;

    x += dx;
    y += dy;
    z += dz;

    screenContext.clearRect(0, 0, width, height);
    bufferCanvas && screenContext.drawImage(bufferCanvas, 0, 0);

    const path = new Path2D();
    // First axes
    path.moveTo((3.5 * width) / 4, height / 2);
    path.lineTo((3.5 * width) / 4 + scale * x, height / 2 + scale * y);
    screenContext.lineWidth = 1;
    // screenContext.strokeStyle = `#0000${00}`;
    screenContext.stroke(path); // Shade by z?

    // Draw the contents of the screenCanvas on the bufferCanvas, with an offset
    bufferContext.clearRect(0, 0, width, height);
    bufferContext.drawImage(screenCanvas, -1, 0);

    requestAnimationFrame(draw);
  }
}
draw();
