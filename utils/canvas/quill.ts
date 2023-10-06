import { evolve, initialize } from "../models/ripples/lib";

// TODO: Pass init and evolution functions to generic plotter
export function quiver(screenCanvas: HTMLCanvasElement) {
  const screenContext = screenCanvas?.getContext("2d");

  let h = initialize(0.2);
  let h2 = [...h];
  let slope = [...h];
  h2[0] += 0.1;

  // Scale the data to the canvas
  const width = screenCanvas.width;
  const height = screenCanvas.height;
  const xScale = width / h.length;
  const yScale = 20;
  const offset1 = 150;
  const offset2 = 250;

  // Frame rate and animation (TODO: encapsulate)
  const fps = 30;
  let now;
  let then = Date.now();
  const interval = 1000 / fps;
  let delta;

  function draw() {
    if (screenContext) {
      requestAnimationFrame(draw);

      now = Date.now();
      delta = now - then;

      if (delta > interval) {
        then = now - (delta % interval);

        screenContext.clearRect(0, 0, width, height);

        const path = new Path2D();
        // First axes
        for (let i = 0; i < h.length - 1; i += 1) {
          path.moveTo(xScale * i, offset1);
          path.lineTo(xScale * i + 8 * slope[i], offset1 + yScale * h[i]);
        }
        // Second axes
        for (let i = 0; i < h.length - 1; i += 1) {
          path.moveTo(xScale * i, offset2);
          path.lineTo(xScale * i + 8 * slope[i], offset2 + yScale * h[i]);
        }
        screenContext.lineWidth = 1;
        screenContext.stroke(path);

        const { h: h1, slope: slope2 } = evolve(h, 7); // Pass this in
        h = h1;
        slope = slope2;
      }
    }
  }
  draw();
}
