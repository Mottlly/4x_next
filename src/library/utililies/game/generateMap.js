import { createNoise2D } from "simplex-noise";
// If hexToPosition is in another file, import it:
// import { hexToPosition } from "../../../app/components/hexBoard/hexUtilities";

/* ------------------------------------------------------------------
   1) Utility: Convert axial (q,r) coordinates to a 3D-ish position
      (x, 0, z) for a hex in an odd-r horizontal layout.
   ------------------------------------------------------------------ */
function hexToPosition(q, r, spacing) {
  // Example implementation matching an odd-r horizontal layout:
  // (Adjust for your own coordinate system if needed.)
  const width = Math.sqrt(3) * spacing;
  const height = 2 * spacing * 0.75; // because hex height is 3/4 of 2*radius
  const x = q * width + ((r % 2) * width) / 2;
  const z = r * (height * 0.6667); // Typically ~2/3 offset in many hex layouts
  return [x, 0, z];
}

/* ------------------------------------------------------------------
   2) River Generation Helpers from riverGenerator.js
   ------------------------------------------------------------------ */

// getNeighbors(tile, board)
// Returns neighbors for an odd-r horizontal layout by directly looking
// them up in board.tiles. This is used by the new river-generation method.
function getNeighbors(tile, board) {
  const { q, r } = tile;

  // Offsets for even rows
  const neighborsEven = [
    { q: q - 1, r: r }, // W
    { q: q + 1, r: r }, // E
    { q: q, r: r - 1 }, // NE
    { q: q - 1, r: r - 1 }, // NW
    { q: q, r: r + 1 }, // SE
    { q: q - 1, r: r + 1 }, // SW
  ];

  // Offsets for odd rows
  const neighborsOdd = [
    { q: q - 1, r: r }, // W
    { q: q + 1, r: r }, // E
    { q: q + 1, r: r - 1 }, // NE
    { q: q, r: r - 1 }, // NW
    { q: q + 1, r: r + 1 }, // SE
    { q: q, r: r + 1 }, // SW
  ];

  // Decide which offset pattern to use based on row parity
  const offsets = r % 2 === 0 ? neighborsEven : neighborsOdd;

  return offsets
    .map(({ q: nq, r: nr }) =>
      board.tiles.find((t) => t.q === nq && t.r === nr)
    )
    .filter(Boolean);
}

// distanceBetweenTiles(tileA, tileB, spacing)
// Computes the Euclidean distance in the XZ-plane between two tiles.
function distanceBetweenTiles(tileA, tileB, spacing) {
  const posA = hexToPosition(tileA.q, tileA.r, spacing);
  const posB = hexToPosition(tileB.q, tileB.r, spacing);
  const dx = posA[0] - posB[0];
  const dz = posA[2] - posB[2];
  return Math.sqrt(dx * dx + dz * dz);
}

// nearestWaterDistance(tile, waterTiles, spacing)
// Returns the distance from `tile` to the closest water or lake tile.
function nearestWaterDistance(tile, waterTiles, spacing) {
  let minDist = Infinity;
  for (let wt of waterTiles) {
    const d = distanceBetweenTiles(tile, wt, spacing);
    if (d < minDist) {
      minDist = d;
    }
  }
  return minDist;
}

/**
 * generateRivers(board, sourceTiles)
 *
 * For each tile in sourceTiles:
 *   - Simulate river flow for up to 10 steps
 *   - Flow never goes uphill
 *   - Flow tries to go strictly downhill, otherwise it stays level
 *   - Among valid neighbors, choose the one that’s closest to any water tile
 *   - On the 10th step, 30% chance of turning the tile into a lake and stopping
 */
function generateRivers(board, sourceTiles) {
  const waterTiles = board.tiles.filter(
    (tile) => tile.type === "water" || tile.type === "lake"
  );

  sourceTiles.forEach((sourceTile) => {
    let currentTile = sourceTile;
    currentTile.river = true; // mark the source as a river tile
    let iterations = 0;

    while (
      iterations < 10 &&
      currentTile &&
      currentTile.type !== "water" &&
      currentTile.type !== "lake"
    ) {
      const neighbors = getNeighbors(currentTile, board);
      if (neighbors.length === 0) break;

      // Filter out neighbors that are uphill.
      let candidates = neighbors.filter((n) => n.height <= currentTile.height);

      // If any neighbors are strictly lower, restrict to those.
      const downhill = candidates.filter((n) => n.height < currentTile.height);
      if (downhill.length > 0) {
        candidates = downhill;
      }
      if (candidates.length === 0) break;

      // Choose the neighbor that minimizes the distance to existing water.
      let bestCandidate = null;
      let bestDistance = Infinity;
      for (const candidate of candidates) {
        const d = nearestWaterDistance(candidate, waterTiles, board.spacing);
        if (d < bestDistance) {
          bestDistance = d;
          bestCandidate = candidate;
        }
      }
      if (!bestCandidate) break;

      // Starting after the 7th iteration, add an increasing chance to stop the river.
      if (iterations >= 7) {
        // Compute probability linearly:
        // Iteration 7 -> 33% chance, iteration 8 -> 67%, iteration 9 -> 100%.
        // Since iterations starts at 0, when iterations===7 it's the 8th step, etc.
        const lakeProb = (iterations - 7 + 1) / 3; // 1/3 for 8th, 2/3 for 9th, 3/3 for 10th.
        if (Math.random() < lakeProb) {
          bestCandidate.type = "lake";
          break;
        }
      }

      bestCandidate.river = true;
      currentTile = bestCandidate;
      iterations++;
    }
  });
}

/* ------------------------------------------------------------------
   3) Main Biome Generation
   ------------------------------------------------------------------ */

// We still need a getNeighbors(q, r) for water flood-fill and
// mountain-surround checks. This older style doesn't rely on
// board.tiles, so we'll keep it for flood fill & mountain checks.
function getNeighborsAxial(q, r) {
  if (r % 2 === 0) {
    // Even rows:
    return [
      { q: q - 1, r: r - 1 }, // NW
      { q, r: r - 1 }, // NE
      { q: q - 1, r }, // W
      { q: q + 1, r }, // E
      { q: q - 1, r: r + 1 }, // SW
      { q, r: r + 1 }, // SE
    ];
  } else {
    // Odd rows:
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

// The main function that creates tiles, classifies them, and
// then runs our improved river-generation approach.
export function generateBiomeMap(cols, rows, seed = Math.random()) {
  // Create noise functions.
  const elevationNoise = createNoise2D(() => seed);
  const biomeNoise = createNoise2D(() => seed + 500);

  // Noise scales (tweak as desired).
  const elevationScale = 0.05;
  const biomeScale = 0.08;

  // We'll store all generated tiles here.
  const tiles = [];

  // --- Step 1: Generate Tiles with Discrete Elevation Levels ---
  for (let r = 0; r < rows; r++) {
    for (let q = 0; q < cols; q++) {
      // Compute raw elevation in [0,1]
      const rawElev =
        (elevationNoise(q * elevationScale, r * elevationScale) + 1) / 2;
      // Quantize into discrete levels 1–4 (1=water, 4=mountain).
      let elevationLevel = Math.floor(rawElev * 4) + 1;
      if (elevationLevel > 4) elevationLevel = 4;

      let type;
      if (elevationLevel === 1) {
        type = "water";
      } else if (elevationLevel === 4) {
        type = "mountain";
      } else {
        // For levels 2 or 3, use a biome noise
        const rawBiome = (biomeNoise(q * biomeScale, r * biomeScale) + 1) / 2;
        if (rawBiome < 0.33) {
          type = "desert";
        } else if (rawBiome < 0.66) {
          type = "plains";
        } else {
          type = "forest";
        }
      }

      // Store the tile
      tiles.push({
        q,
        r,
        type,
        height: elevationLevel,
        elevationLevel,
      });
    }
  }

  // Create a lookup for quick access during flood fill, etc.
  const tileMap = new Map();
  tiles.forEach((t) => {
    tileMap.set(`${t.q},${t.r}`, t);
  });

  // --- Step 2: Flood-Fill Water Regions to Identify Lakes ---
  //   (unchanged from your original code, using getNeighborsAxial)
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

        // Check if this region touches the map border
        if (
          current.q === 0 ||
          current.r === 0 ||
          current.q === cols - 1 ||
          current.r === rows - 1
        ) {
          touchesBorder = true;
        }

        const neighbors = getNeighborsAxial(current.q, current.r);
        for (const n of neighbors) {
          const nKey = `${n.q},${n.r}`;
          const nTile = tileMap.get(nKey);
          if (nTile && nTile.type === "water" && !visited.has(nKey)) {
            stack.push(nTile);
          }
        }
      }

      // If water region doesn't touch border, convert to lake
      if (!touchesBorder) {
        region.forEach((t) => {
          t.type = "lake";
        });
      }
    }
  }

  // --- Step 3: Upgrade Fully Surrounded Mountain Tiles to Impassable ---
  for (const tile of tiles) {
    if (tile.type === "mountain" && tile.elevationLevel === 4) {
      let isSurrounded = true;
      const neighbors = getNeighborsAxial(tile.q, tile.r);
      for (const n of neighbors) {
        const nKey = `${n.q},${n.r}`;
        const nTile = tileMap.get(nKey);
        // If any neighbor is not a mountain, it's not fully surrounded
        if (!nTile || nTile.type !== "mountain") {
          isSurrounded = false;
          break;
        }
      }
      if (isSurrounded) {
        tile.type = "impassable mountain";
        tile.height = 5;
        tile.elevationLevel = 5;
      }
    }
  }

  // --- Step 4: Use the new river generation approach ---
  // First, construct a "board" object expected by generateRivers.
  const board = {
    cols,
    rows,
    spacing: 1.05, // your indicated spacing
    tiles,
  };

  // Identify which tiles you want to start rivers from
  const riverProbability = 0.04; // 4%
  const sourceTiles = tiles.filter(
    (t) =>
      t.type === "mountain" &&
      t.elevationLevel === 4 &&
      Math.random() < riverProbability
  );

  // Now call the improved river generator.
  generateRivers(board, sourceTiles);

  // Return the final tiles array
  return tiles;
}
