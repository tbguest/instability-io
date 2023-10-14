const screenCanvas = <HTMLCanvasElement>document.getElementById("screenCanvas");
const bufferCanvas = <HTMLCanvasElement>document.getElementById("bufferCanvas");

const screenContext = screenCanvas?.getContext("2d");
const bufferContext = bufferCanvas?.getContext("2d");

// Initial conditions
let x1 = 0.1;
let y1 = 0.0;
let z1 = 0.0;

let x2 = 0.2;
let y2 = 0.0;
let z2 = 0.0;

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
    // System 1
    const dx1 = sigma * (y1 - x1) * dt;
    const dy1 = (x1 * (rho - z1) - y1) * dt;
    const dz1 = (x1 * y1 - beta * z1) * dt;
    x1 += dx1;
    y1 += dy1;
    z1 += dz1;

    // System 2
    const dx2 = sigma * (y2 - x2) * dt;
    const dy2 = (x2 * (rho - z2) - y2) * dt;
    const dz2 = (x2 * y2 - beta * z2) * dt;
    x2 += dx2;
    y2 += dy2;
    z2 += dz2;

    screenContext.clearRect(0, 0, width, height);
    bufferCanvas && screenContext.drawImage(bufferCanvas, 0, 0);

    const path = new Path2D();
    // First axes
    path.moveTo(0.25 * width, 0.1 * height);
    path.lineTo(0.25 * width + scale * y1, 0.1 * height + scale * x1);

    // Second axes
    path.moveTo(0.75 * width, 0.1 * height);
    path.lineTo(0.75 * width + scale * y2, 0.1 * height + scale * x2);

    screenContext.lineWidth = 1;
    // screenContext.strokeStyle = `#0000${00}`;
    screenContext.stroke(path); // Shade by z?

    // Draw the contents of the screenCanvas on the bufferCanvas, with an offset
    bufferContext.clearRect(0, 0, width, height);
    bufferContext.drawImage(screenCanvas, 0, 1);

    requestAnimationFrame(draw);
  }
}
draw();
