// Parameters
const sigma = 10.0;
const rho = 28.0;
const beta = 8.0 / 3.0;
const dt = 0.01;

// Update the system using Euler method
export function update(x: number, y: number, z: number) {
  const dx = sigma * (y - x) * dt;
  const dy = (x * (rho - z) - y) * dt;
  const dz = (x * y - beta * z) * dt;
  x += dx;
  y += dy;
  z += dz;
  return { x, y, z };
}
