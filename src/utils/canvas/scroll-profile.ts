export const EPS = 0.1;
export const NX = 200;
// export const L0 = 7.0;
export const B = 3.0;
const Q0 = 1;
export const Q = Q0 * EPS;
export const D = 0.25;

const screenCanvas = <HTMLCanvasElement>document.getElementById("screenCanvas");
const bufferCanvas = <HTMLCanvasElement>document.getElementById("bufferCanvas");

const screenContext = screenCanvas?.getContext("2d");
const bufferContext = bufferCanvas?.getContext("2d");

let h = initialize(0.2);

// Scale the data to the canvas
const width = screenCanvas.width;
const height = screenCanvas.height;
const xScale = width / h.length;
const yScale = 10;
const yOffset = 100;

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
      bufferContext.drawImage(screenCanvas, 0, 2);

      const { h: h1 } = evolve(h, 7); // Pass this in
      h = h1;
    }
  }
}
draw();

export function initialize(roughness: number) {
  const initialState = [];
  for (let i = 0; i < NX; i++) {
    initialState.push(roughness * Math.random());
  }
  return initialState;
}

function saltate(h: number[], L: number) {
  const slopes = [];
  for (let j = 0; j < NX; j++) {
    // Let's introduce a slope condition where the grain only moves if it's on the "upwind" side of the slope
    const jprevious = j === 0 ? NX - 1 : j - 1;
    const jnext = j === NX - 1 ? 0 : j + 1;
    const slope = h[jnext] - h[jprevious];
    if (slope > 0) {
      let jump = Math.floor(L + B * h[j]);
      jump = jump < 0 ? 0 : jump;
      h[j] = h[j] - Q;
      if (j + jump < NX) {
        h[j + jump] = h[j + jump] + Q;
      } else {
        const wrap = j + jump - NX;
        h[wrap] = h[wrap] + Q;
      }
    }
    slopes.push(slope);
  }

  return { h, slopes };
}

function diffuse(h: number[]) {
  // Init a temp array of sums
  let nnSum = [];
  for (let i = 0; i < NX; i++) {
    nnSum.push(0.0);
  }

  // Boundaries
  nnSum[0] = (h[1] + h[NX - 1]) / 2;
  nnSum[NX - 1] = (h[NX - 2] + h[0]) / 2;

  // Body
  for (let i = 1; i < NX - 2; i++) {
    nnSum[i] = (h[i - 1] + h[i + 1]) / 2;
  }

  // Average
  for (let i = 0; i < NX; i++) {
    h[i] = h[i] + D * (nnSum[i] - h[i]);
  }

  return h;
}

export function evolve(h: number[], L: number) {
  const { h: saltated, slopes } = saltate(h, L);
  return { h: diffuse(saltated), slope: slopes };
}
