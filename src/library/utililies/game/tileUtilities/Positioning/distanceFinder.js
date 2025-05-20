export function offsetToCube({ q, r }) {
  const x = q - (r - (r & 1)) / 2;
  const z = r;
  const y = -x - z;
  return { x, y, z };
}

export function hexDistance(a, b) {
  const A = offsetToCube(a);
  const B = offsetToCube(b);
  return (Math.abs(A.x - B.x) + Math.abs(A.y - B.y) + Math.abs(A.z - B.z)) / 2;
}
