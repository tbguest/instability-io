export const EPS = 0.1;
export const NX = 100;
export const L0 = 5.0;
export const B = 5.0;
// export const B = 30.0;
const Q0 = 1;
export const Q = Q0 * EPS;
export const D = 0.35;
// export const D = 0.25;

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
      for (let i = 1; i < NX; i += 1) {
        const xn = xScale * i;
        const yn = -yScale * h[i] + yOffset;
        path.lineTo(xn, yn);
      }
      screenContext.lineWidth = 1;
      screenContext.stroke(path);

      // Draw the contents of the screenCanvas on the bufferCanvas, with an offset
      bufferContext.clearRect(0, 0, width, height);
      // bufferContext.drawImage(screenCanvas, 0, 0);
      bufferContext.drawImage(screenCanvas, 0, 2);

      const { h: h1 } = evolve(h, L0); // Pass this in
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

export function saltate(hs: number[], L: number) {
  const slopes = [];
  for (let j = 0; j < NX; j++) {
    // Let's introduce a slope condition where the grain only moves if it's on the "upwind" side of the slope
    const jprevious = j === 0 ? NX - 1 : j - 1;
    const jnext = j === NX - 1 ? 0 : j + 1;
    const slope = hs[jnext] - hs[jprevious];
    if (slope <= 0) {
      let jump = Math.floor(L + B * hs[j]);
      jump = jump < 0 ? 0 : jump;
      hs[j] = hs[j] - Q;
      if (j + jump < NX) {
        hs[j + jump] = hs[j + jump] + Q;
      } else {
        const wrap = j + jump - NX;
        hs[wrap] = hs[wrap] + Q;
      }
    }
    slopes.push(slope);
  }

  return { h: hs, slopes };
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
