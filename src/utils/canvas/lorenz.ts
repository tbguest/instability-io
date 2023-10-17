import { update } from "../models/lorenz/lib";

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

// Scale the data to the canvas
const width = screenCanvas.width;
const height = screenCanvas.height;

// Time step and scale
const scale = 3;

function draw() {
  if (screenContext && bufferContext) {
    // System 1
    const { x: xp, y: yp, z: zp } = update(x1, y1, z1);
    x1 = xp;
    y1 = yp;
    z1 = zp;

    // System 2
    const { x: xpp, y: ypp, z: zpp } = update(x2, y2, z2);
    x2 = xpp;
    y2 = ypp;
    z2 = zpp;

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
    screenContext.stroke(path); // Shade by z?

    // Draw the contents of the screenCanvas on the bufferCanvas, with an offset
    bufferContext.clearRect(0, 0, width, height);
    bufferContext.drawImage(screenCanvas, 0, 1);

    requestAnimationFrame(draw);
  }
}
draw();
