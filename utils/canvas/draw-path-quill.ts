export function drawPathQuill(
  h: number[],
  slope: number[],
  offset: number,
  canvas: HTMLCanvasElement,
  clear?: boolean
) {
  const cx = canvas.getContext("2d");

  // Scale the data to the canvas
  const width = canvas.width;
  const height = canvas.height;
  const xScale = width / h.length;

  const h2 = [...h];
  h2[0] += 0.1;

  if (cx) {
    if (!clear) {
      cx.clearRect(0, 0, width, height);
    }

    const path = new Path2D();
    for (let i = 0; i < h.length - 1; i += 1) {
      path.moveTo(xScale * i, offset);
      path.lineTo(xScale * i + 8 * slope[i], offset + 20 * h[i]);
    }
    cx.lineWidth = 1;
    cx.stroke(path);
  }
  return;
}
