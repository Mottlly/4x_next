import { createNoise2D } from "simplex-noise";

/**
 * Returns the neighbors of a tile at (q, r) for an odd‑r horizontal layout.
 */
function getNeighbors(q, r) {
  if (r % 2 === 0) {
    // Even rows
    return [
      { q: q - 1, r: r - 1 }, // NW
      { q: q, r: r - 1 }, // NE
      { q: q - 1, r: r }, // W
      { q: q + 1, r: r }, // E
      { q: q - 1, r: r + 1 }, // SW
      { q: q, r: r + 1 }, // SE
    ];
  } else {
    // Odd rows
    return [
      { q: q, r: r - 1 }, // NW
      { q: q + 1, r: r - 1 }, // NE
      { q: q - 1, r: r }, // W
      { q: q + 1, r: r }, // E
      { q: q, r: r + 1 }, // SW
      { q: q + 1, r: r + 1 }, // SE
    ];
  }
}

export function generateBiomeMap(cols, rows, seed = Math.random()) {
  // Create noise functions for elevation and biome distribution.
  const elevationNoise = createNoise2D(() => seed);
  const biomeNoise = createNoise2D(() => seed + 500);

  // Noise scales determine the size of clusters.
  const elevationScale = 0.05;
  const biomeScale = 0.08;

  // Base height values for various biome types.
  const baseHeights = {
    water: 0.1,
    desert: 0.25,
    plains: 0.3,
    forest: 0.4,
    mountain: 0.8,
    "impassable mountain": 1.0,
    lake: 0.1,
  };

  const tiles = [];

  // --- Step 1: Generate Tiles with Discrete Elevation Levels 1 to 4 ---
  // Level 1 is sea level (water); level 4 is set to mountain.
  // For levels 2 and 3 we use biome noise to produce clusters of desert, plains, or forest.
  for (let r = 0; r < rows; r++) {
    for (let q = 0; q < cols; q++) {
      // Normalize elevation noise from [-1, 1] to [0, 1]
      const rawElev =
        (elevationNoise(q * elevationScale, r * elevationScale) + 1) / 2;
      // Map to discrete levels 1–4.
      let elevationLevel = Math.floor(rawElev * 4) + 1;
      if (elevationLevel > 4) elevationLevel = 4; // safeguard

      let type;
      if (elevationLevel === 1) {
        type = "water";
      } else if (elevationLevel === 4) {
        type = "mountain";
      } else {
        const normalizedBiome =
          (biomeNoise(q * biomeScale, r * biomeScale) + 1) / 2;
        if (normalizedBiome < 0.33) {
          type = "desert";
        } else if (normalizedBiome < 0.66) {
          type = "plains";
        } else {
          type = "forest";
        }
      }

      const height = baseHeights[type];

      tiles.push({ q, r, type, height, elevationLevel });
    }
  }

  // --- Step 2: Build a Lookup Table for Fast Neighbor Access ---
  const tileMap = new Map();
  for (const tile of tiles) {
    tileMap.set(`${tile.q},${tile.r}`, tile);
  }

  // --- Step 3: Flood-Fill Water Regions to Identify Lakes ---
  // Any water region (level 1) that does not touch the map border becomes a lake.
  const visited = new Set();
  for (const tile of tiles) {
    const key = `${tile.q},${tile.r}`;
    if (tile.type === "water" && !visited.has(key)) {
      const region = [];
      let touchesBorder = false;
      const stack = [tile];

      while (stack.length > 0) {
        const current = stack.pop();
        const currentKey = `${current.q},${current.r}`;
        if (visited.has(currentKey)) continue;
        visited.add(currentKey);
        region.push(current);

        if (
          current.q === 0 ||
          current.r === 0 ||
          current.q === cols - 1 ||
          current.r === rows - 1
        ) {
          touchesBorder = true;
        }

        const neighbors = getNeighbors(current.q, current.r);
        for (const neighbor of neighbors) {
          const nKey = `${neighbor.q},${neighbor.r}`;
          const nTile = tileMap.get(nKey);
          if (nTile && nTile.type === "water" && !visited.has(nKey)) {
            stack.push(nTile);
          }
        }
      }

      if (!touchesBorder) {
        for (const t of region) {
          t.type = "lake";
          t.height = baseHeights.lake;
        }
      }
    }
  }

  // --- Step 4: Upgrade Fully Surrounded Mountain Tiles to Impassable Mountains ---
  // Only mountain tiles (from level 4) are eligible.
  for (const tile of tiles) {
    if (tile.type === "mountain" && tile.elevationLevel === 4) {
      let isSurrounded = true;
      const neighbors = getNeighbors(tile.q, tile.r);
      for (const neighbor of neighbors) {
        const nKey = `${neighbor.q},${neighbor.r}`;
        const nTile = tileMap.get(nKey);
        // If any neighbor is missing or not a mountain, then this tile is not fully surrounded.
        if (!nTile || nTile.type !== "mountain") {
          isSurrounded = false;
          break;
        }
      }
      if (isSurrounded) {
        tile.type = "impassable mountain";
        tile.elevationLevel = 5; // Upgrade level to 5.
        tile.height = baseHeights["impassable mountain"];
      }
    }
  }

  // --- Step 5: River Generation ---
  // For mountain tiles (but not impassable mountains), with a fixed probability generate a river source.
  // Rivers will flow to a neighbor with a lower elevation level; if none exists, then to a tile with equal elevation.
  // If neither is available, the current tile becomes a lake.
  const riverProbability = 0.05; // 5% chance to start a river.
  for (const tile of tiles) {
    if (tile.type === "mountain" && Math.random() < riverProbability) {
      let current = tile;
      let iterations = 0;
      while (current && iterations < 100) {
        // Mark the current tile as a river tile unless it's water/lake.
        if (current.type !== "water" && current.type !== "lake") {
          current.river = true;
        }

        if (current.type === "water" || current.type === "lake") break;

        let lowestNeighbor = null;
        let equalNeighbor = null;
        const neighbors = getNeighbors(current.q, current.r);
        for (const neighbor of neighbors) {
          const nKey = `${neighbor.q},${neighbor.r}`;
          const nTile = tileMap.get(nKey);
          if (nTile) {
            if (
              !lowestNeighbor ||
              nTile.elevationLevel < lowestNeighbor.elevationLevel
            ) {
              lowestNeighbor = nTile;
            }
            if (
              nTile.elevationLevel === current.elevationLevel &&
              !equalNeighbor
            ) {
              equalNeighbor = nTile;
            }
          }
        }

        if (
          lowestNeighbor &&
          lowestNeighbor.elevationLevel < current.elevationLevel
        ) {
          current = lowestNeighbor;
        } else if (equalNeighbor) {
          current = equalNeighbor;
        } else {
          current.type = "lake";
          current.height = baseHeights.lake;
          break;
        }
        iterations++;
      }
    }
  }

  return tiles;
}
