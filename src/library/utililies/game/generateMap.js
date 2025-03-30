import { createNoise2D } from "simplex-noise";

export function generateBiomeMap(cols, rows, seed = Math.random()) {
  const elevationNoise = createNoise2D(() => seed);
  const moistureNoise = createNoise2D(() => seed + 500);

  const elevationScale = 0.05; // Controls mountain/hill size
  const moistureScale = 0.08;

  const tiles = [];

  for (let r = 0; r < rows; r++) {
    for (let q = 0; q < cols; q++) {
      // Elevation noise (for height)
      const elevation =
        (elevationNoise(q * elevationScale, r * elevationScale) +
          0.5 *
            elevationNoise(q * elevationScale * 2, r * elevationScale * 2)) /
        1.5;

      // Moisture noise (for biome determination)
      const moisture = moistureNoise(q * moistureScale, r * moistureScale);

      let type = "plains";
      if (elevation < -0.3) type = "water";
      else if (elevation < 0) type = moisture > 0 ? "plains" : "desert";
      else if (elevation < 0.4) type = moisture > 0.2 ? "forest" : "plains";
      else type = "mountain";

      // Map elevation to a suitable tile height
      const height = mapElevationToHeight(elevation, type);

      tiles.push({ q, r, type, height });
    }
  }

  return tiles;
}

// Helper to translate elevation values to tile height
function mapElevationToHeight(elevation, type) {
  const baseHeights = {
    water: 0.1,
    plains: 0.3,
    desert: 0.25,
    forest: 0.4,
    mountain: 0.8,
  };

  // Fine-tune height based on elevation noise
  const variation = Math.max(0, elevation * 0.5);
  return baseHeights[type] + variation;
}
