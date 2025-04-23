export default function getNeighborsAxial(q, r) {
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
