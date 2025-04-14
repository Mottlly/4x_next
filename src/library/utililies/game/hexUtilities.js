export function hexToPosition(q, r, spacing) {
  const width = Math.sqrt(3) * spacing;
  const height = 2 * spacing * 0.75;
  const x = q * width + ((r % 2) * width) / 2;
  const z = r * (height * 0.6667);
  return [x, 0, z];
}

/**
 * Returns neighbors for axial coordinates in an odd-r horizontal layout.
 */
export function getNeighborsAxial(q, r) {
  if (r % 2 === 0) {
    return [
      { q: q - 1, r: r - 1 }, // NW
      { q, r: r - 1 }, // NE
      { q: q - 1, r }, // W
      { q: q + 1, r }, // E
      { q: q - 1, r: r + 1 }, // SW
      { q, r: r + 1 }, // SE
    ];
  } else {
    return [
      { q, r: r - 1 }, // NW
      { q: q + 1, r: r - 1 }, // NE
      { q: q - 1, r }, // W
      { q: q + 1, r }, // E
      { q, r: r + 1 }, // SW
      { q: q + 1, r: r + 1 }, // SE
    ];
  }
}
