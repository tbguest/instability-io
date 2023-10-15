import { LATTICE_X, evolve, initializeModel } from "../models/dunes/lib";

const screenCanvas = <HTMLCanvasElement>document.getElementById("screenCanvas");
const bufferCanvas = <HTMLCanvasElement>document.getElementById("bufferCanvas");

const screenContext = screenCanvas?.getContext("2d");
const bufferContext = bufferCanvas?.getContext("2d");

let h = initializeModel();

// Scale the data to the canvas
const width = screenCanvas.width;
const height = screenCanvas.height;
const xScale = width / h.length;
const yScale = 0.5;
const yOffset = 350;

// Frame rate and animation
const fps = 30;
let now;
let then = Date.now();
const interval = 1000 / fps;
let delta;

function draw() {
  if (screenContext && bufferContext) {
    requestAnimationFrame(draw);

    now = Date.now();
    delta = now - then;

    if (delta > interval) {
      then = now - (delta % interval);

      screenContext.clearRect(0, 0, width, height);
      bufferCanvas && screenContext.drawImage(bufferCanvas, 0, 0);

      const path = new Path2D();
      const x0 = xScale * 0;

      // Negative since the canvas (0,0) is upper left
      const h0 = -yScale * h[0] + yOffset;
      path.moveTo(x0, h0);
      for (let i = 1; i < LATTICE_X; i += 1) {
        const xn = xScale * i;
        const yn = -yScale * h[i] + yOffset;
        path.lineTo(xn, yn);
      }
      screenContext.lineWidth = 1;
      screenContext.stroke(path);

      // Draw the contents of the screenCanvas on the bufferCanvas, with an offset
      bufferContext.clearRect(0, 0, width, height);
      // bufferContext.drawImage(screenCanvas, 0, 0);
      bufferContext.fillStyle = "rgb(0,0,0,0.85)";
      bufferContext.drawImage(screenCanvas, 0, -3);

      for (let i = 0; i < 3 * LATTICE_X; i++) {
        const { h: h1 } = evolve(h); // Pass this in
        h = h1;
      }
    }
  }
}
draw();
