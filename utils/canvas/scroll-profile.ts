import { evolve, initialize } from "../models/ripples/lib";

export function scrollProfile(
  screenCanvas: HTMLCanvasElement,
  bufferCanvas: HTMLCanvasElement | null
) {
  const screenContext = screenCanvas?.getContext("2d");
  const bufferContext = bufferCanvas?.getContext("2d");

  let h = initialize(0.2);

  // Scale the data to the canvas
  const width = screenCanvas.width;
  const height = screenCanvas.height;
  const xScale = width / h.length;
  const yScale = 10;
  const yOffset = 250;

  const xMin = 1;
  const hAtXMin = yScale * h[0] + yOffset;

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
        path.moveTo(xMin, hAtXMin);
        for (let i = 1; i < h.length - 1; i += 1) {
          path.lineTo(xScale * (i + 1), yScale * h[i + 1] + yOffset);
        }
        screenContext.lineWidth = 1;
        screenContext.stroke(path);

        // Draw the contents of the screenCanvas on the bufferCanvas, with an offset
        bufferContext.clearRect(0, 0, width, height);
        bufferContext.drawImage(screenCanvas, 0, -2);

        const { h: h1 } = evolve(h, 7); // Pass this in
        h = h1;
      }
    }
  }
  draw();
}
