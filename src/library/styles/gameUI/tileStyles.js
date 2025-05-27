// Centralized style and geometry info for all tile types and pieces

export const tileTypeStyles = {
  water: {
    color: "#3ec6f0",
    edgeColor: "#b3e6ff",
    geometry: { type: "cylinder", args: [1, 1, 0.5, 6] },
  },
  lake: {
    color: "#4fc3f7",
    edgeColor: "#b3e6ff",
    geometry: { type: "cylinder", args: [1, 1, 0.5, 6] },
  },
  plains: {
    color: "#b8e994",
    edgeColor: "#eaffd0",
    geometry: { type: "cylinder", args: [1, 1, 0.5, 6] },
  },
  grassland: {
    color: "#7bed9f",
    edgeColor: "#d4f9e2",
    geometry: { type: "cylinder", args: [1, 1, 0.5, 6] },
  },
  forest: {
    color: "#218c5c",
    edgeColor: "#a3e635",
    geometry: { type: "cylinder", args: [1, 1, 0.5, 6] },
  },
  mountain: {
    color: "#636e72",
    edgeColor: "#b2bec3",
    geometry: { type: "cylinder", args: [1, 1, 0.7, 6] },
  },
  "impassable mountain": {
    color: "#2d3436",
    edgeColor: "#636e72",
    geometry: { type: "cylinder", args: [1, 1, 0.8, 6] },
  },
  default: {
    color: "#cccccc",
    edgeColor: "#ffffff",
    geometry: { type: "cylinder", args: [1, 1, 0.5, 6] },
  },
};

export const riverStyles = {
  color: "deepskyblue",
  geometry: { type: "sphere", args: [0.1, 8, 8] },
};

export const fogStyles = {
  color: "#a0aec0",
  geometry: { type: "cylinder", args: [1, 1, 0.18, 6] },
  opacity: 0.7,
};

export const semiFogStyles = {
  color: "#cbd5e1",
  geometry: { type: "cylinder", args: [1, 1, 0.05, 6] },
  opacity: 0.4,
};

export const pieceTypeStyles = {
  pod: { color: "green" },
  scout: { color: "#38bdf8" },
  engineer: { color: "#facc15" },
  security: { color: "#f87171" },
  default: { color: "red" },
};

export const buildingTypeStyles = {
  reconstructed_shelter: { color: "#9b59b6" },
  resource_extractor: { color: "#27ae60" },
  sensor_suite: { color: "#5f27cd" },
  default: { color: "#c2a465" },
};

export const movementStyles = {
  color: "cyan",
  opacity: 0.8,
  wireframe: true,
  borderScale: 0.85, // relative to tile spacing
  thickness: 0.02,
  renderOrder: 999,
  depthTest: false,
};