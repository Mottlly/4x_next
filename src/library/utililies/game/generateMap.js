import { createNoise2D } from "simplex-noise";

export function generateBiomeMap(cols, rows, seed = Math.random()) {
  const elevationNoise = createNoise2D(() => seed);
  const moistureNoise = createNoise2D(() => seed + 500);

  const elevationScale = 0.05; // Controls mountain/hill size
  const moistureScale = 0.08;

  const tiles = [];

  // Generate initial tiles and store raw elevation value
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

      // Store the tile with raw elevation data for river simulation
      tiles.push({ q, r, type, height, elevation });
    }
  }

  // Build a lookup table for quick neighbor access
  const tileMap = new Map();
  tiles.forEach((tile) => {
    tileMap.set(`${tile.q},${tile.r}`, tile);
  });

  // Define axial neighbor offsets for a hex grid
  const neighborOffsets = [
    { q: 1, r: 0 },
    { q: 1, r: -1 },
    { q: 0, r: -1 },
    { q: -1, r: 0 },
    { q: -1, r: 1 },
    { q: 0, r: 1 },
  ];

  // Flood-fill connected water regions and mark enclosed ones as "lake"
  const visited = new Set();
  for (const tile of tiles) {
    const key = `${tile.q},${tile.r}`;
    if (tile.type === "water" && !visited.has(key)) {
      const region = [];
      let touchesBorder = false;
      const stack = [tile];

      // Perform DFS to get the full water region
      while (stack.length > 0) {
        const current = stack.pop();
        const currentKey = `${current.q},${current.r}`;
        if (visited.has(currentKey)) continue;
        visited.add(currentKey);
        region.push(current);

        // If any water tile is at the edge, the region touches the border
        if (
          current.q === 0 ||
          current.r === 0 ||
          current.q === cols - 1 ||
          current.r === rows - 1
        ) {
          touchesBorder = true;
        }

        // Check all neighbors in the hex grid
        for (const offset of neighborOffsets) {
          const neighborKey = `${current.q + offset.q},${current.r + offset.r}`;
          const neighbor = tileMap.get(neighborKey);
          if (
            neighbor &&
            neighbor.type === "water" &&
            !visited.has(neighborKey)
          ) {
            stack.push(neighbor);
          }
        }
      }

      // If the water region doesn't touch the border, it's fully enclosed—mark it as a lake.
      if (!touchesBorder) {
        region.forEach((t) => {
          t.type = "lake";
        });
      }
    }
  }

  // Generate occasional rivers from mountain tiles.
  // Instead of changing the tile's type, we add a "river" property.
  const riverProbability = 0.05; // 5% chance a mountain tile becomes a river source
  for (const tile of tiles) {
    if (tile.type === "mountain" && Math.random() < riverProbability) {
      let current = tile;
      let iterations = 0;

      // Simulate river flow until reaching water/lake or max iterations
      while (current && iterations < 100) {
        // Mark the current tile as having a river (set a flag) without changing its type
        if (current.type !== "water" && current.type !== "lake") {
          current.river = true;
        }

        // Stop if we've reached sea or a lake
        if (current.type === "water" || current.type === "lake") {
          break;
        }

        // Determine the neighbor with the lowest elevation (simulate downhill flow)
        let lowestNeighbor = null;
        for (const offset of neighborOffsets) {
          const neighborKey = `${current.q + offset.q},${current.r + offset.r}`;
          const neighbor = tileMap.get(neighborKey);
          if (neighbor) {
            if (
              !lowestNeighbor ||
              neighbor.elevation < lowestNeighbor.elevation
            ) {
              lowestNeighbor = neighbor;
            }
          }
        }
        // Break if no valid downhill neighbor exists or no further downhill drop is found
        if (!lowestNeighbor || lowestNeighbor.elevation >= current.elevation) {
          break;
        }
        current = lowestNeighbor;
        iterations++;
      }
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
