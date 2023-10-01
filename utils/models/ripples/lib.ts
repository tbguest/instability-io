import { NX, L0, B, Q, D } from "./constants";

export function initialize(roughness: number) {
  const initialState = [];
  for (let i = 0; i < NX; i++) {
    initialState.push(roughness * Math.random());
  }
  return initialState;
}

function saltate(h: number[]) {
  for (let j = 0; j < NX; j++) {
    // Let's introduce a slope condition where the grain only moves if it's on the "upwind" side of the slope
    const jprevious = j === 0 ? NX - 1 : j - 1;
    const jnext = j === NX - 1 ? 0 : j + 1;
    if (h[jnext] > h[jprevious]) {
      let jump = Math.floor(L0 + B * h[j]);
      jump = jump < 0 ? 0 : jump;
      h[j] = h[j] - Q;
      if (j + jump < NX) {
        h[j + jump] = h[j + jump] + Q;
      } else {
        const wrap = j + jump - NX;
        h[wrap] = h[wrap] + Q;
      }
    }
  }

  return h;
}

function diffuse(h: number[]) {
  // Init a temp array of sums
  let nnSum = [];
  for (let i = 0; i < NX; i++) {
    nnSum.push(0.0);
  }

  // Boundaries
  nnSum[0] = (h[1] + h[NX - 1]) / 2;
  nnSum[NX] = (h[NX - 2] + h[0]) / 2;

  // Body
  for (let i = 1; i < NX - 1; i++) {
    nnSum[i] = (h[i - 1] + h[i + 1]) / 2;
  }

  // Average
  for (let i = 0; i < NX; i++) {
    h[i] = h[i] + D * (nnSum[i] - h[i]);
  }

  return h;
}

export function evolve(h: number[]) {
  const saltated = saltate(h);
  return diffuse(saltated);
}
