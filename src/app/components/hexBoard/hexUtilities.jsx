// Returns a hex color string based on a given tile type.
export const getColorForType = (type) => {
  switch (type) {
    case "water":
      return "#4169E1";
    case "lake":
      return "#007BA7";
    case "forest":
      return "#228B22";
    case "desert":
      return "#EDC9Af";
    case "mountain":
      return "#A9A9A9";
    case "impassable mountain":
      return "#555555";
    case "plains":
      return "#90EE90";
    default:
      return "#CCCCCC";
  }
};

// Converts axial hex coordinates (q, r) to a 3D world position (x, y, z).
export const hexToPosition = (q, r, spacing) => {
  const xOffset = spacing * 1.65;
  const zOffset = spacing * 1.42;
  return [q * xOffset + (r % 2) * (xOffset / 2), 0, -r * zOffset];
};
