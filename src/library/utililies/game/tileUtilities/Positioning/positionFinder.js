export default function hexToPosition(q, r, spacing) {
  const width = Math.sqrt(3) * spacing;
  const height = 2 * spacing * 0.75;
  const x = q * width + ((r % 2) * width) / 2;
  const z = height * r;
  return [x, 0, z];
}
