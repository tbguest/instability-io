export function drawPathStack(
  h: number[],
  offset: number,
  canvas: HTMLCanvasElement
) {
  const cx = canvas.getContext("2d");

  // Scale the data to the canvas
  const width = canvas.width;
  const height = canvas.height;
  const xScale = width / h.length;
  const yScale = 20;
  const yOffset = 50;

  const xMin = 1;
  const xMax = (h.length - 1) * xScale;
  const hAtXMin = yScale * h[0] + yOffset + offset;

  if (cx) {
    // cx.clearRect(0, 0, width, height);
    const path = new Path2D();
    path.moveTo(xMin, hAtXMin);
    for (let i = 1; i < h.length - 1; i += 1) {
      path.lineTo(xScale * (i + 1), yScale * h[i + 1] + yOffset + offset);
    }
    path.lineTo(xMax, height - 1);
    path.lineTo(xMin, height - 1);
    path.lineTo(xMin, hAtXMin);
    path.closePath();
    // cx.fillStyle = "#ffe8b8";
    cx.fillStyle = "white";
    cx.fill(path);
    cx.lineWidth = 1;
    cx.stroke(path);
  }
}
