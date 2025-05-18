import { hexDistance } from "./distanceFinder";

export function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function hexLerp(a, b, t) {
  return {
    q: lerp(a.q, b.q, t),
    r: lerp(a.r, b.r, t),
  };
}

export function hexRound(h) {
  let x = h.q;
  let z = h.r;
  let y = -x - z;

  let rx = Math.round(x);
  let ry = Math.round(y);
  let rz = Math.round(z);

  let x_diff = Math.abs(rx - x);
  let y_diff = Math.abs(ry - y);
  let z_diff = Math.abs(rz - z);

  if (x_diff > y_diff && x_diff > z_diff) {
    rx = -ry - rz;
  } else if (y_diff > z_diff) {
    ry = -rx - rz;
  } else {
    rz = -rx - ry;
  }
  return { q: rx, r: rz };
}

export function hexLine(a, b) {
  const N = hexDistance(a, b);
  const results = [];
  for (let i = 0; i <= N; i++) {
    results.push(hexRound(hexLerp(a, b, i / N)));
  }
  return results;
}
