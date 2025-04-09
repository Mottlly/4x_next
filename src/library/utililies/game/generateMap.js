import { createNoise2D } from "simplex-noise";

/**
 * Returns the neighbors for a tile at (q, r) in an odd‑r horizontal layout.
 */
function getNeighbors(q, r) {
  if (r % 2 === 0) {
    // Even rows:
    return [
      { q: q - 1, r: r - 1 }, // NW
      { q: q, r: r - 1 }, // NE
      { q: q - 1, r: r }, // W
      { q: q + 1, r: r }, // E
      { q: q - 1, r: r + 1 }, // SW
      { q: q, r: r + 1 }, // SE
    ];
  } else {
    // Odd rows:
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
  // Create noise functions.
  const elevationNoise = createNoise2D(() => seed);
  const biomeNoise = createNoise2D(() => seed + 500);

  // Noise scales determine the size of clusters.
  const elevationScale = 0.05;
  const biomeScale = 0.08;

  const tiles = [];

  // --- Step 1: Generate Tiles with Discrete Elevation Levels ---
  // Use the elevation noise to assign an integer elevation level (1–4).
  // Level 1 is sea level ("water"), level 4 is "mountain".
  // For mid-levels (2, 3), use biome noise to choose the biome.
  for (let r = 0; r < rows; r++) {
    for (let q = 0; q < cols; q++) {
      // Compute a raw elevation value (normalized to [0, 1]).
      const rawElev =
        (elevationNoise(q * elevationScale, r * elevationScale) + 1) / 2;
      // Quantize into discrete elevation levels 1–4.
      let elevationLevel = Math.floor(rawElev * 4) + 1;
      if (elevationLevel > 4) elevationLevel = 4; // Safety check.

      let type;
      if (elevationLevel === 1) {
        type = "water";
      } else if (elevationLevel === 4) {
        type = "mountain";
      } else {
        // For elevation levels 2 or 3, pick a biome using the biome noise.
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

      // Use the discrete elevation level as the tile's height.
      const height = elevationLevel;

      tiles.push({ q, r, type, height, elevationLevel });
    }
  }

  // --- Step 2: Build a Lookup Table for Fast Neighbor Access ---
  const tileMap = new Map();
  tiles.forEach((tile) => {
    tileMap.set(`${tile.q},${tile.r}`, tile);
  });

  // --- Step 3: Flood-Fill Water Regions to Identify Lakes ---
  // Water regions (level 1) that do not touch the map border are marked as "lake".
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
        region.forEach((t) => {
          t.type = "lake";
        });
      }
    }
  }

  // --- Step 4: Upgrade Fully Surrounded Mountain Tiles to Impassable Mountains ---
  // Only mountain tiles (elevation level 4) are eligible.
  // If a mountain tile is surrounded by other mountain tiles, upgrade it to an impassable mountain (elevation 5).
  for (const tile of tiles) {
    if (tile.type === "mountain" && tile.elevationLevel === 4) {
      let isSurrounded = true;
      const neighbors = getNeighbors(tile.q, tile.r);
      for (const neighbor of neighbors) {
        const nKey = `${neighbor.q},${neighbor.r}`;
        const nTile = tileMap.get(nKey);
        if (!nTile || nTile.type !== "mountain") {
          isSurrounded = false;
          break;
        }
      }
      if (isSurrounded) {
        tile.type = "impassable mountain";
        tile.elevationLevel = 5; // Upgrade to level 5.
        tile.height = 5;
      }
    }
  }

  // --- Step 5: River Generation ---
  // Generate rivers from mountain tiles (but not impassable mountains).
  // Each step, a river flows to a neighbor with a lower elevation level.
  // If none exists, it flows to an equal elevation neighbor.
  // If neither option is available, the current tile is converted into a lake.
  const riverProbability = 0.05; // 5% chance to start a river.
  for (const tile of tiles) {
    if (tile.type === "mountain" && Math.random() < riverProbability) {
      let current = tile;
      let iterations = 0;
      while (current && iterations < 100) {
        // Mark the current tile as part of a river (unless it's water or a lake).
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
          current.height = current.elevationLevel;
          break;
        }
        iterations++;
      }
    }
  }

  return tiles;
}
