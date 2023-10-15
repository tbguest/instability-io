export const LATTICE_X = 1000;
const SAR = 1 / 3;
const MEAN_SLAB_HEIGHT = 10;
const P_SAND = 0.7;
const P_NOSAND = 0.5;
const L = 15;
const REPOSE_ANGLE = (Math.atan(2 / 3) * 180) / 3.14;
const SHADOW_ANGLE = 15;
const lc = 0.1;

function computeSlope(dh: number, dd: number, ar: number) {
  // dh: height difference [number of slabs]
  // dd: horizonral separation [number of lattice cells]
  // ar: aspect ratio (y/x)
  return (Math.atan2(dh * ar, dd) * 180) / 3.14;
}

function enforceAngleOfRepose({
  h,
  ix,
  mode = "add",
}: {
  h: number[];
  ix: number;
  mode: "add" | "remove";
}) {
  let stable = false;

  while (!stable) {
    let previousIndex = ix - 1;
    let nextIndex = ix + 1;

    // Apply wrap at boundaries
    if (previousIndex < 0) {
      previousIndex = LATTICE_X - 1;
    }
    if (nextIndex > LATTICE_X - 1) {
      nextIndex = 0;
    }

    // Compute slopes for each neighbouring cell
    const slopePrevious = computeSlope(h[ix] - h[previousIndex], 1, SAR);
    const slopeNext = computeSlope(h[ix] - h[nextIndex], 1, SAR);
    const slopes = [Math.abs(slopePrevious), Math.abs(slopeNext)];

    if (Math.max(...slopes) > REPOSE_ANGLE) {
      // Find the steeper slope. Use downwind if they're equal
      const iFall = slopes[0] > slopes[1] ? previousIndex : nextIndex;
      if (mode == "add") {
        h[ix] -= 1;
        h[iFall] += 1;
      }

      if (mode == "remove") {
        h[ix] += 1;
        h[iFall] -= 1;
      }

      ix = iFall;
    } else {
      stable = true;
    }
  }
  return h;
}

export function initializeModel() {
  // Place slabs at random until the chosen mean slab height is achieved.
  let h: number[] = new Array(LATTICE_X).fill(0);

  // Populate lattice with randomly placed slabs
  for (let n = 0; n < LATTICE_X * MEAN_SLAB_HEIGHT; n++) {
    // # pick a lattice point at random
    const ix = Math.floor(Math.round((LATTICE_X - 1) * Math.random()));

    // # add a "slab"
    h[ix] = h[ix] + 1;

    // # check the angle of repose
    const hStable = enforceAngleOfRepose({ h, ix, mode: "add" });
    h = hStable;
  }
  return h;
}

function getSlopes(idx: number, h: number[]) {
  // Compute the upwind distance and angles to each lattice cell
  const dUpwind = [];
  const thetas = [];

  // Let's only check indices within some distance upwind
  for (let i = 0; i < 100; i++) {
    // TODO: 100 is arbitary
    const iOffset = (idx - i + LATTICE_X) % LATTICE_X;
    const d = (idx - iOffset + LATTICE_X) % LATTICE_X;
    dUpwind.push(d);
    thetas.push(computeSlope(h[iOffset] - h[idx], d, SAR));
  }
  return thetas;
}

export function evolve(h: number[]) {
  // # pick an index at random
  //   const x = new Array(LATTICE_X).fill(0);
  let ix = Math.round((LATTICE_X - 1) * Math.random());

  // If the substrate exposed, no action
  if (h[ix] <= 0) {
    return { h };
  }

  // Compute the upwind distance and angles to each lattice cell
  const thetasInitial = getSlopes(ix, h);

  // If not in the shadow zone
  if (!thetasInitial.some((theta) => theta > SHADOW_ANGLE)) {
    // Remove the slab
    h[ix] = h[ix] - 1;

    // Retain original indices, since they may be mutated in the repose step
    const ix0 = ix;

    // Check the angle of repose
    const hStable = enforceAngleOfRepose({ h, ix: ix0, mode: "remove" }); // TODO
    h = hStable;

    // Slab saltation step
    let transport = true;
    while (transport) {
      const jump = Math.floor(L + lc * (h[ix] - MEAN_SLAB_HEIGHT));

      ix = ix + jump;

      // wrap
      if (ix > LATTICE_X - 1) {
        ix = ix % LATTICE_X;
      }

      // Compute the upwind distance and angles to each lattice cell
      const thetas = getSlopes(ix, h);

      // If in a shadow zone, deposit with unit probability (P=1)
      if (thetas.some((theta) => theta > SHADOW_ANGLE)) {
        h[ix] += 1;
        transport = false;
      } else if (h[ix] > 0) {
        // If the cell contains one or more sand slabs, deposit with probability P=P_SAND
        if (Math.random() < P_SAND) {
          h[ix] = h[ix] + 1;
          transport = false;
        }
      } else {
        // If bare substrate, deposit with probability P=P_NOSAND
        if (Math.random() < P_NOSAND) {
          h[ix] = h[ix] + 1;
          transport = false;
        }
      }
    }

    // Check the angle of repose
    h = enforceAngleOfRepose({ h, ix, mode: "add" });
  }
  return { h };
}
