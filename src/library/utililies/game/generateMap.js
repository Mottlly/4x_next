// generateBiomeMap.js
import { createNoise2D } from "simplex-noise";

export const generateBiomeMap = (cols, rows, seed = Math.random()) => {
  const noise2D = createNoise2D(() => seed);
  const scale = 0.08; // controls biome size
  const tiles = [];

  for (let r = 0; r < rows; r++) {
    for (let q = 0; q < cols; q++) {
      const elevation = noise2D(q * scale, r * scale);
      const moisture = noise2D(q * scale + 100, r * scale + 100);

      let type = "plains";

      if (elevation < -0.3) type = "water";
      else if (elevation < 0) type = moisture > 0 ? "plains" : "desert";
      else if (elevation < 0.4) type = moisture > 0.2 ? "forest" : "plains";
      else type = "mountain";

      tiles.push({ q, r, type });
    }
  }

  return tiles;
};
