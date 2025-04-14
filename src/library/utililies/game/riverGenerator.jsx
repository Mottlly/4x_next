// riverGenerator.js

import { hexToPosition } from "../../../app/components/hexBoard/hexUtilities";
// Ensure hexUtilities exports your hexToPosition function.

// Returns an array of the six neighboring tiles for a given tile based on axial coordinates.
// Example getNeighbors for an odd-r horizontal layout
export function getNeighbors(tile, board) {
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

  // Decide whether to use the even or odd offsets based on the row index.
  const offsets = r % 2 === 0 ? neighborsEven : neighborsOdd;

  return offsets
    .map(({ q: nq, r: nr }) =>
      board.tiles.find((t) => t.q === nq && t.r === nr)
    )
    .filter(Boolean);
}

// Computes the Euclidean distance in the XZ-plane between two tiles.
export function distanceBetweenTiles(tileA, tileB, spacing) {
  const posA = hexToPosition(tileA.q, tileA.r, spacing);
  const posB = hexToPosition(tileB.q, tileB.r, spacing);
  const dx = posA[0] - posB[0];
  const dz = posA[2] - posB[2];
  return Math.sqrt(dx * dx + dz * dz);
}

// Returns the distance from a tile to the nearest water tile (sea or lake).
export function nearestWaterDistance(tile, waterTiles, spacing) {
  let minDist = Infinity;
  for (let waterTile of waterTiles) {
    const d = distanceBetweenTiles(tile, waterTile, spacing);
    if (d < minDist) {
      minDist = d;
    }
  }
  return minDist;
}

/**
 * generateRivers(board, sourceTiles)
 *
 * For each source tile provided, simulate a river path that:
 * - Never flows uphill (only flows on the same height or downhill).
 * - Prefers the neighbor that is lower than the current tile if available.
 * - Chooses the neighbor that minimizes the distance to any water tile.
 * - After 10 iterations, with a 30% chance, ends the river by converting the tile into a lake.
 *
 * Updates the board.tiles in place, marking tiles with `river = true` and optionally changing a tile's type to "lake".
 */
export function generateRivers(board, sourceTiles) {
  // Collect all water bodies (sea or lake) for distance calculations.
  const waterTiles = board.tiles.filter(
    (tile) => tile.type === "water" || tile.type === "lake"
  );

  // Process each source tile.
  sourceTiles.forEach((sourceTile) => {
    let currentTile = sourceTile;
    currentTile.river = true; // Mark this tile as part of a river.
    let iterations = 0;

    while (
      iterations < 10 &&
      currentTile &&
      currentTile.type !== "water" &&
      currentTile.type !== "lake"
    ) {
      // Get all neighbors.
      const neighbors = getNeighbors(currentTile, board);
      if (neighbors.length === 0) break;

      // Filter out neighbors that are uphill.
      let candidates = neighbors.filter((n) => n.height <= currentTile.height);
      // If any neighbor is strictly downhill, only use those.
      const downhillCandidates = candidates.filter(
        (n) => n.height < currentTile.height
      );
      if (downhillCandidates.length > 0) {
        candidates = downhillCandidates;
      }
      if (candidates.length === 0) break;

      // Choose the candidate that minimizes the distance to any water tile.
      let bestCandidate = null;
      let bestDistance = Infinity;
      candidates.forEach((n) => {
        const d = nearestWaterDistance(n, waterTiles, board.spacing);
        if (d < bestDistance) {
          bestDistance = d;
          bestCandidate = n;
        }
      });
      if (!bestCandidate) break;

      // On the 10th iteration, chance to end the river by forming a lake (30% chance).
      if (iterations === 9 && Math.random() < 0.3) {
        bestCandidate.type = "lake";
        break;
      }

      bestCandidate.river = true;
      currentTile = bestCandidate;
      iterations++;
    }
  });
}
