import { NX, B, Q, D } from "./constants";

export function initialize(roughness: number) {
  const initialState = [];
  for (let i = 0; i < NX; i++) {
    initialState.push(roughness * Math.random());
  }
  return initialState;
}

export function saltate(hs: number[], L: number, b: number, nx: number) {
  const slopes = [];
  for (let j = 0; j < nx; j++) {
    // Let's introduce a slope condition where the grain only moves if it's on the "upwind" side of the slope
    const jprevious = j === 0 ? nx - 1 : j - 1;
    const jnext = j === nx - 1 ? 0 : j + 1;
    const slope = hs[jnext] - hs[jprevious];
    if (slope <= 0) {
      let jump = Math.floor(L + b * hs[j]);
      jump = jump < 0 ? 0 : jump;
      hs[j] = hs[j] - Q;
      if (j + jump < nx) {
        hs[j + jump] = hs[j + jump] + Q;
      } else {
        const wrap = j + jump - nx;
        hs[wrap] = hs[wrap] + Q;
      }
    }
    slopes.push(slope);
  }

  return { h: hs, slopes };
}

export function diffuse(h: number[]) {
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
  const { h: saltated, slopes } = saltate(h, L, B, NX);
  return { h: diffuse(saltated), slope: slopes };
}
