export function drawPathTranslate(
  h: number[],
  canvas: HTMLCanvasElement,
  canvas2: HTMLCanvasElement | null
) {
  const cx = canvas.getContext("2d");
  const cx2 = canvas2?.getContext("2d");

  // Scale the data to the canvas
  const width = canvas.width;
  const height = canvas.height;
  const xScale = width / h.length;
  const yScale = 10;
  const yOffset = 250;

  const xMin = 1;
  const hAtXMin = yScale * h[0] + yOffset;

  if (cx) {
    cx.clearRect(0, 0, width, height);
    canvas2 && cx.drawImage(canvas2, 0, 0);

    const path = new Path2D();
    path.moveTo(xMin, hAtXMin);
    for (let i = 1; i < h.length - 1; i += 1) {
      path.lineTo(xScale * (i + 1), yScale * h[i + 1] + yOffset);
    }
    cx.lineWidth = 1;
    cx.stroke(path);

    // Draw the contents of the canvas on canvas2, with an offset
    if (cx2) {
      cx2.clearRect(0, 0, width, height);
      // cx2.globalAlpha = 0.995;
      cx2.drawImage(canvas, 0, -2);
    }
  }
  return;
}
